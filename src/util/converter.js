const APP_PLATFORM_TABLE = {
    0: 'ALL',
    1: 'Android',
    2: 'Windows',
    3: 'Linux',
    4: 'IOS',
    5: 'Browser',
};

export const asPlatformText = platformCode => {
    if (platformCode in APP_PLATFORM_TABLE) {
        return APP_PLATFORM_TABLE[platformCode];
    }
    return `Unknown:${platformCode}`;
};


const APP_ROLE_TABLE = {
    0: '管理员(Owner)',
    1: '维护员(Maintainer)',
};

export const asAppRoleText = role => {
    if (role in APP_ROLE_TABLE) {
        return APP_ROLE_TABLE[role];
    }
    return `Unknown:${role}`;
};

const VERSION_STATE_TABLE = {
    0: '仅发布',
    1: '已上线',
};

export const asVersionStateText = state => {
    if (state in VERSION_STATE_TABLE) {
        return VERSION_STATE_TABLE[state];
    }
    return `Unknown:${state}`;
};
