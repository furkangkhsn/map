var map;
var directionsRenderer;
var directionsService;

window.wp = [];
/*let waypoints = window.musteriler.map(x => {
    return {location: {lat: x.enlem, lng: x.boylam}}
});
*/
function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39, lng: 35},
        zoom: 6
    });
    directionsRenderer.setMap(map);
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);  
    });
}

function placeMarkerAndPanTo(latLng, map) {
    if(window.marker != undefined) window.marker.setMap(null);
    window.start_point = latLng;
    window.marker = new google.maps.Marker({
        position: latLng,
        map: map
    });
}

function noktayaYakinlariHesapla(latlng) {
    let dist = window.musteriler.map(x => {
        return {
            kodu: x.kodu,
            uzakligi: getDistance({lat: latlng.lat(), lng: latlng.lng()}, {lat: x.enlem, lng: x.boylam})
        }
    }).sort((x, y) => x.uzakligi - y.uzakligi);
    let sortedClients = [];
    for (let i = 0; i < window.rut_sayisi; i++) {
        sortedClients.push(window.musteriler.find(y => y.kodu == dist[i].kodu));
    }
    window.sortedClients = sortedClients;
}

function getWaypoints(clients) {
    for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        let latlng = {location: {
            lat: client.enlem,
            lng: client.boylam
        }};
        window.wp.push(latlng);
    }
}

var rad = function(x) {
    return x * Math.PI / 180;
};

var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

function rut_hesapla() {
    window.rut_sayisi = prompt('Kaç müşteri ziyaret etmek istiyorsunuz?');
    if(window.rut_sayisi != null) {
        noktayaYakinlariHesapla(window.start_point);
        console.log(window.sortedClients);
        
        var summaryPanel = document.getElementById('directions-panel');
        for (var i = 1; i < window.sortedClients.length; i++) {
            let client = window.sortedClients[i];
            summaryPanel.innerHTML += `
                <div class="route">
                    <div class="no">${ client.kodu }</div>
                    <div class="from-to">
                        <div class="nereden">${ client.adi } </div>
                    </div>
                </div>
            `;
        }
    }
}

function rut_ciz() {
    console.log(window.wp);
    
    let request = {
        origin: window.start_point,
        destination: window.wp[window.wp.length-1],
        waypoints: window.wp,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            console.log(result);
            directionsRenderer.setDirections(result);
            var route = result.routes[0];
            let orders = route.waypoint_order;
            var summaryPanel = document.getElementById('directions-panel');
            /*summaryPanel.innerHTML = `
                <div class="route">
                    <div class="no">${ 1 }</div>
                    <div class="from-to">
                        <div class="nereden">${ route.legs[0].start_address }</div>    
                    </div>
                    <div class="uzaklik">${ route.legs[0].distance.text }</div>
                </div>
            `;
            // For each route, display summary information.
            for (var i = 1; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += `
                    <div class="route">
                        <div class="no">${ routeSegment }</div>
                        <div class="from-to">
                            <div class="nereden" route_id='${orders[i]}'>${ route.legs[i].end_address } </div>
                        </div>
                        <div class="uzaklik">${ route.legs[i].distance.text }</div>
                    </div>
                `;
            }*/
        }
    });
}
/*
var request = {
    origin: {lat: 38.39232108, lng: 27.12559183},
    destination: { lat: 39.409031, lng: 29.999532 },
    waypoints: waypoints.slice(0, 25),
    optimizeWaypoints: true,
    travelMode: 'DRIVING'
};
directionsService.route(request, function(result, status) {
    if (status == 'OK') {
        console.log(result);
        directionsRenderer.setDirections(result);
        var route = result.routes[0];
        let orders = route.waypoint_order;
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = `
            <div class="route">
                <div class="no">${ 1 }</div>
                <div class="from-to">
                    <div class="nereden">${ route.legs[0].start_address }</div>    
                </div>
                <div class="uzaklik">${ route.legs[0].distance.text }</div>
            </div>
        `;
        // For each route, display summary information.
        for (var i = 1; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML += `
                <div class="route">
                    <div class="no">${ routeSegment }</div>
                    <div class="from-to">
                        <div class="nereden" route_id='${orders[i]}'>${ route.legs[i].end_address } </div>
                    </div>
                    <div class="uzaklik">${ route.legs[i].distance.text }</div>
                </div>
            `;
        }
    }
});*/