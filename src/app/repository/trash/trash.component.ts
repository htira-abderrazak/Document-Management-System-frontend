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
  isLoading = true;
  dataempty = false;
  buttonText = 'Clear Trash';
  isLoadingButton = false;

  constructor(private directoryservice: DirectorysericeService) {}

  ngOnInit(): void {
    this.directoryservice.getTrash().subscribe((data: any) => {
      this.data = data;
      this.isLoading = false;
      this.dataempty = this.directoryservice.isArrayEmptyEvery(data);
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

  handleClick() {
    this.isLoadingButton = true; // Show loading indicator

    // Replace with your actual request logic
    this.directoryservice.cleanTrash().subscribe({
      next: (response) => {
        // Handle successful response
        window.location.reload();
      },
      error: (error) => {
        // Handle error
        console.error(error);
        this.isLoadingButton = false;
        alert('error!');
      },
    });
  }

  restorefile(id: string) {
    this.isLoading = true;
    this.directoryservice.restoreFile(id).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {
        // Handle error
        console.error(error);
        alert('error!');
      },
    });
  }

  restorefolder(id: string) {
    this.isLoading = true;
    this.directoryservice.restoreFolder(id).subscribe({
      next: (response) => {
        window.location.reload();
      },
      error: (error) => {
        // Handle error
        console.error(error);
        alert('error!');
      },
    });
  }
}
