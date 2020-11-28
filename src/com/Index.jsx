import React, {Component} from 'react';
import LoadingImage from '../img/loading.gif';
import './Index.less';

class Index extends Component {
    componentDidMount() {
        setTimeout(() => {
            this.props.history.replace({
                pathname: '/c/'
            });
        }, 1000);
    }

    render() {
        return (
            <div className="index">
                <img src={LoadingImage} alt="Loading"/>
                <p>BerronTech, Loading......</p>
            </div>
        );
    }
}

export default Index;
