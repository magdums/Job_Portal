import React from 'react'
import { Badge } from './ui/badge'
import { Ghost } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const JobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <h1>{job?.company?.name}</h1>
                <p>India</p>
                <div>
                    <h1>{job?.title}</h1>
                    <p>{job?.description}</p>
                </div>
                <div className='flex items-center gap-2 mt-4'>
                    <Badge className={'text-blue-700 font-bold'} variant={Ghost}>{job?.position}Positions</Badge>
                    <Badge className={'text-red-600 font-bold'} variant={Ghost}>{job?.jobType}</Badge>
                    <Badge className={'text-purple-700 font-bold'} variant={Ghost}>{job?.salary}LPA</Badge>
                </div>

            </div>
        </div>
    )
}

export default JobCards
