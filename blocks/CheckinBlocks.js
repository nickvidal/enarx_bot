"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckinBlocks = void 0;
const uikit_1 = require("@rocket.chat/apps-engine/definition/uikit");
function createCheckinBlocks(modify, text) {
    const blocks = modify.getCreator().getBlockBuilder();
    blocks.addSectionBlock({
        text: {
            type: uikit_1.TextObjectType.MARKDOWN,
            text,
        },
    });
    blocks.addActionsBlock({
        elements: [{
                type: uikit_1.BlockElementType.BUTTON,
                text: {
                    type: uikit_1.TextObjectType.PLAINTEXT,
                    text: 'Check-in',
                },
                actionId: 'checkin',
            },
        ],
    });
    return blocks;
}
exports.createCheckinBlocks = createCheckinBlocks;
