/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import select_button from '../images/selectVec.svg'
import {Link} from "react-router-dom";

export default function SearchOptions({address_name, category_group_name, place_name, road_address_name}) {
    const [temp, setTemp] = useState("hi");

    return (
        <div className={style.search_options}>
            <h2 className={style.place_name}>{place_name}</h2>
            <div className={style.category_group_name}>{category_group_name}</div>
            <div className={style.road_address_name}>주소 {road_address_name}</div>

            <Link to={{pathname: `/result/:${temp}`, content: temp}}>
                <img
                    className={style.select_button}
                    src={select_button}/>
            </Link>
        </div>
    )
}