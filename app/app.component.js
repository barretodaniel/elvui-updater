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
var core_1 = require('@angular/core');
var electron_1 = require('electron');
var version_service_1 = require('./version.service');
var AppComponent = (function () {
    function AppComponent(_versionService, _ngZone) {
        this._versionService = _versionService;
        this._ngZone = _ngZone;
        this.versionEqual = true;
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        electron_1.ipcRenderer.on('version-reply', function (event, version) {
            _this._ngZone.run(function () {
                _this.current = version;
                _this.versionEqual = _this.latest === _this.current;
                _this.footerMessage = _this.versionEqual
                    ? 'Package is up to date'
                    : 'An update is available';
            });
        });
        electron_1.ipcRenderer.on('update-done', function (event) {
            _this._versionService.getCurrentVersion();
            electron_1.ipcRenderer.send('set-latest-version', _this.latest);
        });
        this.getVersions();
    };
    AppComponent.prototype.ngOnDestroy = function () {
        electron_1.ipcRenderer.removeAllListeners();
    };
    AppComponent.prototype.getVersions = function () {
        var _this = this;
        this._versionService.getLatestVersion().then(function (version) {
            _this.latest = version;
            _this._versionService.getCurrentVersion();
        });
    };
    AppComponent.prototype.update = function () {
        electron_1.ipcRenderer.send('update');
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
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map