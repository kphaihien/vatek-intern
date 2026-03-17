
import { useDispatch, useSelector } from "react-redux";
import { useApi } from "../hooks/useApi"
import { Button, Input, Table } from "antd";
import Column from "antd/es/table/Column";
import ColumnGroup from "antd/es/table/ColumnGroup";
import { useEffect, useMemo, useState } from "react";
import CreateEmployeeModal from "../components/CreateEmployeeModal";
import { deleteEmployee } from "../redux/employeeSlice";
import EditEmployeeModal from "../components/EditEmployeeModal";
const {Search}=Input
const EmployeeRender=()=>{
    const [isCreateModalOpen,setIsCreateModalOpen]=useState(false)
    const [isEditingModalOpen,setIsEditingModalOpen]=useState(false);
    const [editingEmployee,setEditingEmployee]=useState({})
    const [searchParams,setSearchParams]=useState("")
    useApi('https://reqres.in/api/users?page=1')
    const employeeList = useSelector((state) => state.employees.employeeList)

    const filterEmployees = useMemo(() => {
        if (!searchParams) return employeeList  

        return employeeList.filter((empl) =>
            empl.lastname?.toLowerCase().includes(searchParams.toLowerCase()) ||
            empl.firstname?.toLowerCase().includes(searchParams.toLowerCase()) ||
            empl.email?.toLowerCase().includes(searchParams.toLowerCase())
        )
    }, [employeeList, searchParams])
    const dispatch=useDispatch()
    
    const columns = [
        {
            title:'Avatar',
            dataIndex:"avatar",
            render:(img)=>(
              <img src={img} alt="Lỗi hoặc chưa có ảnh"
                className="max-w-25 max-h-20"
              />  
            ),
        },
        {
            title: 'Full Name',
            fixed: 'start',
            dataIndex:"firstname",
            render:(firstname)=>(
                <p>{firstname}</p>
            ),
        },
        {
            title: 'Last Name',
            fixed: 'start',
            dataIndex: "lastname",
            render: (lastname) => (
                <p>{lastname}</p>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render:(email)=>(
                <p>{email}</p>
            )
        },
        {
            title: 'Sửa',
            fixed: 'end',
            width: 80   ,
            render: (_,record) =><button onClick={()=>handleEditUser(record)}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-600 cursor-pointer size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg></button>
,
        },
        {
            title: 'Xóa',
            width: 80,
            render: (_,record) => <button onClick={()=>handleDeleteEmployee(record)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-red-500 cursor-pointer size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg></button>
            ,
        },
    ];
        const handleEditUser=(record)=>{
            setEditingEmployee(record)
            setIsEditingModalOpen(true)
        }
        const handleDeleteEmployee=(record)=>{
            dispatch(deleteEmployee(record))
        }
        const handleOnSearch=()=>{
            // const employees=employees.filter((empl)=>empl.lastname.toLowerCase().includes(searchParams.toLowerCase())&&empl.firstname.toLowerCase().includes(searchParams.toLowerCase()))
        }
        
    return(
        <>
            <div className="flex flex-col justify-start gap-3 p-3 bg-gray-200">
                <h1 className="pt-2 pl-3 text-4xl font-bold text-black">Employees Rendering</h1>
                <div className="flex items-center justify-between pl-4">
                    <Search size="large" onChange={(e)=>setSearchParams(e.target.value)} placeholder="Tìm kiếm..." onSearch={handleOnSearch} style={{ width: 200 }} />

                    <Button onClick={()=>setIsCreateModalOpen(!isCreateModalOpen)} type="primary" className="self-end mr-4 cursor-pointer w-15 h-15">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </Button>
                </div>
                <Table className="px-4" dataSource={filterEmployees} columns={columns}>
                </Table>
            </div>
            {isCreateModalOpen&&<CreateEmployeeModal onClose={()=>setIsCreateModalOpen(false)} onCancel={setIsCreateModalOpen}/>}
            {isEditingModalOpen&&<EditEmployeeModal editingEmployee={editingEmployee} onClose={()=>setIsEditingModalOpen(false)}/>}
        </>
    )
}
export default EmployeeRender