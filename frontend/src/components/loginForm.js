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
        label: "Password",
        name: "password",
        rules: [{ required: true, message: 'Please input your password!' }],
    },
];

export default function Login() {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleFormSubmit = async (values) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.status === 200) {
                localStorage.setItem("userId", data.user.id);
                navigate("/");
                toast.success(data.message);
            } else {
                toast.warning(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Form
                form={form}
                name="login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={handleFormSubmit}
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
                    <Link className="login-form-forgot" to="/forgot">
                        Forgot password
                    </Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Login
                    </Button>
                    Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
        </div>
    );
}
