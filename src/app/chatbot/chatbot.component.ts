import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ChatbotIcons } from './interfaces/library.interface';
import { Subscription, filter, fromEvent } from 'rxjs';
import { ChatbotIconComponent } from './chatbot-icon/chatbot-icon.component';
import { ChatbotTextboxComponent } from './chatbot-textbox/chatbot-textbox.component';
import { Directory } from '../repository/directory';
@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [ChatbotIconComponent, ChatbotTextboxComponent],
  templateUrl: 'chatbot.component.html',
  styleUrl: 'chatbot.component.css',
})
export class ChatbotComponent implements OnDestroy {
  @Input({ required: true }) icons!: ChatbotIcons;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) data!: Directory;
  @Output() triggerParent = new EventEmitter<void>();

  showTextBox: boolean = false;

  readonly keyDownEvent$ = fromEvent<KeyboardEvent>(document, 'keydown');
  private keyInputSub!: Subscription;

  ngOnDestroy(): void {
    if (this.keyInputSub) {
      this.keyInputSub.unsubscribe();
    }
  }
  handleTriggerFromGrandchild() {
    this.triggerParent.emit(); // bubble it up
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
