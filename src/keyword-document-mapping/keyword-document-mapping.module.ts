import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { WrapperComponent } from './wrapper/wrapper.component';
import { KeywordComponent } from './keyword/keyword.component';
import { DocumentTableComponent } from './document-table/document-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    WrapperComponent,
    KeywordComponent,
    DocumentTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTypeaheadModule,
    HttpClientModule
  ],
  exports: [
    WrapperComponent
  ]
})
export class KeywordDocumentMappingModule { }
