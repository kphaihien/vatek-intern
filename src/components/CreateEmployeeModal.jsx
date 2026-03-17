import React from 'react'
import {
    Button,
    Cascader,
    Checkbox,
    ColorPicker,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Radio,
    Rate,
    Select,
    Slider,
    Switch,
    Transfer,
    Tree,
    TreeSelect,
    Upload,
    Modal
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addEmployee } from '../redux/employeeSlice';


const { TextArea } = Input;
const CreateEmployeeModal = ({onCancel,onClose}) => {
    const [form]=Form.useForm()
    const dispatch=useDispatch()
    const firstname=Form.useWatch('firstname',form)
    const lastname= Form.useWatch('lastname', form)
    const email = Form.useWatch('email', form)
    const handleOk=()=>{
        dispatch(addEmployee({id:Date.now(),firstname,lastname,email}))
        onClose();
    }
  return (
    <>
        <div >
            <Modal open={true}
                  onOk={handleOk}
                  onCancel={()=>onCancel(false)}
            >
                <Form form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: 600 }}
                >
                    <Form.Item label="First Name" name="firstname" >
                        <Input />
                    </Form.Item>
                      <Form.Item label="Last Name" name="lastname">
                          <Input />
                      </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
          </div>
    </>
  )
}

export default CreateEmployeeModal