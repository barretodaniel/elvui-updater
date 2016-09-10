"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const electron_1 = require('electron');
const version_service_1 = require('./version.service');
let AppComponent = class AppComponent {
    constructor(_versionService, _ngZone) {
        this._versionService = _versionService;
        this._ngZone = _ngZone;
        this.versionEqual = true;
    }
    ngOnInit() {
        electron_1.ipcRenderer.on('version-reply', (event, version) => {
            this._ngZone.run(() => {
                this.current = version;
                this.compareVersions();
            });
        });
        electron_1.ipcRenderer.on('update-done', (event) => {
            electron_1.ipcRenderer.send('set-latest-version', this.latest);
            this._versionService.getCurrentVersion();
        });
        this.getVersions();
    }
    ngOnDestroy() {
        electron_1.ipcRenderer.removeAllListeners();
    }
    compareVersions() {
        this.versionEqual = this.latest === this.current;
        this.footerMessage = this.versionEqual
            ? 'Package is up to date'
            : 'An update is available';
    }
    getLatestVersion() {
        this.footerMessage = 'Checking for updates';
        return this._versionService.getLatestVersion().then(version => {
            this.latest = version;
            this.compareVersions();
        });
    }
    getVersions() {
        this.getLatestVersion().then(() => {
            this._versionService.getCurrentVersion();
        });
    }
    update() {
        electron_1.ipcRenderer.send('update');
    }
};
AppComponent = __decorate([
    core_1.Component({
        // moduleId: module.id,
        selector: 'app',
        templateUrl: 'src/app.component.html',
        providers: [version_service_1.VersionService]
    }), 
    __metadata('design:paramtypes', [version_service_1.VersionService, core_1.NgZone])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map