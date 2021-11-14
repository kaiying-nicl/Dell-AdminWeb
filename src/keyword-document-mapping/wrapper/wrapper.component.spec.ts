import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { KeywordComponent } from '../keyword/keyword.component';
import { Keyword } from '../models/keyword-model';
import { DocumentService } from '../services/document.service';
import { KeywordService } from '../services/keyword.service';
import { WrapperComponent } from './wrapper.component';

const keyword = new Keyword(1, 'test');

describe('WrapperComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;

  let keywordServiceSpy: any;
  let documentServiceSpy: any;

  beforeEach(async () => {
    keywordServiceSpy = jasmine.createSpyObj('KeywordService', ['getKeywords']);
    keywordServiceSpy.getKeywords.and.returnValue(of([]));

    documentServiceSpy = jasmine.createSpyObj('DocumentService', ['']);

    await TestBed.configureTestingModule({
      declarations: [
        WrapperComponent,
        KeywordComponent,
        DocumentTableComponent
      ],
      imports: [
        ReactiveFormsModule,
        NgbTypeaheadModule
      ],
      providers: [
        { provide: KeywordService, useValue: keywordServiceSpy },
        { provide: DocumentService, useValue: documentServiceSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should update selectedKeyword when selectKeyword method is triggered`, () => {
    component.selectKeyword(keyword);
    expect(component.selectedKeyword.id).toBe(keyword.id);
    expect(component.selectedKeyword.value).toBe(keyword.value);
  });
});
