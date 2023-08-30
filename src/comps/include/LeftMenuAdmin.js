import React from 'react';
import { Menu } from 'antd'
import { Link } from 'react-router-dom';
import Icon, { DashboardOutlined, ScheduleOutlined, TeamOutlined, UsergroupAddOutlined  } from '@ant-design/icons';

const leftMenuAdmin = (defaultSelectedkey, defaultOpenKey) => {
    return (
        <Menu defaultSelectedKeys={defaultSelectedkey} defaultOpenKeys={defaultOpenKey} theme="light" mode="inline" style={{ borderRight: "0px" }}>
            <Menu.Item key="dashboard">
                <Link to={'/admin/dashboard'}>
                    <DashboardOutlined />
                    <span>Дашбоард</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="events" >
                <Link to={'/admin/events'} >
                    <ScheduleOutlined />
                    <span>Эвэнт</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="members" >
                <Link to={'/admin/members'} >
                    <TeamOutlined />
                    <span>Гишүүд</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="payments" >
                <Link to={'/admin/payments'} >
                    <div className="custom-icons-list"><TugrugIcon style={{}}/><span>Төлбөр</span></div>
                </Link>
            </Menu.Item>
            <Menu.Item key="users" >
                <Link to={'/admin/users'}>
                    <UsergroupAddOutlined />
                    <span>Хэрэглэгч</span>
                </Link>
            </Menu.Item>
        </Menu >
    )
};
const TugrugSvg = () => (
    <svg width="1em" height="1em" viewBox="0 0 512 512" >
        <polygon points="333.489,208.033 234.79,243.957 234.79,199.901 343.749,160.243 333.489,132.052 234.79,167.976 234.79,30 
        338.723,30 338.723,0 100.857,0 100.857,30 204.79,30 204.79,178.895 95.83,218.553 106.09,246.744 204.79,210.82 204.79,254.876 
        95.83,294.534 106.09,322.725 204.79,286.801 204.79,439.579 234.79,439.579 234.79,275.882 343.749,236.224 "/>
    </svg>
);

const TugrugIcon = props => <Icon component={TugrugSvg} {...props} />

export default leftMenuAdmin;