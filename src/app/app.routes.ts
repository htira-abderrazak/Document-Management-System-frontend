import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FolderComponent } from './repository/folder/folder.component';
import { MyDiskComponent } from './repository/my-disk/my-disk.component';
import { SearchComponent } from './repository/search/search.component';
import { TrashComponent } from './repository/trash/trash.component';
import { FavoriteComponent } from './repository/favorite/favorite.component';
import { RecentComponent } from './repository/recent/recent.component';
import { LogginComponent } from './auth/loggin/loggin.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LogginComponent,
  },
  {
    path: 'signup',
    component:SignupComponent ,
  },

  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'mydrive', pathMatch: 'full' },
      { path: 'folder/:id', component: FolderComponent },
      { path: 'mydrive', component: MyDiskComponent },
      { path: 'search/:name', component: SearchComponent },
      { path: 'trash', component: TrashComponent },
      { path: 'favorite', component: FavoriteComponent },
      { path: 'recent', component: RecentComponent },
    ],
  },
];
