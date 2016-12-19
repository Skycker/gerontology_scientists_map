import {gerontologists} from "./mockup";
import MapMarkerHandler from "./map-marker-handler";


// make google map marker for gerontologist
var prepareMarker = function (scientist) {
    return new google.maps.Marker({
        position: scientist.location,
        title: scientist.name,
        draggable: true
    })
};

// make window with extra information about gerontologist
var prepareInfoWindow = function (scientist) {
    return new google.maps.InfoWindow({
        content: `<p><strong>${scientist.name}</strong></p>
        <p>Country: ${scientist.country}</p>
        <p>Gender: ${scientist.gender}</p>
        <p>Year of birth: ${scientist.yearOfBirth}</p>
        <p>Years since PhD: ${scientist.yearsSincePHD}</p>
        <p>Institution: ${scientist.institution}</p>
        <p>COST Affiliation Category: ${scientist.affiliationCategory}</p>
        <p>Core expertise: ${scientist.expertise}</p>
        <p>Contacts: ${scientist.email}, ${scientist.phone}</p>`
    });
};

// get data about scientists.
// In real life that code should send ajax request to server and we need promise to handle asynchronous code.
// but we don't have server side, so this promise resolves data from constant array
var getGerontologists = function (gender, category, expertise) {
    return new Promise((resolve, reject) => {
        var data = gerontologists;
        // in real life filter params should be sent to server as ajax GET-parameters
        // but wee use mock up and filter it via js
        if (gender) {
            data = data.filter((person) => {
                return person.gender == gender;
            })
        }
        if (category) {
            data = data.filter((person) => {
                return person.affiliationCategory == category;
            })
        }
        if (expertise) {
            data = data.filter((person) => {
                return person.expertise.indexOf(expertise) != -1;
            })
        }
        resolve(data)
    });
};

$(window).ready(() => {
    var center = {lat: 25.363, lng: 131.044};
    var gerontologistMap = new MapMarkerHandler("map", center, 2);

    var updateMap = function () {
        gerontologistMap.removeMarkers();
        var gender = $("#gender-filter").val();
        var category = $("#affiliation-filter").val();
        var expertise = $("#expertise-filter").val();
        getGerontologists(gender, category, expertise).then(function (people) {
            for (let person of people) {
                let marker = prepareMarker(person);
                let infoWindow = prepareInfoWindow(person);
                marker.addListener('click', () => {
                    infoWindow.open(gerontologistMap.map, marker);
                });
                // We don't have server to save new marker coordinates, just put type in in console
                marker.addListener('dragend', function (marker) {
                    var latLng = marker.latLng;
                    console.log(`New lat: ${latLng.lat()}, New lng: ${latLng.lng()}`)
                });
                gerontologistMap.addMarker(marker)
            }
        });
    };
    updateMap();

    // init filters
    $('.js-filter-dropdown').dropdown({
        onChange: function (value, text, $selectedItem) {
            updateMap();
        }
    });
});
