import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { KeywordDocumentMappingModule } from 'src/keyword-document-mapping/keyword-document-mapping.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeywordDocumentMappingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
