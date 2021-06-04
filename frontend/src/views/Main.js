import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import Nav from '../components/Nav';
import Search from "../components/Search";

import car from '../images/car.svg';
import title from '../images/title.svg';

export default function Main() {
    return (
        <div className={style.main_box}>
            <Nav/>
            <div className={style.title_box}>
                <img
                className={style.title}
                src={title}
                alt='title'
                />
            </div>
            <Search/>
            <div className={style.car_box}>
                <img
                className={style.car}
                src={car}
                alt='car'
                />
            </div>
        </div>
    )
}