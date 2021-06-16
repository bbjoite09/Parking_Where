/*global kakao*/
import React, { useState, useEffect } from "react";

import style from '../css/style.module.css';

import select_button from '../images/selectVec.svg'
import {Link} from "react-router-dom";

export default function SearchOptions({address_name, category_group_name, place_name, road_address_name, lat, lng, index, onCreate}) {

    const clickName = () => {
        onCreate(index);
    }

    return (
        <div className={style.search_options}>
            <div>
                <div className={style.place_name}
                onClick={()=> {clickName()}}>{place_name}</div>
            </div>
            <div className={style.category_group_name}>{category_group_name}</div>
            <div className={style.road_address_name}>주소 {road_address_name}</div>

            <Link to={{pathname: '/result', content: {lat: lat, lng: lng}}}>
                <img
                    className={style.select_button}
                    src={select_button}
                />
            </Link>

        </div>
    )
}