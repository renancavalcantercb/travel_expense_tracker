import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'antd';

const ExpensesTable = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    navigate('/login');
                    return;
                }
                const response = await fetch(`http://127.0.0.1:5000/api/v1/expenses/${userId}`);

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setExpenses(data);
            } catch (error) {
                console.error("Error fetching expenses:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount, record) => `${amount.toFixed(2)} ${record.currency}`,
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category ID',
            dataIndex: 'category_id',
            key: 'category_id',
        }
    ];

    return (
        <Table 
            dataSource={expenses} 
            columns={columns} 
            rowKey="id" 
            loading={isLoading}
            style={{ width: '75%', margin: 'auto', marginTop: "20px" }}
        />
    );
};

export default ExpensesTable;
