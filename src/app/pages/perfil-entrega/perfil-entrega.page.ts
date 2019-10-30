import { Component, OnInit } from '@angular/core';
import { Entrega } from 'src/app/model/entrega';
import { ActivatedRoute } from '@angular/router';
import { EntregaService } from 'src/app/services/entrega.service';
import { GoogleMapsEvent, Marker, GoogleMaps, GoogleMapOptions, GoogleMap } from '@ionic-native/google-maps';

@Component({
  selector: 'app-perfil-entrega',
  templateUrl: './perfil-entrega.page.html',
  styleUrls: ['./perfil-entrega.page.scss'],
})
export class PerfilEntregaPage implements OnInit {

  map: GoogleMap;
  protected entrega: Entrega = new Entrega;
  protected id: string = null;
  
  slideOpts = {
    initialSlide: 1,
    slidesPerView: 3,
    speed: 400
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected entregaService: EntregaService,
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.entregaService.get(this.id).subscribe(
        res => {
          this.entrega = res
        },
        erro => this.id = null
      )
    }
  }
  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: this.entrega.lat,
           lng: this.entrega.lng
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'red',
      animation: 'DROP',
      position: {
        lat: this.entrega.lat,
        lng: this.entrega.lng
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
      res=>{
        console.log(res);
        marker.setPosition(res[0]);
        this.entrega.lat = res[0].lat;
        this.entrega.lng = res[0].lng;
       }
    )
  }
  
}
