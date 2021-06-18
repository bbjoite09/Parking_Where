/*global kakao*/
import React from "react";

import style from '../css/style.module.css';

import select_button from '../images/selectVec.svg'
import {Link} from "react-router-dom";

export default function SearchOptions({category_group_name, place_name, road_address_name, lat, lng, index, onCreate}) {

    const clickName = (clickType, content) => {
        let nameOrLocation = { clickType : clickType, content: content }
        onCreate(nameOrLocation);
    }

    return (
        <div className={style.search_options}>
            <div>
                <div className={style.place_name}
                onClick={()=> {clickName('name', index)}}>{place_name}</div>
            </div>
            <div className={style.category_group_name}>{category_group_name}</div>
            <div className={style.road_address_name}>주소 {road_address_name}</div>

            <img
                className={style.select_button}
                src={select_button}
                onClick={() => {clickName('location', [lat, lng])}}
            />

        </div>
    )
}