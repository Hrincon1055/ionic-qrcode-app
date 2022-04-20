import { Component } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public opts = {
    allowSlidePrev: false,
    allowSlideNext: false,
  };
  constructor(
    private barcodeScanner: BarcodeScanner,
    private dataLocalService: DataLocalService
  ) {}
  ionViewWillEnter() {
    this.scan();
  }
  public scan() {
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        // console.log('Barcode data', JSON.stringify(barcodeData));
        if (!barcodeData.cancelled) {
          this.dataLocalService.guardarRegistro(
            barcodeData.format,
            barcodeData.text
          );
        }
      })
      .catch((err) => {
        // this.dataLocalService.guardarRegistro(
        //   'QRCode',
        //   'https://fernando-herrera.com'
        // );
        this.dataLocalService.guardarRegistro(
          'QRCode',
          'geo: 40.73151796986687, -74.06087294062502'
        );
        console.log('Error', JSON.stringify(err));
      });
  }
}
