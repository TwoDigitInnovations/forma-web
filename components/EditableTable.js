import React, { useMemo } from "react";
import { useTable } from "react-table";

export default function EditableTable({ columnsConfig, data, onChange, setTotal }) {
    const tableData = useMemo(() => data, [data]);

    const handleUpdateRow = (rowIndex, field, value) => {
        const updatedData = [...data];
        const row = { ...updatedData[rowIndex] };

        row[field] = value;

        if (field === "amount") {
            const rate = parseFloat(row.rate) || 0;
            const quantity = parseFloat(row.quantity) || 0;
            row.amount = rate * quantity;
        }

        if (field === "rate" || field === "quantity") {
            const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
            const quantity =
                field === "quantity" ? parseFloat(value) || 0 : parseFloat(row.quantity) || 0;
            row.amount = rate * quantity;
        }

        updatedData[rowIndex] = row;

        const total = updatedData.reduce(
            (sum, item) => sum + (parseFloat(item.amount) || 0),
            0
        );
        setTotal(total);

        onChange && onChange(updatedData);
    };

    const handleDeleteRow = (rowIndex) => {
        const updated = tableData.filter((_, idx) => idx !== rowIndex);
        onChange && onChange(updated);
    };

    const handleAddRow = () => {
        const blankRow = {};
        columnsConfig.forEach((col) => {
            if (col.type === "select" && col.options && col.options.length > 0) {
                blankRow[col.key] = col.options[0];
            } else {
                blankRow[col.key] = "";
            }
        });
        const updated = [...tableData, blankRow];
        onChange && onChange(updated);
    };

    const columns = useMemo(
        () => [
            ...columnsConfig.map((col) => ({
                Header: col.label,
                accessor: col.key,
                Cell: ({ value, row }) => {
                    const rowIndex = row.index;
                    const [localValue, setLocalValue] = React.useState(value ?? "");

                    React.useEffect(() => {
                        setLocalValue(value ?? ""); // sync if external data changes
                    }, [value]);

                    if (col.type === "text" || col.type === "number") {
                        return (
                            <input
                                type={col.type}
                                value={localValue}
                                onChange={(e) => setLocalValue(e.target.value)}
                                onBlur={() => handleUpdateRow(rowIndex, col.key, localValue)}
                                className="w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm focus:outline-none focus:border-blue-400"
                            />
                        );
                    }

                    if (col.type === "select") {
                        return (
                            <select
                                value={localValue}
                                onChange={(e) => {
                                    setLocalValue(e.target.value);
                                    handleUpdateRow(rowIndex, col.key, e.target.value);
                                }}
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
                    const [open, setOpen] = React.useState(false);

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
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                        onClick={() => handleAddRow()}
                                    >
                                        Add New Row
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleDeleteRow(row?.index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                },
            },
        ],
        [columnsConfig, data]
    );

    const tableInstance = useTable({ columns, data: tableData });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        tableInstance;

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
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
