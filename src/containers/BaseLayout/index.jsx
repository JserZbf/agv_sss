import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { ConfigProvider, } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import { connect } from 'dva';
import Error from 'components/Error';
import TopBar from 'containers/TopBar';
import DocumentTitle from 'react-document-title';
import Category from '../Category';
import styles from './index.less';
import logo from '../../assets/logo@2x.png';


@withRouter
@connect(() => ({}), () => ({}))
class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: undefined,
        };
    }

    componentDidMount() {
    }

    componentDidCatch(error, info) {
        console.error('Layout Catched Error:', error, info);
        this.setState({
            errorMessage: error.message || 'Layout Catched Error with no message.',
        });
    }

    render() {

        const { errorMessage } = this.state;
        const { children, location: { pathname } } = this.props;
        if (errorMessage) {
            return (
                <Error
                    message={errorMessage}
                    returnButtonText="返回首页"
                    onReturn={() => {
                        this.setState({
                            errorMessage: undefined,
                        });
                    }}
                />
            );
        }

        return (
            <ConfigProvider locale={zhCN}>
                <DocumentTitle title="AGV调度系统">
                    {pathname === '/login' ?
                        <div  className={styles.container}>{children}</div> :
                        <div className={styles.container}>

                            <div className={styles.leftContainer}>
                                <div className={styles.menuBackground}>
                                    <Category />
                                </div>

                                <div className={styles.menuLeft}>
                                    <img src={logo} alt='' style={{ width: "20px" }} />
                                    <p className={styles.menuSize}>上海交大智邦提供技术支持</p> </div>
                            </div>
                            <div className={styles.rightContainer}>
                                <div className={styles.header}>
                                    <TopBar />
                                </div>
                                <div className={styles.childContainer}>
                                    {children}
                                </div>
                            </div>
                        </div>

                    }

                </DocumentTitle>
            </ConfigProvider>
        );
    }
}

Layout.propTypes = {
    children: PropTypes.node,
    location: PropTypes.shape({
        pathname: PropTypes.string,
    }),
};

export default Layout;
