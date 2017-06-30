import { ContractService } from './../contract/contract.service';
import { SupervisorService } from './../supervisor/supervisor.service';
import { MeasurementService } from './../measurement/measurement.service';
import { ContractApportionmentService } from './../contractapportionment/contractapportionment.service';
import { TypeOfContractService } from './../typeofcontract/typeofcontract.service';
import { BiddingService } from './../bidding/bidding.service';
import { ConstructionService } from './../construction/construction.service';
import { BiddingApportionmentService } from './../biddingapportionment/biddingapportionment.service';
import { BiddingApportionment } from './../biddingapportionment/biddingapportionment';
import { LocalBd } from './../shared/localBd';
import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { GenericValidator } from "../../utils/generic-form-validator";
import { IMyOptions } from 'mydatepicker';
import { Bidding } from './../bidding/bidding';
import { TypeOfContract } from './../typeofcontract/typeofcontract';
import { ContractApportionment } from './../contractapportionment/contractapportionment';
import { Measurement } from './../measurement/measurement';
import { Contract } from './../contract/contract';
import { Supervisor } from './../supervisor/supervisor';

@Component({
  selector: 'app-managerwork',
  templateUrl: './managerwork.component.html'
})
export class ManagerworkComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public myDatePickerOptions: IMyOptions = {
    todayBtnTxt: 'Hoje',
    dateFormat: 'dd/mm/yyyy',
    dayLabels: { su: 'Dom', mo: 'Seg', tu: 'Ter', we: 'Qua', th: 'Qui', fr: 'Sex', sa: 'Sab' },
    monthLabels: { 1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril', 5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto', 9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro' },
  };

  select: string;
  localBd: string;
  public errors: any[] = [];
  typeOfContract: TypeOfContract[];
  biddingsConstruction: Bidding;
  contractApportionment: ContractApportionment;
  measurement: Measurement;
  bidding: Bidding;
  contractId: number;
  typeOfContractId: number;
  apportionmentId: number;
  public modalVisible: boolean;
  public modalContractVisible: boolean;
  public modalEditContractVisible: boolean;
  public modalContractAVisible: boolean;
  public modalMeasurementVisible: boolean;
  public modalMeasurementsVisible: boolean;
  biddingApportionmentForm: FormGroup;
  contractForm: FormGroup;
  contractAForm: FormGroup;
  measurementForm: FormGroup;
  public displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private validationMessagesContract: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  //private genericValidatorContract: GenericValidator;
  biddingApportionment: BiddingApportionment;
  contract: Contract;
  contractsConstruction: Contract[] = [];
  supervisors: Supervisor[];
  measurements: Measurement[];

  constructor(
    private fb: FormBuilder,
    private biddingApportionmentService: BiddingApportionmentService,
    private constructionService: ConstructionService,
    private biddingService: BiddingService,
    private typeOfContractService: TypeOfContractService,
    private contractApportionmentService: ContractApportionmentService,
    private measurementService: MeasurementService,
    private supervisorService: SupervisorService,
    private router: Router,
    private contractService: ContractService,
    private route: ActivatedRoute,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) {
    this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {
      companyCode: { required: 'A empresa é obrigatorio.' },
      affiliateCode: { required: 'A filial é obrigatória' },
      serviceCode: { required: 'O código do serviço é obrigatório' },
      apportionmentValue: { required: 'O valor do rateio é obrigatório' },
      projectNumber: { required: 'O número do projeto é obrigatório' },
      projectPhaseCode: { required: 'A fase do projeto é obrigatória' },
      financialAccountCode: { required: 'A conta financeira é obrigatória' },
      costCenterCode: { required: 'O centro de custo é obrigatório' },
      //validation contract
      typeofcontractId: { required: 'o tipo de contrato é obrigatorio.' },
      vendorCode: { required: 'o código do fornecedor é obrigatório' },
      signatureDate: { required: 'A data de assinatura é obrigatória' },
      contractValue: { required: 'O valor é obrigatório' },
      deadline: { required: 'O prazo é obrigatório' },
      area: { required: 'A area é obrigatória' },
      contractDuration: { required: 'A duração é obrigatória' },
      comments: { maxlength: 'O nome precisa ter no máximo 1000 caracteres' },
      //validations Measurement
      supervisorId: { required: 'O supervisor é obrigatório.' },
      date: { required: 'A data é obrigatória' },
      amount: { required: 'O valor é obrigatório' },
      chit: { required: 'O número da nota fiscal é obrigatório.' },
      chitSeries: { required: 'A série é obrigatória' }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    /// this.genericValidatorContract = new GenericValidator(this.validationMessagesContract);
    this.biddingApportionment = new BiddingApportionment();

  }

  ngOnInit() {
    this.getBiddingsConstruction();

    this.biddingApportionmentForm = this.fb.group({
      companyCode: ['', [Validators.required]],
      affiliateCode: ['', [Validators.required]],
      serviceCode: ['', [Validators.required]],
      apportionmentValue: ['', [Validators.required]],
      projectNumber: ['', [Validators.required]],
      projectPhaseCode: ['', [Validators.required]],
      financialAccountCode: ['', [Validators.required]],
      costCenterCode: ['', [Validators.required]],
    });

    this.contractForm = this.fb.group({
      typeOfContractId: ['', [Validators.required]],
      vendorCode: ['', [Validators.required]],
      signatureDate: ['', [Validators.required]],
      contractValue: ['', [Validators.required]],
      deadline: ['', [Validators.required]],
      area: ['', [Validators.required]],
      contractDuration: ['', [Validators.required]],
      comments: ['', [Validators.maxLength(1000)]]
    });

    this.contractAForm = this.fb.group({
      companyCode: ['', [Validators.required]],
      affiliateCode: ['', [Validators.required]],
      serviceCode: ['', [Validators.required]],
      apportionmentValue: ['', [Validators.required]],
      projectNumber: ['', [Validators.required]],
      projectPhaseCode: ['', [Validators.required]],
      financialAccountCode: ['', [Validators.required]],
      costCenterCode: ['', [Validators.required]],
    });

    this.measurementForm = this.fb.group({
      supervisorId: ['', [Validators.required]],
      date: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      chit: ['', [Validators.required]],
      chitSeries: ['', [Validators.required]],
    });
    this.getConstructionsLocal();
    this.getTypeOfContracts();
    }

  getConstructionsLocal() {
    let retorno: LocalBd = this.constructionService.getConstructionWeb();
    if (retorno.idConstruction != null) {
      this.localBd = "" + retorno.idConstruction + " - " + retorno.descConstruction;
    }
    else {
      this.localBd = "Nenhuma obra selecionada";
    }
  }

  getBiddingsConstruction() {
    this.biddingService.getAllBiddingsConstruction()
      .subscribe(
      result => {
        this.biddingsConstruction = result,
        this.toastr.info('Licitações carregadas!', 'Sucesso');
           },
      error => { this.errors = JSON.parse(error._body).errors }
      );
  }

  selectBidding() {
    this.biddingService.getBidding(+this.select)
      .subscribe(
      result => {
        this.bidding = result,
          this.getContractConstruction();
      },
      error => { this.errors = JSON.parse(error._body).errors }
      );
  }

  addBiddingA() {
    if (this.biddingApportionmentForm.dirty && this.biddingApportionmentForm.valid) {
      //let user = this.eventoService.obterUsuario();

      let p = Object.assign({}, this.biddingApportionment, this.biddingApportionmentForm.value)
      p.biddingShoppingPortalId = this.bidding.biddingShoppingPortalId;
      p.constructionId = this.bidding.constructionId;
      p.biddingId = this.bidding.id;
      this.biddingApportionmentService.registerBiddingA2(p)
        .subscribe(
        result => {
          this.onSaveBiddingAComplete()
        },
        error => {
          this.onError(error);
        });
    }
  }

  public showModal(modal: string): void {
    if (modal == 'rateioLic')
      this.modalVisible = true;
    else if (modal == 'contract')
      this.modalContractVisible = true;
    else if (modal == 'measurement')
      this.modalMeasurementVisible = true;
    else if (modal == 'measurements')
      this.modalMeasurementsVisible = true;
  }

  public showModalContractA(modal: string, idContract: number, typeOfContractId: number): void {
    this.modalContractAVisible = true;
    this.contractId = idContract;
    this.typeOfContractId = typeOfContractId;
      }

  public showModalMeasurement(idApportionment: number, contractId: number): void {
    this.modalMeasurementVisible = true;
    this.contractId = contractId;
    this.apportionmentId = idApportionment;
    this.getSupervisors();
  }

  public showModalMeasurements(idApportionment: number, contractId: number): void {
    this.getMeasurements(idApportionment, contractId);
    this.modalMeasurementsVisible = true;
    this.apportionmentId = idApportionment;
  }

  public hideModal(modal: string): void {
    if (modal == 'rateioLic')
      this.modalVisible = false;
    else if (modal == 'contract')
      this.modalContractVisible = false;
    else if (modal == 'contractA')
      this.modalContractAVisible = false;
    else if (modal == 'measurement')
      this.modalMeasurementVisible = false;
    else
      this.modalMeasurementsVisible = false;
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.biddingApportionmentForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.biddingApportionmentForm);
    });

    Observable.merge(this.contractForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contractForm);
    });

    Observable.merge(this.contractAForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contractAForm);
    });

    Observable.merge(this.measurementForm.valueChanges, ...controlBlurs).debounceTime(3000).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.measurementForm)
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
    this.toastr.warning('Erro ao cadastrar rateio de licitação!', 'Alerta!');
  }

  onSaveBiddingAComplete(): void {
    this.hideModal("rateioLic");
    this.toastr.success('Rateio da licitação cadastrado!', 'Sucesso');
    this.biddingApportionmentForm.reset();
    this.selectBidding()
    this.errors = [];
  }

  onSaveContractComplete(): void {
    this.hideModal("contract");
    this.toastr.success('Contrato cadastrado!', 'Sucesso');
    this.contractForm.reset();
    this.selectBidding();
    this.errors = [];
  }

  onSaveContractAComplete(): void {
    this.hideModal("contractA");
    this.toastr.success('Rateio contrato cadastrado!', 'Sucesso');
    this.contractAForm.reset();
    this.getContractConstruction();
    this.errors = [];
  }

  onSaveMeasurementComplete(): void {
    this.hideModal("measurement");
    this.toastr.success('Medição cadastrada!', 'Sucesso');
    this.measurementForm.reset();
    this.errors = [];
  }

  getContractConstruction() {
    this.contractService.getContractsConstructionBidding(this.bidding.constructionId, this.bidding.id)
      .subscribe(
      result => {
        this.contractsConstruction = result
       },
      error => { this.errors = JSON.parse(error._body).errors }
      );
  }

  addContract() {
    if (this.contractForm.dirty && this.contractForm.valid) {
      //let user = this.eventoService.obterUsuario();
      let p = Object.assign({}, this.contract, this.contractForm.value)
      p.constructionId = this.bidding.constructionId;
      p.biddingId = this.bidding.id;
      p.contractOrigin = 0;
      this.contractService.newRegisterContract(p)
        .subscribe(
        result => {
          this.onSaveContractComplete()
        },
        error => {
          this.onError(error);
        });
    }
  }

  addContractA(idContract: number) {
    if (this.contractAForm.dirty && this.contractAForm.valid) {
      //let user = this.eventoService.obterUsuario();
      let p = Object.assign({}, this.contractApportionment, this.contractAForm.value)
      p.constructionId = this.bidding.constructionId;
      p.contractId = this.contractId;
      p.typeOfContractId = this.typeOfContractId;
      this.contractApportionmentService.registerContractANew(p)
        .subscribe(
        result => {
          this.onSaveContractAComplete()
        },
        error => {
          this.onError(error);
        });
    }
  }
  getTypeOfContracts() {
    this.typeOfContractService.getAllTypeOfContract().subscribe(result => {
      this.typeOfContract = result;
    })
  }

  getSupervisors() {
    this.supervisorService.getSupervisors().subscribe(result => {
      this.supervisors = result;
    })
  }

  addMeasurement() {
    if (this.measurementForm.dirty && this.measurementForm.valid) {
      let p = Object.assign({}, this.measurement, this.measurementForm.value)
      p.constructionId = this.bidding.constructionId;
      p.contractId = this.contractId;
      p.apportionmentCode = this.apportionmentId;
      this.measurementService.registerMeasurementN(p)
        .subscribe(
        result => {
          this.onSaveMeasurementComplete()
        },
        error => {
          this.onError(error);
        });
    }
  }

  getMeasurements(idApportionment: number, idContract: number) {
    this.measurementService.getMeasurementsAppCon(idApportionment, idContract)
      .subscribe(
      result => {
      this.measurements = result;
      },
      error => { this.errors = JSON.parse(error._body).errors }
      );
  }
}
