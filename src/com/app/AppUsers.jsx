import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {bind, deleteBinder, findByAppId} from '../../api/userApp';
import {searchByName} from '../../api/user';
import {Button, Form, Mentions, message, Modal, Select, Space, Table} from 'antd';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import './AppUsers.less';
import {USER_APP_ROLE_OPTIONS} from '../../context/metaData';

const USER_SEARCH_MAX_ROWS = 10;

class AppUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            addModalVisible: false,
            userSearchValueText: '',
            userSearchValueId: 0,
            userSearchResult: [],
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.appId = id;
        this.refreshUsers();
        const {setTitle} = this.props.storeOperations;
        setTitle('应用用户管理', '权限管理');
    }

    refreshUsers() {
        findByAppId(this.appId).then(res => {
            for (const binder of res) {
                binder.key = binder.id;
            }
            this.setState({users: res});
        });
    }

    deleteBinder(id) {
        Modal.confirm({
            title: '确认删除？',
            content: '确认删除？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                deleteBinder(id).then(() => {
                    message.success('删除成功！');
                    this.refreshUsers();
                })
            }
        });
    }

    showAddModal(show) {
        this.setState({addModalVisible: show})
    }

    onUserSearch(text) {
        if (!text) {
            return;
        }
        if (this.searchTimer) {
            clearTimeout(this.searchTimer);
        }
        this.searchTimer = setTimeout(() => {
            searchByName(text, USER_SEARCH_MAX_ROWS).then(res => {
                this.setState({userSearchResult: res});
            })
        }, 500);
    }

    onSearchUserSelected(option) {
        const {value, key} = option;
        this.setState({
            userSearchValueText: value,
            userSearchValueId: key,
        })
    }

    renderTableOperations(binder) {
        const {id} = binder;
        return (<>
            <Button type="link" icon={<DeleteOutlined/>} onClick={() => {
                this.deleteBinder(id)
            }}>删除</Button>
        </>);
    }

    bindUserRole(userId, appId, role) {
        bind(userId, appId, role).then(() => {
            message.success('设置权限成功！');
            this.refreshUsers();
        });
    }

    addUserRole(data) {
        const {userSearchValueId} = this.state;
        if (!userSearchValueId) {
            message.error('请选择用户');
            return;
        }
        const {role} = data;
        bind(userSearchValueId, this.appId, role).then(() => {
            this.refreshUsers();
            this.showAddModal(false);
        });
    }

    renderRoleSelector(binder) {
        const {role, userId, appId} = binder;
        return (
            <Select placeholder="请选择角色" options={USER_APP_ROLE_OPTIONS} value={role}
                    onChange={newRole => this.bindUserRole(userId, appId, newRole)}/>);
    }

    render() {
        const {users, addModalVisible, userSearchResult} = this.state;
        return (
            <div className="app-users">
                <Space className="btn-group">
                    <Button type="primary" icon={<PlusOutlined/>} onClick={() => this.showAddModal(true)}>添加</Button>
                </Space>
                <Table dataSource={users} pagination={false}>
                    <Table.Column title="#" dataIndex="id" key="id"/>
                    <Table.Column title="用户" dataIndex="user" key="user" render={user => user.name}/>
                    <Table.Column title="角色" dataIndex="role" key="role"
                                  render={(_, row) => this.renderRoleSelector(row)} width={200}/>
                    <Table.Column title="操作" key="operations" render={row => this.renderTableOperations(row)}/>
                </Table>
                <Modal title="应用维护团队-新增用户"
                       visible={addModalVisible}
                       okText="确认添加"
                       cancelText="取消操作"
                       closable={false}
                       maskClosable={false}
                       onCancel={() => this.showAddModal(false)}
                       onOk={() => this.userAddForm && this.userAddForm.submit()}>
                    <Form ref={form => this.userAddForm = form}
                          onFinish={data => this.addUserRole(data)}>
                        <Form.Item label="用户" name="userId" rules={[{required: true, message: '请选择用户'}]}>
                            <Mentions
                                prefix="@"
                                onSearch={e => this.onUserSearch(e)}
                                onSelect={e => this.onSearchUserSelected(e)}>
                                {
                                    userSearchResult.map(user => (
                                        <Mentions.Option value={user.name} key={user.id}>{user.name}</Mentions.Option>))
                                }
                            </Mentions>
                        </Form.Item>
                        <Form.Item label="角色" name="role" rules={[{required: true, message: '请选择角色'}]}>
                            <Select options={USER_APP_ROLE_OPTIONS}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(AppUsers);
