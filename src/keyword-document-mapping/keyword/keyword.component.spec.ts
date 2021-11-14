import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbTypeaheadModule, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Keyword } from '../models/keyword-model';
import { KeywordService } from '../services/keyword.service';
import { KeywordComponent } from './keyword.component';

const keywords = [
  new Keyword(1, 'test'),
  new Keyword(2, 'test2')
];

describe('KeywordComponent', () => {
  let component: KeywordComponent;
  let fixture: ComponentFixture<KeywordComponent>;
  let element: DebugElement;

  let keywordServiceSpy: any;

  beforeEach(async () => {
    keywordServiceSpy = jasmine.createSpyObj('KeywordService', ['getKeywords', 'addKeyword', 'updateKeyword', 'deleteKeyword']);
    keywordServiceSpy.getKeywords.and.returnValue(of(keywords));
    keywordServiceSpy.addKeyword.and.returnValue(of(null));
    keywordServiceSpy.updateKeyword.and.returnValue(of(null));
    keywordServiceSpy.deleteKeyword.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      declarations: [KeywordComponent],
      imports: [
        ReactiveFormsModule,
        NgbTypeaheadModule
      ],
      providers: [
        { provide: KeywordService, useValue: keywordServiceSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    fixture.detectChanges();
  });

  it(`should call getKeywords onInit`, () => {
    expect(keywordServiceSpy.getKeywords).toHaveBeenCalledTimes(1);
    expect(component.keywords.length).toEqual(keywords.length);
  });

  it(`should assign selectedKeyword value after selecting option from typeahead`, () => {
    spyOn(component.selectKeywordEvent, 'emit').calls.reset();
    const event: NgbTypeaheadSelectItemEvent<Keyword> = {
      item: keywords[0],
      preventDefault: () => undefined
    };

    component.selectedItem(event)

    expect(component.selectedKeyword).not.toBeNull();
    expect(component.selectedKeyword).toEqual(event.item);
    expect(component.selectKeywordEvent.emit).toHaveBeenCalled();
  });

  it(`should clear mappings when user input into searchbox`, () => {
    spyOn(component.selectKeywordEvent, 'emit').calls.reset();

    const searchboxEl = element.query(By.css('input')).nativeElement;
    searchboxEl.dispatchEvent(new Event('keyup'));

    expect(component.selectKeywordEvent.emit).toHaveBeenCalledWith(null);
  });

  it(`should clear searchbox, clear mappings and disable typeahead after clicking 'Add Keyword' button`, () => {
    spyOn(component.selectKeywordEvent, 'emit').calls.reset();

    element.query(By.css('button.btn-primary')).nativeElement.dispatchEvent(new Event('click'));

    expect(component.selectedKeyword).toBe(null);
    expect(component.keywordsHolder.length > 0).toBeTrue();
    expect(component.keywords.length === 0).toBeTrue();
    expect(component.keywordInput.value).toBe('');
    expect(component.selectKeywordEvent.emit).toHaveBeenCalledWith(null);
    expect(component.onAdd).toBe(true);
  });

  it(`should do add keyword service call when 'Save' button is clicked onAdd`, () => {
    keywordServiceSpy.getKeywords.calls.reset();
    spyOn(component.selectKeywordEvent, 'emit').calls.reset();

    element.query(By.css('button.btn-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const value = 'TestAgain';
    component.keywordInput.patchValue(value);
    element.query(By.css('button.btn-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(keywordServiceSpy.addKeyword).toHaveBeenCalledOnceWith(value);
    expect(keywordServiceSpy.getKeywords).toHaveBeenCalled();
    expect(component.selectedKeyword).not.toBeNull();
    expect(component.onAdd).toBe(false);
  });

  it(`should clear searhbox when Adding new Keyword is cancelled`, () => {
    element.query(By.css('button.btn-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    component.keywordInput.patchValue('need to clear input');

    element.query(By.css('button.btn-danger')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.keywordInput.value).toBe('');
    expect(component.keywords.length > 0).toBeTrue();
    expect(component.onAdd).toBe(false);
  });

  it(`should disable typeahead when 'Edit' button is clicked`, () => {
    component.selectedKeyword = keywords[0];
    fixture.detectChanges();

    element.query(By.css('button.btn-outline-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.onEdit).toBeTrue();
    expect(component.keywordsHolder.length > 0).toBeTrue();
    expect(component.keywords.length === 0).toBeTrue();
  });

  it(`should do update keyword service call when 'Save' button is clicked onEdit`, () => {
    keywordServiceSpy.getKeywords.calls.reset();

    component.selectedKeyword = keywords[0];
    fixture.detectChanges();

    element.query(By.css('button.btn-outline-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    component.keywordInput.patchValue('testing123');
    element.query(By.css('button.btn-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(keywordServiceSpy.updateKeyword).toHaveBeenCalledWith(new Keyword(keywords[0].id, 'testing123'));
    expect(keywordServiceSpy.getKeywords).toHaveBeenCalled();
    expect(component.onEdit).toBeFalse();
  });

  it(`should revert to original keyword value when Edit Keyword is cancelled`, () => {
    component.selectedKeyword = keywords[0];
    fixture.detectChanges();

    element.query(By.css('button.btn-outline-primary')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    component.keywordInput.patchValue('testing123');
    element.query(By.css('button.btn-danger')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(component.keywordInput.value).toBe(component.selectedKeyword);
    expect(component.keywords.length > 0).toBeTrue();
    expect(component.onEdit).toBe(false);
  });

  it(`should do delete keyword service call when 'Delete' button is clicked`, () => {
    keywordServiceSpy.getKeywords.calls.reset();
    spyOn(component.selectKeywordEvent, 'emit').calls.reset();

    component.selectedKeyword = keywords[1];
    fixture.detectChanges();

    element.query(By.css('button.btn-danger')).nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    expect(keywordServiceSpy.deleteKeyword).toHaveBeenCalledOnceWith(keywords[1].id);
    expect(keywordServiceSpy.getKeywords).toHaveBeenCalled();
    expect(component.selectedKeyword).toBeNull();
    expect(component.keywordInput.value).toBe('');
    expect(component.selectKeywordEvent.emit).toHaveBeenCalledOnceWith(null);
  });
});
