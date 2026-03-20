import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmployeeList } from '../redux/employeeSlice';
import { mockDataEmployees } from '../data/mockData';

export const useApi = (url) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const respone = await axios(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'reqres_46b7211ee7bb44599042a913ff48f49c',
          },
        });
        dispatch(setEmployeeList(respone.data.data));
        setMessage('Fetch data successfully');
        setIsLoading(false);
      } catch (error) {
        dispatch(setEmployeeList(mockDataEmployees));
        setError(error);
        setIsLoading(false);
      }
    };
    fetchData();
  });
  return { message, isLoading, error };
};
