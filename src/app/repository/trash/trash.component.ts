import { Component, OnInit } from '@angular/core';
import { DirectorysericeService } from '../directoryserice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trash.component.html',
  styleUrl: './trash.component.css',
})
export class TrashComponent implements OnInit {

  data = [];
  constructor(private directoryservice: DirectorysericeService) { }

  ngOnInit(): void {
      this.directoryservice.getTrash().subscribe((data: any) => {
        this.data = data;
      });
  }
  separateDateTime(time: any) {
    const dateTime = new Date(time);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours();

    return `${day}/${month}/${year} ${hour}:00`;
  }
}
