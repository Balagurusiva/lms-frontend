"use client";
import { IoIosClose, IoIosSearch } from "react-icons/io";
import RegistrationForm from "../../../../components/feedData/RegistrationForm";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../../components/ui/table";

import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useState } from "react";
import { capitalizeWords } from "../../../../utils/index";
import { ArrowUpDown, EditIcon, DeleteIcon } from "lucide-react";
import { cn } from "../../../../lib/utils";

import { editTask, deleteTask } from "../../../../actions";


export function DataTable({ data }) {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pagination, setPagination] = useState({
        pageSize: 5,
        pageIndex: 0,
    });

    const [show, setShow] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);


    const sumbitEditedTask = async (id, editedTask) => {
        const response = await editTask(id, editedTask)
        console.log(response)
    }

    const handleEditTask = (task, task_date) => {
        console.log(task_date)
        setCurrentTask({ ...task, task_date, user_id: window.localStorage.getItem("user_id") });
        setShow(true);
    };

    const handleDeleteTask = async (id) => {
        const response = await deleteTask(id)
        console.log(response)
    }

    const columns = [
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
                                <DeleteIcon />
                            </span>
                        </p>
                    </div>
                ));
            },
        },
        {
            accessorKey: "task_duration",
            header: (() => <p>Time Duration <br /> (minutes)</p>),
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

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        globalFilterFn: (row, columnId, value) => {
            console.log(row)
            return (
                row.getValue("task_name").toLowerCase().includes(value.toLowerCase())
            );
        },
    });

    return (
        <div className="w-full">

            <div className="rounded-md border min-h-[380px] relative overflow-clip shadow-xl">
                <Table>
                    <TableHeader className="bg-blue-300 text-black">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>



            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg relative">
                        <button
                            onClick={() => setShow(false)}
                            className="absolute top-2 right-2 text-red-500 text-xl"
                        >
                            <IoIosClose />
                        </button>
                        <h1 className="text-2xl font-bold text-center mb-4">Edit Task</h1>
                        <form className="space-y-4">
                            <div>
                                <label className="block">Task Name:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentTask ? currentTask.task_name : ""}
                                    onChange={(e) => setCurrentTask({ ...currentTask, task_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block">Time:</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={currentTask ? currentTask.task_time : ""}
                                    onChange={(e) => setCurrentTask({ ...currentTask, task_time: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => {
                                        sumbitEditedTask(currentTask.task_id, currentTask)
                                        setShow(false);
                                    }}
                                >
                                    save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
