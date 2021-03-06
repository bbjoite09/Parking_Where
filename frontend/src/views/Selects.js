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
    const [curParkData, setCurParkData] = useState([]);

    const [mapObj, setMapObj] = useState();
    const [thisLocation, setThisLocation] = useState(false);

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

    const sendThisLocation = async() => {

        if(!mapObj) return;

        setThisLocation(true);

        var bounds = mapObj.getBounds();

        const url = 'http://127.0.0.1:7000/api/public_plot/current';
        const res = await axios.post(url, {
            data : bounds
        }).catch((err) => {
            console.log(err.response);
        })

        if(res && res.data) setCurParkData(res.data[1].parkings);



    }

    useEffect(() => {

        if (curParkData.length == 0) return;

        let positions = []

        for (let index in curParkData) {
            let tempLatLng = new kakao.maps.LatLng(curParkData[index].lat, curParkData[index].lng);
            let tempLatLngObj = {lat: curParkData[index].lat, lng: curParkData[index].lng};
            let element = {title: curParkData[index].Name, latlng: tempLatLng, latlngObj: tempLatLngObj};
            positions.push(element);
        }

        // ?????? ???????????? ????????? ???????????????
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (var i = 0; i < positions.length; i++) {

            // ?????? ???????????? ????????? ?????? ?????????
            var imageSize = new kakao.maps.Size(24, 35);

            // ?????? ???????????? ???????????????
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var temp_title = positions[i].title;
            var temp_position = positions[i].latlng;
            let temp_latlngObj = positions[i].latlngObj;

            // ????????? ???????????????
            var marker = new kakao.maps.Marker({
                map: mapObj, // ????????? ????????? ??????
                position: temp_position, // ????????? ????????? ??????
                title: temp_title, // ????????? ?????????, ????????? ???????????? ????????? ???????????? ???????????????
                image: markerImage // ?????? ?????????
            });

            let link = `https://map.kakao.com/link/to/${temp_title},${temp_latlngObj.lat},${temp_latlngObj.lng}`;

            var iwContent = `<div style=
                "padding:5px; text-align: center; width: 100%; margin-right: 10px;
                font-family: 'Noto Sans KR', sans-serif">${temp_title}
                <a href=${link} style=
                "color:darkorange; text-align: center;
                " target="_blank">?????????</a></div>`
            // ?????????????????? ???????????????
            var infowindow = new kakao.maps.InfoWindow({
                position: temp_position,
                content: iwContent,
            });

            // ?????? ?????? ?????????????????? ???????????????. ????????? ??????????????? marker??? ???????????? ????????? ?????? ?????? ???????????????
            infowindow.open(mapObj, marker);
        }

    }, [curParkData])

    const handleThisLocation = () => {
        setThisLocation(false);
    }

    const handleLocation = (data) => {

        setThisLocation(false);

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
        setMapObj(map);

    }, [resultList, location]);

    useEffect(() => {

        if(!showResult) return;

        getData();

    }, [showResult])

    useEffect(() => {

        if(showResult && parkData.length == 0) {
            alert('????????? ?????????????????? ????????????');
            history.push('/');
        }

        if(parkData.length == 0) return;

        console.log(parkData);
        //?????? ????????? ?????? ????????? ????????? ???????????? ?????? ????????? ??????

        var bounds = new kakao.maps.LatLngBounds();
        var standardLocation = new kakao.maps.LatLng(targetLat, targetLng)

        var mapContainer = document.getElementById('map'), // ????????? ????????? div
            mapOption = {
                center: standardLocation, // ????????? ????????????
                level: 3 // ????????? ?????? ??????
            };

        bounds.extend(standardLocation);

        var map = new kakao.maps.Map(mapContainer, mapOption); // ????????? ???????????????

        let positions = []

        for (let index in parkData) {
            let tempLatLng = new kakao.maps.LatLng(parkData[index].lat, parkData[index].lng);
            let tempLatLngObj = {lat:parkData[index].lat, lng: parkData[index].lng};
            let element = { title : parkData[index].Name , latlng : tempLatLng, latlngObj : tempLatLngObj};
            positions.push(element);
        }

        // ?????? ???????????? ????????? ???????????????
        var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (var i = 0; i < positions.length; i++) {

            // ?????? ???????????? ????????? ?????? ?????????
            var imageSize = new kakao.maps.Size(24, 35);

            // ?????? ???????????? ???????????????
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var temp_title = positions[i].title;
            var temp_position = positions[i].latlng;
            let temp_latlngObj = positions[i].latlngObj;

            // ????????? ???????????????
            var marker = new kakao.maps.Marker({
                map: map, // ????????? ????????? ??????
                position: temp_position, // ????????? ????????? ??????
                title: temp_title, // ????????? ?????????, ????????? ???????????? ????????? ???????????? ???????????????
                image: markerImage // ?????? ?????????
            });

            let link = `https://map.kakao.com/link/to/${temp_title},${temp_latlngObj.lat},${temp_latlngObj.lng}`;

            var iwContent = `<div style=
                "padding:5px; text-align: center; width: 100%; margin-right: 10px;
                font-family: 'Noto Sans KR', sans-serif">${temp_title}
                <a href=${link} style=
                "color:darkorange; text-align: center;
                " target="_blank">?????????</a></div>`
            // ?????????????????? ???????????????
            var infowindow = new kakao.maps.InfoWindow({
                position: temp_position,
                content: iwContent,
            });

            // ?????? ?????? ?????????????????? ???????????????. ????????? ??????????????? marker??? ???????????? ????????? ?????? ?????? ???????????????
            infowindow.open(map, marker);

            bounds.extend(positions[i].latlng);
        }

        marker = new kakao.maps.Marker({
                map: map, // ????????? ????????? ??????
                position: standardLocation// ????????? ????????? ??????
        });

        if(!thisLocation) {
            map.setBounds(bounds);
        }

        setMapObj(map);
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
                                lat = {option.lat}
                                lng = {option.lng}
                                onCreate = {handleThisLocation}
                            />
                        ))}
                    </div>
                )}
                <div id="map" className={style.map}>
                    <div
                        className={style.searchThisLocation}
                        onClick={() => {
                            sendThisLocation();
                        }}
                    >??????????????? ??????</div>
                </div>
            </div>
        </div>
    )
}