import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotTextboxComponent } from './chatbot-textbox.component';

describe('ChatbotTextboxComponent', () => {
  let component: ChatbotTextboxComponent;
  let fixture: ComponentFixture<ChatbotTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotTextboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
