import { Component } from '@angular/core';
import { DataLocalService } from '../../services/data-local.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  constructor(public dataLocalService: DataLocalService) {}
  public enviarCorreo() {
    this.dataLocalService.enviarCorreo();
  }
  public abrirRegistro(registro: Registro) {
    console.log('tab2.page LINE 14 =>', registro);
    this.dataLocalService.abrirRegistro(registro);
  }
}
