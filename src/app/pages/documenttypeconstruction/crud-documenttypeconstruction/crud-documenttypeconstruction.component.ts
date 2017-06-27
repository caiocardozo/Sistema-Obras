import { DocumentTypeConstructionService } from './../documenttypeconstruction.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DocumentTypeConstruction } from './../documenttypeconstruction';

@Component({
  selector: 'crud-documenttypeconstruction',
  templateUrl: './crud-documenttypeconstruction.component.html'
})
export class CrudDocumentTypeConstructionComponent implements OnInit {

  public form: FormGroup;
  public errors: any[] = [];
  documentTypeConstruction: DocumentTypeConstruction = new DocumentTypeConstruction();
  documentTypeConstructions: DocumentTypeConstruction[] = [];

  constructor(
    private fb: FormBuilder,
    private documentTypeConstructionService: DocumentTypeConstructionService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {

    this.toastr.setRootViewContainerRef(vcr);

    this.form = this.fb.group({
      description: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    this.getDocumentTypeConstructions()
  }

  getDocumentTypeConstructions() {
    this.documentTypeConstructionService.getAllDocumentTypeConstruction().subscribe(result => {
      this.documentTypeConstructions = result;
      this.toastr.info('Documentos tipos obra carregados.');
    }, err => {
      this.toastr.warning('Problema ao carregar documentos.');
    });
  }

  insert() {
    this.documentTypeConstructionService.createDocumentTypeConstruction(this.form.value)
      .subscribe(result => {
        this.toastr.success('Tipo de documento cadastrado!', 'Sucesso');
        this.form.reset();
        this.getDocumentTypeConstructions();
      }, err => {
        this.toastr.warning('Problema para cadastrar.', 'Alerta!');
        this.form.reset;
      });
  }

  updateStatus(id: number) {
    this.documentTypeConstructionService.updateStatusDocumentTypeConstruction(id)
      .then(documentTypeConstruction => {
        this.toastr.success('Status alterado.', 'Successo!')
        this.getDocumentTypeConstructions();
      }, err => {
        this.toastr.warning('Status não atualizado.', 'Alerta!');
      });
  }

  remove(id: number) {
    this.documentTypeConstructionService.deleteDocumentTypeConstruction(id)
      .subscribe(result => {
        this.toastr.success('Tipo de documento apagado!', 'Sucesso');
        this.documentTypeConstructionService.getAllDocumentTypeConstruction().subscribe(result => {
          this.documentTypeConstructions = result;
        })
      }, err => {
        this.toastr.warning('Problema para apagar.', 'Alerta!');
      });
  }
}
