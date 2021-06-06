/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import Nav from '../components/Nav';
import SearchOptions from '../components/SearchOptions';
import Search from "../components/Search";

export default function Selects(props) {
    const content = props.location.content;
    let result_data = 1;
    let places = new kakao.maps.services.Places();

    let callback = function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            result_data = result[0].address_name;
        }
    };

    places.keywordSearch(content, callback);

    return (
        <div>
            <Nav/>
            <button onClick={() => {alert(result_data)}}>hi</button>
        </div>
    )
}