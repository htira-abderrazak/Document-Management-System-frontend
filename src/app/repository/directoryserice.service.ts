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
      "name" :name,
      "parent" : parent
    }
    return this.http.post(this.API_URL+'/folder/',body)
  }
  createFile(data: FormData) {
    return this.http.post(this.API_URL+'/file/',data)
  }
}
