import { Avatar, Dropdown, Icon, Layout, Menu, message } from 'antd';
import React from 'react';
import { LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ProfileOutlined, UserOutlined,  } from '@ant-design/icons';
import Auth from '../../lib/auth';

const { Header } = Layout;

class TopBar extends React.Component {    

    constructor(props) {
        super(props)

        let confirm = Auth.getConfirm()
        this.state = {            
            user: confirm.user
        }
    }


    handleUserMenuClick = (e) => {
        if (e.key == "2") {//logout        
            Auth.logout()
            window.location.replace('/')
        } else {
            message.info('Тун удахгүй')
        }
    }

    getMenu = () => {
        return (
            <Menu onClick={this.handleUserMenuClick}>
                <Menu.Item key="1"><ProfileOutlined />Профайл</Menu.Item>
                <Menu.Item key="2"><LogoutOutlined />Гарах</Menu.Item>
            </Menu>
        )
    }

    render() {
        return (
            <Header className="admin-header" >
                {/* <Icon                                       
                    className="trigger"
                    align="middle"
                    type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.props.toggle}
                />                 */}
                {this.props.collapsed ?
                    <MenuUnfoldOutlined onClick={this.props.toggle}/> : <MenuFoldOutlined onClick={this.props.toggle}/>
                }

                <div className="top-user">
                    <Dropdown overlay={this.getMenu()}>
                        <div className="top-user-wrapper">
                            <Avatar icon={<UserOutlined/>} />
                            <div className="username">{this.state.user.username}</div>
                        </div>
                    </Dropdown>
                </div>
            </Header>
        )
    }
}


export default TopBar