import React, {Component} from 'react';
import {mapStateAndActions} from '../../store/storeUtils';

class AppList extends Component {
    componentDidMount() {
        const {setTitle} = this.props.storeOperations;
        setTitle('应用包管理', '应用包列表');
    }

    render() {
        return (
            <div>


            </div>
        );
    }
}

export default mapStateAndActions(AppList);
