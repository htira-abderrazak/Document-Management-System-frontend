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
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { PrimeNGConfig } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavigationPaneComponent } from '../navigation-pane/navigation-pane.component';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ChatbotComponent } from '../../chatbot/chatbot.component';
import { ChatbotIcons } from '../../chatbot/interfaces/library.interface';
interface TreeNode {
  id: string;
  name: string;
  content: TreeNode[];
}
@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    ContextMenuModule,
    MenuModule,
    ReactiveFormsModule,
    NavigationPaneComponent,
    ChatbotComponent,
  ],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
})
export class FolderComponent implements OnInit {
  @ViewChild('contextMenufolders') contextMenufolders!: ContextMenu;
  @ViewChild('contextMenufiles') contextMenufiles!: ContextMenu;

  icons: ChatbotIcons = {
    chatbotIcon: 'assets/icons/chatbot.svg',
    userIcon: 'assets/icons/user.svg',
  };
  basePath: string = 'http://localhost:3800/message';
  private unsubscribe$ = new Subject<void>();
  tree_data: TreeNode[] = [];
  data: Directory;
  id: any;
  API_URL = `${environment.apiUrl}`;
  show_grid!: string;
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
  @ViewChild('movefile') modalmovefile!: TemplateRef<any>;

  tree: any;
  isLoading = true;
  dataempty = false;
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
      {
        label: 'favorite',
        command: () => this.addFolderToFavorite(this.selectedid),
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
      {
        label: 'favorite',
        command: () => this.addFileToFavorite(this.selectedid),
      },
      {
        label: 'move',
        command: () => {
          this.directoryserverce.getFoldertree().subscribe({
            next: (data: any) => {
              this.tree_data = data;
              this.open(this.modalmovefile);
            },
          });
        },
      },
    ];
  }

  ngOnInit(): void {
    if (this.local.get('show_grid') == null) {
      this.local.set('show_grid', 'true');
    }
    this.show_grid = this.local.get('show_grid');
    this.primengConfig.ripple = true;

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramId) => {
        this.isLoading = true;
        this.id = paramId.get('id');
        this.directoryserverce
          .getFolderContent(this.id)
          .subscribe((data: any) => {
            this.data = data;
            this.isLoading = false;
            this.dataempty = this.directoryserverce.isArrayEmptyEvery(data);
          });
        this.local.set('folder', this.id);
      });
    this.directoryserverce.GetnavigationPane().subscribe((data: any) => {
      this.tree = data;
    });
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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
    this.directoryserverce.renameFolder(name, this.selectedid).subscribe({
      next: (data: any) => {
        window.location.reload();
        this.modalService.dismissAll();
      },
      error: (error) => {
        if (error.status == '400') this.error = 'name already exist';
        else this.error = 'error try later';
      },
    });
  }

  renamefile(name: any) {
    const Data = new FormData();

    Data.append('name', name);
    this.directoryserverce.renameFile(Data, this.selectedid).subscribe({
      next: (data: any) => {
        window.location.reload();
        this.modalService.dismissAll();
      },
      error: (error) => {
        if (error.status == '400') this.error = 'name already exist';
        else this.error = 'error try later';
      },
    });
  }
  //open file
  openfile(url: string) {
    window.open(url, '_blank');
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
    this.show_grid = 'true';
    this.local.set('show_grid', 'true');
  }
  showList() {
    this.show_grid = 'false';
    this.local.set('show_grid', 'false');
  }

  //delete folder
  deleteFolder(name: any, id: any) {
    if (confirm('Are you sure to delete the folder ' + name + '?')) {
      this.directoryserverce.deleteFolder(id).subscribe({
        next: () => {
          alert('deleted successfully!');
          this.data.folders.splice(
            this.data.folders.findIndex((obj) => obj.id === id),
            1
          );
        },
        error: (error) => {
          if (error.status == '400') this.error = 'name already exist';
          alert('error!');
        },
      });
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
      this.directoryserverce.deleteFile(id).subscribe({
        next: () => {
          alert('deleted successfully!');
          this.data.files.splice(
            this.data.files.findIndex((obj) => obj.id === id),
            1
          );
        },
        error: (error) => {
          if (error.status == '400') this.error = 'name already exist';
          alert('error!');
        },
      });
    }
  }
  showContextMenubyleftClickfolders(event: MouseEvent) {
    this.contextMenufolders.show(event); // Show the context menu at the click event coordinatese
  }
  showContextMenubyleftClickfiles(event: MouseEvent) {
    this.contextMenufiles.show(event); // Show the context menu at the click event coordinatese
  }
  addFileToFavorite(id: string) {
    this.directoryserverce.addFilertofavorite(id).subscribe({
      next: () => {
        alert('added successfully!');
      },
      error: (error) => {
        alert('error!');
      },
    });
  }

  addFolderToFavorite(id: string) {
    this.directoryserverce.addFoldertofavorite(id).subscribe({
      next: () => {
        alert('added successfully!');
      },
      error: (error) => {
        alert('error!');
      },
    });
  }

  expandedNodes = new Set<string>();
  selectedNodeId: string | null = null;

  toggleExpand(nodeId: string): void {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  isExpanded(nodeId: string): boolean {
    return this.expandedNodes.has(nodeId);
  }

  onCheckboxClick(nodeId: string): void {
    // If clicking the same checkbox, deselect it
    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = null;
    } else {
      // Select the new node (automatically deselects previous)
      this.selectedNodeId = nodeId;
    }
  }

  isSelected(nodeId: string): boolean {
    return this.selectedNodeId === nodeId;
  }

  hasContent(node: TreeNode): boolean {
    return node.content && node.content.length > 0;
  }

  moveFileToAnotherFolder() {
    console.log(this.selectedNodeId!, this.selectedid);
    this.directoryserverce
      .movefile(this.selectedNodeId!, this.selectedid)
      .subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          alert('error');
        },
      });
  }

  onGrandchildTriggered() {
    if (this.local.get('show_grid') == null) {
      this.local.set('show_grid', 'true');
    }
    this.show_grid = this.local.get('show_grid');
    this.primengConfig.ripple = true;

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((paramId) => {
        this.isLoading = true;
        this.id = paramId.get('id');
        this.directoryserverce
          .getFolderContent(this.id)
          .subscribe((data: any) => {
            this.data = data;
            this.isLoading = false;
            this.dataempty = this.directoryserverce.isArrayEmptyEvery(data);
          });
        this.local.set('folder', this.id);
      });
    this.directoryserverce.GetnavigationPane().subscribe((data: any) => {
      this.tree = data;
    });
  }
}
