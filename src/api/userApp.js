import {request} from './request';

export const fetchMyApps = (page, rows) => {
    return request({
        url: '/api/token/user-app/_mine',
        method: 'get',
        params: {
            page,
            rows
        },
    });
};

export const findByAppId = appId => {
    return request({
        url: '/api/token/user-app/_by-app',
        method: 'get',
        params: {
            appId: appId,
        }
    });
};


export const bind = (userId, appId, role) => {
    return request({
        url: '/api/token/user-app/_bind',
        method: 'post',
        data: {
            userId,
            appId,
            role,
        }
    });
};

export const deleteBinder = id => {
    return request({
        url: `/api/token/user-app/${id}`,
        method: 'delete',
    });
};
