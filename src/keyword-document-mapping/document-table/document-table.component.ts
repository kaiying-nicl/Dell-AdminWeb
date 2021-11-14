import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Document, DocWithMappingStatus } from '../models/document-model';
import { Keyword } from '../models/keyword-model';
import { DocumentService } from '../services/document.service';
import { KeywordService } from '../services/keyword.service';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.scss']
})
export class DocumentTableComponent implements OnInit, OnChanges {

  mappedDocs: DocWithMappingStatus[] = [];
  docsToDisplay: DocWithMappingStatus[] = [];
  onEdit = false;

  @Input() selectedKeyword: Keyword;

  constructor(private keywordService: KeywordService, private documentService: DocumentService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedKeyword'].previousValue != changes['selectedKeyword'].currentValue) {
      this.getMappings(changes['selectedKeyword'].currentValue);
    }
  }

  getMappings(keyword: Keyword): void {
    if (keyword) {
      this.keywordService.getMappings(keyword.id)
        .subscribe(docs =>
          this.docsToDisplay = docs.map(a => ({
            ...a,
            mapped: true
          })));
    } else {
      this.docsToDisplay = [];
    }
    this.onEdit = false;
  }

  onClickEditBtn(): void {
    this.documentService.getDocuments()
      .subscribe(docs => {
        this.mappedDocs = Object.assign([], this.docsToDisplay);
        this.docsToDisplay = this.mapDocsStatus(docs);
        this.onEdit = true;
      });
  }

  onSave(): void {
    var mappings = this.docsToDisplay
      .filter(d => d.mapped === true)
      .map(d => d.id);

    this.keywordService.updateMappings(this.selectedKeyword.id, mappings)
      .subscribe(() => {
        this.getMappings(this.selectedKeyword);
      });
  }

  onCancel(): void {
    this.docsToDisplay = Object.assign([], this.mappedDocs);
    this.onEdit = false;
  }

  private mapDocsStatus(docs: Document[]): DocWithMappingStatus[] {
    return docs.map(a => ({
      ...a,
      mapped: this.docsToDisplay.some(d => d.id === a.id)
    }))
  }
}
