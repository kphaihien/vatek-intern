import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import employeeReducer from '../redux/employeeSlice';
import EmployeeModal from '../components/EmployeeModal';

// Mock antd
jest.mock('antd', () => {
  const React = require('react');

  let formValues = {};

  const Form = ({ children }) => <div data-testid="form">{children}</div>;

  Form.Item = ({ children, label, name }) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      {React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { id: name, name }) : child
      )}
    </div>
  );

  Form.useForm = () => {
    const form = {
      resetFields: jest.fn(),
      setFieldsValue: (vals) => {
        formValues = { ...formValues, ...vals };
      },
      validateFields: jest.fn().mockResolvedValue({ ...formValues }),
      getFieldValue: (name) => formValues[name],
    };
    return [form];
  };

  const Input = React.forwardRef(({ id, name, onChange, ...props }, ref) => (
    <input
      id={id}
      name={name}
      ref={ref}
      onChange={(e) => {
        formValues[name] = e.target.value;
        onChange && onChange(e);
      }}
      {...props}
    />
  ));

  Input.TextArea = React.forwardRef(({ id, name, rows, ...props }, ref) => (
    <textarea id={id} name={name} ref={ref} rows={rows} {...props} />
  ));

  Input.Password = React.forwardRef(({ id, name, ...props }, ref) => (
    <input id={id} name={name} type="password" ref={ref} {...props} />
  ));

  const Modal = ({ children, open, onOk, onCancel, title, okText, cancelText }) =>
    open ? (
      <div data-testid="modal">
        {title && <div data-testid="modal-title">{title}</div>}
        <div>{children}</div>
        <button data-testid="ok-btn" onClick={onOk}>
          {okText || 'OK'}
        </button>
        <button data-testid="cancel-btn" onClick={onCancel}>
          {cancelText || 'Cancel'}
        </button>
      </div>
    ) : null;

  const message = { success: jest.fn(), error: jest.fn() };

  return { Form, Input, Modal, message, InputNumber: () => null, Select: () => null };
});

// Mock antd icons
jest.mock('@ant-design/icons', () => ({
  EditOutlined: () => <span data-testid="edit-icon" />,
  PlusCircleOutlined: () => <span data-testid="plus-icon" />,
}));

const mockEmployee = {
  id: '1',
  first_name: 'Nguyen',
  last_name: 'Hien',
  email: 'hien@gmail.com',
  avatar: 'https://i.pravatar.cc/150?img=1',
};

const createStore = (employees = []) =>
  configureStore({
    reducer: { employees: employeeReducer },
    preloadedState: { employees: { employeeList: employees } },
  });

const renderModal = (props, store = createStore()) =>
  render(
    <Provider store={store}>
      <EmployeeModal {...props} />
    </Provider>
  );

describe('EmployeeModal — type=add', () => {
  let onClose, store;

  beforeEach(() => {
    onClose = jest.fn();
    store = createStore();
  });

  it('renders modal', () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('show icon plus when type === add', () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('render title when type ===add', () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    expect(screen.getByText('employee.addTitle')).toBeInTheDocument();
  });

  it('render fields', () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    expect(screen.getByLabelText('employee.firstName')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.lastName')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.email')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.avatarUrl')).toBeInTheDocument();
  });

  it('dispatch addEmployee and call onClose when click save', async () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    fireEvent.click(screen.getByTestId('ok-btn'));
    await new Promise((r) => setTimeout(r, 50));
    expect(onClose).toHaveBeenCalled();
    expect(store.getState().employees.employeeList).toHaveLength(1);
  });

  it('call onClose when click cancel', () => {
    renderModal({ type: 'add', onClose, editingEmployee: {} }, store);
    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('EmployeeModal — type=edit', () => {
  let onClose, store;

  beforeEach(() => {
    onClose = jest.fn();
    store = createStore([mockEmployee]);
  });

  it('renders modal', () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('show icon edit when type===edit', () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('render edit title', () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    expect(screen.getByText('employee.editTitle')).toBeInTheDocument();
  });

  it('render fields', () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    expect(screen.getByLabelText('employee.firstName')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.lastName')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.email')).toBeInTheDocument();
    expect(screen.getByLabelText('employee.avatarUrl')).toBeInTheDocument();
  });

  it('dispatch editEmployee and call onClose when click save', async () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    fireEvent.click(screen.getByTestId('ok-btn'));
    await new Promise((r) => setTimeout(r, 50));
    expect(onClose).toHaveBeenCalled();
  });

  it('call onClose when cancel was clicked', () => {
    renderModal({ type: 'edit', onClose, editingEmployee: mockEmployee }, store);
    fireEvent.click(screen.getByTestId('cancel-btn'));
    expect(onClose).toHaveBeenCalled();
  });
});
