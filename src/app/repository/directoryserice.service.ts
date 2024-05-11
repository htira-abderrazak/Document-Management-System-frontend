import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DirectorysericeService {
  private API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getRootFolders() {
    return this.http.get(this.API_URL + '/root-folders/');
  }

  getFolderContent(id: any) {
    return this.http.get(this.API_URL + '/folder-content/' + id + '/');
  }

  createFolder(name: string, parent: any) {
    const body = {
      name: name,
      parent: parent,
    };
    return this.http.post(this.API_URL + '/folder/', body);
  }

  createFile(data: FormData) {
    return this.http.post(this.API_URL + '/file/', data);
  }

  renameFolder(name: string, id: string) {
    const body = {
      name: name,
    };
    return this.http.put(this.API_URL + '/folder/' + id + '/', body);
  }

  deleteFolder(id: string) {
    return this.http.delete(this.API_URL + '/folder/' + id + '/');
  }

  renameFile(data: FormData, id: string) {
    return this.http.put(this.API_URL + '/file/' + id + '/', data);
  }

  deleteFile(id: string) {
    return this.http.delete(this.API_URL + '/file/' + id + '/');
  }

  GetnavigationPane() {
    return this.http.get(this.API_URL + '/navigation-pane/');
  }

  search(name: string) {
    return this.http.get(this.API_URL + '/search/' + name + '/');
  }

  getTrash() {
    return this.http.get(this.API_URL + '/trash/');
  }
  getFavorite() {
    return this.http.get(this.API_URL + '/favorite/');

  }
  addFoldertofavorite(id: string) {
    const body = {
      favorite: true,
    };
    return this.http.put(this.API_URL + '/folder/' + id + '/', body);
  }

  addFilertofavorite(id: string) {
    const body = {
      favorite: true,
    };
    return this.http.put(this.API_URL + '/file/' + id + '/', body);
  }

  getRecent() {
    return this.http.get(this.API_URL + '/recent/');
  }

  getTotalSize() {
    return this.http.get(this.API_URL + '/get-total-size/');
  }

  cleanTrash() {
    return this.http.delete(this.API_URL + '/clean/');
  }
  //return if the array of arrays is empty
  isArrayEmptyEvery(arr: any[]): boolean {
    return arr.every(element => element.length === 0);
  }
}
