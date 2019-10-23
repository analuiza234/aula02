import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.page.html',
  styleUrls: ['./add-usuario.page.scss'],
})
export class AddUsuarioPage implements OnInit {

  protected usuario: Usuario = new Usuario;
  protected id: string = null;
  protected preview: string = null;

  constructor(
    protected usuarioService: UsuarioService,
    protected alertController: AlertController,
    protected router: Router,
    protected activedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.localAtual()
  }

  //função chamada toda vez que a pagina recebe foco;
  ionViewWillEnter() {
    this.id = this.activedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.usuarioService.get(this.id).subscribe(
        res => {
          this.usuario = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Ops!", "Tire sua foto!")
    } else {
      this.usuario.foto = this.preview;
      if (this.id) {
        this.usuarioService.update(this.usuario, this.id).then(
          res => {
            this.presentAlert("Aviso", "Atualizado!");
            form.reset();
            this.usuario = new Usuario;
            this.router.navigate(['/tabs/listUsuario']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Erro ao atualizar!");
          }
        )
      } else {
        this.usuarioService.save(this.usuario).then(
          res => {
            this.presentAlert("Aviso", "Cadastrado!");
            form.reset();
            this.usuario = new Usuario;
            this.router.navigate(['/tabs/listUsuario']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Erro ao cadastrar!");
          }
        )
      }
    }
  }

  async presentAlert(titulo: string, texto: string) {
    const alert = await this.alertController.create({
      header: titulo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }

  localAtual() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.usuario.lat = resp.coords.latitude
      this.usuario.lng = resp.coords.longitude
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  tirarFoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.preview = base64Image;
    }, (err) => {
      // Handle error
    });
  }

}
