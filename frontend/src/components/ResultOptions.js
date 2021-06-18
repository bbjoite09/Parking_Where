import React, { useState, useEffect } from "react";

import style from '../css/style.module.css';

export default function ResultOptions({name, free, address, begin_time, end_time}) {

    return (
        <div className={style.result_options}>
            <div className={style.result_name}>{name}</div>
            <div className={style.result_cost}>{free}</div>
            <div className={style.result_address}>주소 : {address}</div>
            <div className={style.result_time}>운영시간 : {begin_time} ~ {end_time}</div>
        </div>
    )
}