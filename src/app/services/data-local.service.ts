/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  public guardados: Registro[] = [];
  private _storage: Storage | null = null;
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private iab: InAppBrowser,
    private file: File,
    private emailComposer: EmailComposer
  ) {
    this.init();
    this.cargarStorge();
  }
  async init(): Promise<void> {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
  public async guardarRegistro(format: string, text: string): Promise<void> {
    await this.cargarStorge();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    console.log('data-local.service LINE 13 =>', this.guardados);
    this._storage.set('registros', this.guardados);
    this.abrirRegistro(nuevoRegistro);
  }
  public async cargarStorge(): Promise<Registro[]> {
    const guardados = await this.storage.get('registros');
    this.guardados = guardados || [];
    return this.guardados;
  }
  public abrirRegistro(registro: Registro): void {
    this.navCtrl.navigateForward('/tabs/tab2');
    switch (registro.type) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;

      default:
        break;
    }
  }
  public enviarCorreo(): void {
    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado En, Texto\n';
    arrTemp.push(titulos);
    this.guardados.forEach((registro: Registro) => {
      const linea = `${registro.type},${registro.format},${
        registro.created
      },${registro.text.replace(',', ' ')}\n`;
      arrTemp.push(linea);
    });
    this.crearArchivo(arrTemp.join(''));
  }
  private crearArchivo(text: string) {
    this.file
      .checkFile(this.file.dataDirectory, 'registro.csv')
      .then((existe) => {
        console.log('data-local.service LINE 69 =>', existe);
        return this.escribirTexto(text);
      })
      .catch((err) => {
        this.file
          .createFile(this.file.dataDirectory, 'registro.csv', false)
          .then((creado) => this.escribirTexto(text))
          .catch((error) => console.log);
      });
  }
  private async escribirTexto(text: string) {
    await this.file.writeExistingFile(
      this.file.dataDirectory,
      'registro.csv',
      text
    );
    const archivo = `${this.file.dataDirectory}registro.csv`;
    const email = {
      to: 'max@mustermann.de',
      cc: 'erika@mustermann.de',
      bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [archivo],
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true,
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
