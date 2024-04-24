import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

import {
  ModalDismissReasons,
  NgbModal,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';

import { FolderComponent } from '../repository/folder/folder.component';
import { MyDiskComponent } from '../repository/my-disk/my-disk.component';
import { DirectorysericeService } from '../repository/directoryserice.service';

import { LocalStorageService } from 'angular-web-storage';

import { timer, fromEvent } from 'rxjs';
import { takeUntil, mergeMap, tap } from 'rxjs/operators';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FolderComponent,
    RouterOutlet,
    RouterModule,
    MyDiskComponent,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    NgbProgressbarModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showChild: boolean = true;
  private modalService = inject(NgbModal);
  private modalRef: any;
  closeResult = '';
  error = '';
  name = new FormControl('');
  search_name = new FormControl('');
  isActiveRoute: boolean = false;

  size: number = 0;
  constructor(
    private router: Router,
    private directoryService: DirectorysericeService,
    private local: LocalStorageService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(){
    this.directoryService.getTotalSize().subscribe((data:any) => {
      this.size = data
    })
  }
  open(content: TemplateRef<any>) {
    const childRoute = this.activatedRoute.firstChild;
    //open modal to crate folder only when the route is "drive" of "folder"
    if (
      childRoute!.snapshot.url[0].path == 'folder' ||
      childRoute!.snapshot.url[0].path == 'drive'
    ) {
      this.modalRef = this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  private getDismissReason(reason: any): string {
    this.error = '';
    this.name.setValue('');
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  reloadChild() {
    this.showChild = false;
    setTimeout(() => {
      this.showChild = true;
    }, 0);
  }
  createFolder(name: any): void {
    this.directoryService
      .createFolder(name, this.local.get('folder'))
      .subscribe(
        (data) => {
          this.reloadChild();
          this.modalService.dismissAll();
        },
        (error) => (this.error = error.error.name)
      );
  }

  closeWindow() {
    const myDiv = document.getElementById('myDiv') as HTMLElement;
    if (myDiv) {
      myDiv.style.display = 'none';
    }
    this.resetDiv();
  }
  showWindow() {
    const myDiv = document.getElementById('myDiv') as HTMLElement;
    if (myDiv) {
      myDiv.style.display = 'block';
    }
  }

  showSuccessMessage() {
    this.hideSpinner();
    const successfull_message = document.getElementById(
      'successfull-message'
    ) as HTMLElement;
    const loading_message = document.getElementById(
      'loading-message'
    ) as HTMLElement;

    if (successfull_message && loading_message) {
      loading_message.style.display = 'none';
      successfull_message.style.display = 'block';
    }
  }

  showSpinner() {
    const spinner = document.getElementById('spinner') as HTMLElement;
    if (spinner) spinner.style.display = 'block';
  }

  hideSpinner() {
    const spinner = document.getElementById('spinner') as HTMLElement;
    if (spinner) spinner.style.display = 'none';
  }

  resetDiv() {
    this.showSpinner();
    const successfull_message = document.getElementById(
      'successfull-message'
    ) as HTMLElement;
    const loading_message = document.getElementById(
      'loading-message'
    ) as HTMLElement;
    const error_message = document.getElementById(
      'error-message'
    ) as HTMLElement;
    const error_name_message = document.getElementById(
      'error-name-message'
    ) as HTMLElement;
    if (successfull_message && loading_message && error_message) {
      loading_message.style.display = 'block';
      successfull_message.style.display = 'none';
      error_message.style.display = 'none';
      error_name_message.style.display = 'none';
    }
  }
  showerrormessage() {
    this.hideSpinner();
    const loading_message = document.getElementById(
      'loading-message'
    ) as HTMLElement;
    const error_message = document.getElementById(
      'error-message'
    ) as HTMLElement;
    if (error_message && loading_message) {
      error_message.style.display = 'block';
      loading_message.style.display = 'none';
    }
  }
  showrrorNamemessage() {
    this.hideSpinner();
    const loading_message = document.getElementById(
      'loading-message'
    ) as HTMLElement;
    const error_message = document.getElementById(
      'error-name-message'
    ) as HTMLElement;
    if (error_message && loading_message) {
      error_message.style.display = 'block';
      loading_message.style.display = 'none';
    }
  }
  onFileChange(event: any) {
    const childRoute = this.activatedRoute.firstChild;
    //crate file only when the route is "drive" of "folder"
    if (
      childRoute!.snapshot.url[0].path == 'folder' ||
      childRoute!.snapshot.url[0].path == 'drive'
    ) {
      const files = event.target.files;
      if (files && files.length > 0) {
        this.showWindow(); // Show the div immediately

        const uploadData = new FormData();
        uploadData.append('file', files[0]);
        uploadData.append('name', files[0].name);
        uploadData.append('directory', this.local.get('folder'));

        this.directoryService
          .createFile(uploadData)
          .pipe(
            // Show success message after complete:
            tap(() => {
              this.showSuccessMessage();
              this.reloadChild();
            }),
            // Close the div after 3 seconds:
            mergeMap(() => timer(3000)),
            takeUntil(fromEvent(document, 'click'))
          )
          .subscribe({
            error: (error) => {
              if (error.status == '400') this.showrrorNamemessage();
              else this.showerrormessage();
            },
          });
      }
      this.resetDiv();
    }
  }

  submit(event: Event) {
    this.router.navigate(['/search/', this.search_name.value]);
  }
}
