import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {createUser, fetchUsers, resetPassword} from '../../api/user';
import {Avatar, Button, Form, Input, message, Modal, Space, Table} from 'antd';
import {DeleteOutlined, PlusOutlined, SecurityScanOutlined} from '@ant-design/icons';

const TABLE_ROWS = 20;
const TABLE_PAGINATION = {
    position: ['bottomRight'],
    pageSize: TABLE_ROWS,
};

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentPage: 1,
            totalRows: 0,
            addUserModalVisible: false,
            resetPasswordModalVisible: false,
            resetPasswordUser: {},
        };
    }

    componentDidMount() {
        const {currentPage} = this.state;
        this.refreshUsers(currentPage);
    }

    refreshUsers(page, rows = TABLE_ROWS) {
        const {currentPage} = this.state;
        fetchUsers(currentPage, rows).then(res => {
            const {total, pageNum, list} = res;
            for (const user of list) {
                user.key = user.id;
            }
            this.setState({
                users: list,
                totalRows: total,
                currentPage: pageNum,
            });
        });
    }

    showAddUserModal(show) {
        this.setState({addUserModalVisible: show});
    }

    doCreateUser(data) {
        const {currentPage} = this.state;
        createUser(data).then(res => {
            message.success(`用户[${res.name}]创建成功`);
            this.refreshUsers(currentPage);
            this.showAddUserModal(false);
        });
    }

    showResetPasswordModal(show, user) {
        this.setState({resetPasswordModalVisible: show, resetPasswordUser: user});
    }

    doResetPassword(data) {
        const {password, rePassword} = data;
        if (password !== rePassword) {
            Modal.error({
                title: '提示',
                content: '两次输入密码不一致',
                okText: '重新输入',
            });
            return;
        }
        const {resetPasswordUser} = this.state;
        resetPassword(resetPasswordUser.id, password).then(() => {
            message.success('密码重置成功');
            this.showResetPasswordModal(false, {});
        });
    }

    renderTableOperations(user) {
        return (<>
            <Button type="link" icon={<DeleteOutlined/>}>删除</Button>
            <Button type="link" icon={<SecurityScanOutlined/>} onClick={() => {
                this.showResetPasswordModal(true, user);
            }}>重置密码</Button>
        </>);
    }

    render() {
        const {users, totalRows, currentPage, addUserModalVisible, resetPasswordModalVisible, resetPasswordUser} = this.state;
        TABLE_PAGINATION.total = totalRows;
        TABLE_PAGINATION.current = currentPage;
        TABLE_PAGINATION.onChange = (page, rows) => {
            this.refreshUsers(page, rows)
        };
        return (
            <div className="users">
                <Space className="btn-group">
                    <Button icon={<PlusOutlined/>} type="primary"
                            onClick={() => this.showAddUserModal(true)}>添加</Button>
                </Space>
                <Table dataSource={users} pagination={TABLE_PAGINATION}>
                    <Table.Column title="#" key="id" dataIndex="id"/>
                    <Table.Column title="登录名" key="loginName" dataIndex="loginName"/>
                    <Table.Column title="名称" key="name" dataIndex="name"/>
                    <Table.Column title="头像" key="avatar" dataIndex="avatar"
                                  render={avatar => (<Avatar src={avatar}/>)}/>
                    <Table.Column title="操作" key="operations" render={user => this.renderTableOperations(user)}/>
                </Table>
                <Modal
                    title="创建用户"
                    okText="创建"
                    cancelText="取消"
                    closable={false}
                    maskClosable={false}
                    onCancel={() => this.showAddUserModal(false)}
                    onOk={this.addUserForm && this.addUserForm.submit}

                    visible={addUserModalVisible}>
                    <Form ref={form => this.addUserForm = form} onFinish={data => this.doCreateUser(data)}>
                        <Form.Item label="登录名" name="loginName" rules={[{required: true, message: '请输入登录名'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="用户名" name="name" rules={[{required: true, message: '请输入用户名'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="密码" name="password" rules={[{required: true, message: '请输入密码'}]}>
                            <Input.Password/>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="重置密码"
                    visible={resetPasswordModalVisible}
                    okText="重置"
                    cancelText="取消"
                    closable={false}
                    maskClosable={false}
                    onOk={() => this.resetPasswordForm && this.resetPasswordForm.submit()}
                    onCancel={() => this.showResetPasswordModal(false, {})}>
                    <Form ref={form => this.resetPasswordForm = form}
                          initialValues={resetPasswordUser}
                          onFinish={data => this.doResetPassword(data)}>
                        <Form.Item label="请输入新密码" name="password" rules={[{required: true, message: '请输入新密码'}]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item label="重复输入新密码" name="rePassword" rules={[{required: true, message: '请输入相同的密码'}]}>
                            <Input.Password/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(UserList);
