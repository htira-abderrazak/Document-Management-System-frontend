import { LocalStorageService } from 'angular-web-storage';
import { CommonModule } from '@angular/common';
import {
  inject,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
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
import { ContextMenuModule } from 'primeng/contextmenu';
import { PrimeNGConfig } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    ContextMenuModule,
    MenuModule,
    ReactiveFormsModule,
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
  closeResult = '';
  name = new FormControl('');
  contextMenuItemsFolders: MenuModule[];
  contextMenuItemsFiles: MenuModule[];

  error = '';
  selectedname: any; //the name selected to edit file or folder
  selectedid: any; //the id selected to edit file or folder
  @ViewChild('renameFolder') modalrenamefolder!: TemplateRef<any>;
  @ViewChild('renameFile') modalrenamefile!: TemplateRef<any>;

  constructor(
    private directoryserverce: DirectorysericeService,
    private activatedRoute: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private local: LocalStorageService
  ) {
    this.data = {
      adress: [],
      folders: [],
      id: '',
      files: [],
    };
    this.contextMenuItemsFolders = [
      {
        label: 'rename',
        command: () => this.open(this.modalrenamefolder),
      },
      {
        label: 'Delete',
        command: (event: any) => {
          this.deleteFolder(this.selectedname, this.selectedid);
        },
      },
    ];
    this.contextMenuItemsFiles = [
      {
        label: 'rename',
        command: () => this.open(this.modalrenamefile),
      },
      {
        label: 'Delete',
        command: (event: any) => {
          this.deleteFile(this.selectedname, this.selectedid);
        },
      },
    ];
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

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

  handleMenuClick(event: MouseEvent, id: string): void {
    event.preventDefault(); // Prevent the default behavior of routerLink
    event.stopPropagation(); // Stop event propagation to prevent navigating to the folder route
  }

  //modal open
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

  renamefolder(name: any) {
    this.directoryserverce.renameFolder(name, this.selectedid).subscribe(
      (data: any) => {
        window.location.reload();
        this.modalService.dismissAll();
      },
      (error) => {
        if (error.status == '400') this.error = 'name already exist';
        else this.error = 'error try later';
      }
    );
  }

  renamefile(name: any) {
    const Data = new FormData();

    Data.append('name', name);
    this.directoryserverce.renameFile(Data, this.selectedid).subscribe(
      (data: any) => {
        window.location.reload();
        this.modalService.dismissAll();
      },
      (error) => {
        if (error.status == '400') this.error = 'name already exist';
        else this.error = 'error try later';
      }
    );
  }
  //open file
  openfile(url: string) {
    window.open(this.API_URL + url, '_blank');
  }

  // remove seconds and minutes froim date
  separateDateTime(time: any) {
    const dateTime = new Date(time);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours();

    return `${day}/${month}/${year} ${hour}:00`;
  }

  //show folders and  files in grid or liste
  showGrid() {
    this.show_grid = true;
  }
  showList() {
    this.show_grid = false;
  }

  //delete folder
  deleteFolder(name: any, id: any) {
    if (confirm('Are you sure to delete the folder ' + name + '?')) {
      this.directoryserverce.deleteFolder(id).subscribe(
        () => {
          alert('deleted successfully!');
          this.data.folders.splice(
            this.data.folders.findIndex((obj) => obj.id === id),
            1
          );
        },
        (error) => {
          if (error.status == '400') this.error = 'name already exist';
          alert('error!');
        }
      );
    }
  }

  //function excute when the context menu show
  showContextMenu(itemname: any, itemid: any) {
    this.selectedid = itemid;
    this.selectedname = itemname;
  }

  //delete file
  deleteFile(name: any, id: any) {
    if (confirm('Are you sure to delete the file ' + name + '?')) {
      this.directoryserverce.deleteFile(id).subscribe(
        () => {
          alert('deleted successfully!');
          this.data.folders.splice(
            this.data.files.findIndex((obj) => obj.id === id),
            1
          );
        },
        (error) => {
          if (error.status == '400') this.error = 'name already exist';
          alert('error!');
        }
      );
    }
  }
}
