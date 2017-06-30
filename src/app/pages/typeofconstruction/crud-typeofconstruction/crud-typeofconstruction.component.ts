import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router } from "@angular/router";

import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { GenericValidator } from './../../../utils/generic-form-validator';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { TypeOfConstructionService } from './../typeofconstruction.service';
import { TypeOfConstruction } from './../typeofconstruction';

@Component({
  selector: 'crud-typeofconstruction',
  templateUrl: './crud-typeofconstruction.component.html'
})
export class CrudTypeOfConstructionComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public typeocform: FormGroup;
  public edittypeocform: FormGroup;
  public errors: any[] = [];
  typeOfConstruction: TypeOfConstruction;
  typeofconstructions: TypeOfConstruction[] = [];
  public modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private typeofconstructionService: TypeOfConstructionService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      }
    };

    this.editValidationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      status: {
        required: 'O status é requerido.'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.editGenericValidator = new GenericValidator(this.editValidationMessages);
    this.typeOfConstruction = new TypeOfConstruction();
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  displayEditMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
 private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getTypeofconstructions();
    this.typeocform = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });

    this.edittypeocform = this.fb.group({
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

    Observable.merge(this.typeocform.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.typeocform);
    });

    Observable.merge(this.edittypeocform.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayEditMessage = this.editGenericValidator.processMessages(this.edittypeocform);
    });
  }

  getTypeofconstructions() {
    this.typeofconstructionService.getAllTypeOfConstruction()
      .subscribe(result => {
        this.typeofconstructions = result;
        this.toastr.info('Tipos de obras carregados.');
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de obra.');
      });
  }

  getTypeofconstructionsSilent() {
    this.typeofconstructionService.getAllTypeOfConstruction()
      .subscribe(result => {
        this.typeofconstructions = result;
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de obra.');
      });
  }

  insert() {
    this.typeofconstructionService.createTypeOfConstruction(this.typeocform.value)
      .subscribe(result => {
        this.toastr.success('Tipo de obra cadastrado!', 'Sucesso');
        this.typeocform.reset();
        this.getTypeofconstructionsSilent()
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
      });
  }

  updateStatus(id: number) {
    this.typeofconstructionService.updateStatusTypeOfConstruction(id)
      .then(typeofconstruction => {
        this.toastr.success('Status alterado.', 'Successo!');
        this.getTypeofconstructionsSilent()
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.typeofconstructionService.deleteTypeOfBond(id)
      .subscribe(result => {
        this.toastr.success('Tipo de obra removido!', 'Sucesso')
        this.typeofconstructionService.getAllTypeOfConstruction().subscribe(result => {
          this.typeofconstructions = result;
        })
      }, err => {
        this.toastr.warning('Problema ao remover.', 'Alerta!');
      });
  }

  updateTOConstruction() {
    if (this.edittypeocform.dirty && this.edittypeocform.valid) {
      let p = Object.assign({}, this.typeOfConstruction, this.edittypeocform.value);
      console.log(p);
      this.typeofconstructionService.updateTypeOfConstruction(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getTypeofconstructionsSilent();
    this.toastr.success('Tipo de obra Atualizado');
  }

  public showModal(tOConstruction: TypeOfConstruction): void {
    this.preencherFormSituation(tOConstruction);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  preencherFormSituation(tOConstruction: TypeOfConstruction): void {
    this.typeOfConstruction = tOConstruction;
    this.edittypeocform.patchValue({
      description: this.typeOfConstruction.description,
      status: this.typeOfConstruction.status,
    });
  }
}
