
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

import { TypeOfBond } from "./../../typeofbond/typeofbond";
import { TypeOfBondService } from './../typeofbond.service';

@Component({
  selector: 'crud-typeofbond',
  templateUrl: './crud-typeofbond.component.html'
})
export class CrudTypeOfBondComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public formBond: FormGroup;
  public editformTOBond: FormGroup;
  public errors: any[] = [];
  typeOfBond: TypeOfBond;
  typeofbonds: TypeOfBond[] = [];
  public modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private typeofbondService: TypeOfBondService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      description: {
        required: 'A descrição é obrigatória.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
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
    this.typeOfBond = new TypeOfBond();
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getTypeofbonds();
    this.formBond = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });

    this.editformTOBond = this.fb.group({
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

    Observable.merge(this.formBond.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.formBond);
    });

    Observable.merge(this.editformTOBond.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.genericValidator.processMessages(this.editformTOBond);
    });
  }

  getTypeofbonds() {
    this.typeofbondService.getAllTypeOfBond().subscribe(result => {
      this.typeofbonds = result;
      this.toastr.info('Tipos de cauções carregadas.');
    }, err => {
      this.toastr.warning('Problema ao carregar tipos de cauções.');
    });
  }

  getTypeOfBondsSilent() {
    this.typeofbondService.getAllTypeOfBond().subscribe(result => {
      this.typeofbonds = result;
    }, err => {
      this.toastr.warning('Problema ao carregar tipos de cauções.');
    });
  }

  insertTOBond() {
    this.typeofbondService.createTypeOfBond(this.formBond.value)
      .subscribe(result => {
        this.toastr.success('Tipo de caução cadastrado!', 'Sucesso');
        this.formBond.reset();
        this.getTypeOfBondsSilent();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
      });
  }

  updateStatus(id: number) {
    this.typeofbondService.updateStatusTypeOfBond(id)
      .then(typeOfBond => {
        this.toastr.success('Status alterado.', 'Successo!');
        this.getTypeOfBondsSilent()
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.typeofbondService.deleteTypeOfBond(id)
      .subscribe(result => {
        this.toastr.success('Tipo de caução apagado!', 'Sucesso');
        this.typeofbondService.getAllTypeOfBond().subscribe(result => {
          this.typeofbonds = result;
        })
      }, err => {
        this.toastr.warning('Problema para alterar.', 'Alerta!');
      });
  }

  updateTypeOfBond() {
    if (this.editformTOBond.dirty && this.editformTOBond.valid) {
      let p = Object.assign({}, this.typeOfBond, this.editformTOBond.value);
      this.typeofbondService.updateTypeOfBond(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getTypeOfBondsSilent();
    this.toastr.success('tipo de caução Atualizada.');
  }

  public showModal(typeOfBond: TypeOfBond): void {
    this.fillFormTypeOfBond(typeOfBond);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormTypeOfBond(typeOfBond: TypeOfBond): void {
    this.typeOfBond = typeOfBond;
    this.editformTOBond.patchValue({
      description: this.typeOfBond.description,
      status: this.typeOfBond.status,
    });
  }
}
