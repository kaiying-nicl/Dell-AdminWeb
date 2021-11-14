import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DocumentTableComponent } from 'src/keyword-document-mapping/document-table/document-table.component';
import { KeywordComponent } from 'src/keyword-document-mapping/keyword/keyword.component';
import { WrapperComponent } from 'src/keyword-document-mapping/wrapper/wrapper.component';
import { AppComponent } from './app.component';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let element: DebugElement;

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        KeywordComponent,
        WrapperComponent,
        DocumentTableComponent
      ],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  })

  it(`should have as title 'Dell-AdminWeb'`, () => {
    expect(component.title).toBe('Dell-AdminWeb');
  });

  it(`should have navigation bar with title 'AdminWeb'`, () => {
    const navbarTitle = element.query(By.css('a.navbar-brand')).nativeElement.textContent;
    expect(navbarTitle).toBe('AdminWeb');
  });
});
