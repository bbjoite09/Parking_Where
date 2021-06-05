import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import logo1 from '../images/logo.svg';
import user from '../images/user.svg';

export default function Nav() {

    const alert_prep = () => {
        alert("로그인 기능 준비 중 입니다.")
    }

    return (
        <div className={style.nav}>
            <a href='/'>
                <img
                className={style.logo1}
                src={logo1}
                alt="logo1"
                href="/"
                />
            </a>

            <img
                className={style.user}
                src = {user}
                alt = "user"
                onClick={()=> alert_prep()}
            />
        </div>
    )
}