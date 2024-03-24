import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { retry } from 'rxjs';

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
}
