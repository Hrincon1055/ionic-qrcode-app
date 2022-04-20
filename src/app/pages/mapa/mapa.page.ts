/* eslint-disable no-var */
import {
  AfterViewInit,
  Component,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {
  // @ViewChild('mapa') divMapa!: ElementRef;
  public lat: number;
  public lng: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');
    geo = geo.substring(4, geo.length).trim().split(',');
    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);
    console.log('mapa.page LINE 14 =>', this.lat, this.lng);
  }
  ngAfterViewInit(): void {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiaHJyaW5jb24iLCJhIjoiY2ttNGJmaW4wMDMxNzJ3dXN5NHp6dGF4YiJ9.KHShjouFCANhHoMBzOtX6A';
    const map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });
    map.on('load', () => {
      map.resize();
      new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(map);
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;
      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );
    });
  }
}
