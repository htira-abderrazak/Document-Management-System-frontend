import { TestBed } from '@angular/core/testing';

import { DirectorysericeService } from './directoryserice.service';

describe('DirectorysericeService', () => {
  let service: DirectorysericeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectorysericeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
