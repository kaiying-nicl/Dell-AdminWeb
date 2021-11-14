import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Document } from '../models/document-model';
import { Keyword, KeywordPostBody } from '../models/keyword-model';
import { KeywordService } from './keyword.service';

const docs = [
  new Document(1, 'book1', ''),
  new Document(2, 'book2', ''),
  new Document(3, 'book3', ''),
  new Document(4, 'book4', ''),
  new Document(5, 'book5', ''),
]

const keywords = [
  new Keyword(1, 'Test'),
  new Keyword(2, 'Test2')
]

describe('KeywordService', () => {
  let service: KeywordService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(KeywordService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return array of keywords for GET keywords endpoint', () => {
    service.getKeywords().subscribe(result => {
      expect(result.length).toBe(keywords.length);
      expect(result).toEqual(keywords);
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('GET');
    req.flush(keywords);
  });

  it('should return void for DELETE keyword endpoint', () => {
    service.deleteKeyword(keywords[0].id).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}/${keywords[0].id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should return void for ADD keyword endpoint', () => {
    service.addKeyword(keywords[0].value).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(new KeywordPostBody(keywords[0].value));
    req.flush(null);
  });

  it('should return void for UPDATE keyword endpoint', () => {
    service.updateKeyword(keywords[0]).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(keywords[0]);
    req.flush(null);
  });

  it('should return array of documents for GET mappings endpoint', () => {
    service.getMappings(keywords[0].id).subscribe(result => {
      expect(result).toBe(docs);
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}/${keywords[0].id}/mappings`);
    expect(req.request.method).toBe('GET');
    req.flush(docs);
  });

  it('should return void for UPDATE mappings endpoint', () => {
    service.updateMappings(keywords[0].id, [1, 2, 3]).subscribe(result => {
      expect(result).toBeNull();
    });

    const req = httpTestingController.expectOne(`${service.baseUrl}/${keywords[0].id}/mappings`);
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });
});
