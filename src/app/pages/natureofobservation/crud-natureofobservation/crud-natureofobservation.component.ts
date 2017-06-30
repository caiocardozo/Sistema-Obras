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

import { NatureOfObservation } from "./../../natureofobservation/natureofobservation";
import { NatureOfObservationService } from './../natureofobservation.service';

@Component({
  selector: 'app-crud-natureofobservation',
  templateUrl: './crud-natureofobservation.component.html'
})
export class CrudNatureOfObservationComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public formNatureoo: FormGroup;
  public editFormNatureoo: FormGroup;
  public errors: any[] = [];
  natureOfObservation: NatureOfObservation;
  natureOfObservations: NatureOfObservation[] = [];
  public modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private natureOfObservationService: NatureOfObservationService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      internallyAvailable: {
        required: 'Exibe internamenteé requerida.',
        minlength: 'Exibe internamente precisa ter no mínimo 3 caracteres',
        maxlength: 'Exibe internamente precisa ter no máximo 3 caracteres'
      }
    };

    this.editValidationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      internallyAvailable: {
        required: 'Exibe internamenteé requerida.',
        minlength: 'Exibe internamente precisa ter no mínimo 3 caracteres',
        maxlength: 'Exibe internamente precisa ter no máximo 3 caracteres'
      },
      status: {
        required: 'O status é requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.natureOfObservation = new NatureOfObservation();
    this.editGenericValidator = new GenericValidator(this.editValidationMessages);
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getNatureOfObservations();
    this.formNatureoo = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
        //,CustomValidator.EmailValidator
      ])],
      internallyAvailable: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.required
        //,CustomValidator.EmailValidator
      ])]
    });
    this.editFormNatureoo = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
        //,CustomValidator.EmailValidator
      ])],
      internallyAvailable: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.required
        //,CustomValidator.EmailValidator
      ])],
      status: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.formNatureoo.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.formNatureoo);
    });

     Observable.merge(this.editFormNatureoo.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.editGenericValidator.processMessages(this.editFormNatureoo);
    });
  }

  getNatureOfObservations() {
    this.natureOfObservationService.getAllNatureOfObservation()
    .subscribe(result => {
      this.natureOfObservations = result
       this.toastr.info('Natureza das observações carregadas.');
    }, err => {
        this.toastr.warning('Problema ao carregar natureza da observação.');
       });
  }

  getNatureOfObservationsSilent() {
    this.natureOfObservationService.getAllNatureOfObservation()
    .subscribe(result => {
      this.natureOfObservations = result
      }, err => {
        this.toastr.warning('Problema ao carregar natureza da observação.');
       });
  }

  insert() {
    this.natureOfObservationService.createNatureOfObservation(this.formNatureoo.value)
      .subscribe(result => {
        this.toastr.success('Tipo de natureza da observação cadastrado!', 'Sucesso');
        this.formNatureoo.reset();
        this.getNatureOfObservationsSilent();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
        this.formNatureoo.reset;
      });
  }

  updateStatus(id: number) {
    this.natureOfObservationService.updateStatusNatureOfObservation(id)
      .then(natureOfObservation => {
        this.toastr.success('Status alterado.', 'Successo!')
        this.getNatureOfObservationsSilent();
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.natureOfObservationService.deleteNatureOfObservation(id)
      .subscribe(result => {
        this.toastr.success('Tipo de natureza da observação apagado!', 'Sucesso');
        this.natureOfObservationService.getAllNatureOfObservation().subscribe(result => {
          this.natureOfObservations = result;
        })
      }, err => {
        this.toastr.warning('Problema para apagar.', 'Alerta!');
      });
  }

  updateIAvailable(id: number) {
    this.natureOfObservationService.updateIAvailableNatureOfObservation(id)
      .then(natureOfObservation => {
        this.toastr.success('Exibe internamente alterado.', 'Successo!')
        this.getNatureOfObservationsSilent();
      }, err => {
        this.toastr.warning('Exibe internamente não atualizado.', 'Alerta!');
      });
  }

  updateNatureOfObservation() {
    if (this.editFormNatureoo.dirty && this.editFormNatureoo.valid) {
      let p = Object.assign({}, this.natureOfObservation, this.editFormNatureoo.value);
      this.natureOfObservationService.updateNatureOfObservation(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }

  onSaveComplete(): void {
    this.hideModal();
    this.getNatureOfObservationsSilent();
    this.toastr.success('Natureza da observação atualizada.');
  }

  public showModal(natureOfObservation: NatureOfObservation): void {
    this.fillFormNatureOfObservation(natureOfObservation);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormNatureOfObservation(natureOfObservation: NatureOfObservation): void {
    this.natureOfObservation = natureOfObservation;
    this.editFormNatureoo.patchValue({
      description: this.natureOfObservation.description,
      status: this.natureOfObservation.status,
      internallyAvailable: this.natureOfObservation.internallyAvailable,
    });
  }
}

