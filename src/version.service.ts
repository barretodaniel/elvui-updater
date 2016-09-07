import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { ipcRenderer } from 'electron';

@Injectable()
export class VersionService {

  constructor(private _http: Http) { }

  getLatestVersion(): Promise<number> {
    const test = /<a href=\"http:\/\/www.tukui.org\/downloads\/elvui-[0-9]{2}.[0-9]{2}/g;
    return this._http.get('http://www.tukui.org/dl.php')
      .toPromise()
      .then(response => parseFloat(test.exec(response.text())[0].split('-').pop()));
  }

  getCurrentVersion(): void {
    ipcRenderer.send('version');
  }
}