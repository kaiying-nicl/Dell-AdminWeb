import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Document, DocWithMappingStatus } from '../models/document-model';
import { Keyword } from '../models/keyword-model';
import { DocumentService } from '../services/document.service';
import { KeywordService } from '../services/keyword.service';
import { DocumentTableComponent } from './document-table.component';

const docs = [
    new Document(1, 'book1', ''),
    new Document(2, 'book2', ''),
    new Document(3, 'book3', ''),
    new Document(4, 'book4', ''),
    new Document(5, 'book5', ''),  
]

const keywordMappings = docs.slice(0, 3);

describe('DocumentTableComponent', () => {
  let component: DocumentTableComponent;
  let fixture: ComponentFixture<DocumentTableComponent>;
  let element: DebugElement;

  let keywordServiceSpy: any;
  let documentServiceSpy: any;

  beforeEach(async () => {
    keywordServiceSpy = jasmine.createSpyObj('KeywordService', ['getMappings', 'updateMappings']);
    keywordServiceSpy.getMappings.and.returnValue(of(keywordMappings));
    keywordServiceSpy.updateMappings.and.returnValue(of(null))

    documentServiceSpy = jasmine.createSpyObj('DocumentService', ['getDocuments']);
    documentServiceSpy.getDocuments.and.returnValue(of(docs));
    
    await TestBed.configureTestingModule({
      declarations: [ DocumentTableComponent ],
      imports: [
          FormsModule
      ],
      providers: [
        { provide: KeywordService, useValue: keywordServiceSpy},
        { provide: DocumentService, useValue: documentServiceSpy}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTableComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  });

  it(`should get new document mappings when selected keyword changed`, () => {
    spyOn(component, 'getMappings');
    component.ngOnChanges({
        selectedKeyword: new SimpleChange(null, new Keyword(1, 'Test'), true)
    });
    fixture.detectChanges();

    expect(component.getMappings).toHaveBeenCalled();
  });

  it(`should add document mapping status after GET`, () => {
    component.getMappings(new Keyword(1, 'Test'));

    expect(component.docsToDisplay.length > 0).toBeTrue();
    expect(component.docsToDisplay[0].mapped).toBeTruthy();
  });

  it(`should clear mapped documents when receives an empty keyword`, () => {
      component.docsToDisplay = [
          new DocWithMappingStatus(true, 1, 'Test', '')
      ]
      component.getMappings(null);

      expect(component.docsToDisplay.length).toBe(0);
  })

  it(`should cancel editing when mapped documents updated`, () => {
    component.onEdit = true;
    component.getMappings(null);
    expect(component.onEdit).toBeFalse();

    component.onEdit = true;
    component.getMappings(new Keyword(1, 'Test'));
    expect(component.onEdit).toBeFalse();
  });

  it(`should display all documents when Edit mode is active`, () => {
    component.selectedKeyword = new Keyword(1, 'Test');
    fixture.detectChanges();
    element.query(By.css('.btn-outline-primary')).nativeElement.dispatchEvent(new Event('click'));

    expect(documentServiceSpy.getDocuments).toHaveBeenCalledTimes(1);
    expect(component.mappedDocs.length >= 0).toBeTrue();
    expect(component.docsToDisplay.length >= component.mappedDocs.length).toBeTrue();
    expect(component.onEdit).toBeTrue();
  });

  it(`should call update mappings service call when 'Save' button is clicked`, () => {
    component.selectedKeyword = new Keyword(1, 'Test');
    component.getMappings(component.selectedKeyword);
    component.onEdit = true;
    fixture.detectChanges();

    spyOn(component, 'getMappings').calls.reset();
    element.query(By.css('.btn-primary')).nativeElement.dispatchEvent(new Event('click'));

    expect(keywordServiceSpy.updateMappings).toHaveBeenCalledOnceWith(
        component.selectedKeyword.id, component.docsToDisplay.map(d => d.id));
    expect(component.getMappings).toHaveBeenCalledTimes(1);
  });

  it(`should revert to only show currently mapped documents when 'Cancel' button is clicked`, () => {
    component.selectedKeyword = new Keyword(1, 'Test');
    component.getMappings(component.selectedKeyword);
    component.onClickEditBtn();
    fixture.detectChanges();

    element.query(By.css('.btn-primary')).nativeElement.dispatchEvent(new Event('click'));

    expect(component.docsToDisplay).toEqual(component.mappedDocs);
    expect(component.onEdit).toBeFalse();
  })
});
