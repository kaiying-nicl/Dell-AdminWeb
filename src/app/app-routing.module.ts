import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WrapperComponent } from 'src/keyword-document-mapping/wrapper/wrapper.component';

@NgModule({
  imports: [RouterModule.forRoot([
    {path: '', redirectTo: '/keyword', pathMatch: 'full'},
    {path: 'keyword', component: WrapperComponent}
  ])],
  exports: [RouterModule]
})
export class AppRoutingModule { }
