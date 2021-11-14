import { Component, OnInit } from '@angular/core';
import { Keyword } from '../models/keyword-model';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  selectedKeyword: Keyword;

  constructor() { }

  ngOnInit(): void {
  }

  selectKeyword(keyword: Keyword): void {
    this.selectedKeyword = keyword;
  }
}
