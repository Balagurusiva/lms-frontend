
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { capitalizeWords } from "../../../../utils/index";
import { ArrowUpDown, EditIcon, DeleteIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";

import { editTask, deleteTask } from "../../../../actions";

export const columns = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "task_ids",
        header: "Task ID",
        cell: ({ row }) => {
            return row.original.tasks.map((task) => (
                <div key={task.task_id}>
                    <p>{task.task_id}</p>
                </div>
            ));
        },
    },
    {
        accessorKey: "tasks",
        header: "Tasks",
        cell: ({ row }) => {
            return row.original.tasks.map((task) => (
                <div key={task.task_id}>
                    <p className="flex justify-between">
                        {capitalizeWords(task.task_name)}
                        <span className="flex gap-2">
                            <EditIcon onClick={() => handleEditTask(task, row.original.date)} />
                            <DeleteIcon onClick={() => handleDeleteTask(task.task_id)} />
                        </span>
                    </p>
                </div>
            ));
        },
    },
    {
        accessorKey: "task_duration",
        header: "Task Duration (minutes)",
        cell: ({ row }) => {
            return row.original.tasks.map((task) => (
                <div key={task.task_id}>
                    <p>{task.duration}</p>
                </div>
            ));
        },
    },
    {
        accessorKey: "total_duration",
        header: "Total Hours",
        cell: ({ row }) => {
            const hours = (row.original.total_duration / 60).toFixed(2);
            return <p>{hours} hours</p>;
        },
    },
    {
        accessorKey: "approved_status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <p
                    className={cn(
                        "w-[80px] p-2 flex items-center justify-center text-white rounded-sm bg-red-500",
                        { "bg-green-500": row.original.approved_status }
                    )}
                >
                    {row.original.approved_status ? "Approved" : "Not Approved"}
                </p>
            );
        },
    },
];