import json
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
def search():
    search_data = request.get_json()
    print(search_data)


# 공공데이터 공영주차장 정보 DB에 저장 (총 14417개)
@app.route('/api/data')
def get_data():
    with open('static/seoul_park_lot.json', encoding='UTF8') as json_file:
        result = json.load(json_file)

        datas = result["DATA"]

        count = 0
        for data in datas:
            # 필요한 정보 정의(주차장명, 주소, 유/무료 구분, 야간 무료 여부, 기본 요금, 기본 시간, 추가 요금, 주간 시작 시간, 주간 종료 시간, 위도, 경도)
            park_id = count
            name = data['parking_name']
            address = data['addr']
            free = data['pay_nm']
            night_free = data['night_free_open']

            basic_cost = data['rates']
            basic_time = data['time_rate']
            add_cost = data['add_rates']

            weekday_begin_time = data['weekday_begin_time']
            weekday_end_time = data['weekday_end_time']

            lat = data['lat']
            lng = data['lng']

            doc = {
                "park_id": park_id,
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
            count += 1
            # document 삽입
            db.park_info.insert(doc)

    print(db.park_info.count())

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
                    'type': "Polygon",
                    'coordinates': [[[0, 0],
                                     [130, 0],
                                     [130, 50],
                                     [0, 50],
                                     [0, 0]]]
                }}}}))
    for i in results[:3]:
        print(i)

    return '1'


if __name__ == '__main__':
    app.run('0.0.0.0', port=7000, debug=True)
