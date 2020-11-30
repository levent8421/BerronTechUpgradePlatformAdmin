import Home from '../com/Home';
import Login from '../com/Login';
import Index from '../com/Index';
import AppList from '../com/app/AppList';
import UserList from '../com/user/UserList';
import MyInfo from '../com/MyInfo';
import HomeIndex from '../com/HomeIndex';
import AppDetail from '../com/app/AppDetail';
import AppVersionList from '../com/app/AppVersionList';
import VersionDetail from '../com/app/VersionDetail';
import AppUsers from '../com/app/AppUsers';

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
    },
    {
        path: '/c/app/:id',
        component: AppDetail,
        exact: true,
    },
    {
        path: '/c/:appId/version',
        component: AppVersionList,
        exact: true,
    },
    {
        path: '/c/version/:id',
        component: VersionDetail,
        exact: true,
    },
    {
        path: '/c/:id/users',
        component: AppUsers,
        exact: true,
    }
];
