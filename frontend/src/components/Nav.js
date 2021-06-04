import style from '../css/Nav.module.css';

import logo1 from '../images/logo.svg';

export default function Nav() {
    return (
        <div className={style.nav}>
            <img
                className={style.logo1}
                src={logo1}
                alt="logo1"
            />
        </div>
    )
}