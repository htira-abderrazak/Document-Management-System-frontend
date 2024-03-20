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
import { Folder } from '../folder';
import { error } from 'console';

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
  contextMenuItems: MenuModule[];
  selectedId = '';
  error = '';
  @ViewChild('content') modalrename!: TemplateRef<any>;

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
    this.contextMenuItems = [
      {
        label: 'rename',
        icon: 'pi pi-edit',
        command: () => this.open(this.modalrename),
      },
      { label: 'Delete', icon: 'pi pi-times' },
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

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    console.log('Context Menu Event:', event);
  }

  // open folder with context menu
  // openFolder() {
  //   this.router.navigate(['/folder/' + this.local.get('selectedFolder')]);
  // }

  handleMenuClick(event: MouseEvent, id: string): void {
    event.preventDefault(); // Prevent the default behavior of routerLink
    event.stopPropagation(); // Stop event propagation to prevent navigating to the folder route
    this.local.set('selectedFolder', id); // set the id in the localstorge to manage the folder selected
  }

  //modal rename
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
    this.error = ""
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
  rename(name: any, isfolder: boolean) {
    if (isfolder == true) {
      this.directoryserverce
        .renameFolder(name, this.local.get('selectedFolder'))
        .subscribe(
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
  }

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
}
