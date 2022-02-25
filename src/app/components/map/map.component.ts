import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Position, PositionOptions} from '@capacitor/geolocation';
import {Geolocation} from '@capacitor/geolocation';
import MapOptions = google.maps.MapOptions;
import {Device, DeviceInfo} from '@capacitor/device';

declare let google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  info: DeviceInfo;
  map: google.maps.Map;

  watchPosition = '';
  currentWaypoints = [];
  currentTrack: google.maps.Polyline;
  position = {
    marker: null,
    latitude: 0.0,
    longitude: 0.0,
  };
  infowindow = new google.maps.InfoWindow({
    content: 'Trip: ',
    maxWidth: 200,
  });
  options: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 3000,
    timeout: 5000
  };

  constructor() {
  }

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    this.info = await Device.getInfo();
    if (this.info.platform === 'android') {
      await Geolocation.requestPermissions();
    }
    const location = await Geolocation.getCurrentPosition(this.options);

    this.position.latitude = location.coords.latitude;
    this.position.longitude = location.coords.longitude;
    const latLng = new google.maps.LatLng(this.position.latitude, this.position.longitude);
    const mapOptions: MapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.HYBRID,
      streetViewControl: false,
      controlSize: 20,
      fullscreenControl: true,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.position.marker = new google.maps.Marker();
    this.map.setCenter(latLng);
    this.position.marker.setIcon('assets/icon/marker.png');
    this.position.marker.setPosition(latLng);
    this.position.marker.setMap(this.map);
    await this.addWatch();
  }

  async addWatch() {
    this.watchPosition = await Geolocation.watchPosition(this.options, (position) => {
      this.updatePosition(position);
    });
  }

  async stopWatch() {
    Geolocation.clearWatch({id: this.watchPosition});
  }

  async updatePosition(position: Position) {
    this.position.latitude = position.coords.latitude;
    this.position.longitude = position.coords.longitude;
    const latLng = new google.maps.LatLng(this.position.latitude, this.position.longitude);
    this.map.setCenter(latLng);
    this.position.marker.setPosition(latLng);
    this.position.marker.addListener('click', () => {
      this.infowindow.open({
        anchor: this.position.marker,
        nap: this.map,
        shouldFocus: false,
      });
    });
    this.currentWaypoints.push({
      lat: this.position.latitude,
      lng: this.position.longitude,
    });
    this.redrawPath(this.currentWaypoints);
  }

  async redrawPath(route) {
    if (this.currentTrack) {
      this.currentTrack.setMap(null);
    }
    if (route.length > 1) {
      this.currentTrack = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      this.currentTrack.setMap(this.map);
    }
  }
}
