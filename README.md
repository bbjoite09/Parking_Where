# 🚧 Parking Where 🚧

## ⚙ 외부 패키지 설치

<details><summary>how to local set up</summary>

python 가상 환경(3.8 버전 +)

1. poetry
   ```shell
    $ cd backend
    $ poetry install
   ```


2. npm
   ```shell
    $ cd frontend
    $ npm install
   ```

</details>

## 🚍 개발 일지

#### 2021.05.29

✔ 팀 프로젝트 시작<br>
✔ 개발 사양 및 개발 계획, 기능 정의<br>
✔ 로고, 메인페이지 디자인<br>

#### 2021.06.05

✔ 서울 열린데이터 광장<a href="http://data.seoul.go.kr/dataList/OA-13122/S/1/datasetView.do">
   서울시 공영주차장 정보 api</a>를 사용하여 공영주차장 정보 DB 구축<br>
✔ 특정 위치 기준 가까운 거리 도출 기능 추가<br>
✔ react로 메인페이지 구성<br>

#### 2021.06.12

✔ 공영주차장 데이터 전처리<br>
✔ 1km 반경 주차장 정보 반환 기능 추가<br>
✔ react, flask 통신 <br>
✔ 카카오 지도 api를 활용하여 검색, 지도 기능 추가<br>

#### 2021.06.19

✔ 현재 지도에서 검색하기 기능 추가<br>
✔ AWS 서버 배포<br>
✔ 팀 프로젝트 마감, 발표<br>

## 🚘 Functional requirements

- Keywords 검색
- 지도에 검색된 위치 표시(사용자 검색 장소, 공영주차장 위치)
- 카카오 길찾기 연동
- 현재 지도에서 검색

- 반응형 웹 수정
- 툴 디자인 변경
- 요금 정보 추가
- 실시간 DB
