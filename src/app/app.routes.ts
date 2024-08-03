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
import { authGuard } from './guard/auth.guard';
import { signGuard } from './guard/sign.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { StorageComponent } from './repository/storage/storage.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LogginComponent,canActivate: [signGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,canActivate: [signGuard]
  },

  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'mydrive', pathMatch: 'full' },
      {
        path: 'folder/:id',
        component: FolderComponent,
        canActivate: [authGuard],
      },
      { path: 'mydrive', component: MyDiskComponent, canActivate: [authGuard] },
      {
        path: 'search/:name',
        component: SearchComponent,
        canActivate: [authGuard],
      },
      { path: 'trash', component: TrashComponent, canActivate: [authGuard] },
      {
        path: 'favorite',
        component: FavoriteComponent,
        canActivate: [authGuard],
      },
      { path: 'recent', component: RecentComponent, canActivate: [authGuard] },
      { path: 'storage', component: StorageComponent, canActivate: [authGuard] },

    ],

  },  {
    path: '**',
    component: NotFoundComponent
  },
];
