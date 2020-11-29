import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';
import {fetchVersionById, getFileUploadUrl} from '../../api/appVersion';
import {Button, Form, Input, InputNumber, message, Select, Upload} from 'antd';
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
        this.refreshVersionInfo();
    }

    refreshVersionInfo() {
        const {id} = this.props.match.params;
        fetchVersionById(id).then(res => {
            this.setState({version: res});
            this.form && this.form.setFieldsValue(res);
        });
    }

    onUploadStatusChanged(e) {
        const {status} = e.file;
        if (status === 'done') {
            message.success('文件上传成功，该版本将被锁定！');
        }
        this.refreshVersionInfo();
    }

    renderFileUpload(version) {
        const {filename, id} = version;
        const {webToken} = this.props.storeState;
        const headers = {
            'X-Token': webToken,
        };
        if (filename) {
            return (<a href={filename} target="_blank">点击下载</a>);
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
                <Form ref={form => this.form = form} initialValues={version} labelCol={{span: 2}}>
                    <Form.Item label="版本名称" name="versionName" rules={[{required: true, message: '请输入版本名称'}]}>
                        <Input placeholder="请输入版本名称"/>
                    </Form.Item>
                    <Form.Item label="版本号" name="versionCode" rules={[{required: true, message: '请输入版本号码'}]}>
                        <InputNumber placeholder="请输入版本号码"/>
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
