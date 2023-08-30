import {
    DashboardOutlined,
    MonitorOutlined,
    QuestionCircleOutlined,
    ScheduleOutlined,
    ShoppingOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const leftMenuOperator = (defaultSelectedkey, defaultOpenKey) => {
    return (
        <Menu
            defaultSelectedKeys={defaultSelectedkey}
            defaultOpenKeys={defaultOpenKey}
            theme="light"
            mode="inline"
            style={{ borderRight: '0px' }}>
            <Menu.Item key="dashboard">
                <Link to={'/operator/dashboard'}>
                    <DashboardOutlined />
                    <span>Dashboard</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="members">
                <Link to={'/operator/members'}>
                    <UserOutlined />
                    <span>Гишүүд</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="event">
                <Link to={'/operator/attendance'}>
                    <ScheduleOutlined />
                    <span>Ирц</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="user">
                <Link to={'/operator/question'}>
                    <QuestionCircleOutlined />
                    <span>Асуулт</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="poll">
                <Link to={'/operator/poll'}>
                    <MonitorOutlined />
                    <span>Санал асуулга</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="package">
                <Link to={'/operator/package'}>
                    <ShoppingOutlined />
                    <span>Эвэнт пакеж</span>
                </Link>
            </Menu.Item>
        </Menu>
    );
};

export default leftMenuOperator;
