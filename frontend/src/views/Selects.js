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

        var firstResultX = resultList[0].x;
        var firstResultY =  resultList[0].y;

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

    }, [resultList]);

    return (
        <div className={style.selects}>
            <script> {console.log("return render")} </script>
            <Nav/>
            <div className={style.grid_container}>
                {loading && (<script> {console.log("loading render")} </script>)}
                {!loading && (
                    <div className={style.main_container}>
                        {resultList.map((option) => (
                            <SearchOptions
                                address_name={option.address_name}
                                category_group_name={option.category_group_name}
                                place_name={option.place_name}
                                road_address_name={option.road_address_name}
                            />
                        ))}
                    </div>
                )}

                <div id="map" className={style.map}></div>
            </div>
        </div>
    )
}