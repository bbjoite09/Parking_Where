/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import select_button from '../images/selectVec.svg'
import {Link} from "react-router-dom";

export default function SearchOptions({address_name, category_group_name, place_name, road_address_name, lat, lng, index, onCreate}) {
    const axios = require('axios');

    const [resData, setResData] = useState();

    const clickName = () => {
        onCreate(index);
    }

    const handleClick = async () => {
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

        if(res && res.data) setResData(res);
    };

    useEffect(() => {

        if(!resData) return;
        console.log('this is resData : ', resData);

    }, [resData]);


    return (
        <div className={style.search_options}>
            <div>
                <div className={style.place_name}
                onClick={()=> {clickName()}}>{place_name}</div>
            </div>
            <div className={style.category_group_name}>{category_group_name}</div>
            <div className={style.road_address_name}>주소 {road_address_name}</div>

            <img
                className={style.select_button}
                src={select_button}
                onClick={() => {
                    handleClick();
                }}
            />
        </div>
    )
}