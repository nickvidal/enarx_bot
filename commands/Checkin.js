"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCheckinCommand = void 0;
const CheckinModal_1 = require("../modals/CheckinModal");
async function processCheckinCommand(app, context, read, modify, persistence, params) {
    if (params && params.length > 0 && params[0].trim()) {
        const firstParam = params.shift();
        if (firstParam === 'score') {
            return await app.enarxCheckin.sendKarmaScoreboard({ read, modify, room: context.getRoom(), user: context.getSender(), checkines: true, checkinrs: true });
        }
    }
    const triggerId = context.getTriggerId();
    if (triggerId) {
        try {
            const modal = await CheckinModal_1.checkinModal({ app, read, modify, data: { user: context.getSender() } });
            await modify.getUiController().openModalView(modal, { triggerId }, context.getSender());
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.processCheckinCommand = processCheckinCommand;
