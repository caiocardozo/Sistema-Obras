import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CrudSituationComponent } from './crud-situation/crud-situation.component';
import { SituationService } from './situation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CrudSituationComponent
  ],
  exports:[],
  providers:[SituationService]
})
export class SituationModule { }
