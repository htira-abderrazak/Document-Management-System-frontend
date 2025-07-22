import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Subscription, interval, takeWhile } from 'rxjs';

@Directive({
  selector: '[libTyping]',
  standalone: true,
})
export class TypingDirective implements OnInit, OnDestroy {
  @Input({ required: true }) text!: string;
  @Input({ required: false }) nativeContainer!: HTMLElement;

  timer = interval(30);
  timerSub!: Subscription;
  index: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this._applyTypingEffect();
  }

  private _applyTypingEffect(): void {
    this.el.nativeElement.textContent = '';
    this.timerSub = this.timer
      .pipe(takeWhile(() => this.index <= this.text.length))
      .subscribe(() => {
        this.el.nativeElement.textContent += this.text.charAt(this.index);
        this.nativeContainer.scrollTop = this.nativeContainer.scrollHeight;
        this.index = this.index + 1;
      });
  }

  ngOnDestroy(): void {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
}
