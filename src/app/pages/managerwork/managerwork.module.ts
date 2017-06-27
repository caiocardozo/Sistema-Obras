import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContractService } from './../contract/contract.service';
import { BiddingService } from './../bidding/bidding.service';
import { MyDatePickerModule } from 'mydatepicker';
import { SupervisorService } from './../supervisor/supervisor.service';
import { MeasurementService } from './../measurement/measurement.service';
import { ContractApportionmentService } from './../contractapportionment/contractapportionment.service';
import { TypeOfContractService } from './../typeofcontract/typeofcontract.service';
import { BiddingApportionmentService } from './../biddingapportionment/biddingapportionment.service';
import { ManagerworkComponent } from './managerwork.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
  ],
  providers:[BiddingService,BiddingApportionmentService, TypeOfContractService, ContractApportionmentService, MeasurementService, SupervisorService,ContractService],
  declarations: [ManagerworkComponent]
})
export class ManagerWorkModule { }
