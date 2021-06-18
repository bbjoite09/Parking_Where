import React, { useState, useEffect } from "react";
import style from '../css/mini.module.css';
import {Link} from "react-router-dom";

import rens from '../images/rens.svg';
import logo1 from "../images/logo.svg";
import user from "../images/user.svg";

export default function MiniSearch(props) {

    const [content, setContent] = useState();
    console.log(props.searchContent);

    const alert_prep = () => {
        alert("로그인 기능 준비 중 입니다.")
    }

    return (
        <div className={style.mini_search}>
            <Link to='/'>
                <img
                    className={style.logo1}
                    src={logo1}
                    alt="logo1"
                    href="/"
                />
            </Link>

            <div className={style.search}>
                <img
                    className={style.search_rens}
                    src={rens}
                    alt='돋보기'
                />
                <input
                    type='text'
                    id='search_box'
                    className={style.search_box}
                    value={content}
                    placeholder={props.searchContent}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Link to={{pathname: `/selects/${content}`}}>
                    <button className={style.search_button}>검색</button>
                </Link>
            </div>

            <img
                className={style.user}
                src={user}
                alt="user"
                onClick={() => alert_prep()}
            />
        </div>
    )
}