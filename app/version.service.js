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
const http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
const electron_1 = require('electron');
let VersionService = class VersionService {
    constructor(_http) {
        this._http = _http;
    }
    getLatestVersion() {
        const test = /<a href=\"http:\/\/www.tukui.org\/downloads\/elvui-[0-9]{2}.[0-9]{2}/g;
        return this._http.get('http://www.tukui.org/dl.php')
            .toPromise()
            .then(response => parseFloat(test.exec(response.text())[0].split('-').pop()));
    }
    getCurrentVersion() {
        electron_1.ipcRenderer.send('version');
    }
};
VersionService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [http_1.Http])
], VersionService);
exports.VersionService = VersionService;
//# sourceMappingURL=version.service.js.map