// if using SVG and you require older browser support uncomment below
// require('svg4everybody')();


import $ from 'jquery';

$('document').ready(function() {
    console.log('ready');

    if ('geolocation' in navigator) {
        
        let location = navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos);
        }, function(err) {
            console.log(err);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } 
});