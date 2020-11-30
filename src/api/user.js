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

export const searchByName = (name, maxRows) => {
    return request({
        url: '/api/token/user/_search',
        method: 'get',
        params: {
            name: name,
            maxRows: maxRows,
        }
    });
};


export const fetchUsers = (page, rows) => {
    return request({
        url: '/api/token/user/',
        method: 'get',
        params: {
            page, rows
        }
    });
};


export const createUser = data => {
    return request({
        url: '/api/token/user/',
        method: 'put',
        data: data,
    });
};


export const resetPassword = (id, password) => {
    return request({
        url: `/api/token/user/${id}/_reset-password`,
        method: 'post',
        data: {
            password,
        }
    });
};
