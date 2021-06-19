import React, { useState, useEffect } from "react";

import style from '../css/style.module.css';
import route from '../images/길찾기.svg';
import {Link} from "react-router-dom";

export default function ResultOptions({name, free, address, begin_time, end_time, lat, lng, onCreate}) {

    const kakao_link = `https://map.kakao.com/link/to/${name},${lat},${lng}`;

    return (
        <div className={style.result_options}>
            <div className={style.result_name}>{name}</div>
            <div className={style.result_cost}>{free}</div>
            <div className={style.result_address}>주소 : {address}</div>

            <div className={style.last_block}>
                <div className={style.result_time}>운영시간 : {begin_time} ~ {end_time}</div>
                <a href={kakao_link} target='_black'>
                    <img
                        src={route}
                        className={style.select_button}
                        onClick={()=>{
                            onCreate();
                        }}
                    />
                </a>

            </div>

        </div>
    )
}