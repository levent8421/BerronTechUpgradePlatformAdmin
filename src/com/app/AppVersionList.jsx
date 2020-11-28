import React, {Component} from 'react';
import {createVersion, fetchVersionByAppId} from '../../api/appVersion';
import {Button, Form, Input, message, Modal, Select, Space, Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import './AppVersionList.less';
import {mapStateAndActions} from '../../store/storeUtils';
import {VERSION_STATE_OPTIONS} from '../../context/metaData';
import {asVersionStateText} from '../../util/converter';

const TABLE_ROWS = 20;

class AppVersionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: [],
            createModalVisible: false,
            currentPage: 1,
            totalRows: 0,
        };
    }

    componentDidMount() {
        const {appId} = this.props.match.params;
        const {setTitle} = this.props.storeOperations;
        this.appId = appId;
        this.refreshTable(1);
        setTitle('应用版本管理', 'app version');
    }

    refreshTable(page, rows = TABLE_ROWS) {
        fetchVersionByAppId(this.appId, page, rows).then(res => {
            const {list, total, pageNum} = res;
            const versions = list.map(v => {
                v.key = v.id;
                v.stateText = asVersionStateText(v.state);
                return v;
            });
            this.setState({versions: versions, totalRows: total, currentPage: pageNum});
        });
    }

    showCreateModal(show) {
        this.setState({createModalVisible: show});
    }

    createVersion(data) {
        data.appId = this.appId;
        const {currentPage} = this.state;
        createVersion(data).then(res => {
            const msg = `版本[${res.versionName}]创建成功`;
            message.success(msg);
            this.refreshTable(currentPage);
            this.showCreateModal(false);
        });
    }

    renderOperations(version) {
        return (<>
            <Button
                type="link"
                onClick={() => this.props.history.push({pathname: `/c/version/${version.id}`})}>
                详情
            </Button>
        </>);
    }

    render() {
        const {versions, createModalVisible} = this.state;
        return (
            <div className="version-list">
                <Space className="btn-list">
                    <Button icon={<PlusOutlined/>}
                            type="primary"
                            onClick={() => this.showCreateModal(true)}>
                        创建版本
                    </Button>
                </Space>
                <Table dataSource={versions}>
                    <Table.Column title="#" key="id" dataIndex="id"/>
                    <Table.Column title="版本名称" key="versionName" dataIndex="versionName"/>
                    <Table.Column title="版本号" key="versionCode" dataIndex="versionCode"/>
                    <Table.Column title="版本信息" key="releaseNote" dataIndex="releaseNote"/>
                    <Table.Column title="描述" key="description" dataIndex="description"/>
                    <Table.Column title="应用" key="app" dataIndex="app" render={app => app.name}/>
                    <Table.Column title="发布人" key="publisher" dataIndex="publisher" render={user => user.name}/>
                    <Table.Column title="状态" key="state" dataIndex="stateText"/>
                    <Table.Column title="操作" key="operations" render={version => this.renderOperations(version)}/>
                </Table>
                <Modal visible={createModalVisible}
                       title="创建版本"
                       okText="创建"
                       cancelText="取消"
                       onCancel={() => this.showCreateModal(false)}
                       maskClosable={false}
                       closable={false}
                       onOk={() => this.createForm && this.createForm.submit()}>
                    <Form labelCol={{span: 5}} ref={form => this.createForm = form}
                          onFinish={data => this.createVersion(data)}>
                        <Form.Item label="版本号码" name="versionCode" rules={[{required: true, message: '请输入版本号码'}]}>
                            <Input placeholder="版本号，如：1"/>
                        </Form.Item>
                        <Form.Item label="版本名称" name="versionName" rules={[{required: true, message: '请输入版本名称'}]}>
                            <Input placeholder="版本名称，如：V1.1.1"/>
                        </Form.Item>
                        <Form.Item label="版本信息" name="releaseNote">
                            <Input.TextArea rows={4} placeholder="请输入版本信息"/>
                        </Form.Item>
                        <Form.Item label="备注" name="description">
                            <Input.TextArea rows={4} placeholder="请输入备注"/>
                        </Form.Item>
                        <Form.Item label="发布后状态" name="state" rules={[{required: true, message: '请选择发布后状态'}]}>
                            <Select placeholder="发布后状态" options={VERSION_STATE_OPTIONS}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default mapStateAndActions(AppVersionList);
