import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';

import { Construction } from "./../../construction/construction";
import { ConstructionService } from './../../construction/construction.service';
import { LocalBd } from './../localBd';

@Component({
  selector: 'home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

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
