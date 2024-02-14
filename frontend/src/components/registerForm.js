import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Input, Button } from 'antd';

const formFields = [
    {
        label: "Username",
        name: "username",
        rules: [{ required: true, message: 'Please input your username!' }],
    },
    {
        label: "Email",
        name: "email",
        rules: [
            { 
                required: true, 
                message: 'Please input your email!' 
            },
            {
                type: "email",
                message: "The input is not valid E-mail!",
            },
        ],
    },
    {
        label: "Password",
        name: "password",
        rules: [{ required: true, message: 'Please input your password!' }],
    },
];

export default function Register() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/v1/users/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.status === 201) {
                toast.success("Registration successful");
                navigate("/login");
            } else {
                toast.warning(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred during registration");
        }
    };

    return (
        <div style={{ height: '75vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Form
                form={form}
                name="register"
                className="register-form"
                onFinish={handleFormSubmit}
                layout="vertical"
                style={{
                    maxWidth: '300px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    padding: '24px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                {formFields.map((field, index) => (
                    <Form.Item
                        key={index}
                        name={field.name}
                        label={field.label}
                        rules={field.rules}
                    >
                        <Input 
                            type={field.name === 'password' ? 'password' : 'text'} 
                        />
                    </Form.Item>
                ))}

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="register-form-button" style={{marginRight: '10px'}}>
                        Register
                    </Button>
                </Form.Item>
                Already have an account? <Link to="/login">Login now!</Link>
            </Form>
        </div>
    );
}

