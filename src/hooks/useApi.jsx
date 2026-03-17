import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmployeeList } from '../redux/employeeSlice';

export const useApi = (url) => {
    const [message, setMessage] = useState('');
    const mockData = [
        {
            id: "1",
            avatar: "https://upload.wikimedia.org/wikipedia/en/b/bd/Doraemon_character.png",
            lastname: "hien",
            firstname: "nguyen",
            email: "hien@gmail.com",
        },
        {
            id: "2",
            avatar: "https://i.pravatar.cc/150?img=1",
            lastname: "anh",
            firstname: "tran",
            email: "anh.tran@gmail.com",
        },
        {
            id: "3",
            avatar: "https://i.pravatar.cc/150?img=2",
            lastname: "minh",
            firstname: "le",
            email: "minh.le@gmail.com",
        },
        {
            id: "4",
            avatar: "https://i.pravatar.cc/150?img=3",
            lastname: "linh",
            firstname: "pham",
            email: "linh.pham@gmail.com",
        },
        {
            id: "5",
            avatar: "https://i.pravatar.cc/150?img=4",
            lastname: "tuan",
            firstname: "hoang",
            email: "tuan.hoang@gmail.com",
        },
        {
            id: "6",
            avatar: "https://i.pravatar.cc/150?img=5",
            lastname: "mai",
            firstname: "vo",
            email: "mai.vo@gmail.com",
        },
        {
            id: "7",
            avatar: "https://i.pravatar.cc/150?img=6",
            lastname: "khoa",
            firstname: "do",
            email: "khoa.do@gmail.com",
        },
        {
            id: "8",
            avatar: "https://i.pravatar.cc/150?img=7",
            lastname: "nhung",
            firstname: "bui",
            email: "nhung.bui@gmail.com",
        },
        {
            id: "9",
            avatar: "https://i.pravatar.cc/150?img=8",
            lastname: "dat",
            firstname: "pham",
            email: "dat.pham@gmail.com",
        },
        {
            id: "10",
            avatar: "https://i.pravatar.cc/150?img=9",
            lastname: "hoa",
            firstname: "nguyen",
            email: "hoa.nguyen@gmail.com",
        },
        {
            id: "11",
            avatar: "https://i.pravatar.cc/150?img=10",
            lastname: "duc",
            firstname: "tran",
            email: "duc.tran@gmail.com",
        }
    ];
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch=useDispatch();
    useEffect(() => {
        const fetchData=async()=>{
            setIsLoading(true)
            try {
                const respone=await axios(url,{
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json',
                        'x-api-key':'reqres_46b7211ee7bb44599042a913ff48f49c',
                    }   
                })      
                dispatch(setEmployeeList(respone.data.data))
                setMessage('Fetch data successfully')
                setIsLoading(false)
            } catch (error) {
                dispatch(setEmployeeList(mockData))
                setError(error)
                setIsLoading(false)
            }
        }
        fetchData();
    },[])
    return { message, isLoading, error };
}