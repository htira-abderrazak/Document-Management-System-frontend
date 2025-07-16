import { TestBed } from '@angular/core/testing';

import { MyChatbotLibraryService } from './my-chatbot-library.service';

describe('MyChatbotLibraryService', () => {
  let service: MyChatbotLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyChatbotLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
