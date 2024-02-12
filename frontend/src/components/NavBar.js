import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Button, Row, Col } from 'antd';

const Navbar = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login'); 
    };

    const token = localStorage.getItem('token');

    const menuItems = [
        {
            key: 'home',
            label: (<Link to="/">Home</Link>),
        },
        {
            key: 'expenses',
            label: (<Link to="/expenses">Expenses</Link>),
        },
        {
            key: 'exchange',
            label: (<Link to="/exchange">Exchange</Link>),
        }
    ];

    return (
        <Row align="middle" justify="space-between" className='ant-menu-overflow ant-menu ant-menu-root ant-menu-horizontal ant-menu-light custom-menu css-dev-only-do-not-override-1b0bdye'>
            <Col flex="auto">
                <Menu mode="horizontal" items={menuItems} className="custom-menu"/>
            </Col>
            {token && (
                <Col>
                    <Button danger type="primary" onClick={logout}>Logout</Button>
                </Col>
            )}
        </Row>
    );
};

export default Navbar;
