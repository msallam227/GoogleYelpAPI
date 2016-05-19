// =========Start Google Places API=========
var geocoder;
var map;
var markers = new Array();
var infos = new Array();

function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (RCB)
    var myLatlng = new google.maps.LatLng(40.7191114,-74.0328205);
    var myOptions = { // default map options
        zoom: 16,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);
}

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (var i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (var i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}

// find address function
function findAddress() {
    var address = document.getElementById("gmap_where").value;

    // script uses our 'geocoder' in order to find location by address name
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

            // we will center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);

            // store current coordinates into hidden variables
            // document.getElementById('lat').value = results[0].geometry.location.Xa;
            // document.getElementById('lng').value = results[0].geometry.location.Ya;
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();

            // and then - add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'assets/images/mapMarker.png'
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// find custom places function
function findPlaces() {

    // prepare variables (filter)
    var type = document.getElementById('gmap_type').value;
    var radius = document.getElementById('gmap_radius').value;
    // var keyword = document.getElementById('gmap_keyword').value;

    // Set default search location based on lat/lng passed from index page.
    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: radius,
        types: [type]
    };
    // if (keyword) {
    //     request.keyword = [keyword];
    // }

    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
}

// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        // alert('Sorry, nothing is found');
    }
}

// creare single marker function
function createMarker(obj) {

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
    });
    markers.push(mark);

    // type of place info window
    var infowindow = new google.maps.InfoWindow({
        content: '<div id="infowindowPhoto"><img src="' + obj.icon + '" /></div><div id="infowindowData"><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Address: ' + obj.vicinity + '</font></div>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        infowindow.open(map,mark);
    });
    infos.push(infowindow);
}

// initialization
google.maps.event.addDomListener(window, 'load', initialize);
// =========End Places API=========

// =========Start Geolocation API=========
function writeAddressName(latLng) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
        "location": latLng
    },
    function(results, status) {
        if (status == google.maps.GeocoderStatus.OK)
            document.getElementById("gmap_where").value = results[0].formatted_address;
        else
            document.getElementById("error").innerHTML += "Unable to retrieve your address" + "<br />";
    });
}

function geolocationSuccess(position) {
    var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    // Write the formatted address
    writeAddressName(userLatLng);
    var myOptions = {
      zoom : 16,
      center : userLatLng,
      mapTypeId : google.maps.MapTypeId.ROADMAP
    };

    // Draw the map
    var mapObject = new google.maps.Map(document.getElementById("map"), myOptions);

    // Place the marker
    new google.maps.Marker({
        map: mapObject,
        position: userLatLng
    });

    // Draw a circle around the user position to have an idea of the current localization accuracy
    var circle = new google.maps.Circle({
        center: userLatLng,
        radius: position.coords.accuracy,
        map: mapObject,
        fillColor: '#0000FF',
        fillOpacity: 0.5,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0
    });
    mapObject.fitBounds(circle.getBounds());
}

function geolocationError(positionError) {
    document.getElementById("error").innerHTML += "<div>" + positionError.message + "</div><br />";
}

function geolocateUser() {
    // If the browser supports the Geolocation API
    if (navigator.geolocation){
        var positionOptions = {
        enableHighAccuracy: true,
        timeout: 10 * 1000 // 10 seconds
      };
      navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
    }else
      document.getElementById("error").innerHTML += "Your browser doesn't support the Geolocation API";
}

window.onload = geolocateUser;
// =========End Google Geolocation API=========