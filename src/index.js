import { Layout } from 'antd';
// import 'antd/dist/antd.less';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import withAuth from './comps/hoc/withAuth';
import LeftMenu from './comps/include/LeftMenu';
import TopBar from './comps/include/TopBar';
import Login from './comps/Login';
import AuthConsumer from './context/AuthContext';
import './less/index.less';
import history from './lib/history';
import configureStore from './redux/store';
import routesAdmin from './route/admin';
import routesOperator from './route/operator';

const { Content } = Layout;

let main = window.__INITIAL_STATE__;
const store = configureStore(main);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        };
    }

    getRoute = () => {
        const { role } = this.context.confirm;
        if (role == 'Authenticated') {
            return routesAdmin;
        } else if (role == 'operator') {
            return routesOperator;
        }
    };

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        console.log('context  ', this);
        return (
            <Layout style={{ flexDirection: 'row' }}>
                <LeftMenu
                    collapsed={this.state.collapsed}
                    toggle={this.toggle}
                />
                <Layout
                    style={{
                        alignContent: 'flex-start',
                        flex: '1 1 0%',
                        height: '100vh'
                    }}>
                    <TopBar
                        toggle={this.toggle}
                        collapsed={this.state.collapsed}
                    />
                    <Content
                        style={{
                            margin: '0px 0px 0px 1px',
                            padding: '0',
                            alignItems: 'stretch',
                            flex: '1 1 auto',
                            overflowY: 'auto'
                        }}>
                        {this.getRoute()}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

App.contextType = AuthConsumer;

const AuthWrap = withAuth(App);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route exact path={'/admin/auth/login'} component={Login} />
                <AuthWrap />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}
