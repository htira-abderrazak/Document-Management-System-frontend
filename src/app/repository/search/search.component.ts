import { Component, OnInit, OnDestroy } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { DirectorysericeService } from '../directoryserice.service';
import { Directory } from '../directory';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  name: any;
  data : any;
  isLoading = true;
  dataempty = false;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private directoryservice: DirectorysericeService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe when component is destroyed
      .subscribe(paramId => {
        this.isLoading = true; // Reset loading state on param change
        this.name = paramId.get('name');

        this.directoryservice.search(this.name)
          .subscribe((data : any) => {
            this.data = data;
            this.isLoading = false;
            this.dataempty = this.directoryservice.isArrayEmptyEvery(data);
          });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
