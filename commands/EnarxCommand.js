"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnarxCommand = void 0;
const helpers_1 = require("../lib/helpers");
const Checkin_1 = require("./Checkin");
class EnarxCommand {
    constructor(app) {
        this.app = app;
        this.command = 'enarx';
        this.i18nParamsExample = 'Enarx_Params';
        this.i18nDescription = 'Enarx_Description';
        this.providesPreview = false;
        this.CommandEnum = {
            Help: 'help',
            Checkin: 'checkin',
            Send: 'send',
        };
    }
    async executor(context, read, modify, http, persistence) {
        const members = await helpers_1.getMembers(this.app, read);
        const sender = context.getSender();
        const room = context.getRoom();
        if (!(members.some((member) => member.username === sender.username))) {
            return await helpers_1.notifyUser(this.app, modify, room, sender, `You are not allowed to run this command.`);
        }
        const [command, ...params] = context.getArguments();
        if (!command) {
            return await Checkin_1.processCheckinCommand(this.app, context, read, modify, persistence, params);
        }
        switch (command) {
            case this.CommandEnum.Checkin:
                await Checkin_1.processCheckinCommand(this.app, context, read, modify, persistence, params);
                break;
            default:
                await Checkin_1.processCheckinCommand(this.app, context, read, modify, persistence, params);
        }
    }
}
exports.EnarxCommand = EnarxCommand;
