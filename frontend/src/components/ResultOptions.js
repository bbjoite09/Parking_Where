/*global kakao*/
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import style from '../css/style.module.css';

import select_button from '../images/selectVec.svg'
import {Link} from "react-router-dom";

export default function ResultOptions({name, free, add_cost, basic_cost, basic_time, address, begin_time, end_time}) {


    return (
        <div className={style.search_options}>
            <div>
                <div className={style.place_name}>{name}</div>
            </div>
            <div className={style.category_group_name}>{free}</div>
            <div className={style.road_address_name}>주소 {address}</div>

        </div>
    )
}