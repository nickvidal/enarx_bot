"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnarxCheckin = void 0;
const metadata_1 = require("@rocket.chat/apps-engine/definition/metadata");
const buffer_1 = require("buffer");
const CheckinBlocks_1 = require("../blocks/CheckinBlocks");
const helpers_1 = require("../lib/helpers");
const CheckinModal_1 = require("../modals/CheckinModal");
class EnarxCheckin {
    constructor(app) {
        this.app = app;
        this.sendScore = false;
    }
    async run(read, modify, persistence, user, checkinQuestion, sendScoreBoard) {
        let members = await helpers_1.getMembers(this.app, read);
        if (members && this.app.botUser !== undefined && this.app.enarxMembersRoom !== undefined && this.app.enarxPostCheckinRoom !== undefined) {
            const checkinQuestions = [
                'Hello, would you like to check-in today?',
            ];
            const text = checkinQuestion ? checkinQuestion : checkinQuestions[helpers_1.random(0, checkinQuestions.length - 1)];
            if (user !== undefined) {
                members = [user];
            }
            for (const member of members) {
                if (member.id === this.app.botUser.id) {
                    continue;
                }
                const room = await helpers_1.getDirect(this.app, read, modify, member.username);
                const blocks = CheckinBlocks_1.createCheckinBlocks(modify, text);
                await helpers_1.sendMessage(this.app, modify, room, text, [], blocks);
            }
            if (sendScoreBoard === 'checkinrs') {
                await this.sendKarmaScoreboard({ read, modify, room: this.app.enarxPostCheckinRoom, checkines: false, checkinrs: true });
            }
            else if (sendScoreBoard === 'all') {
                await this.sendKarmaScoreboard({ read, modify, room: this.app.enarxPostCheckinRoom, checkines: true, checkinrs: true });
            }
        }
        return;
    }
    async sendKarmaScoreboard({ read, modify, room, user, checkinrs, checkines }) {
        let output = '';
        if (checkinrs !== false) {
            const checkinrKarmaAssoc = new metadata_1.RocketChatAssociationRecord(metadata_1.RocketChatAssociationModel.MISC, 'checkinrKarma');
            const checkinrKarmaData = await read.getPersistenceReader().readByAssociation(checkinrKarmaAssoc);
            if (checkinrKarmaData && checkinrKarmaData.length > 0 && checkinrKarmaData[0]) {
                const checkinrKarma = checkinrKarmaData[0];
                const checkinrSortable = [];
                for (const key in checkinrKarma) {
                    if (checkinrKarma.hasOwnProperty(key)) {
                        checkinrSortable.push([key, checkinrKarma[key]]);
                    }
                }
                checkinrSortable.sort((a, b) => b[1] - a[1]);
                output += '*These are the people who checked-in the most (top 10)*:\n';
                const emojis = [':first_place: ', ':second_place: ', ':third_place: '];
                let countUsers = 0;
                let count = -1;
                let last;
                for (const key in checkinrSortable) {
                    countUsers++;
                    if (countUsers > 10) {
                        break;
                    }
                    if (checkinrSortable.hasOwnProperty(key)) {
                        if (last !== checkinrSortable[key][1]) {
                            count++;
                        }
                        const username = buffer_1.Buffer.from(checkinrSortable[key][0], 'base64').toString('utf8');
                        output += `${emojis[count] ? emojis[count] : ':reminder_ribbon: '}${username}: ${checkinrSortable[key][1]}\n`;
                        last = checkinrSortable[key][1];
                    }
                }
            }
        }
        if (checkines !== false) {
            const karmaAssoc = new metadata_1.RocketChatAssociationRecord(metadata_1.RocketChatAssociationModel.MISC, 'karma');
            const karmaData = await read.getPersistenceReader().readByAssociation(karmaAssoc);
            if (karmaData && karmaData.length > 0 && karmaData[0]) {
                const karma = karmaData[0];
                const sortable = [];
                for (const key in karma) {
                    if (karma.hasOwnProperty(key)) {
                        sortable.push([key, karma[key]]);
                    }
                }
                sortable.sort((a, b) => b[1] - a[1]);
                output += '\n*Here is the current Thank You Scoreboard (top 10)*:\n';
                const emojis = [':first_place: ', ':second_place: ', ':third_place: '];
                let countUsers = 0;
                let count = -1;
                let last;
                for (const key in sortable) {
                    countUsers++;
                    if (countUsers > 10) {
                        break;
                    }
                    if (sortable.hasOwnProperty(key)) {
                        if (last !== sortable[key][1]) {
                            count++;
                        }
                        const username = buffer_1.Buffer.from(sortable[key][0], 'base64').toString('utf8');
                        output += `${emojis[count] ? emojis[count] : ':reminder_ribbon: '}${username}: ${sortable[key][1]}\n`;
                        last = sortable[key][1];
                    }
                }
            }
        }
        if (output) {
            if (user) {
                await helpers_1.notifyUser(this.app, modify, room, user, output);
            }
            else {
                await helpers_1.sendMessage(this.app, modify, room, output);
            }
        }
    }
    async submit({ context, modify, read, persistence }) {
        const data = context.getInteractionData();
        const { checkin } = data.view.state;
        const errors = {};
        /*if (checkin === undefined || checkin.who === undefined || checkin.who.length === 0) {
            errors.who = 'Please select at least one user';
        }*/
        if (checkin === undefined || checkin.what === undefined || checkin.what.length === 0) {
            errors.what = 'Please enter some text';
        }
        if (Object.keys(errors).length > 0) {
            return context.getInteractionResponder().viewErrorResponse({
                viewId: data.view.id,
                errors,
            });
        }
        await this.sendCheckin(read, modify, persistence, data.user, checkin.who, checkin.what);
        const modal = await CheckinModal_1.checkinRegisteredModal({ read, modify, data });
        return context.getInteractionResponder().updateModalViewResponse(modal);
    }
    async getUsernameFromText(read, text) {
        const username = text ? text.replace(/^@/, '').trim() : false;
        if (username) {
            const members = await helpers_1.getMembers(this.app, read);
            if (Array.from(members).some((member) => {
                return member.username === username;
            })) {
                return username;
            }
        }
        return false;
    }
    async sendCheckin(read, modify, persistence, sender, usernames, text) {
        const karmaAssoc = new metadata_1.RocketChatAssociationRecord(metadata_1.RocketChatAssociationModel.MISC, 'karma');
        const karmaData = await read.getPersistenceReader().readByAssociation(karmaAssoc);
        let karma = karmaData && karmaData.length > 0 && karmaData[0];
        if (!karma) {
            karma = {};
        }
        if (usernames === undefined || usernames.length === 0) {
            usernames = [];
        }
        for (let username of usernames) {
            username = buffer_1.Buffer.from(username).toString('base64');
            if (karma[username]) {
                karma[username] += 1;
            }
            else {
                karma[username] = 1;
            }
        }
        await persistence.updateByAssociation(karmaAssoc, karma);
        const checkinrKarmaAssoc = new metadata_1.RocketChatAssociationRecord(metadata_1.RocketChatAssociationModel.MISC, 'checkinrKarma');
        const checkinrKarmaData = await read.getPersistenceReader().readByAssociation(checkinrKarmaAssoc);
        let checkinrKarma = checkinrKarmaData && checkinrKarmaData.length > 0 && checkinrKarmaData[0];
        if (!checkinrKarma) {
            checkinrKarma = {};
        }
        const senderUsername = buffer_1.Buffer.from(sender.username).toString('base64');
        if (checkinrKarma[senderUsername]) {
            checkinrKarma[senderUsername] += 1;
        }
        else {
            checkinrKarma[senderUsername] = 1;
        }
        await persistence.updateByAssociation(checkinrKarmaAssoc, checkinrKarma);
        let msg;
        let replaceUsernames;
        if (usernames.length === 1) {
            replaceUsernames = usernames[0];
        }
        else if (usernames.length > 1) {
            const lastUsername = usernames.pop();
            replaceUsernames = usernames.join(', @') + ` and @${lastUsername}`;
        }
        const checkinMessages = [
            '@sender should be resting on Sunday, but instead accomplished this: {text}',
            '@sender wants to accomplish this during the week: {text}',
            '@sender accomplished this today: {text}',
            '@sender accomplished this today: {text}',
            '@sender accomplished this today: {text}',
            '@sender accomplished this during the week: {text}',
            '@sender should be resting on Saturday, but instead accomplished this: {text}',
        ];
        const d = new Date();
        const n = d.getDay();
        msg = checkinMessages[n];
        msg = msg.replace('@sender', '@' + sender.username).replace('{text}', text);
        await helpers_1.sendMessage(this.app, modify, this.app.enarxPostCheckinRoom, msg);

        if (usernames.length >= 1) {
            msg = '@sender says thanks to: @username';
            msg = msg.replace('@sender', '@' + sender.username).replace('@username', '@' + replaceUsernames);
            await helpers_1.sendMessage(this.app, modify, this.app.enarxPostCheckinRoom, msg);
        }
    }
}
exports.EnarxCheckin = EnarxCheckin;
