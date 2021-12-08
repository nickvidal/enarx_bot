"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckinEndpoint = void 0;
const api_1 = require("@rocket.chat/apps-engine/definition/api");
class CheckinEndpoint extends api_1.ApiEndpoint {
    constructor(app) {
        super(app);
        this.app = app;
        this.path = 'checkin';
    }
    async post(request, endpoint, read, modify, http, persistence) {
        var _a, _b;
        this.app.enarxCheckin.run(read, modify, persistence, undefined, (_a = request.query) === null || _a === void 0 ? void 0 : _a.text, (_b = request.query) === null || _b === void 0 ? void 0 : _b.sendScoreBoard);
        return this.success();
    }
}
exports.CheckinEndpoint = CheckinEndpoint;
