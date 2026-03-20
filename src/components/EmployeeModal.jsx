import { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addEmployee, editEmployee } from '../redux/employeeSlice';
import { useTranslation } from 'react-i18next';

const EmployeeModal = ({ onClose, editingEmployee, type }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const isEdit = type === 'edit';
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      values.id = isEdit ? editingEmployee.id : Date.now();
      dispatch(isEdit ? editEmployee(values) : addEmployee(values));
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
        last_name: editingEmployee.last_name,
        first_name: editingEmployee.first_name,
        email: editingEmployee.email,
        avatar: editingEmployee.avatar,
      });
    }
  }, [editingEmployee, form]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-gray-800">
          {isEdit ? <EditOutlined /> : <PlusCircleOutlined />}
          <span>{isEdit ? `${t('employee.editTitle')}` : `${t('employee.addTitle')}`}</span>
        </div>
      }
      open={true}
      onOk={handleSave}
      onCancel={handleCancel}
      okText="Lưu thay đổi"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="first_name"
            label={`${t('employee.firstName')}`}
            rules={[{ required: true, message: 'Vui lòng nhập First Name' }]}
            className="col-span-2"
          >
            <Input placeholder={`${t('employee.firstNamePlaceholder')}`} />
          </Form.Item>

          <Form.Item
            name="last_name"
            label={`${t('employee.lastName')}`}
            className="col-span-2"
            rules={[{ required: true, message: `Vui lòng nhập ${t('employee.lastName')}` }]}
          >
            <Input placeholder={`${t('employee.lastNamePlaceholder')}`} />
          </Form.Item>
          <Form.Item
            name="email"
            label={`${t('employee.email')}`}
            rules={[{ required: true, message: `Vui lòng nhập ${t('employee.email')}` }]}
            className="col-span-2"
          >
            <Input placeholder={`${t('employee.emailPlaceholder')}`} />
          </Form.Item>
          <Form.Item name="avatar" label={`${t('employee.avatarUrl')}`} className="col-span-2">
            <Input.TextArea rows={3} placeholder={`${t('employee.avatarPlaceholder')}`} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EmployeeModal;
