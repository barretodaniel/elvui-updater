import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { ipcRenderer } from 'electron';

import { VersionService } from './version.service';

@Component({
  // moduleId: module.id,
  selector: 'app',
  templateUrl: 'src/app.component.html',
  providers: [ VersionService ]
})
export class AppComponent implements OnInit, OnDestroy {
  latest: number;
  current: number;
  versionEqual: boolean;
  footerMessage: string;

  constructor(private _versionService: VersionService, private _ngZone: NgZone) {
    this.versionEqual = true;
  }

  ngOnInit() {
    ipcRenderer.on('version-reply', (event, version: number) => {
      this._ngZone.run(() => {
        this.current = version;
        this.versionEqual = this.latest === this.current;
        this.footerMessage = this.versionEqual
          ? 'Package is up to date'
          : 'An update is available';
      });
    });

    ipcRenderer.on('update-done', (event) => {
      this._versionService.getCurrentVersion();
      ipcRenderer.send('set-latest-version', this.latest);
    });
    this.getVersions();
  }

  ngOnDestroy() {
    ipcRenderer.removeAllListeners();
  }

  getVersions() {
    this._versionService.getLatestVersion().then(version => {
      this.latest = version;
      this._versionService.getCurrentVersion();
    });
  }

  update() {
    ipcRenderer.send('update');
  }
}