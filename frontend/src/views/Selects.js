/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';
import { useHistory, useParams } from "react-router-dom";

import Nav from '../components/Nav';
import SearchOptions from '../components/SearchOptions';
import ResultOptions from "../components/ResultOptions";
import MiniSearch from "../components/MiniSearch";


export default function Selects(props) {
    const content = useParams().content;
    const axios = require('axios');
    let history = useHistory();

    const [resultList, setResultList] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [location, setLocation] = useState(0);
    const [targetLat, setTargetLat] = useState(0);
    const [targetLng, setTargetLng] = useState(0);
    const [parkData, setParkData] = useState([]);

    const getData = async () => {
        const url = 'http://127.0.0.1:7000/api/public_plot/get';
        const res = await axios.post(url, {
            lat: targetLat,
            lng: targetLng,
        }).catch((err) => {
            if(err.response) {
                console.log(err.response);
            } else if (err.request) {
                console.log("never recieved a response");
            }
        });

        if(res && res.data) setParkData(res.data[1].parkings);
    }

    const handleLocation = (data) => {

        if(data.clickType === 'name') {
            setLocation(data.content);
        }

        else if (data.clickType === 'location') {
            setShowResult(true);
            setTargetLat(data.content[0]);
            setTargetLng(data.content[1]);
        }

        else {
            console.log('error in handleLocation Func');
        }
    }

    useEffect(() => {

        let places = new kakao.maps.services.Places();

        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setResultList(result);
            }
        };
        places.keywordSearch(content, callback);

        if(showResult) {
            setShowResult(false);
        }

    }, [content])

    useEffect(() => {

        if (resultList.length == 0) {
            return;
        }

        var firstResultX = resultList[location].x;
        var firstResultY =  resultList[location].y;

        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(firstResultY, firstResultX),
            level: 3
        };
        var map = new kakao.maps.Map(container, options);

        var markerPosition = new kakao.maps.LatLng(firstResultY, firstResultX);
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);

    }, [resultList, location]);

    useEffect(() => {

        if(!showResult) return;

        getData();

    }, [showResult])

    useEffect(() => {

        if(showResult && parkData.length == 0) {
            alert('근처에 공영주차장이 없습니다');
            history.push('/');
        }

        if(parkData.length == 0) return;

        //이제 여기에 지도 선택된 장소로 업뎃하고 공용 주차장 마커

        var bounds = new kakao.maps.LatLngBounds();
        var standardLocation = new kakao.maps.LatLng(targetLat, targetLng)

        var mapContainer = document.getElementById('map'), // 지도를 표시할 div
            mapOption = {
                center: standardLocation, // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

        bounds.extend(standardLocation);

        var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

        let positions = []

        for (let index in parkData) {
            let tempLatLng = new kakao.maps.LatLng(parkData[index].lat, parkData[index].lng);
            let element = { title : parkData[index].Name , latlng : tempLatLng };
            positions.push(element);
        }

        // 마커 이미지의 이미지 주소입니다
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (var i = 0; i < positions.length; i++) {

            // 마커 이미지의 이미지 크기 입니다
            var imageSize = new kakao.maps.Size(24, 35);

            // 마커 이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var temp_title = positions[i].title;
            var temp_position = positions[i].latlng;

            // 마커를 생성합니다
            var marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: temp_position, // 마커를 표시할 위치
                title: temp_title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image: markerImage // 마커 이미지
            });

            // 인포윈도우를 생성합니다
            var infowindow = new kakao.maps.InfoWindow({
                position: temp_position,
                content: `<span class="info-title">${temp_title}</span>`
            });

            // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
            infowindow.open(map, marker);

            bounds.extend(positions[i].latlng);
        }

        marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: standardLocation// 마커를 표시할 위치
        });

        map.setBounds(bounds);

    }, [parkData])


    return (
        <div className={style.selects}>
            <MiniSearch searchContent={content}/>
            <div className={style.grid_container}>
                {!showResult && (<div className={style.main_container}>
                        {resultList.map((option, index) => (
                            <SearchOptions
                                address_name={option.address_name}
                                category_group_name={option.category_group_name}
                                place_name={option.place_name}
                                road_address_name={option.road_address_name}
                                lat = {option.y}
                                lng = {option.x}
                                index = {index}
                                onCreate = {handleLocation}
                            />
                        ))}
                    </div>
                )}
                {showResult && (<div className={style.main_container}>
                        {parkData.map((option) => (
                            <ResultOptions
                                name = {option.Name}
                                free = {option.Free}
                                address = {option.Address}
                                begin_time = {option['Weekday begin time']}
                                end_time = {option['Weekday end time']}
                            />
                        ))}
                    </div>
                )}

                <div id="map" className={style.map}></div>
            </div>
        </div>
    )
}