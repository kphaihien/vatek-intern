import { useDispatch, useSelector } from 'react-redux';
import { useApi } from '../hooks/useApi';
import { Button, Input, Table } from 'antd';
import { useMemo, useState } from 'react';
import { deleteEmployee } from '../redux/employeeSlice';
import EmployeeModal from '../components/EmployeeModal';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

const EmployeeRender = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState({});
  const [searchParams, setSearchParams] = useState('');
  const [type, setType] = useState('');

  useApi('https://reqres.in/api/users?page=1');
  const employeeList = useSelector((state) => state.employees.employeeList);

  const filterEmployees = useMemo(() => {
    if (!searchParams) return employeeList;
    return employeeList.filter(
      (empl) =>
        empl.lastname?.toLowerCase().includes(searchParams.toLowerCase()) ||
        empl.firstname?.toLowerCase().includes(searchParams.toLowerCase()) ||
        empl.email?.toLowerCase().includes(searchParams.toLowerCase())
    );
  }, [employeeList, searchParams]);

  const dispatch = useDispatch();

  const columns = [
    {
      title: `${t('employee.avatar')}`,
      dataIndex: 'avatar',
      width: 120,
      render: (img) => (
        <img
          src={img}
          alt="avatar"
          className="h-12 w-12 rounded-full object-cover sm:h-16 sm:w-16"
        />
      ),
    },
    {
      title: `${t('employee.firstName')}`,
      dataIndex: 'first_name',
      width: 120,
      render: (firstname) => <p>{firstname}</p>,
    },
    {
      title: `${t('employee.lastName')}`,
      dataIndex: 'last_name',
      width: 120,
      render: (lastname) => <p>{lastname}</p>,
    },
    {
      title: `${t('employee.email')}`,
      dataIndex: 'email',
      responsive: ['sm'],
      render: (email) => <p className="break-all">{email}</p>,
    },
    {
      title: `${t('employee.editAction')}`,
      fixed: 'right',
      width: 60,
      render: (_, record) => (
        <button onClick={() => handleEditUser(record)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 cursor-pointer text-green-600 sm:size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      ),
    },
    {
      title: `${t('employee.deleteAction')}`,
      fixed: 'right',
      width: 60,
      render: (_, record) => (
        <button onClick={() => handleDeleteEmployee(record)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 cursor-pointer text-red-500 sm:size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      ),
    },
  ];

  const handleEditUser = (record) => {
    setType('edit');
    setEditingEmployee(record);
    setIsModalOpen(true);
  };
  const handleDeleteEmployee = (record) => dispatch(deleteEmployee(record));
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee({});
  };

  return (
    <>
      <div className="flex min-h-screen flex-col gap-3 bg-gray-200 p-3">
        <h1 className="pt-2 pl-3 text-2xl font-bold text-black sm:text-4xl">
          {t('employee.title')}
        </h1>

        <div className="flex items-center justify-between gap-2 px-3">
          <Search
            className="w-full max-w-xs sm:max-w-sm"
            size="large"
            onChange={(e) => setSearchParams(e.target.value)}
            placeholder={t('employee.searchPlaceholder')}
          />
          <Button
            onClick={() => {
              setType('add');
              setIsModalOpen(true);
            }}
            type="primary"
            className="cursor-pointer"
            size="large"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
          >
            <span className="hidden sm:inline">{t('employee.addTitle')}</span>
          </Button>
        </div>

        <div className="overflow-hidden px-3">
          <Table dataSource={filterEmployees} columns={columns} rowKey="id" scroll={{ x: 500 }} />
        </div>
      </div>

      {isModalOpen && (
        <EmployeeModal type={type} editingEmployee={editingEmployee} onClose={handleCloseModal} />
      )}
    </>
  );
};

export default EmployeeRender;
