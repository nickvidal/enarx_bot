"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processHelpCommand = void 0;
const helpers_1 = require("../lib/helpers");
async function processHelpCommand(app, context, read, modify) {
    const sender = context.getSender();
    const room = await helpers_1.getDirect(app, read, modify, sender.username);
    const message = `These are the commands I can understand:
        \`/enarx checkin\` Starts a new checkin message
        \`/enarx help\` Shows this message`;
    await helpers_1.sendMessage(app, modify, room, message);
}
exports.processHelpCommand = processHelpCommand;
