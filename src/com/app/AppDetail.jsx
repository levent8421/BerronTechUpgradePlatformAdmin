import React, {Component} from 'react';
import {fetchAppById, updateAppInfo} from '../../api/appPackage';
import {mapStateAndActions} from '../../store/storeUtils';
import {Button, Form, Input, message, Modal, Select} from 'antd';
import {APP_PLATFORM_OPTIONS} from '../../context/metaData';

class AppDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            app: {
                name: '',
                dirName: '',
                platform: 0,
                description: '',
            }
        };
    }

    componentDidMount() {
        const {params} = this.props.match;
        const {setTitle} = this.props.storeOperations;
        fetchAppById(params.id).then(res => {
            this.setState({app: res});
            setTitle(res.name, res.dirName);
            this.setFormValue(res);
        });
    }

    setFormValue(app) {
        if (!this.form) {
            return;
        }
        this.form.setFieldsValue(app);
    }

    updateAppInfo(data) {
        const {app} = this.state;
        data.id = app.id;
        Modal.confirm({
            title: '确认修改？',
            content: `确认修改APP[${app.name}]的信息吗？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                updateAppInfo(data).then(() => {
                    message.success('修改成功');
                });
            }
        });
    }

    render() {
        const {app} = this.state;
        return (
            <div className="app-detail">
                <Form ref={form => this.form = form} onFinish={data => this.updateAppInfo(data)} initialValues={app}>
                    <Form.Item label="应用名称" name="name" rules={[{required: true, message: '请输入应用名称'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="唯一标识" name="dirName" rules={[{required: true, message: '请输入唯一标识'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="适用平台" name="platform" rules={[{required: true, message: '请选择适用平台'}]}>
                        <Select options={APP_PLATFORM_OPTIONS}/>
                    </Form.Item>
                    <Form.Item label="应用描述" name="description">
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default mapStateAndActions(AppDetail);
