import { TypeOfConstructionService } from './typeofconstruction.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudTypeOfConstructionComponent } from './crud-typeofconstruction/crud-typeofconstruction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CrudTypeOfConstructionComponent
  ],
  exports:[],
  providers:[TypeOfConstructionService]
})
export class TypeOfConstructionModule { }
