/* Simple handler to manage markers on google map */
class MapMarkerHandler {
    constructor(mapContainerId, centerCoords, zoom = 1, scrollwheel = false) {
        this.map = new google.maps.Map(document.getElementById(mapContainerId), {
            center: centerCoords,
            scrollwheel: scrollwheel,
            zoom: zoom
        });
        this.markers = [];
    }

    removeMarkers() {
        for (let m of this.markers) {
            m.setMap(null);
        }
        this.markers = [];
    };

    addMarker(marker) {
        this.markers.push(marker);
        marker.setMap(this.map)
    }
}

export default MapMarkerHandler