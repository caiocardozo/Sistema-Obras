import { GenericValidator } from './../../../utils/generic-form-validator';
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { IMyOptions } from 'mydatepicker';
import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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

@Component({
  selector: 'add-construction',
  templateUrl: './add-construction.component.html',
  styleUrls: ['./add-construction.component.css']
})
export class AddConstructionComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  private myDatePickerOptions: IMyOptions = {
    todayBtnTxt: 'Hoje',
    dateFormat: 'dd/mm/yyyy',
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    monthLabels: { 1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro' },

  };

  public errors: any[] = [];
  constructionForm: FormGroup;
  construction: Construction;
  situations: Situation[];
  typeOfInspections: TypeOfInspection[];
  typeOfConstructions: TypeOfConstruction[];
  campi: Campus[];

  constructor(
    private fb: FormBuilder,
    private constructionService: ConstructionService,
    private situationService: SituationService,
    private typeOfInspectionService: TypeOfInspectionService,
    private typeOfConstructionService: TypeOfConstructionService,
    private campusService: CampusService,
    private location: Location,
    private router: Router,
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
      typeInspectionId: {
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
      nickname: ['', [Validators.minLength(2), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      campId: ['', Validators.required],
      typeOfConstructionId: ['', Validators.required],
      situationId: ['', Validators.required],
      typeInspectionId: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      contractTerminationDate: '',
      area: ['', Validators.required],
      estimatedValue: ['', Validators.required]
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
        this.toastr.info('Situações carregadas.');
      }, err => {
        this.toastr.warning('Problema ao carregar situações de obra.');
      });
  }

  getCampi() {
    this.campusService.getAllCampus().subscribe(result => {
      this.campi = result;
    })
  }

  getTypeofconstructions() {
    this.typeOfConstructionService.getAllTypeOfConstruction()
      .subscribe(result => {
        this.typeOfConstructions = result;
      })
  }

  getTypeOfInspections() {
    this.typeOfInspectionService.getAllTypeOfInspection().subscribe(result => {
      this.typeOfInspections = result;
    })
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.constructionForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.constructionForm);
    });
  }

  adicionarConstruction() {
    if (this.constructionForm.dirty && this.constructionForm.valid) {
      //let user = this.eventoService.obterUsuario();

      let p = Object.assign({}, this.construction, this.constructionForm.value)

      this.constructionService.registerConstruction(p)
        .subscribe(
        result => { this.onSaveComplete() },
        error => {
          this.onError(error);
        });
    }
  }

onError(error) {
    this.toastr.error('Ocorreu um erro no processamento', 'Ops! :(');
    this.errors = JSON.parse(error._body).errors;
  }

  onSaveComplete(): void {
    this.constructionForm.reset();
    this.errors = [];

    this.toastr.success('Evento Registrado com Sucesso!', 'Sucesso', { dismiss: 'controlled' })
      .then((toast: Toast) => {
        setTimeout(() => {
          this.toastr.dismissToast(toast);
          this.router.navigate(['/obras/home']);
        }, 2500);
      });
  }

  goBack(): void {
    this.location.back();
  }

}
