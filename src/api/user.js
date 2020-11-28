import {request} from './request';

export const fetchCurrentUser = () => {
    return request({
        url: '/api/token/user/_me',
        method: 'get',
    });
};

export const loginByName = data => {
    return request({
        url: '/api/open/user/_login',
        method: 'post',
        data,
    });
};
