/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import Nav from '../components/Nav';
import ResultOptions from '../components/ResultOptions';

export default function Result(props) {

    const axios = require('axios');

    const content = props.location.content;
    const lat = content.lat;
    const lng = content.lng;

    const [location, setLocation] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resData, setResData] = useState([]);

    const getData = async () => {
        const url = 'http://127.0.0.1:7000/api/public_plot/get';
        const res = await axios.post(url, {
            lat: lat,
            lng: lng,
        }).catch((err) => {
            if(err.response) {
                console.log(err.response);
            } else if (err.request) {
                console.log("never recieved a response");
            }
        });

        if(res && res.data) setResData(res.data[1].parkings);
    }

    useEffect(() => {

        getData();

    }, [])


    useEffect(() => {

        if (!resData) return;
        setLoading(false);

        if (resData.length == 0) return;

        var firstResultX = resData[location].lat;
        var firstResultY =  resData[location].lng;

        var containers = document.getElementById('maps');
        var option = {
            center: new kakao.maps.LatLng(firstResultY, firstResultX),
            level: 3
        };
        var map = new kakao.maps.Map(containers, option);

        var markerPosition = new kakao.maps.LatLng(firstResultY, firstResultX);
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);

    }, [resData, location])

    return (
        <div className={style.result}>
            <Nav/>
            <div className={style.grid_container}>
                {loading}
                {!loading && (
                    <div className={style.main_container}>
                        {resData.map((params) => (
                            <ResultOptions
                                name = {params.Name}
                                free = {params.Free}
                                address = {params.Address}
                                begin_time = {params['Weekday begin time']}
                                end_time = {params['Weekday end time']}
                            />
                        ))}
                    </div>
                )}

                <div id='maps' className={style.map}></div>
            </div>
        </div>
    )
}