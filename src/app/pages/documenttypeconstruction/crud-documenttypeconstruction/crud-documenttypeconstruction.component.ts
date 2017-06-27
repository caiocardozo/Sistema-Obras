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

import { DocumentTypeConstructionService } from './../documenttypeconstruction.service';
import { DocumentTypeConstruction } from './../documenttypeconstruction';

@Component({
  selector: 'documenttypeconstruction',
  templateUrl: './crud-documenttypeconstruction.component.html'
})
export class CrudDocumentTypeConstructionComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public form: FormGroup;
  public editformDTConstruction: FormGroup;
  public errors: any[] = [];
  documentTypeConstruction: DocumentTypeConstruction;
  documentTypeConstructions: DocumentTypeConstruction[] = [];
  private modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private documentTypeConstructionService: DocumentTypeConstructionService,
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
    this.documentTypeConstruction = new DocumentTypeConstruction();
    this.modalVisible = false;
  }
  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getDTConstructions();
    this.form = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });

    this.editformDTConstruction = this.fb.group({
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

    Observable.merge(this.form.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.form);
    });

    Observable.merge(this.editformDTConstruction.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.editGenericValidator.processMessages(this.editformDTConstruction);
    });
  }
  getDTConstructions() {
    this.documentTypeConstructionService.getAllDocumentTypeConstruction().subscribe(result => {
      this.documentTypeConstructions = result;
      this.toastr.info('Documentos tipos obra carregados.');
    }, err => {
      this.toastr.warning('Problema ao carregar documentos.');
    });
  }

  getDTConstructionsSilent() {
    this.documentTypeConstructionService.getAllDocumentTypeConstruction().subscribe(result => {
      this.documentTypeConstructions = result;
    }, err => {
      this.toastr.warning('Problema ao carregar documentos.');
    });
  }

  insert() {
    this.documentTypeConstructionService.createDocumentTypeConstruction(this.form.value)
      .subscribe(result => {
        this.toastr.success('Tipo de documento cadastrado!', 'Sucesso');
        this.form.reset();
        this.getDTConstructionsSilent();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
        this.form.reset;
      });
  }

  updateStatus(id: number) {
    this.documentTypeConstructionService.updateStatusDocumentTypeConstruction(id)
      .then(documentTypeConstruction => {
        this.toastr.success('Status alterado.', 'Successo!')
        this.getDTConstructionsSilent();
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.documentTypeConstructionService.deleteDocumentTypeConstruction(id)
      .subscribe(result => {
        this.toastr.success('Tipo de documento apagado!', 'Sucesso');
        this.documentTypeConstructionService.getAllDocumentTypeConstruction().subscribe(result => {
          this.documentTypeConstructions = result;
        })
      }, err => {
        this.toastr.warning('Problema para apagar.', 'Alerta!');
      });
  }

  updateDTConstruction() {
    if (this.editformDTConstruction.dirty && this.editformDTConstruction.valid) {
      let p = Object.assign({}, this.documentTypeConstruction, this.editformDTConstruction.value);
      this.documentTypeConstructionService.updateDocumentTypeConstruction(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getDTConstructionsSilent();
    this.toastr.success('Tipo de documento atualizado.');
  }

  public showModal(documentTypeConstruction: DocumentTypeConstruction): void {
    this.fillFormDTConstructions(documentTypeConstruction);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormDTConstructions(documentTypeConstruction: DocumentTypeConstruction): void {
    console.log(documentTypeConstruction);
        this.documentTypeConstruction = documentTypeConstruction;
    this.editformDTConstruction.patchValue({
      description: this.documentTypeConstruction.description,
      status: this.documentTypeConstruction.status,
    });
  }
}
