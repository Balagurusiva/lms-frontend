"use client"
import React, { useState, useEffect } from 'react'
import { getAllTask } from '../../../../actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Button } from '../../../../components/ui/button'

import { columns } from './column'
import { DataTable } from './data-table';

const page = () => {

    //data fetching
    const [allTasks, setAllTasks] = useState([]);
    const fetchData = async () => {
        const response = await getAllTask();
        setAllTasks(response);
    };

    useEffect(() => {
        fetchData();
    }, []);

    //date input process
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())


    const tasks = [
        {
            "date_id": 1,
            "date": "2024-07-01",
            "approved_by": 123,
            "approved_status": true,
            "weekly_status_created_at": "2024-07-01T10:00:00Z",
            "weekly_status_updated_at": "2024-07-01T15:30:00Z",
            "total_duration": 480,
            "task_count": 3,
            "tasks": [
                {
                    "task_id": 1,
                    "task_name": "Implement new feature",
                    "duration": 180,
                    "created_at": "2024-07-01T10:30:00Z",
                    "updated_at": "2024-07-01T10:30:00Z"
                },
                {
                    "task_id": 2,
                    "task_name": "Code review",
                    "duration": 120,
                    "created_at": "2024-07-01T13:00:00Z",
                    "updated_at": "2024-07-01T13:00:00Z"
                },
                {
                    "task_id": 3,
                    "task_name": "Team meeting",
                    "duration": 180,
                    "created_at": "2024-07-01T15:00:00Z",
                    "updated_at": "2024-07-01T15:00:00Z"
                }
            ]
        },
        {
            "date_id": 2,
            "date": "2024-07-08",
            "approved_by": 456,
            "approved_status": false,
            "weekly_status_created_at": "2024-07-08T09:00:00Z",
            "weekly_status_updated_at": "2024-07-08T17:00:00Z",
            "total_duration": 360,
            "task_count": 2,
            "tasks": [
                {
                    "task_id": 4,
                    "task_name": "Bug fixing",
                    "duration": 240,
                    "created_at": "2024-07-08T09:30:00Z",
                    "updated_at": "2024-07-08T09:30:00Z"
                },
                {
                    "task_id": 5,
                    "task_name": "Documentation",
                    "duration": 120,
                    "created_at": "2024-07-08T14:00:00Z",
                    "updated_at": "2024-07-08T14:00:00Z"
                }
            ]
        }
    ]

    return (
        <div className='p-5 pt-2'>
            <div className="title  ">
                <p className='text-[22px] font-bold'>Timesheet</p>
            </div>

            <div className="date-inputs flex justify-between items-center mt-2">
                <div className="start-date flex items-center gap-2">
                    <p>Start Date</p>
                    <input type="date" className='w-[200px] border-2 border-gray-400 px-2 py-1 rounded-md' onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="to-date flex items-center gap-2">
                    <p>to Date</p>
                    <input type="date" className='w-[200px] border-2 border-gray-400 px-2 py-1 rounded-md' onChange={(e) => setEndDate(e.target.value)} />
                </div>
                <div className="setDate-button">
                    <Button>Get Timesheet</Button>
                </div>
            </div>

            {/* Timesheet table */}
            <div className="container mx-auto py-5">
                <DataTable columns={columns} data={tasks} />
            </div>


        </div>
    )
}

export default page
