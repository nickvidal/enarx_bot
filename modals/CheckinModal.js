"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkinRegisteredModal = exports.checkinModal = void 0;
const blocks_1 = require("@rocket.chat/apps-engine/definition/uikit/blocks");
const helpers_1 = require("../lib/helpers");
async function checkinModal({ app, data, read, modify }) {
    const viewId = 'checkin';
    const checkinMessages = [
        'What did you accomplish today?',
        'What do you want to accomplish during the week?',
        'What did you accomplish today?',
        'What did you accomplish today?',
        'What did you accomplish today?',
        'What did you accomplish during the week?',
        'What did you accomplish today?',
    ];
    const whoMessages = [
        'Who helped you today?',
        'Who do you want to talk to during the week?',
        'Who helped you today?',
        'Who helped you today?',
        'Who helped you today?',
        'Who helped you during the week?',
        'Who helped you today?',
    ];
    const d = new Date();
    const n = d.getDay();
    const checkinMsg = checkinMessages[n];
    const whoMsg = whoMessages[n];
    const block = modify.getCreator().getBlockBuilder();
    const members = await helpers_1.getMembers(app, read);
    const users = members
        .sort((a, b) => {
        return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1;
    })
        .map((member) => {
        return {
            text: {
                type: blocks_1.TextObjectType.PLAINTEXT,
                text: member.username,
            },
            value: member.username,
        };
    });
    block.addInputBlock({
        blockId: 'checkin',
        element: block.newPlainTextInputElement({ actionId: 'what' }),
        label: {
            type: blocks_1.TextObjectType.PLAINTEXT,
            text: checkinMsg,
            emoji: true,
        },
    });
    block.addInputBlock({
        blockId: 'checkin',
        element: block.newMultiStaticElement({
            actionId: 'who',
            placeholder: {
                type: blocks_1.TextObjectType.PLAINTEXT,
                text: 'Select users',
            },
            options: users,
        }),
        label: {
            type: blocks_1.TextObjectType.PLAINTEXT,
            text: whoMsg,
            emoji: true,
        },
    });   
    return {
        id: viewId,
        title: {
            type: blocks_1.TextObjectType.PLAINTEXT,
            text: 'Check-in time!',
        },
        submit: block.newButtonElement({
            text: {
                type: blocks_1.TextObjectType.PLAINTEXT,
                text: 'Check-in',
            },
        }),
        close: block.newButtonElement({
            text: {
                type: blocks_1.TextObjectType.PLAINTEXT,
                text: 'Cancel',
            },
        }),
        blocks: block.getBlocks(),
    };
}
exports.checkinModal = checkinModal;
async function checkinRegisteredModal({ read, modify, data }) {
    const viewId = 'checkin';
    const block = modify.getCreator().getBlockBuilder();
    block.addSectionBlock({
        text: {
            type: blocks_1.TextObjectType.PLAINTEXT,
            text: 'Your check-in has been registered.',
        },
    });
    return {
        id: viewId,
        title: {
            type: blocks_1.TextObjectType.PLAINTEXT,
            text: 'Check-in',
        },
        close: block.newButtonElement({
            text: {
                type: blocks_1.TextObjectType.PLAINTEXT,
                text: 'Close',
            },
        }),
        blocks: block.getBlocks(),
    };
}
exports.checkinRegisteredModal = checkinRegisteredModal;
