'use strict';

import $ from 'jquery';
import ee from 'event-emitter';

class CountdownClock {

    constructor(time) {
        this.timeLeft = null;
        this.isInSeason = false;
        this.deadline = time;
        this.addCountToDom = false;
    }

    init() {
        this.initClock();
    }

    countdown() {
        let now = new Date();
        
        this.addCountdownToDom((Date.parse(this.deadline) - Date.parse(now)));

        return this.timeLeft = (Date.parse(this.deadline) - Date.parse(now));
    }

    addCountdownToDom(timeLeft) {
        let countEl;

        if (!this.addCountToDom) {

            countEl = document.createElement('div');
            countEl.className += 'countdown';

            const countdownTitle = document.createElement('h3');
            countdownTitle.className += 'medium-text orange';
            countdownTitle.innerHTML = 'But the PSL will bere here soon';
            
            document.querySelector('.page-container').appendChild(countdownTitle);
            document.querySelector('.page-container').appendChild(countEl);
        } else {
            countEl = document.querySelector('.countdown');
        }

        countEl.innerHTML = timeLeft;

        this.addCountToDom = true;
    }

    removeCountdownFromDom() {
        const countEl = document.querySelector('.countdown');

        if (countEl) {
            countEl.innerHTML = '';
            countEl.remove();
        }
        
    }

    hasDeadlineBeenHit() {
        return this.timeLeft <= 0;
    }

    initClock() {
        const interval = setInterval(() => {
    
            let clock = this.countdown();

            console.log(clock);

            if (this.hasDeadlineBeenHit()) {

                this.isInSeason = true;
                
                this.emit('season:open', this.isInSeason);
                
                this.removeCountdownFromDom();
                
                clearInterval(interval);

            } else {

                this.emit('season:close', this.isInSeason);
                
            }

        }, 1000);
    }

}

class pslAPP {

    constructor() {
        this.text = document.querySelector('.main-text');
        this.pageContainer = document.querySelector('.page-container');
        this.isOpen = null;
        this.mapInit = false;
        this.userLocation = false;
        this.headlineSet = false;
    }

    seasonOpened() {
        let hasBeenSet;

        if (hasBeenSet) return false;
        this.setHeadlineText(true);
        this.addMap();

        hasBeenSet = true;

    }   

    seasonClosed() {
        console.log('closed!');
        this.setHeadlineText(false);
    }

    setHeadlineText(isOpen) {
        let hasBeenSet;

        isOpen ? this.text.innerHTML = 'YASSS!' : this.text.innerHTML = 'Not Yet';
        
        if (hasBeenSet) false;
        let textClass = isOpen ? 'yup': 'nope';
        this.text.className += ' ' + textClass;
    }

    addMap() {
        if (this.mapInit) return;
        const map = document.createElement('div');
        map.className += 'map';
        map.id = 'map';
        
        const mapHeadline = document.createElement('h4');
        mapHeadline.className += ' text-center';
        mapHeadline.innerHTML = 'Better go get you one. Here\'s your nearest PSL';

        this.pageContainer.appendChild(mapHeadline);
        this.pageContainer.appendChild(map);

        this.storeLocation();

        this.mapInit = true;
    }

    storeLocation() {
        const localStorage = window.localStorage;

        if ('geolocation' in navigator) {

            this.userLocation = navigator.geolocation.getCurrentPosition(function(pos) {
                
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };

                let gm;
                
                if (localStorage.getItem('pos')) {
                    console.log('alrady there');
                    gm = new Map(coords);
                } else {
                    gm = new Map(coords);
                }

                localStorage.setItem('pos', JSON.stringify(coords));

                gm.init();
    
    
            }, function(err) {
                console.log(err);
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        } 
    }

}

class Map {
    
    constructor(coords) {
        this.coords = coords;
        this.map;
        this.service;
        this.infoWindow;
        this.mapDidRun;
        this.marker;


    }

    searchCallback(results, status) {
        console.log(this);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            
            results.map((curVal, index) => {

                this.createMarker(results[index], false);
            })
        }
    }


    createMarker(place, youAreHere) {
        let here = youAreHere;
        
        const hereMarker = {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
            fillColor: here ? '#c0392b' : '#00704a',
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 1
        };
    
        this.marker = new google.maps.Marker({
            map: this.map, 
            position: here ? place : place.geometry.location,
            icon: hereMarker
        });
    
        google.maps.event.addListener(this.marker, 'click', (e) => {
            console.log(this.marker);
            console.log(this.infoWindow);

            if (here) {
                this.infoWindow.setContent(this.markerHTML(place, here));
                this.infoWindow.open(this.map, this);
            } else {
                console.log(place);
                this.service.getDetails({
                    placeId: place.place_id
                }, (place, status) => {
                    this.infoWindow.setContent(this.markerHTML(place, here));
                    this.infoWindow.open(this.map, this);
                });
            }
        });
    }

    markerHTML(place, youAreHere) {

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
    }

    recenterMap() {
        if (!this.mapDidRun) return false;

        let center = this.map.getCenter();
        google.maps.event.trigger(this.map, "resize");
        this.map.setCenter(center); 
    }

    init(){
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: this.coords,
            zoom: 15,
            scrollwheel: false
        });
    
        this.service = new google.maps.places.PlacesService(this.map);
        this.infoWindow = new google.maps.InfoWindow();
        
        console.log(this.infoWindow);
        let youAreHere = this.createMarker(this.coords, true);

        this.service.nearbySearch({
            location: this.coords, 
            radius: 500,
            name: 'Starbucks'
        }, this.searchCallback.bind(this));
    
        this.mapDidRun = true;

        google.maps.event.addDomListener(window, 'resize', this.recenterMap);
    }

}


ee(CountdownClock.prototype);

const countDown = new CountdownClock('August 28, 2017 08:33:00');
const app = new pslAPP;

countDown.init();

countDown.on('season:close', function(val) {
    app.seasonClosed();
});

countDown.on('season:open', function(val) {
    app.seasonOpened();
});