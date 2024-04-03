import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FolderComponent } from './repository/folder/folder.component';
import { MyDiskComponent } from './repository/my-disk/my-disk.component';
import { SearchComponent } from './repository/search/search.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'mydrive', pathMatch: 'full' },
      { path: 'folder/:id', component: FolderComponent },
      { path: 'mydrive', component: MyDiskComponent },
      { path: 'search/:name', component : SearchComponent}
    ],
  },

];
