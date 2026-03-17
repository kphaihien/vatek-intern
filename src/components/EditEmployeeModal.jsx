import { useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editEmployee } from "../redux/employeeSlice";


const EditEmployeeModal = ({ onClose,editingEmployee }) => {
    const [form] = Form.useForm();
    const dispatch=useDispatch();
    console.log(editingEmployee);
    
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            values.id=editingEmployee.id
            console.log(values,"moi");
            
            dispatch(editEmployee(values))
            message.success("Cập nhật sách thành công!");
            form.resetFields();
            onClose();
        } catch (err) {
            if (err?.data?.message) {
                message.error(err.data.message);
            }     
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };
    useEffect(() => {
        if (editingEmployee) {
            form.setFieldsValue({
                lastname: editingEmployee.lastname,
                firstname: editingEmployee.firstname,
                email: editingEmployee.email,
                avatar: editingEmployee.avatar
            });
        }
    }, [editingEmployee, form]);
    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-gray-800">
                    <EditOutlined className="text-blue-500" />
                    <span>Chỉnh sửa nhân viên</span>
                </div>
            }
            open={true}
            onOk={handleSave}
            onCancel={handleCancel}
            okText="Lưu thay đổi"
            cancelText="Hủy"
            width={600}
            okButtonProps={{ className: "bg-blue-500 border-none" }}
        >
            <Form form={form} layout="vertical" className="mt-4">
                <div className="grid grid-cols-2 gap-x-4">
                    <Form.Item
                        name="firstname"
                        label="First Name"
                        rules={[{ required: true, message: "Vui lòng nhập First Name" }]}
                        className="col-span-2"
                    >
                        <Input placeholder="Nhập First Name" />
                    </Form.Item>

                    <Form.Item
                        name="lastname"
                        label="Last Name"
                        className="col-span-2"
                        rules={[{ required: true, message: "Vui lòng nhập Last Name" }]}
                    >
                        <Input placeholder="Nhập Last Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: "Vui lòng nhập email" }]}
                        className="col-span-2"
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>


                    <Form.Item name="avatar" label="URL avatar" className="col-span-2">
                        <Input.TextArea rows={3} placeholder="Nhập đường dẫn tới avatar" />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default EditEmployeeModal;