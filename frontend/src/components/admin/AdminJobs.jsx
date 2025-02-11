import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AdminJobsTable from './AdminJobsTable'

import { searchJobByText } from '@/redux/jobSlice'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'


const AdminJobs = () => {
    useGetAllAdminJobs();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    useEffect(()=>{
      dispatch(searchJobByText(input));
  },[input]); 
  return (
    <div>
    <Navbar />
    <div className='max-w-6xl mx-auto my-10'>
        <div className='flex items-center justify-between my-5'>
            <Input
                className="w-fit"
                placeholder="Filter by role"
                onChange={(e) => setInput(e.target.value)}
            />
            <Button onClick={() => navigate("/admin/jobs/create")}>Post New Job</Button>
        </div>
        <AdminJobsTable/>
    </div>
</div>
  )
}

export default AdminJobs

