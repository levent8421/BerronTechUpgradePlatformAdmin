import React, {Component} from 'react';
import {mapStateAndActions} from '../store/storeUtils';
import {Empty} from 'antd';

class HomeIndex extends Component {
    componentDidMount() {
        this.props.storeOperations.setTitle('贝榕物联-软件发布平台', 'BerronTech');
    }

    render() {
        return (
            <div className="home-index">
                <p>暂无内容展示</p>
                <Empty/>
            </div>
        );
    }
}

export default mapStateAndActions(HomeIndex);
