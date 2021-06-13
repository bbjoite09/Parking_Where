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
