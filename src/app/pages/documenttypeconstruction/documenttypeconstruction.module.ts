import { CrudDocumentTypeConstructionComponent } from './crud-documenttypeconstruction/crud-documenttypeconstruction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentTypeConstructionService } from './documenttypeconstruction.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CrudDocumentTypeConstructionComponent],
  exports:[CrudDocumentTypeConstructionComponent],
  providers:[DocumentTypeConstructionService]
})
export class DocumentTypeConstructionModule { }
