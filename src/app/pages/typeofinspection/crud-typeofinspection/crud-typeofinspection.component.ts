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

import { TypeOfInspectionService } from './../typeofinspection.service';
import { TypeOfInspection } from './../../typeofinspection/typeofinspection';

@Component({
  selector: 'crud-typeofinspection',
  templateUrl: './crud-typeofinspection.component.html'
})
export class CrudTypeOfInspectionComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public formtoInspection: FormGroup;
  public editFormtoInspection: FormGroup;
  public errors: any[] = [];
  typeOfInspection: TypeOfInspection;
  typeOfInspections: TypeOfInspection[] = [];
  public modalVisible: boolean;

  constructor(private fb: FormBuilder,
    private typeOfInspectionService: TypeOfInspectionService,
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
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.editGenericValidator = new GenericValidator(this.editValidationMessages);
    this.typeOfInspection = new TypeOfInspection();
    this.modalVisible = false;

  }

  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getTypeOfInspections();
    this.formtoInspection = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });

    this.editFormtoInspection = this.fb.group({
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

    Observable.merge(this.formtoInspection.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.formtoInspection);
    });

     Observable.merge(this.editFormtoInspection.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.editGenericValidator.processMessages(this.editFormtoInspection);
    });
  }
  getTypeOfInspections() {
    this.typeOfInspectionService.getAllTypeOfInspection()
      .subscribe(result => {
        this.typeOfInspections = result,
          this.toastr.info('Tipos de fiscalização carregados.');
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de fiscalização de obra.');
      });
  }

  getTypeOfInspectionsSilent() {
    this.typeOfInspectionService.getAllTypeOfInspection()
      .subscribe(result => {
        this.typeOfInspections = result;
      })
  }

  insertTOInspection() {
    this.typeOfInspectionService.createTypeOfInspection(this.formtoInspection.value)
      .subscribe(result => {
        this.toastr.success('Tipo de fiscalização cadastrado!', 'Sucesso');
        this.formtoInspection.reset();
        this.getTypeOfInspectionsSilent();
      }, err => {
        this.toastr.warning('Problema para alterar.', 'Alerta!');
      });
  }

  updateStatus(id: number) {
    this.typeOfInspectionService.updateStatusTypeOfInspection(id)
      .then(typeofconstruction => {
        this.toastr.success('Status alterado.', 'Successo!');
        this.getTypeOfInspectionsSilent()
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.typeOfInspectionService.deleteTypeOfInspection(id)
      .subscribe(result => {
        this.toastr.success('Tipo de fiscalização removida!', 'Sucesso');
        this.typeOfInspectionService.getAllTypeOfInspection().subscribe(result => {
          this.typeOfInspections = result;
        })
      }, err => {
        this.toastr.warning('Problema ao remover tipo de fiscalização.', 'Alerta!');
      });
  }

  updateTOInspection() {
    if (this.editFormtoInspection.dirty && this.editFormtoInspection.valid) {
      let p = Object.assign({}, this.typeOfInspection, this.editFormtoInspection.value);
      this.typeOfInspectionService.updateTypeOfInspection(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getTypeOfInspectionsSilent();
    this.toastr.success('Tipo de fiscalização atualizada.');
  }

  public showModal(typeOfInspection: TypeOfInspection): void {
    this.fillFormTOInspection(typeOfInspection);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormTOInspection(typeOfInspection: TypeOfInspection): void {
    this.typeOfInspection = typeOfInspection;
    this.editFormtoInspection.patchValue({
      description: this.typeOfInspection.description,
      status: this.typeOfInspection.status,
    });
  }
}
