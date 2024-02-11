import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

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

const Navbar = () => {
    return (
        <Menu mode="horizontal" items={menuItems} />
    );
};

export default Navbar;
