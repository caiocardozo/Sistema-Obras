import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CrudTypeOfBondComponent } from './crud-typeofbond/crud-typeofbond.component';
import { TypeOfBondService } from './typeofbond.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CrudTypeOfBondComponent],
  providers: [TypeOfBondService]
})
export class TypeOfBondModule { }
