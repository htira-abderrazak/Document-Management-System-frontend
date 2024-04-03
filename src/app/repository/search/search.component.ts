import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { DirectorysericeService } from '../directoryserice.service';
import { Directory } from '../directory';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  name: any;
  data = [];

  constructor(
    private directoryservice: DirectorysericeService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramId) => {
      this.name = paramId.get('name');
      this.directoryservice.search(this.name).subscribe((data: any) => {
        this.data = data;
      });
    });
    console.log(this.data);
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
