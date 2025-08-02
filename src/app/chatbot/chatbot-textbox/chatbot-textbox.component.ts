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
import { Subscription } from 'rxjs';

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
  @Output() triggerParent = new EventEmitter<void>();

  readonly welcomeMessage: string =
    "Hello I'm Manu your virtual assistant. How can I help you?";
  readonly errorMessage: string = 'Something went wront. Please try later';
  inputText: string | undefined;
  waitingResponse: boolean = false;
  errorResponse: boolean = false;
  listOfMessages: ChatbotMsg[] = [];
  private messageSub?: Subscription;
  private WsConnection?: Subscription;

  constructor(
    private http: HttpClient,
    private wsservice: MyChatbotLibraryService
  ) {}

  ngOnInit() {
    this.WsConnection = this.wsservice.connect().subscribe({
      next: (msg) => {
        // this.waitingResponse = false;
        // if (msg.response) {
        //   this.listOfMessages.push({
        //     role: 'assistant',
        //     content: msg.response,
        //   });
        // }
        // if (msg.reload == true) this.triggerParent.emit();
      },
      error: (err) => {
        this.listOfMessages.push({
          role: 'assistant',
          content: this.errorMessage,
        });
        return;
      },
      complete: () => console.log('WebSocket connection closed'),
    });

    this.messageSub = this.wsservice.onMessage().subscribe({
      next: (res: any) => {
        this.waitingResponse = false;
        if (res.response) {
          this.listOfMessages.push({
            role: 'assistant',
            content: res.response,
          });
        }
        if (res.reload == true) this.triggerParent.emit();
      },
      error: (err: any) => {
        this.waitingResponse = false;
        this.errorResponse = true;
        this.listOfMessages.push({
          role: 'assistant',
          content: this.errorMessage,
        });
        if (err.reload == true) this.triggerParent.emit();
      },
    });
  }

  getIcon(ind: number): string {
    return ind == 0 || ind % 2 == 0
      ? 'assets/icons/chatboticon.png'
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

      this.waitingResponse = true;

      const request = {
        message: String(this.inputText),
        id: this.id,
        data: this.data,
      };
      //Do the call
      this.wsservice.send(request);
      this.inputText = undefined;
    }
  }

  ngOnDestroy(): void {
    this.wsservice.disconnect();
    this.messageSub?.unsubscribe();
    this.WsConnection?.unsubscribe();
  }
}
