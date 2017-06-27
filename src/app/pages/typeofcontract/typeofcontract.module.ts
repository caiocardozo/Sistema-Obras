import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeOfContractService } from './typeofcontract.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudTypeOfContractComponent } from "app/pages/typeofcontract/crud-typeofcontract/crud-typeofcontract.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CrudTypeOfContractComponent
  ],
  exports:[CrudTypeOfContractComponent],
  providers: [TypeOfContractService]
})
export class TypeOfContractModule { }
