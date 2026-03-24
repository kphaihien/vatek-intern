import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setEmployeeList } from '../redux/employeeSlice';
import { mockDataEmployees } from '../data/mockData';
import axiosInstance from '../config/axiosConfig';

export const useApi = (url) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(url);
        dispatch(setEmployeeList(response.data.data));
        setMessage('Fetch data successfully');
      } catch (error) {
        dispatch(setEmployeeList(mockDataEmployees));
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { message, isLoading, error };
};

export const useMutation = ({ method, url, body }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const mutate = async () => {
    try {
      setIsLoading(true);
      const respone = await axiosInstance({
        url,
        method,
        data: body,
      });
      setMessage('Successfully');
      // return respone.data;
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return { mutate, message, isLoading, error };
};
