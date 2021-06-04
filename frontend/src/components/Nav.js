import React, { useState, useEffect } from "react";
import style from '../css/component.module.css';

import logo1 from '../images/logo.svg';
import user from '../images/user.svg';

export default function Nav() {
    return (
        <div className={style.nav}>
            <img
                className={style.logo1}
                src={logo1}
                alt="logo1"
            />

            <img
                className={style.user}
                src = {user}
                alt = "user"
            />
        </div>
    )
}