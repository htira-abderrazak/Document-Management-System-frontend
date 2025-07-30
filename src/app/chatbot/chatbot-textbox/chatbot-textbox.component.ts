import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ChatbotIcons,
  ChatbotMsg,
  ChatbotRequest,
  ChatbotResponse,
} from '../interfaces/library.interface';
import { HttpClient } from '@angular/common/http';
import { NgClass, NgStyle } from '@angular/common';
import { TypingDirective } from '../directives/typing.directive';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MyChatbotLibraryService } from '../services/my-chatbot-library.service';
import { Directory } from '../../repository/directory';

@Component({
  selector: 'lib-chatbot-textbox',
  standalone: true,
  imports: [NgStyle, NgClass, TypingDirective, FormsModule, InputTextModule],
  templateUrl: './chatbot-textbox.component.html',
  styleUrl: './chatbot-textbox.component.css',
})
export class ChatbotTextboxComponent implements OnInit, OnDestroy {
  @ViewChild('bodyChatbotContainer', { static: false })
  bodyContainer!: ElementRef;

  @Input({ required: true }) data!: Directory;
  @Input({ required: true }) icons!: ChatbotIcons;
  @Input({ required: true }) id!: string;
  @Output() closeChatbot = new EventEmitter<void>();

  readonly welcomeMessage: string =
    "Hello I'm Manu your virtual assistant. How can I help you?";
  readonly errorMessage: string = 'Something went wront. Please try later';
  inputText: string | undefined;
  waitingResponse: boolean = false;
  errorResponse: boolean = false;
  listOfMessages: ChatbotMsg[] = [
    { role: 'assistant', content: this.welcomeMessage },
  ];

  constructor(
    private http: HttpClient,
    private wsservice: MyChatbotLibraryService
  ) {}

  ngOnInit() {
    this.wsservice.connect();
  }

  getIcon(ind: number): string {
    return ind == 0 || ind % 2 == 0
      ? this.icons.chatbotIcon
      : this.icons.userIcon;
  }

  onCloseChatbot(): void {
    this.closeChatbot.emit();
  }

  onSendForm(): void {
    if (this.inputText != undefined) {
      this.listOfMessages.push({
        role: 'user',
        content: <string>this.inputText,
      });
      this.inputText = undefined;
      this.waitingResponse = true;

      const request = {
        message: String(this.inputText),
        id: this.id,
        data: this.data,
      };
      //Do the call
      this.wsservice.send(request);
      this.wsservice.onMessage().subscribe({
        next: (res: any) => {
          this.waitingResponse = false;
          if (res.response) {
            this.listOfMessages.push({
              role: 'assistant',
              content: res.response,
            });
          }
        },
        error: (err: any) => {
          this.waitingResponse = false;
          this.errorResponse = true;
          this.listOfMessages.push({
            role: 'assistant',
            content: this.errorMessage,
          });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.wsservice.disconnect()
  }
}
