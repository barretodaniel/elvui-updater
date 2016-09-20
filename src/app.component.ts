import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
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
        this.compareVersions();
      });
    });

    ipcRenderer.on('update-done', (event) => {
      ipcRenderer.send('set-latest-version', this.latest);
      this._versionService.getCurrentVersion();
    });

    ipcRenderer.on('error', (event, message: string) => {
      const toast = document.getElementById('error-toast');
      toast.MaterialSnackbar.showSnackbar({ message });
    });
    this.getVersions();
  }

  ngOnDestroy() {
    ipcRenderer.removeAllListeners();
  }

  private compareVersions() {
    this.versionEqual = this.latest === this.current;
    this.footerMessage = this.versionEqual
      ? 'Package is up to date'
      : 'An update is available';
  }

  getLatestVersion(): Promise<void> {
    this.footerMessage = 'Checking for updates';
    return this._versionService.getLatestVersion().then(version => {
      this.latest = version;
      this.compareVersions();
    });
  }

  private getVersions() {
    this.getLatestVersion().then(() => {
      this._versionService.getCurrentVersion();
    });
  }

  update() {
    this.footerMessage = 'Updating...';
    ipcRenderer.send('update');
  }
}