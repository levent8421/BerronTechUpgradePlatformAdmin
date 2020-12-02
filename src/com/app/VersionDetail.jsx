import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {fetchVersionById, getFileUploadUrl, updateVersionInfo} from '../../api/appVersion';
import {Button, Form, Input, InputNumber, message, Modal, Select, Upload} from 'antd';
import {VERSION_STATE_OPTIONS} from '../../context/metaData';
import './VersionDetail.less';
import {UploadOutlined} from '@ant-design/icons';

class VersionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            version: {},
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        this.versionId = id;
        this.refreshVersionInfo();
    }

    refreshVersionInfo() {

        const {setTitle} = this.props.storeOperations;
        fetchVersionById(this.versionId).then(res => {
            this.setState({version: res});
            this.form && this.form.setFieldsValue(res);
            setTitle('版本信息管理', res.versionName);
        });
    }

    updateVersionInfo(data) {
        data.id = this.versionId;
        Modal.confirm({
            title: '确认更新版本信息？',
            content: '确认更新版本信息？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                updateVersionInfo(data).then(() => {
                    message.success('信息更新成功');
                })
            },
        });
    }

    onUploadStatusChanged(e) {
        const {status} = e.file;
        if (status === 'done') {
            message.success('文件上传成功，该版本将被锁定！');
            this.refreshVersionInfo();
        }
    }

    renderFileUpload(version) {
        const {filename, id} = version;
        const {webToken} = this.props.storeState;
        const headers = {
            'X-Token': webToken,
        };
        if (filename) {
            return (<a href={filename} target="_blank" rel="noreferrer">点击下载</a>);
        }
        return (<Upload
            showUploadList={false}
            onChange={e => this.onUploadStatusChanged(e)}
            name="file"
            headers={headers}
            action={getFileUploadUrl(id)}>
            <Button icon={<UploadOutlined/>} type="link">点击上传</Button>
        </Upload>);
    }

    render() {
        const _this = this;
        const {version} = this.state;
        return (
            <div className="version-detail">
                <Form ref={form => this.form = form} initialValues={version} labelCol={{span: 2}}
                      onFinish={data => this.updateVersionInfo(data)}>
                    <Form.Item label="版本名称" name="versionName" rules={[{required: true, message: '请输入版本名称'}]}>
                        <Input placeholder="请输入版本名称" disabled={true}/>
                    </Form.Item>
                    <Form.Item label="版本号" name="versionCode" rules={[{required: true, message: '请输入版本号码'}]}>
                        <InputNumber placeholder="请输入版本号码" disabled={true}/>
                    </Form.Item>
                    <Form.Item label="状态" name="state" rules={[{required: true, message: '请输入版本名称'}]}>
                        <Select options={VERSION_STATE_OPTIONS} placeholder="请选择状态"/>
                    </Form.Item>
                    <Form.Item label="版本信息" name="releaseNote">
                        <Input.TextArea rows={4} placeholder="版本信息"/>
                    </Form.Item>
                    <Form.Item label="版本描述" name="description">
                        <Input.TextArea rows={4} placeholder="版本描述"/>
                    </Form.Item>
                    <Form.Item label="文件">
                        {
                            _this.renderFileUpload(version)
                        }
                    </Form.Item>
                    <Form.Item className="submit-btn-wrapper">
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default mapStateAndActions(VersionDetail);
