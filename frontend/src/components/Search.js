import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';
import {Link} from "react-router-dom";

import rens from '../images/rens.svg';

export default function Search() {
    const [content, setContent] = useState("");

    return (
        <div className={style.search}>
            <img
                className={style.search_rens}
                src={rens}
                alt='돋보기'
            />
            <input
                type='text'
                placeholder="  장소를 입력하세요"
                id='search_box'
                className={style.search_box}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <Link to={{pathname: `/selects/${content}`}}>
                <button className={style.search_button}>검색</button>
            </Link>
        </div>
    )
}