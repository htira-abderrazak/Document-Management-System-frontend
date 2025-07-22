import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-chatbot-icon',
  standalone: true,
  imports: [],
  templateUrl: './chatbot-icon.component.html',
  styleUrl: './chatbot-icon.component.css'
})
export class ChatbotIconComponent {
  //
  @Input({required : true}) iconChatbot !: string;
  @Output() chatbotClicked = new EventEmitter<void>();

  onClickedChatbotIcon() : void
  {
    this.chatbotClicked.emit();
  }
}
