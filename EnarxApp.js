"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnarxApp = void 0;
const api_1 = require("@rocket.chat/apps-engine/definition/api");
const App_1 = require("@rocket.chat/apps-engine/definition/App");
const scheduler_1 = require("@rocket.chat/apps-engine/definition/scheduler");
const EnarxCheckin_1 = require("./actions/EnarxCheckin");
const EnarxCommand_1 = require("./commands/EnarxCommand");
const CheckinEndpoint_1 = require("./endpoints/CheckinEndpoint");
const CheckinModal_1 = require("./modals/CheckinModal");
const settings_1 = require("./settings");
class EnarxApp extends App_1.App {
    constructor(info, logger, accessors) {
        super(info, logger, accessors);
        this.enarxName = 'Enarx';
        this.enarxEmojiAvatar = ':speech_balloon:';
        this.enarxCheckin = new EnarxCheckin_1.EnarxCheckin(this);
    }
    async executeViewSubmitHandler(context, read, http, persistence, modify) {
        const data = context.getInteractionData();
        switch (data.view.id) {
            case 'checkin':
                return this.enarxCheckin.submit({ context, modify, read, persistence });
        }
        return {
            success: true,
        };
    }
    async executeBlockActionHandler(context, read, http, persistence, modify) {
        const data = context.getInteractionData();
        switch (data.actionId) {
            case 'checkin': {
                const modal = await CheckinModal_1.checkinModal({ app: this, data, read, modify });
                return context.getInteractionResponder().openModalViewResponse(modal);
            }
        }
        return {
            success: true,
        };
    }
    async onEnable(environmentRead, configModify) {
        this.enarxMembersRoomName = await environmentRead.getSettings().getValueById('Members_Room_Name');
        if (this.enarxMembersRoomName) {
            this.enarxMembersRoom = await this.getAccessors().reader.getRoomReader().getByName(this.enarxMembersRoomName);
        }
        this.enarxPostCheckinRoomName = await environmentRead.getSettings().getValueById('Post_Checkin_Room_Name');
        if (this.enarxPostCheckinRoomName) {
            this.enarxPostCheckinRoom = await this.getAccessors().reader.getRoomReader().getByName(this.enarxPostCheckinRoomName);
        }
        this.enarxPostAnswersRoomName = await environmentRead.getSettings().getValueById('Post_Answers_Room_Name');
        if (this.enarxPostAnswersRoomName) {
            this.enarxPostAnswersRoom = await this.getAccessors().reader.getRoomReader().getByName(this.enarxPostAnswersRoomName);
        }
        this.botUsername = await environmentRead.getSettings().getValueById('Bot_Username');
        if (this.botUsername) {
            this.botUser = await this.getAccessors().reader.getUserReader().getByUsername(this.botUsername);
        }
        return true;
    }
    async onSettingUpdated(setting, configModify, read, http) {
        switch (setting.id) {
            case 'Members_Room_Name':
                this.enarxMembersRoomName = setting.value;
                if (this.enarxMembersRoomName) {
                    this.enarxMembersRoom = await read.getRoomReader().getByName(this.enarxMembersRoomName);
                }
                break;
            case 'Post_Checkin_Room_Name':
                this.enarxPostCheckinRoomName = setting.value;
                if (this.enarxPostCheckinRoomName) {
                    this.enarxPostCheckinRoom = await read.getRoomReader().getByName(this.enarxPostCheckinRoomName);
                }
                break;
            case 'Post_Answers_Room_Name':
                this.enarxPostAnswersRoomName = setting.value;
                if (this.enarxPostAnswersRoomName) {
                    this.enarxPostAnswersRoom = await read.getRoomReader().getByName(this.enarxPostAnswersRoomName);
                }
                break;
            case 'Bot_User':
                this.botUsername = setting.value;
                if (this.botUsername) {
                    this.botUser = await read.getUserReader().getByUsername(this.botUsername);
                }
                break;
        }
    }
    async extendConfiguration(configuration) {
        await Promise.all(settings_1.settings.map((setting) => configuration.settings.provideSetting(setting)));
        await configuration.api.provideApi({
            visibility: api_1.ApiVisibility.PRIVATE,
            security: api_1.ApiSecurity.UNSECURE,
            endpoints: [
                new CheckinEndpoint_1.CheckinEndpoint(this),
            ],
        });
        await configuration.slashCommands.provideSlashCommand(new EnarxCommand_1.EnarxCommand(this));
        configuration.scheduler.registerProcessors([
            {
                id: 'checkin',
                startupSetting: {
                    type: scheduler_1.StartupType.RECURRING,
                    interval: '0 9 * * 1',
                    data: { appId: this.getID() },
                },
                processor: async (jobContext, read, modify, http, persistence) => {
                    this.enarxCheckin.run(read, modify, persistence, undefined, undefined, this.enarxCheckin.sendScore ? 'checkinrs' : undefined);
                    this.enarxCheckin.sendScore = !this.enarxCheckin.sendScore;
                },
            },
            {
                id: 'checkin2',
                startupSetting: {
                    type: scheduler_1.StartupType.RECURRING,
                    interval: '0 9 * * 2',
                    data: { appId: this.getID() },
                },
                processor: async (jobContext, read, modify, http, persistence) => {
                    this.enarxCheckin.run(read, modify, persistence, undefined, undefined, this.enarxCheckin.sendScore ? 'checkinrs' : undefined);
                    this.enarxCheckin.sendScore = !this.enarxCheckin.sendScore;
                },
            },
            {
                id: 'checkin3',
                startupSetting: {
                    type: scheduler_1.StartupType.RECURRING,
                    interval: '0 9 * * 3',
                    data: { appId: this.getID() },
                },
                processor: async (jobContext, read, modify, http, persistence) => {
                    this.enarxCheckin.run(read, modify, persistence, undefined, undefined, this.enarxCheckin.sendScore ? 'checkinrs' : undefined);
                    this.enarxCheckin.sendScore = !this.enarxCheckin.sendScore;
                },
            },
            {
                id: 'checkin4',
                startupSetting: {
                    type: scheduler_1.StartupType.RECURRING,
                    interval: '0 9 * * 4',
                    data: { appId: this.getID() },
                },
                processor: async (jobContext, read, modify, http, persistence) => {
                    this.enarxCheckin.run(read, modify, persistence, undefined, undefined, this.enarxCheckin.sendScore ? 'checkinrs' : undefined);
                    this.enarxCheckin.sendScore = !this.enarxCheckin.sendScore;
                },
            },
            {
                id: 'checkin5',
                startupSetting: {
                    type: scheduler_1.StartupType.RECURRING,
                    interval: '0 12 * * 5',
                    data: { appId: this.getID() },
                },
                processor: async (jobContext, read, modify, http, persistence) => {
                    this.enarxCheckin.run(read, modify, persistence, undefined, undefined, this.enarxCheckin.sendScore ? 'checkinrs' : undefined);
                    this.enarxCheckin.sendScore = !this.enarxCheckin.sendScore;
                },
            },
        ]);
    }
    get membersCache() {
        return this._membersCache;
    }
    set membersCache(memberCache) {
        this._membersCache = memberCache;
    }
}
exports.EnarxApp = EnarxApp;
