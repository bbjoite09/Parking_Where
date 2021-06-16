import json
import os
from math import fsum

from flask_cors import CORS
import pymongo
import requests as requests
from bson import SON
from flask import Flask, request, jsonify, render_template, json
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

client = MongoClient('localhost', 27017)
db = client.get_database('parking_lot')

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["DEBUG"] = True

load_dotenv()
SEOUL_API_KEY = os.environ['SEOUL_API_KEY']


@app.route('/', methods=["GET", "POST"])
def home():

    return 'main page'


@app.route('/search', methods=["POST"])
def search():
    search_data = request.get_json()
    print(search_data)


# 공공데이터 공영주차장 정보 DB에 저장 (총 14417개)
@app.route('/api/public_plot/data')
def get_data():
    db.park_info.create_index([("location", pymongo.GEOSPHERE)])
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
            print(doc)
            db.park_info.insert_one(doc)

    print(db.park_info.count())

    return "DB 삽입 성공"


# DB에서 겹치는 이름들은 하나로 모아 평균 위경도로 저장 (921개로 압축)
@app.route('/api/public_plot/average', methods=['GET'])
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
                # None type 예외처리
                if nll[j][1] is None or nll[j][2] is None:
                    nll[j][1] = 0
                    nll[j][2] = 0
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

    return 'DB 중복 제거'


@app.route('/api/public_plot/get', methods=['POST'])
def get_index():

    # geosphere index 생성
    db.park_info.create_index([("location", pymongo.GEOSPHERE)])
    indexes = db.park_info.index_information()
    print(indexes)

    # react로부터 data 받기 (POST)
    data = request.get_json()
    # print(search_data)
    if len(data) == 0:
        return jsonify({'result': 'fail', 'msg': '요청받은 데이터가 없습니다.'})
    # TODO: float인지 확인
    lng = float(data['lng'])
    lat = float(data['lat'])

    # 특정 위치에서 1.5km 이내 주차장 정보 가져오기
    near_parkings = list(db.park_info.find({'location':
                                                {'$near':
                                                     SON([('$geometry',
                                                           SON([('type', 'Point'),
                                                                ('coordinates',
                                                                 [lng, lat])])),
                                                          ('$maxDistance', 1500)
                                                          ])
                                                 }}))
    # lng: 126.83870535803958, lat: 37.48665649894195 (천왕역 test)

    for park in near_parkings:
        tmp_lng = park['location']['coordinates'][0]
        tmp_lat = park['location']['coordinates'][1]
        del (park['_id'], park['park_id'], park['location'])
        park['lng'] = tmp_lng
        park['lat'] = tmp_lat
        if park['Free'] == "무료":
            park['Basic_time'] = 0
            park['Basic_cost'] = 0
            park['Add cost'] = 0

        print(park)

    return jsonify({'result': 'success'}, {'parkings': near_parkings})


@app.route('/api/public_plot/current', methods=['GET'])
def get_current_location():
    # 현재 지도에서 검색
    # data = request.form
    # if len(data) == 0:
    #     return jsonify({'result': 'fail', 'msg': '요청받은 데이터가 없습니다.'})
    # # TODO: float인지 확인
    # lng = data['lng']
    # lat = data['lat']

    # near_parkings = list(db.park_info.find({
    #     'location': {
    #         '$geoWithin': {
    #             '$geometry': {
    #                 'type': "Polygon",
    #                 'coordinates': [[[128, 36],
    #                                  [128, 37],
    #                                  [127, 37],
    #                                  [127, 36],
    #                                  [128, 36]
    #                                  ]]
    #             }}}}))
    # for i in near_parkings:
    #     print(i)

    return 'true'

if __name__ == '__main__':
    app.run(port=7000, debug=True)
