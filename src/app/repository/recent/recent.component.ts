import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectorysericeService } from '../directoryserice.service';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.css',
})
export class RecentComponent {
  data = [];
  isLoading = true;
  dataempty = false;
  constructor(private directoryservice: DirectorysericeService) {}

  ngOnInit(): void {
    this.directoryservice.getRecent().subscribe((data: any) => {
      this.data = data;
      this.isLoading = false;
      this.dataempty = this.directoryservice.isArrayEmptyEvery(data)
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
