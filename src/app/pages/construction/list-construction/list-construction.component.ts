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
    this.getConstructions()
  }

  getConstructions() {
    this.constructionService.getAllConstruction()
      .subscribe(
      result => {
      this.constructions = result,
        this.toastr.info('Obras carregadas.')
      },
      error => {
        this.errors = JSON.parse(error._body).errors,
        this.toastr.info('Problema para carregar as obras.')
      }
      );
  }
}
