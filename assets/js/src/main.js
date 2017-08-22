'use strict';

import $ from 'jquery';

const localStorage = window.localStorage;

const isItPSLSeason = $('body').data('season');
const yupOrNope = isItPSLSeason ? 'yup' : 'nope';
$('document').ready(function() {
    const $text = $('.main-text');

    $text.text(yupOrNope);
    $text.addClass(yupOrNope);

    const addMapToDOM = () => {
        const $map = $('<div></div>').addClass('map').attr('id', 'map');
        $map.insertAfter($('.page-container'));
    }

    if (localStorage.getItem('pos') && isItPSLSeason) {
        addMapToDOM();
        initMap(JSON.parse(localStorage.getItem('pos')));

    } else {
        if ('geolocation' in navigator) {
            
            let location = navigator.geolocation.getCurrentPosition(function(pos) {
                
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                    
                localStorage.setItem('pos', JSON.stringify(coords));

                if (isItPSLSeason) {
                    addMapToDOM();
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
});



let map;
let service;
let infowindow;

const searchCallback = (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.map((curVal, index) => {
            createMarker(results[index]);
        })
    }
}

const createMarker = (place) => {
    let loc = place.geometry.location;
    let marker = new google.maps.Marker({
        map: map, 
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {

        service.getDetails({
            placeId: place.place_id
        }, (place, status) => {
            infowindow.setContent(markerHTML(place));
            infowindow.open(map, this);
        });
    })
};

const formatHours = (hours) => {
    hours.map(function(currentVal) {
        return `<li> ${currentVal}</li>`;
    });
}

const markerHTML = (place) => {
    let open_now = place.opening_hours.open_now ? 'open' : 'closed'
    return `<div class="store-wrap">
                <div class="small-text ${open_now}">${open_now}</div>
                <div class="name">${place.name} - ${place.rating} Stars</div>
                <div class="address">${place.formatted_address}</div>
                <ul class="hours">
                    ${place.opening_hours.weekday_text.map( (hour) => {
                        return `<li>${hour}</li>`;
                    } ).join('')}
                </ul>
            </div>`;
};


const initMap = (coords) => {

    map = new google.maps.Map(document.getElementById('map'), {
        center: coords,
        zoom: 15,
        scrollwheel: false
    });

    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();

    service.nearbySearch({
        location: coords, 
        radius: 500,
        name: 'Starbucks'
    }, searchCallback);

    service.nearbySearch({
    location: coords,
    radius: 500,
    name: 'Starbucks',
    }, searchCallback);
}  

const recenterMap = () => {
    let center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
}

google.maps.event.addDomListener(window, 'resize', recenterMap);