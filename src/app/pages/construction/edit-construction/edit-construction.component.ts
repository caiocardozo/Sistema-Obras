import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { IMyOptions } from "mydatepicker";

import { CampusService } from './../../campus/campus.service';
import { TypeOfConstructionService } from './../../typeofconstruction/typeofconstruction.service';
import { TypeOfInspectionService } from './../../typeofinspection/typeofinspection.service';
import { SituationService } from './../../situation/situation.service';
import { ConstructionService } from './../construction.service';

import { Campus } from './../../campus/campus';
import { TypeOfConstruction } from './../../typeofconstruction/typeofconstruction';
import { TypeOfInspection } from './../../typeofinspection/typeofinspection';
import { Construction } from './../construction';
import { Situation } from './../../situation/situation';

import { DateUtils } from './../../../common/data-type-utils/date-utils';
import { CurrencyUtils } from './../../../common/data-type-utils/currency-utils';
import { GenericValidator } from './../../../utils/generic-form-validator';

@Component({
  selector: 'edit-construction',
  templateUrl: './edit-construction.component.html',
  styleUrls: ['./edit-construction.component.css']
})
export class EditConstructionComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public errors: any[] = [];
  constructionForm: FormGroup;
  construction: Construction;
  situations: Situation[];
  typeOfInspections: TypeOfInspection[];
  typeOfConstructions: TypeOfConstruction[];
  campi: Campus[];
  constructionId: string = "";
  private sub: Subscription;

  constructor(
    private fb: FormBuilder,
    private constructionService: ConstructionService,
    private situationService: SituationService,
    private typeOfInspectionService: TypeOfInspectionService,
    private typeOfConstructionService: TypeOfConstructionService,
    private campusService: CampusService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      nickname: {
        required: 'O apelido é obrigatório.',
        minlength: 'O apelido da obra precisa ter no mínimo 2 caracteres',
        maxlength: 'O apelido da obra precisa ter no máximo 20 caracteres'
      },
      description: {
        required: 'A descrição é requerida.',
        minlength: 'A descrição precisa ter no mínimo 2 caracteres',
        maxlength: 'A descrição precisa ter no máximo 200 caracteres'
      },
      name: {
        required: 'O nome é requerido.',
        minlength: 'O nome precisa ter no mínimo 2 caracteres',
        maxlength: 'O nome precisa ter no máximo 200 caracteres'
      },
      campId: {
        required: 'Informe o campus'
      },
      typeOfConstructionId: {
        required: 'Informe o tipo de obra'
      },
      situationId: {
        required: 'Informe a situação'
      },
      typeOfInspectionId: {
        required: 'Informe o tipo fiscalização'
      },
      area: {
        required: 'Informe a área'
      },
      estimatedValue: {
        required: 'Informe o valor'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.construction = new Construction();
  }

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  ngOnInit() {
    this.constructionForm = this.fb.group({
      nickname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      campId: ['', Validators.required],
      typeOfConstructionId: ['', Validators.required],
      situationId: ['', Validators.required],
      typeOfInspectionId: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      signatureDate: [''],
      contractTerminationDate: '',
      area: ['', Validators.required],
      estimatedValue: ['', Validators.required]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.constructionId = params['id'];
        this.getConstruction(this.constructionId);
      });

    this.getSituations();
    this.getTypeOfInspections();
    this.getTypeofconstructions();
    this.getCampi();
  }

  getSituations() {
    this.situationService.getAllSituation()
      .subscribe(result => {
        this.situations = result;
      }, error => {
        this.toastr.warning('Problema ao carregar situações de obra.');
      });
  }

  getCampi() {
    this.campusService.getAllCampus()
      .subscribe(result => {
        this.campi = result;
      }, error => {
        this.toastr.warning('Problema ao carregar campus.');
      });
  }

  getTypeofconstructions() {
    this.typeOfConstructionService.getAllTypeOfConstruction()
      .subscribe(result => {
        this.typeOfConstructions = result;
      }, error => {
        this.toastr.warning('Problema ao carregar tipos de obra.');
      });
  }

  getTypeOfInspections() {
    this.typeOfInspectionService.getAllTypeOfInspection()
      .subscribe(result => {
        this.typeOfInspections = result;
      }, err => {
        this.toastr.warning('Problema ao carregar tipos de fiscalização.');
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.constructionForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.constructionForm);
    });
  }

  getConstruction(id: string) {
    this.constructionService.getConstruction(id)
      .subscribe(
      construction => {
        this.fillFormConstruction(construction)
      },
      response => {
        if (response.status == 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  fillFormConstruction(construction: Construction): void {
    this.construction = construction;

    let valorBrl = CurrencyUtils.ToPrice(this.construction.estimatedValue);

    this.constructionForm.patchValue({
      nickname: this.construction.nickname,
      description: this.construction.description,
      name: this.construction.name,
      campId: this.construction.campId,
      typeOfConstructionId: this.construction.typeOfConstructionId,
      situationId: this.construction.situationId,
      typeOfInspectionId: this.construction.typeOfInspectionId,
      startDate: DateUtils.setMyDatePickerDate(this.construction.startDate),
      endDate: DateUtils.setMyDatePickerDate(this.construction.endDate),
      signatureDate: DateUtils.setMyDatePickerDate(this.construction.signatureDate),
      contractTerminationDate: DateUtils.setMyDatePickerDate(this.construction.contractTerminationDate),
      area: this.construction.area,
      estimatedValue: valorBrl
    });
  }
  editconstruction(){
    if (this.constructionForm.dirty && this.constructionForm.valid) {
      let p = Object.assign({}, this.construction, this.constructionForm.value);
      p.startDate = DateUtils.getMyDatePickerDate(p.startDate);
      p.endDate = DateUtils.getMyDatePickerDate(p.endDate);
      p.contractTerminationDate = DateUtils.getMyDatePickerDate(p.contractTerminationDate);
      p.estimatedValue =  CurrencyUtils.ToDecimal(p.estimatedValue);
      p.signatureDate = DateUtils.getMyDatePickerDate(p.signatureDate);
      this.constructionService.updateConstruction(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.errors = JSON.parse(error._body).errors
        });
    }
  }

   onSaveComplete(): void {
    this.errors = [];

    this.toastr.success('Obra Atualizada com Sucesso!', 'Sucesso', { dismiss: 'controlled' })
      .then((toast: Toast) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
          this.router.navigate(['/obra']);
        }, 2500);
      });
  }

  goBack(): void {
    this.location.back();
  }
}
