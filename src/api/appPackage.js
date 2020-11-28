import {request} from './request';

export const createApp = data => {
    return request({
        url: '/api/token/app/',
        method: 'put',
        data: data,
    });
};


export const fetchAppById = id => {
    return request({
        url: `/api/token/app/${id}`,
        method: 'get',
    });
};


export const updateAppInfo = data => {
    return request({
        url: `/api/token/app/${data.id}`,
        method: 'post',
        data,
    });
};
