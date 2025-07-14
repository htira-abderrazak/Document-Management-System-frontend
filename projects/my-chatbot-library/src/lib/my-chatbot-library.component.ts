import { Component, Input, OnDestroy } from '@angular/core';
import { ChatbotIcons } from './interfaces/library.interface';
import { Subscription, filter, fromEvent } from 'rxjs';
import { ChatbotIconComponent } from './chatbot-icon/chatbot-icon.component';
import { ChatbotTextboxComponent } from './chatbot-textbox/chatbot-textbox.component';

@Component({
  selector: 'lib-my-chatbot-library',
  standalone: true,
  imports: [ChatbotIconComponent, ChatbotTextboxComponent],
  templateUrl: 'my-chatbot-library.component.html',
  styleUrl: 'my-chatbot-library.component.css',
})
export class MyChatbotLibraryComponent implements OnDestroy {
  @Input({ required: true }) icons!: ChatbotIcons;
  @Input({ required: true }) basePath!: string;

  showTextBox: boolean = false;

  readonly keyDownEvent$ = fromEvent<KeyboardEvent>(document, 'keydown');
  private keyInputSub!: Subscription;

  ngOnDestroy(): void {
    if (this.keyInputSub) {
      this.keyInputSub.unsubscribe();
    }
  }

  //Method called whenever the chatbot icon is clicked
  onChatbotClicked(): void {
    this.showTextBox = true;
    this._subscribeToKeydownEvent();
  }

  onCloseChatbot(): void {
    this.showTextBox = false;
  }

  private _subscribeToKeydownEvent(): void {
    this.keyInputSub = this.keyDownEvent$
      .pipe(filter((event) => event.key === 'Escape'))
      .subscribe(() => {
        this.showTextBox = false;
        this.keyInputSub.unsubscribe();
      });
  }
}
