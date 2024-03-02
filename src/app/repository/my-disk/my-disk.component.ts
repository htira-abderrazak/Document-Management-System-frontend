import { Component, Input, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DirectorysericeService } from '../directoryserice.service';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-my-disk',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './my-disk.component.html',
  styleUrl: './my-disk.component.css',
})
export class MyDiskComponent implements OnInit {
  @Input() reloadRequested: boolean = false;

  folders: any;
  constructor(
    private directoryservice: DirectorysericeService,
    private local: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.directoryservice.getRootFolders().subscribe((data: any) => {
      this.folders = data;
    });
    this.local.set('folder', '');
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
