import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {Button, Form, Input, message, Modal, Select, Space, Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import './AppList.less';
import {createApp} from '../../api/appPackage';
import {fetchMyApps} from '../../api/userApp';
import {asAppRoleText, asPlatformText} from '../../util/converter';
import {APP_PLATFORM_OPTIONS} from '../../context/metaData';

const PAGE_ROWS = 20;
const TABLE_PAGINATION = {
    position: ['bottomRight'],
    pageSize: PAGE_ROWS,
};


class AppList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appList: [],
            createModalShow: false,
            totalRows: 0,
            currentPage: 1,
        };
    }

    componentDidMount() {
        const {setTitle} = this.props.storeOperations;
        setTitle('应用包管理', '应用包列表');
        this.refreshAppList(1);
    }

    refreshAppList(page, rows = PAGE_ROWS) {
        fetchMyApps(page, rows).then(res => {
            const {list, total, pageNum} = res;
            const appList = list.map(binder => {
                const app = binder.app;
                app.platformText = asPlatformText(app.platform);
                app.role = binder.role;
                app.roleText = asAppRoleText(binder.role);
                app.key = app.id;
                return app;
            });
            this.setState({appList, totalRows: total, currentPage: pageNum});
        })
    }

    showCreateModal(show) {
        this.setState({createModalShow: show});
    }

    createApp(data) {
        const {currentPage} = this.state;
        createApp(data).then(res => {
            const msg = `应用[${res.name}]创建成功！`;
            message.success(msg);
            this.showCreateModal(false);
            this.refreshAppList(currentPage);
        });
    }

    deleteApp(app) {
        message.warn(`${app.name}/暂不支持删除！`);
        const {currentPage} = this.state;
        this.refreshAppList(currentPage)
    }

    toAppDetails(app) {
        this.props.history.push({pathname: `/c/app/${app.id}`});
    }

    toVersionList(app) {
        this.props.history.push({pathname: `/c/${app.id}/version`});
    }

    renderTableOperations(app) {
        return (<>
            <Button type="link" onClick={() => this.deleteApp(app)}>删除</Button>
            <Button type="link" onClick={() => this.toAppDetails(app)}>编辑</Button>
            <Button type="link" onClick={() => this.toVersionList(app)}>版本</Button>
        </>);
    }

    render() {
        const {appList, createModalShow, totalRows, currentPage} = this.state;
        TABLE_PAGINATION.current = currentPage;
        TABLE_PAGINATION.total = totalRows;
        TABLE_PAGINATION.onChange = (page, rows) => {
            this.refreshAppList(page, rows);
        };
        return (
            <div className="app-list">
                <Space className="btns">
                    <Button type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => this.showCreateModal(true)}>
                        创建应用
                    </Button>
                </Space>
                <Table pagination={TABLE_PAGINATION} dataSource={appList}>
                    <Table.Column title="#" key="id" dataIndex="id"/>
                    <Table.Column title="名称" key="name" dataIndex="name"/>
                    <Table.Column title="唯一标识" key="dirName" dataIndex="dirName"/>
                    <Table.Column title="描述" key="description" dataIndex="description"/>
                    <Table.Column title="适用平台" key="platform" dataIndex="platformText"/>
                    <Table.Column title="角色" key="role" dataIndex="roleText"/>
                    <Table.Column title="操作" key="operations" render={data => this.renderTableOperations(data)}/>
                </Table>
                <Modal visible={createModalShow}
                       title="创建应用"
                       closable={false}
                       maskClosable={false}
                       okText="创建"
                       cancelText="取消"
                       onCancel={() => this.showCreateModal(false)}
                       onOk={() => this.createForm && this.createForm.submit()}>
                    <Form onFinish={data => this.createApp(data)} ref={form => this.createForm = form}>
                        <Form.Item label="应用名称" name="name" rules={[{required: true, message: '名称必填'}]}>
                            <Input placeholder="请输入应用名称"/>
                        </Form.Item>
                        <Form.Item label="唯一标识" name="dirName" rules={[{required: true, message: '唯一标识必填'}]}>
                            <Input placeholder="系统将创建和唯一标识相同的目录存放文件"/>
                        </Form.Item>
                        <Form.Item label="适用平台" name="platform" rules={[{required: true, message: '适用平台必填'}]}>
                            <Select options={APP_PLATFORM_OPTIONS} placeholder="请选择该软件适用平台"/>
                        </Form.Item>
                        <Form.Item label="描述信息" name="description">
                            <Input.TextArea rows={4} placeholder="请输入描述信息"/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(AppList);
