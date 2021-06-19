# 공공데이터 공영주차장 정보 DB에 저장 (총 14417개)
import json
from math import fsum

from pymongo import MongoClient

client = MongoClient('localhost', 27017)
db = client.get_database('parking_lot')


def get_data():
    with open('static/seoul_park_lot.json', encoding='UTF8') as json_file:
        result = json.load(json_file)

        datas = result["DATA"]

        count = 0
        for data in datas:
            # 필요한 정보 정의(주차장명, 주소, 유/무료 구분, 야간 무료 여부, 기본 요금, 기본 시간, 추가 요금, 주간 시작 시간, 주간 종료 시간, 위도, 경도)
            park_id = count
            name = data['parking_name']
            tel = data['tel']
            address = data['addr']
            free = data['pay_nm']
            night_free = data['night_free_open']

            basic_cost = data['rates']
            basic_time = data['time_rate']
            add_cost = data['add_rates']

            wbt = data['weekday_begin_time']
            wet = data['weekday_end_time']
            # 시간 표기 방식 변경 ex) 1200 -> 12:00
            weekday_begin_time = wbt[:2] + ":" + wbt[2:]
            weekday_end_time = wet[:2] + ":" + wet[2:]

            lat = data['lat']
            lng = data['lng']

            doc = {
                "park_id": park_id,
                "Name": name,
                "Tel": tel,
                "Address": address,
                "Free": free,
                "Night free": night_free,
                "Basic_cost": basic_cost,
                "Basic_time": basic_time,
                "Add cost": add_cost,
                "Weekday begin time": weekday_begin_time,
                "Weekday end time": weekday_end_time,
                "location": {
                    "type": 'Point',
                    "coordinates": [lng, lat]  # [경도,위도] 순서
                },
            }
            count += 1

            # document 삽입
            db.park_info.insert_one(doc)

    print(db.park_info.count())


# DB에서 겹치는 이름들은 하나로 모아 평균 위경도로 저장 (921개로 압축)
def remove_dup_name():
    db_list = list(db.park_info.find({}, {'_id': False}))
    count = db.park_info.count()

    names = []
    lngs = []
    lats = []

    # name, lng, lat만 뽑아 리스트에 저장
    for i in db_list:
        names.append(i["Name"])
        lngs.append(i["location"]["coordinates"][0])
        lats.append(i["location"]["coordinates"][1])

    nll = [[''] * 3 for i in range(len(names))]  # nll means name, lng, lat

    for i in range(0, count):
        nll[i][0] = names[i]
        nll[i][1] = lngs[i]
        nll[i][2] = lats[i]

    # for i in range(2309, 2326):
    #     print(nll[i][0], nll[i][1], nll[i][2])

    temp = 0
    for i in range(0, count):
        tmp_lng = [nll[i][1]]
        tmp_lat = [nll[i][2]]
        for j in range(i + 1, count):
            if nll[i][0] != nll[j][0]:
                continue
            elif nll[i][0] == '':
                continue
            else:
                temp += 1
                # print(nll[j][0], '이 같네요', j, '번째 삭제합니다')
                tmp_lng.append(nll[j][1])
                tmp_lat.append(nll[j][2])
                # 이름 겹치는 값들은 첫번째 인덱스 빼고 ''로 초기화
                nll[j][0] = ''
                nll[j][1] = 0
                nll[j][2] = 0

        mean_lng = round(fsum(tmp_lng) / len(tmp_lng), 8)
        mean_lat = round(fsum(tmp_lat) / len(tmp_lat), 8)
        nll[i][1] = mean_lng
        nll[i][2] = mean_lat

    tmp_count = 0
    for i in range(0, count):
        if nll[i][0] == '':
            tmp_count += 1
            # print(i, '번째 삭제 완료')
            continue
        print(i, nll[i][0], nll[i][1], nll[i][2])
    print('총', tmp_count, '개 삭제합니다')
    print(db.park_lot.count())

    for i in range(0, count):
        if nll[i][0] == '':
            db.park_info.delete_one({'park_id': i})
            # print(i, '번째 삭제완료')
    print(temp, count, db.park_info.count())

while True:
    if (db.park_info.count() == 0):
        get_data()
    else:
        remove_dup_name()
        break
