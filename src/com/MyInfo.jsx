import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Avatar, Button, Form, Input, Upload} from 'antd';
import {fetchCurrentUser} from '../api/user';

class MyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: {},
        };
    }

    componentDidMount() {
        this.refreshUser();
    }

    refreshUser() {
        const {setTitle} = this.props.storeOperations;
        fetchCurrentUser().then(res => {
            this.setState({me: res});
            setTitle('用户信息维护', res.name);
            this.form && this.form.setFieldsValue(res);
        });
    }

    renderAvatar(user) {
        return (<Upload>
            <Avatar src={user.avatar}/>
        </Upload>)
    }

    render() {
        const {me} = this.state;
        return (
            <div className="my-info">
                <Form initialValue={me} ref={form => this.form = form}>
                    <Form.Item label="登录名" name="loginName" rules={[{required: true, message: '请输入登录名'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="用户名" name="name" rules={[{required: true, message: '请输入用户名'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="头像">
                        {
                            this.renderAvatar(me)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" type="primary">保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default mapStateAndActions(MyInfo);
