import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'path';
import { AppComponent } from './app.component';
import { FolderComponent } from './repository/folder/folder.component';
import { HomeComponent } from './home/home.component';
import { MyDiskComponent } from './repository/my-disk/my-disk.component';
import { NavigationPaneComponent } from './repository/navigation-pane/navigation-pane.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'mydrive', pathMatch: 'full' },
      { path: 'folder/:id', component: FolderComponent },
      { path: 'mydrive', component: MyDiskComponent },
    ],
  },
{  path :'pane', component : NavigationPaneComponent,
}

];
