import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeOfInspectionService } from './typeofinspection.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudTypeOfInspectionComponent } from './crud-typeofinspection/crud-typeofinspection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CrudTypeOfInspectionComponent],
  exports:[CrudTypeOfInspectionComponent],
  providers: [TypeOfInspectionService]
})
export class TypeOfInspectionModule { }
