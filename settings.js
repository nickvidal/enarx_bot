"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const settings_1 = require("@rocket.chat/apps-engine/definition/settings");
exports.settings = [
    {
        id: 'Members_Room_Name',
        type: settings_1.SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: 'Enarx_Members_Room_Name',
        i18nDescription: 'Enarx_Members_Room_Name_Description',
    },
    {
        id: 'Post_Checkin_Room_Name',
        type: settings_1.SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: 'Enarx_Post_Checkin_Room_Name',
        i18nDescription: 'Enarx_Post_Checkin_Room_Name_Description',
    },
    {
        id: 'Post_Answers_Room_Name',
        type: settings_1.SettingType.STRING,
        packageValue: '',
        required: true,
        public: false,
        i18nLabel: 'Enarx_Post_Answers_Room_Name',
        i18nDescription: 'Enarx_Post_Answers_Room_Name_Description',
    },
    {
        id: 'Bot_Username',
        type: settings_1.SettingType.STRING,
        packageValue: 'rocket.cat',
        required: true,
        public: false,
        i18nLabel: 'Enarx_Bot_Username',
        i18nDescription: 'Enarx_Bot_Username_Description',
    },
];
