"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = exports.sendMessage = exports.getMembers = exports.getDirect = exports.random = void 0;
const rooms_1 = require("@rocket.chat/apps-engine/definition/rooms");
const MembersCache_1 = require("../MembersCache");
function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}
exports.random = random;
async function getDirect(app, read, modify, username) {
    if (app.botUsername) {
        const usernames = [app.botUsername, username];
        let room;
        try {
            room = await read.getRoomReader().getDirectByUsernames(usernames);
        }
        catch (error) {
            app.getLogger().log(error);
            return;
        }
        if (room) {
            return room;
        }
        else if (app.botUser) {
            let roomId;
            const newRoom = modify.getCreator().startRoom()
                .setType(rooms_1.RoomType.DIRECT_MESSAGE)
                .setCreator(app.botUser)
                .setUsernames(usernames);
            roomId = await modify.getCreator().finish(newRoom);
            return await read.getRoomReader().getById(roomId);
        }
    }
    return;
}
exports.getDirect = getDirect;
async function getMembers(app, read) {
    if (app.membersCache && app.membersCache.isValid()) {
        return app.membersCache.members;
    }
    let members;
    if (app.enarxMembersRoom) {
        try {
            members = await read.getRoomReader().getMembers(app.enarxMembersRoom.id);
        }
        catch (error) {
            app.getLogger().log(error);
        }
        app.membersCache = new MembersCache_1.MembersCache(members);
    }
    return members.filter((member) => member.username !== 'rocket.cat' && member.username !== app.botUsername) || [];
}
exports.getMembers = getMembers;
async function sendMessage(app, modify, room, message, attachments, blocks) {
    const msg = modify.getCreator().startMessage()
        .setGroupable(false)
        .setSender(app.botUser)
        .setUsernameAlias(app.enarxName)
        .setEmojiAvatar(app.enarxEmojiAvatar)
        .setRoom(room);
    if (message && message.length > 0) {
        msg.setText(message);
    }
    if (attachments && attachments.length > 0) {
        msg.setAttachments(attachments);
    }
    if (blocks !== undefined) {
        msg.setBlocks(blocks);
    }
    try {
        await modify.getCreator().finish(msg);
    }
    catch (error) {
        app.getLogger().log(error);
    }
}
exports.sendMessage = sendMessage;
async function notifyUser(app, modify, room, user, message, attachments) {
    const msg = modify.getCreator().startMessage()
        .setSender(app.botUser)
        .setUsernameAlias(app.enarxName)
        .setEmojiAvatar(app.enarxEmojiAvatar)
        .setText(message)
        .setRoom(room)
        .getMessage();
    try {
        await modify.getNotifier().notifyUser(user, msg);
    }
    catch (error) {
        app.getLogger().log(error);
    }
}
exports.notifyUser = notifyUser;
