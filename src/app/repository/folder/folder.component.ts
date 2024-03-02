import { LocalStorageService } from 'angular-web-storage';
import { CommonModule } from '@angular/common';
import { inject, Component, OnInit, TemplateRef } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { DirectorysericeService } from '../directoryserice.service';
import { Directory } from '../directory';
import { environment } from '../../../environments/environment';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NgbDropdownModule,
    NgbDatepickerModule,
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
})
export class FolderComponent implements OnInit {
  data: Directory;
  id: any;
  API_URL = `${environment.apiUrl}`;
  show_grid = true;
  private modalRef: any;
  private modalService = inject(NgbModal);
  closeResult='';
  constructor(
    private directoryserverce: DirectorysericeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private local: LocalStorageService
  ) {
    this.data = {
      adress: [],
      folders: [],
      id: '',
      files: [],
    };
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramId) => {
      this.id = paramId.get('id');
      this.directoryserverce
        .getFolderContent(this.id)
        .subscribe((data: any) => {
          this.data = data;
        });
      this.local.set('folder', this.id);
    });
  }
  open(content: TemplateRef<any>) {
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
  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  openfile(url: string) {
    window.open(this.API_URL + url, '_blank');
  }

  separateDateTime(time: any) {
    const dateTime = new Date(time);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours();

    return `${day}/${month}/${year} ${hour}:00`;
  }

  showGrid() {
    this.show_grid = true;
  }
  showList() {
    this.show_grid = false;
  }
  onRightClick(event: MouseEvent) {
    event.preventDefault(); 

    console.log('Right-clicked!');
  }
}
