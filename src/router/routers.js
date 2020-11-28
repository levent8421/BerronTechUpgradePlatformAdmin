import Home from '../com/Home';
import Login from '../com/Login';
import Index from '../com/Index';
import AppList from '../com/app/AppList';
import UserList from '../com/user/UserList';
import MyInfo from '../com/MyInfo';
import HomeIndex from '../com/HomeIndex';

export const rootRoutes = [
    {
        path: '/c/*',
        exact: true,
        component: Home,
    },
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/',
        exact: true,
        component: Index,
    },
];


export const homeRoutes = [
    {
        path: '/c/app-list',
        component: AppList,
        exact: true,
    },
    {
        path: '/c/',
        component: HomeIndex,
        exact: true,
    },
    {
        path: '/c/user-list',
        component: UserList,
        exact: true,
    },
    {
        path: '/c/my',
        component: MyInfo,
        exact: true,
    }
];
