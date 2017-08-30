'use strict';

import $ from 'jquery';

const localStorage = window.localStorage;






$('document').ready(function() {

    let isItPSLSeason = null;
    const $text = $('.main-text');

    $text.text(yupOrNopeText);
    $text.addClass(yupOrNope);


    const countDown = (endTime) => {
        
        let now = new Date();
    
        let time = Date.parse(endTime) - Date.parse(now);
    
        return {
            'timeLeft': time
        };
    }
        
    const initClock = (time) => {
    
        let i = 0;
        const interval = setInterval(function() {
    
            let clock = countDown(time);
    
            console.log(clock.timeLeft <= 0);
    
            if (clock.timeLeft <= 0) {
    
                console.log(clock.timeLeft <= 0);
    
                clearInterval(interval);
                
    
                return isItPSLSeason = clock.timeLeft <= 0;
            }
        }, 1000);
    
    }


    

    initClock('August 28 2017');


    console.log(isItPSLSeason);


    const yupOrNope = isItPSLSeason ? 'yup' : 'nope';
    const yupOrNopeText = isItPSLSeason ? 'YASSS!' : 'Not Yet';


    const addMapToDOM = () => {
        const $text = $('<h4>Better go get you one. Here\'s your nearest PSL</h4>').addClass('text-center');
        const $map = $('<div></div>').addClass('map').attr('id', 'map');
        $map.insertAfter($('.page-container'));
        $text.insertAfter($('.page-container'));
    }

    const addCountDownToDOM = () => {
        const $clockWrap = $('<div></div>').attr('id', 'countdown');
        const $clockText = $('<h4>But soon</h4>').addClass('medium-text');

        $clockWrap.insertAfter('.main-text');
        $clockText.insertAfter('.main-text');
    }



    if (localStorage.getItem('pos') && isItPSLSeason) {

        initMap(JSON.parse(localStorage.getItem('pos')));

    } else if (isItPSLSeason) {
        console.log('yup!');
        if ('geolocation' in navigator) {
            
            let location = navigator.geolocation.getCurrentPosition(function(pos) {
                
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                    
                localStorage.setItem('pos', JSON.stringify(coords));

                if (isItPSLSeason) {
                    initMap(coords);
                }
    
            }, function(err) {
                console.log(err);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } 
    }


    // initClock('clock', '2017-08-30');
    
});




let map;
let service;
let infowindow;
let mapDidRun = false;

const searchCallback = (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        
        results.map((curVal, index) => {
            createMarker(results[index], false);
        })
    }
}

const createMarker = (place, youAreHere) => {

    let here = youAreHere;

    const hereMarker = {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
        fillColor: here ? '#c0392b' : '#00704a',
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 1
      };

    let marker = new google.maps.Marker({
        map: map, 
        position: here ? place : place.geometry.location,
        icon: hereMarker
    });

    google.maps.event.addListener(marker, 'click', function() {

        if (here) {
            infowindow.setContent(markerHTML(place, here));
            infowindow.open(map, this);
        } else {
            service.getDetails({
                placeId: place.place_id
            }, (place, status) => {
                infowindow.setContent(markerHTML(place, here));
                infowindow.open(map, this);
            });
        }
    })
};

const markerHTML = (place, youAreHere) => {
    if (youAreHere) {
        return `<div class="store-wrap here-now"></div>
        <div class="here text-center">You are here now.</div>
        <p class="text-center">This might be a good time to reflect on your life choices.</p>
    </div>`;
    } else {
        let open_now = place.opening_hours.open_now ? 'yup' : 'nope';
        let open_now_text = place.opening_hours.open_now ? 'Open' : 'Close';
        
            return `<div class="store-wrap">
                        <div class="small-text ${open_now}">${open_now_text}</div>
                        <div class="name">${place.name} - ${place.rating} Stars</div>
                        <div class="address">${place.formatted_address}</div>
                        <ul class="hours">
                            ${place.opening_hours.weekday_text.map( (hour) => {
                                return `<li>${hour}</li>`;
                            } ).join('')}
                        </ul>
                    </div>`;
    }
};


const initMap = (coords) => {

    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 15,
        scrollwheel: false
    });

    service = new google.maps.places.PlacesService(map);

    infowindow = new google.maps.InfoWindow();

    let youAreHere = createMarker(coords, true);

    service.nearbySearch({
        location: coords, 
        radius: 500,
        name: 'Starbucks'
    }, searchCallback);

    

    mapDidRun = true;
}  

const recenterMap = () => {
    if (!mapDidRun) return false;
    let center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
}

google.maps.event.addDomListener(window, 'resize', recenterMap);