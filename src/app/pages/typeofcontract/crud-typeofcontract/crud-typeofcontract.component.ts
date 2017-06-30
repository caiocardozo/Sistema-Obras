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

import { TypeOfContractService } from './../typeofcontract.service';
import { TypeOfContract } from './../typeofcontract';

@Component({
  selector: 'crud-typeofcontract',
  templateUrl: './crud-typeofcontract.component.html'
})
export class CrudTypeOfContractComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public toContractForm: FormGroup;
  public editTOCForm: FormGroup;
  public errors: any[] = [];
  typeOfContract: TypeOfContract;
  typeOfContracts: TypeOfContract[] = [];
  public modalVisible: boolean;

  constructor(
    private fb: FormBuilder,
    private typeOfContractService: TypeOfContractService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      integratedSapiens: {
        required: 'A integração é requerida.',
        minlength: 'A integração precisa ter no mínimo 3 caracteres',
        maxlength: 'A integração precisa ter no máximo 3 caracteres'
      },
      serviceTransaction: {
        maxlength: 'A transação precisa ter no máximo 6 caracteres'
      },
      status: {
        required: 'O status  é requerido.'
      }
    }
    this.editValidationMessages = {
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A descrição precisa ter no máximo 30 caracteres'
      },
      integratedSapiens: {
        required: 'A integração é requerida.',
        minlength: 'A integração precisa ter no mínimo 3 caracteres',
        maxlength: 'A integração precisa ter no máximo 3 caracteres'
      },
      serviceTransaction: {
        maxlength: 'A transação precisa ter no máximo 6 caracteres'
      },
      status: {
        required: 'O status  é requerido.'
      }
    }

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.editGenericValidator = new GenericValidator(this.editValidationMessages);
    this.typeOfContract = new TypeOfContract();
    this.modalVisible = false;
  }

  displayMessage: { [key: string]: string } = {};
  editDisplayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private editValidationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  private editGenericValidator: GenericValidator;

  ngOnInit() {
    this.getTypeOfContracts();

    this.toContractForm = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])],
      integratedSapiens: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.required
      ])],
      serviceTransaction: ['', Validators.compose([
        Validators.maxLength(6)
      ])]
    });

    this.editTOCForm = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])],
      integratedSapiens: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(3),
        Validators.required
      ])],
      serviceTransaction: ['', Validators.compose([
        Validators.maxLength(6)
      ])],
      status: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.toContractForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.toContractForm);
    });

    Observable.merge(this.editTOCForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.editDisplayMessage = this.editGenericValidator.processMessages(this.editTOCForm);
    });
  }

  getTypeOfContracts() {
    this.typeOfContractService.getAllTypeOfContract()
      .subscribe(result => {
        this.typeOfContracts = result;
        this.toastr.info('tipos de contrato carregados.');
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de contrato.');
      });
  }

  getTypeOfContractsSilent() {
    this.typeOfContractService.getAllTypeOfContract()
      .subscribe(result => {
        this.typeOfContracts = result;
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de contrato.');
      });
  }

  insertTypeOfContract() {
    this.typeOfContractService.createTypeOfContract(this.toContractForm.value)
      .subscribe(result => {
        this.toastr.success('Tipo de contrato cadastrado!', 'Sucesso');
        this.toContractForm.reset();
        this.getTypeOfContractsSilent();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
        this.toContractForm.reset;
      });
  }

  updateStatus(id: number) {
    this.typeOfContractService.updateStatusTypeOfContract(id)
      .then(typeOfContract => {
        this.toastr.success('Status alterado.', 'Successo!')
        this.getTypeOfContractsSilent();
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.typeOfContractService.deleteTypeOfContract(id)
      .subscribe(result => {
        this.toastr.success('Tipo de contrato apagado!', 'Sucesso');
        this.typeOfContractService.getAllTypeOfContract().subscribe(result => {
          this.typeOfContracts = result;
        })
      }, err => {
        this.toastr.warning('Problema para apagar.', 'Alerta!');
      });
  }

  updateISapiens(id: number) {
    this.typeOfContractService.updateISapiensTypeOfContract(id)
      .then(typeOfContract => {
        this.toastr.success('Integra sapiens alterado.', 'Successo!')
        this.getTypeOfContractsSilent();
      }, err => {
        this.toastr.warning('Integra sapiens não atualizado.', 'Alerta!');
      });
  }

  updateTOContract() {
    if (this.editTOCForm.dirty && this.editTOCForm.valid) {
      let p = Object.assign({}, this.typeOfContract, this.editTOCForm.value);
      this.typeOfContractService.updateTypeOfContract(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors;
        });
    }
  }
  onSaveComplete(): void {
    this.hideModal();
    this.getTypeOfContractsSilent();
    this.toastr.success('Tipo de contrato Atualizado');
  }

  public showModal(typeOfContract: TypeOfContract): void {
    this.fillFormTOContract(typeOfContract);
    this.modalVisible = true;
  }

  public hideModal(): void {
    this.modalVisible = false;
  }

  fillFormTOContract(typeOfContract: TypeOfContract): void {
    this.typeOfContract = typeOfContract;
    this.editTOCForm.patchValue({
      description: this.typeOfContract.description,
      integratedSapiens: this.typeOfContract.integratedSapiens,
      serviceTransaction: this.typeOfContract.serviceTransaction,
      status: this.typeOfContract.status,
    });
  }
}
