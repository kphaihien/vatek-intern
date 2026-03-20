import { render, screen, fireEvent } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import employeeReducer from '../redux/employeeSlice';
import EmployeeRender from '../pages/EmployeeRender';

jest.mock('../hooks/useApi', () => ({
  useApi: jest.fn(() => ({ message: '', isLoading: false, error: null })),
}));

jest.mock('antd', () => {
  const React = require('react');

  const Table = ({ dataSource, columns }) => (
    <table data-testid="employee-table">
      <tbody>
        {(dataSource || []).map((row, i) => (
          <tr key={row.id || i}>
            {columns.map((col, j) => (
              <td key={j}>
                {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const Button = ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );

  const Input = React.forwardRef((props, ref) => <input ref={ref} {...props} />);
  Input.Search = ({ onChange, placeholder }) => (
    <div>
      <input placeholder={placeholder} onChange={onChange} data-testid="search-input" />
    </div>
  );

  return { Table, Button, Input };
});

jest.mock('../components/EmployeeModal', () => ({ onClose, type, editingEmployee }) => (
  <div data-testid="employee-modal">
    <span data-testid="modal-type">{type}</span>
    {editingEmployee?.first_name && (
      <span data-testid="editing-name">{editingEmployee.first_name}</span>
    )}
    <button onClick={onClose}>Close Modal</button>
  </div>
));

const mockEmployees = [
  {
    id: '1',
    first_name: 'Nguyen',
    last_name: 'Hien',
    email: 'hien@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    first_name: 'Tran',
    last_name: 'Anh',
    email: 'anh@gmail.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
];

const createStore = (employees = mockEmployees) =>
  configureStore({
    reducer: { employees: employeeReducer },
    preloadedState: { employees: { employeeList: employees } },
  });

const renderEmployeeRender = (store) =>
  render(
    <Provider store={store}>
      <EmployeeRender />
    </Provider>
  );

describe('EmployeeRender', () => {
  it('renders the page heading', () => {
    renderEmployeeRender(createStore());
    expect(screen.getByText('employee.title')).toBeInTheDocument();
  });

  it('renders employee table', () => {
    renderEmployeeRender(createStore());
    expect(screen.getByTestId('employee-table')).toBeInTheDocument();
  });

  it('renders all employees from store', () => {
    renderEmployeeRender(createStore());
    expect(screen.getByText('Nguyen')).toBeInTheDocument();
    expect(screen.getByText('Tran')).toBeInTheDocument();
  });

  it('renders empty table when no employees', () => {
    renderEmployeeRender(createStore([]));
    expect(screen.getByTestId('employee-table')).toBeInTheDocument();
    expect(screen.queryByText('Nguyen')).not.toBeInTheDocument();
  });

  it('filters employees by search text', () => {
    renderEmployeeRender(createStore());
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'hien' } });
    expect(screen.getByText('Nguyen')).toBeInTheDocument();
    expect(screen.queryByText('Tran')).not.toBeInTheDocument();
  });

  it('shows all employees when search is cleared', () => {
    renderEmployeeRender(createStore());
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'hien' } });
    fireEvent.change(screen.getByTestId('search-input'), { target: { value: '' } });
    expect(screen.getByText('Nguyen')).toBeInTheDocument();
    expect(screen.getByText('Tran')).toBeInTheDocument();
  });

  it('open EmployeeModal with type===add when click +', () => {
    renderEmployeeRender(createStore());
    const addBtn = screen.getAllByRole('button').find((b) => !b.dataset.testid);
    fireEvent.click(addBtn);
    expect(screen.getByTestId('employee-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-type').textContent).toBe('add');
  });

  it('closes modal khi onClose được gọi close modal when onClose was called', () => {
    renderEmployeeRender(createStore());
    const addBtn = screen.getAllByRole('button').find((b) => !b.dataset.testid);
    fireEvent.click(addBtn);
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('employee-modal')).not.toBeInTheDocument();
  });

  it('open EmployeeModal with type ===aedit when click edit icon', () => {
    renderEmployeeRender(createStore());
    const rowButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.dataset.testid)
      .slice(1);
    fireEvent.click(rowButtons[0]);
    expect(screen.getByTestId('employee-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-type').textContent).toBe('edit');
  });

  it('send editingEmployee when open edit modal', () => {
    renderEmployeeRender(createStore());
    const rowButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.dataset.testid)
      .slice(1);
    fireEvent.click(rowButtons[0]);
    expect(screen.getByTestId('editing-name').textContent).toBe('Nguyen');
  });

  it('close edit modal when onClose was calling', () => {
    renderEmployeeRender(createStore());
    const rowButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.dataset.testid)
      .slice(1);
    fireEvent.click(rowButtons[0]);
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('employee-modal')).not.toBeInTheDocument();
  });

  it('deletes employee when click delete button', () => {
    const store = createStore();
    renderEmployeeRender(store);
    const rowButtons = screen
      .getAllByRole('button')
      .filter((b) => !b.dataset.testid)
      .slice(1);
    fireEvent.click(rowButtons[1]);
    expect(store.getState().employees.employeeList).toHaveLength(1);
  });
});
