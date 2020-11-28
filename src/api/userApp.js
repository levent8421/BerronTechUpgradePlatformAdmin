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
