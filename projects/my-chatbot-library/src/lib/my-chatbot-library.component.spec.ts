import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyChatbotLibraryComponent } from './my-chatbot-library.component';

describe('MyChatbotLibraryComponent', () => {
  let component: MyChatbotLibraryComponent;
  let fixture: ComponentFixture<MyChatbotLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyChatbotLibraryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyChatbotLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
