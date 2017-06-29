import { LocalBd } from './../../shared/localBd';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { ConstructionService } from './../construction.service';
import { Construction } from './../construction';

@Component({
  selector: 'list-construction',
  templateUrl: './list-construction.component.html'
})
export class ListConstructionComponent implements OnInit {

  localBd: string;
  public errors: any[] = [];
  public displayMessage: { [key: string]: string } = {};
  construction: Construction;
  constructions: Construction[] = [];

  constructor(
    private constructionService: ConstructionService,
    private router: Router,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);
    this.construction = new Construction;
  }

  ngOnInit() {
    this.getConstructions();
    this.getCosntructionsLocal();
  }

  getConstructions() {
    this.constructionService.getAllConstructionHome()
      .subscribe(
      result => {
        this.constructions = result;
        this.toastr.info('Obras carregadas.');
      }, err => {
        this.toastr.warning('Problema ao carregar obras.');
      });
  }

  setConstructionLocal(id: string) {
    this.constructionService.getConstruction(id)
      .subscribe(
      result => {
        this.construction = result;
        let teste: boolean = this.constructionService.setConstructionWeb(this.construction);
        this.localBd = "" + this.construction.id + " - " + this.construction.description;
        this.toastr.success('Obra carregada!', 'Successo!');
      },
      error => {
        this.errors = JSON.parse(error._body).errors;
        this.toastr.warning('Problema para carregar a obra', 'Alerta!');
      }
      );
  };

  getCosntructionsLocal() {
    let retorno: LocalBd = this.constructionService.getConstructionWeb();
    if (retorno.idConstruction != null) {
      this.localBd = "" + retorno.idConstruction + " - " + retorno.descConstruction;
    }
    else {
      this.localBd = "Nenhuma obra selecionada";
    }
  }
}
