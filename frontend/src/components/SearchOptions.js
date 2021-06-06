import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

export default function SearchOptions({address_name, category_group_name, place_name, road_address_name}) {
    return (
        <div className={style.SearchOptions_box}>
            <p>{address_name}</p>
            <p>{category_group_name}</p>
            <p>{place_name}</p>
            <p>{road_address_name}</p>
        </div>
    )
}