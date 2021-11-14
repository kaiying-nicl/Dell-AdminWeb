import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Document } from '../models/document-model';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DocumentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it(`should return array of documents from API via GET`, () => {
    const docs = [
      new Document(1, 'book1', ''),
      new Document(2, 'book2', ''),
      new Document(3, 'book3', ''),
      new Document(4, 'book4', ''),
      new Document(5, 'book5', ''),
    ]

    service.getDocuments().subscribe(result => {
      expect(result.length).toBe(docs.length);
      expect(result).toEqual(docs);
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(docs);
  });
});
