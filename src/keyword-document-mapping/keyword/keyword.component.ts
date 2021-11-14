import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, Observable, Subject } from 'rxjs';
import { Keyword } from '../models/keyword-model';
import { KeywordService } from '../services/keyword.service';

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.scss']
})
export class KeywordComponent implements OnInit {

  keywords: Keyword[] = [];
  keywordsHolder: Keyword[] = [];
  keywordInput = new FormControl('');
  selectedKeyword: Keyword;
  onAdd = false;
  onEdit = false;

  @ViewChild('keywordSearchBox') keywordSearchBox: ElementRef;
  @Output() selectKeywordEvent = new EventEmitter<Keyword>();

  @ViewChild('instance', { static: true }) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(private keywordService: KeywordService) { }

  ngOnInit(): void {
    this.getKeywords();
  }

  getKeywords(): void {
    this.keywordService.getKeywords()
      .subscribe(keywords => {
        this.keywords = keywords;
        if (this.keywordInput.value) {
          this.selectedKeyword = this.getKeywordByValue(this.keywordInput.value);
          this.selectKeywordEvent.emit(this.selectedKeyword);
        }
      });
  }

  formatter = (keyword: Keyword) => keyword.value;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 0),
      map(term => this.keywords.filter(keyword => new RegExp(term, 'mi').test(keyword.value)).slice(0, 10))
    )

  selectedItem(event: NgbTypeaheadSelectItemEvent): void {
    this.keywordSearchBox.nativeElement.blur();
    this.selectedKeyword = event.item;
    this.selectKeywordEvent.emit(event.item);
  }

  clear(): void {
    if (!this.onEdit)
      this.selectKeywordEvent.emit(null);
  }

  onClickAddBtn(): void {
    this.clearAllKeywordInfo();
    this.disableTypeahead();
    this.onAdd = true;
  }

  onClickEditBtn(): void {
    this.disableTypeahead();
    this.onEdit = true;
  }

  onSave(): void {
    if (!this.selectedKeyword) {
      this.keywordService.addKeyword(this.keywordInput.value)
        .subscribe(() => {
          this.getKeywords();
          this.onAdd = false;
        });
    } else {
      this.keywordService.updateKeyword(new Keyword(this.selectedKeyword.id, this.keywordInput.value))
        .subscribe(() => {
          this.getKeywords();
          this.onEdit = false;
        })
    }
  }

  onCancel(): void {
    if (this.selectedKeyword) {
      this.keywordInput.patchValue(this.selectedKeyword);
      this.onEdit = false;
    } else {
      this.keywordInput.patchValue('');
      this.onAdd = false;
    }
    this.reenableTypeahead();
  }

  onDelete(): void {
    this.keywordService.deleteKeyword(this.selectedKeyword.id)
      .subscribe(() => {
        this.getKeywords();
        this.clearAllKeywordInfo();
      });
  }

  unchangeOrEmptyInputValue(): Boolean {
    return !this.keywordInput.value 
      || this.selectedKeyword === this.keywordInput.value 
      || this.selectedKeyword?.value === this.keywordInput.value;
  }

  private clearAllKeywordInfo() {
    this.selectedKeyword = null;
    this.keywordInput.patchValue('');
    this.clear();
  }

  private disableTypeahead(): void {
    this.keywordsHolder = Object.assign([], this.keywords);
    this.keywords = [];
  }

  private reenableTypeahead(): void {
    this.keywords = Object.assign([], this.keywordsHolder);
  }

  private getKeywordByValue(value: string): Keyword {
    return this.keywords.find(k => k.value === value);
  }
}
