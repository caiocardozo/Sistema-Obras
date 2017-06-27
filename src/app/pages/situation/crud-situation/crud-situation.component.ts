import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';

import { Router } from "@angular/router";

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { GenericValidator } from './../../../utils/generic-form-validator';

import { Situation } from "./../../situation/situation";
import { SituationService } from './../situation.service';

@Component({
  selector: 'crud-situation',
  templateUrl: './crud-situation.component.html'
})
export class CrudSituationComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public formSituation: FormGroup;
  public editformSituation: FormGroup;
  public errors: any[] = [];
  situation: Situation;
  situations: Situation[] = [];
  private modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private situationService: SituationService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      description: {
        required: 'A descrição é obrigatória.',
        minlength: 'A descrição precisa ter no mínimo 2 caracteres',
        maxlength: 'A descrição precisa ter no máximo 150 caracteres'
      },
    };
    this.editValidationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      status: {
        required: 'O status é requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.editGenericValidator = new GenericValidator(this.editValidationMessages);
    this.situation = new Situation();
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getSituations();
    this.formSituation = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });

    this.editformSituation = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])],
      status: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.formSituation.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.formSituation);
    });

     Observable.merge(this.editformSituation.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.genericValidator.processMessages(this.editformSituation);
    });
  }

  getSituations() {
    this.situationService.getAllSituation()
      .subscribe(result => {
        this.situations = result;
        this.toastr.info('Situações carregadas.');
      }, err => {
        this.toastr.warning('Problema ao carregar situações de obra.');
      });
  }

  getSituationsSilent() {
    this.situationService.getAllSituation()
      .subscribe(result => {
        this.situations = result;
      });
  }

  insert() {
    this.situationService.createSituation(this.formSituation.value)
      .subscribe(result => {
        this.toastr.success('Tipo de situação cadastrado!', 'Sucesso');
        this.formSituation.reset();
        this.getSituationsSilent();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
        this.formSituation.reset;
      });
  }

  updateStatus(id: number) {
    this.situationService.updateStatusSituation(id)
      .then(situation => {
        this.toastr.success('Status alterado.', 'Successo!')
        this.getSituationsSilent();
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.situationService.deleteSituation(id)
      .subscribe(result => {
        this.toastr.success('Tipo de situação apagado!', 'Sucesso');
        this.situationService.getAllSituation().subscribe(result => {
          this.situations = result;
        })
      }, err => {
        this.toastr.warning('Problema para apagar.', 'Alerta!');
      });
  }

  updateSituation() {
    if (this.editformSituation.dirty && this.editformSituation.valid) {
      let p = Object.assign({}, this.situation, this.editformSituation.value);
      this.situationService.updateSituation(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getSituationsSilent();
    this.toastr.success('Situação Atualizada.');
  }

  public showModal(situation: Situation): void {
    this.fillFormSituation(situation);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormSituation(situation: Situation): void {
    this.situation = situation;
    this.editformSituation.patchValue({
      description: this.situation.description,
      status: this.situation.status,
    });
  }
}
