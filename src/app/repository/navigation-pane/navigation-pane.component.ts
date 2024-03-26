import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navigation-pane',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './navigation-pane.component.html',
  styleUrl: './navigation-pane.component.css'
})
export class NavigationPaneComponent {
  @Input() items: any=[];
  @Input()first :any;
  constructor(){}
  selectedItem: any;
  @Output() itemClick: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(){

  }
  toggleVisibility(item: any): void {
    item.showChildren = !item.showChildren;
  }

  handleItemClick(item: any): void {
    this.itemClick.emit(item.id);
  }

  emitItemClick(name: string): void {
    this.itemClick.emit(name);
  }
}
