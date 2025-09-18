import React, { useMemo, useState } from "react";
import { useTable } from "react-table";

export default function EditableTable({ columnsConfig, data, onChange }) {
    const [tableData, setTableData] = useState(data);

    const handleInputChange = (rowIndex, field, value) => {
        const updatedData = [...tableData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
        setTableData(updatedData);
        if (onChange) onChange(updatedData);
    };

    // react-table columns config
    const columns = useMemo(
        () =>
            [
                ...columnsConfig.map((col) => ({
                    Header: col.label,
                    accessor: col.key,
                    Cell: ({ value, row }) => {
                        const rowIndex = row.index;

                        if (col.type === "text") {
                            return (
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) =>
                                        handleInputChange(rowIndex, col.key, e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-400"
                                />
                            );
                        }

                        if (col.type === "number") {
                            return (
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) =>
                                        handleInputChange(rowIndex, col.key, e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-400"
                                />
                            );
                        }

                        if (col.type === "select") {
                            return (
                                <select
                                    value={value}
                                    onChange={(e) =>
                                        handleInputChange(rowIndex, col.key, e.target.value)
                                    }
                                    className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-400"
                                >
                                    {col.options.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt}
                                        </option>
                                    ))}
                                </select>
                            );
                        }

                        if (col.type === "readonly") {
                            return <span className="font-medium">{value}</span>;
                        }

                        return value;
                    },
                })),
                {
                    Header: "Actions",
                    accessor: "actions",
                    Cell: ({ row }) => {
                        const [open, setOpen] = useState(false);

                        return (
                            <div className="relative inline-block">
                                <button
                                    onClick={() => setOpen(!open)}
                                    className="px-3 py-1 text-sm bg-custom-yellow text-black rounded-md hover:bg-blue-600 cursor-pointer"
                                >
                                    ⋮
                                </button>

                                {open && (
                                    <div className="absolute bottom-full mb-2 right-0 w-32 bg-white border rounded-md shadow-lg z-10">
                                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                            Edit
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                            Delete
                                        </button>
                                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                                            Share
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    },
                },
            ],
        [tableData]
    );

    const tableInstance = useTable({ columns, data: tableData });

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
            >
                <thead className="bg-gray-50">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps()}
                                    key={column.id}
                                    className="px-4 py-2.5 text-left bg-custom-yellow text-sm font-medium text-gray-600"
                                >
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 bg-white">
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={row.id}>
                                {row.cells.map((cell) => (
                                    <td
                                        {...cell.getCellProps()}
                                        key={cell.column.id}
                                        className="px-4 py-2 text-sm text-gray-700"
                                    >
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
