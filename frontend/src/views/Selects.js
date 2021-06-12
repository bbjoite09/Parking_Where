/*global kakao*/
import React, { useState, useEffect } from "react";
import style from '../css/style.module.css';

import Nav from '../components/Nav';
import SearchOptions from '../components/SearchOptions';
import Search from "../components/Search";

export default function Selects(props) {
    const content = props.location.content;
    console.log(content);

    const [resultList, setResultList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(0);

    const handleLocation = (data) => {
        setLocation(data);
    }

    useEffect(() => {
        console.log("first render")
        let places = new kakao.maps.services.Places();

        let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setResultList(result);
                console.log('rl : ', result)
            }
        };
        places.keywordSearch(content, callback);
    }, [])

    useEffect(() => {
        console.log("second render");

        if (resultList.length == 0) {
            return;
        }

        console.log("third render");
        setLoading(false);

        var firstResultX = resultList[location].x;
        var firstResultY =  resultList[location].y;

        var container = document.getElementById('map');
        var options = {
            center: new kakao.maps.LatLng(firstResultY, firstResultX),
            level: 3
        };
        var map = new kakao.maps.Map(container, options);

        var markerPosition = new kakao.maps.LatLng(firstResultY, firstResultX);
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        marker.setMap(map);
        console.log("fort render1");

    }, [resultList, location]);

    return (
        <div className={style.selects}>
            <script> {console.log("return render")} </script>
            <Nav/>
            <div className={style.grid_container}>
                {loading && (<script> {console.log("loading render")} </script>)}
                {!loading && (
                    <div className={style.main_container}>
                        {resultList.map((option, index) => (
                            <SearchOptions
                                address_name={option.address_name}
                                category_group_name={option.category_group_name}
                                place_name={option.place_name}
                                road_address_name={option.road_address_name}
                                lat = {option.y}
                                lng = {option.x}
                                index = {index}
                                onCreate = {handleLocation}
                            />
                        ))}
                    </div>
                )}

                <div id="map" className={style.map}></div>
            </div>
        </div>
    )
}