import { MyDatePickerModule } from 'mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListConstructionComponent } from './list-construction/list-construction.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteConstructionComponent } from './delete-construction/delete-construction.component';
import { AddConstructionComponent } from './add-construction/add-construction.component';
import { ConstructionComponent } from './construction.component';

import { TypeOfConstructionService } from './../typeofconstruction/typeofconstruction.service';
import { TypeOfInspectionService } from './../typeofinspection/typeofinspection.service';
import { SituationService } from './../situation/situation.service';
import { ConstructionService } from './construction.service';
import { CampusService } from './../campus/campus.service';
import { DetailsConstructionComponent } from './details-construction/details-construction.component';
import { constructionsRouterConfig } from "app/pages/construction/construction.routes";
import { EditConstructionComponent } from './edit-construction/edit-construction.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    RouterModule.forChild(constructionsRouterConfig)
  ],
  declarations: [
    ConstructionComponent,
    DetailsConstructionComponent,
    AddConstructionComponent,
    DeleteConstructionComponent,
    ListConstructionComponent,
    EditConstructionComponent
    ],
  exports:[
    RouterModule
  ],
  providers:[
    SituationService,
    TypeOfInspectionService,
    TypeOfConstructionService,
    CampusService
    ]
})
export class ConstructionModule { }
