import Nav from '../components/Nav';
import style from '../css/homestyle.module.css';

import car from '../images/car.svg';
import title from '../images/title.svg';

export default function Main() {
    return (
        <div className={style.main_box}>
            <Nav/>
            <img
                className={style.title}
                src={title}
                alt='title'
            />

            <img
                className={style.car}
                src={car}
                alt='car'
            />
        </div>
    )
}