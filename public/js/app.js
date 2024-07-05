const socket = io();

//geting user location and emiting 
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { longitude, latitude } = position.coords;
        socket.emit('location', { longitude, latitude });
    }, (error) => {
        console.log(error)
    }, {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    })
}


//Leaflet map integration

const map = L.map('map').setView([0, 0], 10)

L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map)


const markers = {}

socket.on('received-location', ({ id, longitude, latitude }) => {
    map.setView([latitude, longitude], 20)
    if (markers[id]) {
        markers[id].setLatLang([latitude, longitude])
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);

    }
})


socket.on('user-disconnected', ({ id }) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})