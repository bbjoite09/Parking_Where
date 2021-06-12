import os

import pymongo
import requests as requests
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv

client = MongoClient('localhost', 27017)
db = client.get_database('parking_DB')

app = Flask(__name__)

load_dotenv()
SEOUL_API_KEY = os.environ['SEOUL_API_KEY']

response = requests.get(
    f'http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/GetParkInfo/1/1000/'
)

result = response.json()

datas = result['GetParkInfo']['row']

last_name = ''
dupli = []

for data in datas:
    # 필요한 정보 정의(주차장명, 주소, 유/무료 구분, 야간 무료 여부, 기본 요금, 기본 시간, 추가 요금, 주간 시작 시간, 주간 종료 시간, 위도, 경도)
    name = data['PARKING_NAME']
    if last_name != name:
        last_name = name
    else:
        if last_name in dupli:
            pass
        else:
            dupli.append(name)

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

for i in dupli:
    db.park_info.aggregate(
        {"$group": {"_id": "$name", "count": {"$sum": 1}}},
        {"$match": {"_id": {"$ne": 0}, "count": {"$gt": 1}}},
        {"$sort": {"count": -1}},
        {"$project": {"name": "$_id", "_id": 0}}
    )