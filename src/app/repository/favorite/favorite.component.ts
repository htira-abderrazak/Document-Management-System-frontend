import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DirectorysericeService } from '../directoryserice.service';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit  {
  data = [];
  isLoading = true;
  dataempty = false;
  constructor(private directoryservice: DirectorysericeService) { }

  ngOnInit(): void {
      this.directoryservice.getFavorite().subscribe((data: any) => {
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
