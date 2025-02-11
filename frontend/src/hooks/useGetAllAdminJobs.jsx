import React from 'react'
import { JOB_API_END_POINT } from '@/components/utils/constant';
import { setAllAdminJobs} from '@/redux/jobSlice';
import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`,{withCredentials:true});
                if(res.data.success){
                    console.log("API Response:", res.data.jobs); // Log API response to verify
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log("API Error:", error);
            }
        }
        fetchAllAdminJobs();
    },[])
}

export default useGetAllAdminJobs

