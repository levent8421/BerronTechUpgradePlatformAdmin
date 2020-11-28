import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Button, Card, Form, Input} from 'antd';
import './Login.less';
import {fetchCurrentUser, loginByName} from '../api/user';

class Login extends Component {
    componentDidMount() {
        const {webToken} = this.props.storeState;
        if (webToken) {
            this.tryAutoLogin();
        }
    }

    tryAutoLogin() {
        const {me, webToken} = this.props.storeState;
        if (me) {
            this.toHome();
            return;
        }
        const {storeOperations} = this.props;
        fetchCurrentUser().then(res => {
            storeOperations.setToken(webToken, res);
            this.toHome();
        });
    }

    loginByName(data) {
        loginByName(data).then(res => {
            const {token, account} = res;
            this.props.storeOperations.setToken(token, account);
            this.toHome();
        });
    }

    toHome() {
        this.props.history.replace({
            pathname: '/c/'
        });
    }

    render() {
        return (
            <div className="login">
                <div className="banner">BerronTech</div>
                <div className="form-wrapper">
                    <Card title="登录" className="card">
                        <Form labelCol={{span: 4, offset: 1}} onFinish={data => this.loginByName(data)}>
                            <Form.Item label="用户名" name="loginName">
                                <Input/>
                            </Form.Item>
                            <Form.Item label="密码" name="password">
                                <Input/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">登录</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        );
    }
}

export default mapStateAndActions(Login);
