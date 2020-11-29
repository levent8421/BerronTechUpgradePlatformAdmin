import {request} from './request';

export const fetchVersionByAppId = (appId, page, rows) => {
    return request({
        url: '/api/token/app-version/_by-app',
        method: 'get',
        params: {
            page: page,
            rows: rows,
            appId: appId
        }
    });
};


export const createVersion = data => {
    return request({
        url: '/api/token/app-version/',
        method: 'put',
        data: data,
    });
};

export const fetchVersionById = id => {
    return request({
        url: `/api/token/app-version/${id}`,
        method: 'get',
    });
};


export const getFileUploadUrl = id => {
    return `/api/token/app-version/${id}/_file`;
};