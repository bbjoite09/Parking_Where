import os

import requests as requests
from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv

client = MongoClient('localhost', 27017)
db = client.get_database('parking_lot')

app = Flask(__name__)

load_dotenv()
SEOUL_API_KEY = os.environ['SEOUL_API_KEY']

@app.route('/')
def home():
    return 'main page'

# 공공데이터 공영주차장 정보 DB에 저장
@app.route('/api/public_plot', methods=['GET'])
def get_parking_lots():
    response = requests.get(
        f'http://openapi.seoul.go.kr:8088/{SEOUL_API_KEY}/json/GetParkInfo/1/1000/'
    )

    result = response.json()

    datas = result['GetParkInfo']['row']

    for data in datas:
        # 필요한 정보 정의(주차장명, 주소, 유/무료 구분, 야간 무료 여부, 기본 요금, 기본 시간, 추가 요금, 주간 시작 시간, 주간 종료 시간)
        name = data['PARKING_NAME']
        address = data['ADDR']
        free = data['PAY_YN']
        night_free = data['NIGHT_FREE_OPEN']

        basic_cost = data['RATES']
        basic_time = data['TIME_RATE']
        add_cost = data['ADD_RATES']

        weekday_begin_time = data['WEEKDAY_BEGIN_TIME']
        weekday_end_time = data['WEEKDAY_END_TIME']

        doc = {
            "Name": name,
            "Address": address,
            "Free": free,
            "Night free": night_free,
            "Basic_cost": basic_cost,
            "Basic_time": basic_time,
            "Add cost" : add_cost,
            "Weekday begin time": weekday_begin_time,
            "Weekday end time": weekday_end_time
        }

        # document 삽입
        db.park_info.insert(doc)

    return 'DB 삽입 성공'

if __name__ == '__main__':
    app.run('0.0.0.0', port=7000, debug=True)
