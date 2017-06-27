import { CrudNatureOfObservationComponent } from './crud-natureofobservation/crud-natureofobservation.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NatureOfObservationService } from './natureofobservation.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    CrudNatureOfObservationComponent
  ],
  providers: [NatureOfObservationService]
})
export class NatureOfObservationModule { }
