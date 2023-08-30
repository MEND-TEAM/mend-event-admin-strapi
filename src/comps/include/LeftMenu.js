import { Layout, Icon } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import leftMenuAdmin from './LeftMenuAdmin';
import leftMenuOperator from './LeftMenuOperator';
import AuthConsumer from '../../context/AuthContext';

const { Sider } = Layout;


class LeftMenu extends React.Component {
    constructor(props) {
        super(props)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ selectedKey: this.getSelectedKey(nextProps.path) })
    }

    getSelectedKey = (path = '') => {
        let paths = path.split('/'); // ["", "admin"|"operator"]
        let open = '' //submenu
        let key = paths[2] || 'dashboard';  //selected menu
        return { open, key }
    }

    getMenuList = () => {
        const selectedKey = this.getSelectedKey(this.props.path) //this.state
        const { role } = this.context.confirm;
        if (role == 'Authenticated') {
            return leftMenuAdmin([selectedKey.key], [selectedKey.open]);
        } else if (role == 'operator') {
            return leftMenuOperator([selectedKey.key], [selectedKey.open]);
        }
    }

    render() {
        // console.log('menuList: ', this.context);
        return (
            <Sider
                trigger={null}
                collapsible
                collapsed={this.props.collapsed}
                className="bot-admin-sider"
                style={{ backgroundColor: 'white' }}
            >
                <div className="logo">
                    <div className={`logo-image ${this.props.collapsed ? 'shrink' : ''}`} />
                </div>

                {this.getMenuList()}

            </Sider>
        )
    }
}

LeftMenu.contextType = AuthConsumer;

const mapStateToProps = (state, ownProps) => {
    let location = state.router.location || {}
    return {
        path: location.pathname || '/'
    }
}

export default connect(mapStateToProps)(LeftMenu)