import os

import pymongo
import requests as requests
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv

client = MongoClient('localhost', 27017)
db = client.get_database('parking_lot')

app = Flask(__name__)

app.config["DEBUG"] = True

load_dotenv()
SEOUL_API_KEY = os.environ['SEOUL_API_KEY']

@app.route('/', methods=["GET", "POST"])
def home():
    return 'main page'

@app.route('/search', methods=["POST"])
def search() :
    search_data = request.get_json()
    print(search_data)

# 공공데이터 공영주차장 정보 DB에 저장
@app.route('/api/public_plot', methods=['GET'])
def get_parking_lots():
    response = requests.get(
        f'http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/GetParkInfo/1/1000/'
    )

    result = response.json()

    datas = result['GetParkInfo']['row']

    for data in datas:
        # 필요한 정보 정의(주차장명, 주소, 유/무료 구분, 야간 무료 여부, 기본 요금, 기본 시간, 추가 요금, 주간 시작 시간, 주간 종료 시간, 위도, 경도)
        name = data['PARKING_NAME']
        address = data['ADDR']
        free = data['PAY_YN']
        night_free = data['NIGHT_FREE_OPEN']

        basic_cost = data['RATES']
        basic_time = data['TIME_RATE']
        add_cost = data['ADD_RATES']

        weekday_begin_time = data['WEEKDAY_BEGIN_TIME']
        weekday_end_time = data['WEEKDAY_END_TIME']

        lat = data['LAT']
        lng = data['LNG']

        doc = {
            "Name": name,
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

        # document 삽입
        db.park_info.insert(doc)

    return 'DB 삽입 성공'

@app.route('/api/public_plot/get', methods=['GET'])
def get_index():
    db.park_info.create_index([("location", pymongo.GEOSPHERE)])
    indexes = db.park_info.index_information()
    print(indexes)

    # 예시: 사각형 안에 포함되는 주차장 
    results = list(db.park_info.find({
       'location': {
          '$geoWithin': {
             '$geometry': {
               'type': "Polygon" ,
               'coordinates': [[[ 0, 0 ],
                               [ 130, 0],
                                [ 130, 50 ],
                                [ 0, 50 ],
                                [0, 0]]]
           }}}}))
    for i in results[:3]:
        print(i)

    return '1'



if __name__ == '__main__':
    app.run('0.0.0.0', port=7000, debug=True)
