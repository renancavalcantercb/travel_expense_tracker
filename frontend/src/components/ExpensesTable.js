import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Form, DatePicker, InputNumber, Input, Select } from 'antd';
import useAuth from '../hooks/useAuth';

const ExpensesTable = () => {
    useAuth();

    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingExpenseId, setDeletingExpenseId] = useState(null);
    const navigate = useNavigate();

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));
            const userId =  userDetails.id;
            const response = await fetch(`http://127.0.0.1:5000/api/v1/expenses/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

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

    useEffect(() => {
        fetchExpenses();
    }, [navigate]);

    const handleAddExpense = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsDeleteModalVisible(false);
    };

    const handleSubmit = async (values) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://127.0.0.1:5000/api/v1/expenses/create/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setIsModalVisible(false);
            fetchExpenses();
        } catch (error) {
            console.error("Error submitting expense:", error);
        }
    };

    const showDeleteModal = (expenseId) => {
        setDeletingExpenseId(expenseId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/v1/expenses/delete/${deletingExpenseId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setIsDeleteModalVisible(false);
            fetchExpenses();
        } catch (error) {
            console.error("Error deleting expense:", error);
        }
    };

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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button onClick={() => console.log('Edit', record)} style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Button onClick={() => showDeleteModal(record.id)} type="danger">
                        Delete
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div style={{ width: '75%', margin: 'auto', marginTop: "20px" }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <Button type="primary" onClick={handleAddExpense}>
                    Add Expense
                </Button>
            </div>
            <Table dataSource={expenses} columns={columns} rowKey="id" loading={isLoading} />

            <Modal title="Add Expense" open={isModalVisible} onCancel={handleCancel} footer={null}>
                <Form onFinish={handleSubmit}>
                    <Form.Item name="date" label="Date">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item name="amount" label="Amount">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name="currency" label="Currency">
                        <Select
                            placeholder="Select a currency"
                            allowClear
                            style={{ width: '50%' }}
                        >
                            <Select.Option value="USD">BRL</Select.Option>
                            <Select.Option value="EUR">EUR</Select.Option>
                            <Select.Option value="BRL">GBP</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                    <Form.Item name="category_id" label="Category ID">
                        <Input />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>

            <Modal
                title="Confirm Delete"
                open={isDeleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this expense?</p>
            </Modal>
        </div>
    );
};

export default ExpensesTable;
