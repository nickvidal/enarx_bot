"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersCache = void 0;
class MembersCache {
    constructor(members) {
        this._expirationTime = 300000;
        this._members = members;
        this._expire = Date.now() + this._expirationTime;
        return this;
    }
    isValid() {
        return this._expire > Date.now();
    }
    get members() {
        return this._members;
    }
}
exports.MembersCache = MembersCache;
