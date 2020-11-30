import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import './Home.less';
import {Avatar, Layout, Menu, PageHeader} from 'antd';
import {AppstoreOutlined, UserOutlined} from '@ant-design/icons';
import {renderRoutes} from 'react-router-config';
import {homeRoutes} from '../router/routers';
import {withRouter} from 'react-router-dom';
import {fetchCurrentUser} from '../api/user';

const {Header, Sider, Footer, Content} = Layout;

const getUserAvatar = user => {
    return user ? user.avatar : '';
};

class Home extends Component {
    componentDidMount() {
        this.checkWebToken();
    }

    checkWebToken() {
        const {storeState, storeOperations, history} = this.props;
        const {webToken, me} = storeState;
        const {setToken} = storeOperations;
        if (!webToken) {
            history.replace({
                pathname: '/login',
            });
            return;
        }
        if (!me) {
            fetchCurrentUser().then(user => {
                setToken(webToken, user);
            });
        }
    }

    onMenuSelected(item) {
        const {key} = item;
        const {history} = this.props;
        switch (key) {
            case 'app':
                history.push({pathname: '/c/app-list'});
                break;
            case 'user':
                history.push({pathname: '/c/user-list'});
                break;
            case 'my':
                history.push({pathname: '/c/my'});
                break;
            default:
            // Do Nothing
        }
    }

    render() {
        const {me, title} = this.props.storeState;
        const userAvatar = getUserAvatar(me);
        return (
            <Layout className="home">
                <Header className="header">
                    <div className="banner">BerronTech</div>
                    <div className="user-info">
                        <Avatar className="avatar" src={userAvatar}/>
                        <div className="username">{me ? me.name : ''}</div>
                    </div>
                </Header>
                <Layout>
                    <Sider className="menu-wrapper">
                        <div className="user-avatar">
                            <Avatar src={userAvatar}/>
                        </div>
                        <Menu
                            mode="inline"
                            theme="dark"
                            onSelect={item => this.onMenuSelected(item)}
                        >
                            <Menu.Item key="app" icon={<AppstoreOutlined/>}>应用管理</Menu.Item>
                            <Menu.Item key="user" icon={<UserOutlined/>}>用户管理</Menu.Item>
                            <Menu.Item key="my" icon={<UserOutlined/>}>个人信息</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Content>
                            <PageHeader
                                title={title.mainTitle}
                                subTitle={title.subTitle}/>
                            <div className="page-wrapper">
                                {
                                    renderRoutes(homeRoutes)
                                }
                            </div>
                        </Content>
                        <Footer>
                            <p className="footer-text">
                                BerronTech Application Upgrade Platform, Powered by Levent8421
                            </p>
                        </Footer>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default mapStateAndActions(withRouter(Home));
