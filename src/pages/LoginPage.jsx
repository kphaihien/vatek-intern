
import { Button, Checkbox, Form, Input } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
const LoginPage = () => {
    const mockUser={
        username:"hien",
        password:"123123"
    }
    const [user,setUser]=useState({})
    const navigate=useNavigate()
    const onFinish = values => {
        setUser(values)
        try {
            if(user.username===mockUser.username&&user.password===mockUser.password){
                alert("Đăng nhập thành công")
                setUser({})
                navigate("/employees")
                return
            }
            console.log(values.username, mockUser.username);
            
        } catch (error) {
            alert("Sai tài khoản hoặc mật khẩu")
            setUser({})
        }
    };
    return (
        <>
            <div className='grid w-full h-screen grid-cols-3 bg-purple-200'>
                <Form
                    className='flex flex-col items-start self-center w-full col-start-2 rounded-lg'
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        className='w-full'
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        className='w-full'
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item className='self-end' label={null}>
                        <Button type="primary" htmlType="submit" className=''>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}
export default LoginPage