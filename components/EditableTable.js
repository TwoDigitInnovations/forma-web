import { Delete, DeleteIcon, Trash } from "lucide-react";
import React, { useMemo, useRef, useEffect } from "react";
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
        const renumbered = recalculateItemNumbers(updated);
        onChange && onChange(renumbered);
    };

    const handleAddRow = (position = 'end', rowIndex = null) => {
        const blankRow = {};
        columnsConfig.forEach((col) => {
            if (col.type === "select" && col.options && col.options.length > 0) {
                blankRow[col.key] = col.options[0];
            } else {
                blankRow[col.key] = "";
            }
        });

        let updated;
        if (position === 'above' && rowIndex !== null) {
            updated = [
                ...tableData.slice(0, rowIndex),
                blankRow,
                ...tableData.slice(rowIndex)
            ];
        } else if (position === 'below' && rowIndex !== null) {
            updated = [
                ...tableData.slice(0, rowIndex + 1),
                blankRow,
                ...tableData.slice(rowIndex + 1)
            ];
        } else {
            updated = [...tableData, blankRow];
        }

        // Recalculate item numbers
        const renumbered = recalculateItemNumbers(updated);

        onChange && onChange(renumbered);
    };

    const handleAddSubtotal = (position, rowIndex) => {
        const subtotalRow = {};
        columnsConfig.forEach((col) => {
            if (col.key === 'item' || col.key === 'description') {
                subtotalRow[col.key] = 'Subtotal';
            } else if (col.key === 'amount') {
                const endIndex = position === 'above' ? rowIndex : rowIndex + 1;
                const subtotalAmount = tableData
                    .slice(0, endIndex)
                    .filter(row => row.rowType !== 'subtotal' && row.rowType !== 'grandtotal')
                    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                subtotalRow[col.key] = subtotalAmount.toFixed(2);
            } else {
                subtotalRow[col.key] = '';
            }
        });
        subtotalRow.rowType = 'subtotal';

        let updated;
        if (position === 'above') {
            updated = [
                ...tableData.slice(0, rowIndex),
                subtotalRow,
                ...tableData.slice(rowIndex)
            ];
        } else {
            updated = [
                ...tableData.slice(0, rowIndex + 1),
                subtotalRow,
                ...tableData.slice(rowIndex + 1)
            ];
        }

        const renumbered = recalculateItemNumbers(updated);
        onChange && onChange(renumbered);
    };

    const handleAddGrandTotal = () => {
        const grandTotalRow = {};
        columnsConfig.forEach((col) => {
            if (col.key === 'item' || col.key === 'description') {
                grandTotalRow[col.key] = 'Grand Total';
            } else if (col.key === 'amount') {
                const total = tableData
                    .filter(row => row.rowType !== 'subtotal' && row.rowType !== 'grandtotal')
                    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                grandTotalRow[col.key] = total.toFixed(2);
            } else {
                grandTotalRow[col.key] = '';
            }
        });
        grandTotalRow.rowType = 'grandtotal';

        const updated = [...tableData, grandTotalRow];
        onChange && onChange(updated);
    };

    const recalculateItemNumbers = (dataArray) => {
        let currentNumber = 1;
        let currentSubNumber = 0;
        let lastMainIndex = 0;

        return dataArray.map((row, index) => {
            const newRow = { ...row };

            if (row.rowType === 'subtotal' || row.rowType === 'grandtotal') {
                // Don't number subtotals or grand totals
                return newRow;
            }

            // Check if this should be a main item or sub-item
            // If there's an item column, update it with numbering
            const itemCol = columnsConfig.find(col => col.key === 'item');
            if (itemCol) {
                // Simple sequential numbering: 1, 2, 3, etc.
                // For sub-items logic, you can enhance this based on your needs
                const prevRow = index > 0 ? dataArray[index - 1] : null;

                if (prevRow && prevRow.rowType !== 'subtotal' && prevRow.rowType !== 'grandtotal') {
                    // Check if should be sub-item (you can add custom logic here)
                    // For now, simple sequential numbering
                    newRow.item = `${currentNumber}`;
                    currentNumber++;
                } else {
                    newRow.item = `${currentNumber}`;
                    currentNumber++;
                }
            }

            return newRow;
        });
    };

    const DropdownMenu = ({ row, rowIndex }) => {
        const [open, setOpen] = React.useState(false);
        const [dropdownPosition, setDropdownPosition] = React.useState('below');
        const buttonRef = useRef(null);
        const dropdownRef = useRef(null);

        useEffect(() => {
            if (open && buttonRef.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const spaceAbove = buttonRect.top;
                const spaceBelow = window.innerHeight - buttonRect.bottom;
                const dropdownHeight = 280;

                if (spaceAbove < dropdownHeight && spaceBelow > spaceAbove) {
                    setDropdownPosition('below');
                } else {
                    setDropdownPosition('above');
                }
            }
        }, [open]);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (
                    dropdownRef.current &&
                    !dropdownRef.current.contains(event.target) &&
                    buttonRef.current &&
                    !buttonRef.current.contains(event.target)
                ) {
                    setOpen(false);
                }
            };

            if (open) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [open]);

        const isSpecialRow = row.original.rowType === 'subtotal' || row.original.rowType === 'grandtotal';

        return (
            <div className="relative inline-block">
                {!isSpecialRow ? (
                    <button
                        ref={buttonRef}
                        onClick={() => setOpen(!open)}
                        className="px-3 py-1 text-sm bg-custom-yellow text-black rounded-md  cursor-pointer"
                    >
                        ⋮
                    </button>
                ) : (
                    <button
                        className="w-full flex justify-center items-center py-2 text-left hover:bg-red-50 text-black cursor-pointer"
                        onClick={() => {
                            handleDeleteRow(rowIndex);
                            setOpen(false);
                        }}
                    >
                        <Trash size={20} />
                    </button>)}

                {open && (
                    <div
                        ref={dropdownRef}
                        className={`absolute ${dropdownPosition === 'above' ? '-bottom-40 right-10 mb-2' : 'bootom-0 mt-2'
                            } right-0 w-48 bg-white border rounded-md shadow-lg z-10`}
                    >

                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b cursor-pointer"
                            onClick={() => {
                                handleAddRow('above', rowIndex);
                                setOpen(false);
                            }}
                        >
                            Add Row Above
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b"
                            onClick={() => {
                                handleAddRow('below', rowIndex);
                                setOpen(false);
                            }}
                        >
                            Add Row Below
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b"
                            onClick={() => {
                                handleAddSubtotal('above', rowIndex);
                                setOpen(false);
                            }}
                        >
                            Add Subtotal Above
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b"
                            onClick={() => {
                                handleAddSubtotal('below', rowIndex);
                                setOpen(false);
                            }}
                        >
                            Add Subtotal Below
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b"
                            onClick={() => {
                                handleAddGrandTotal();
                                setOpen(false);
                            }}
                        >
                            Add Grand Total
                        </button>
                        <button
                            className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 cursor-pointer"
                            onClick={() => {
                                handleDeleteRow(rowIndex);
                                setOpen(false);
                            }}
                        >
                            Delete Row
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const columns = useMemo(
        () => [
            ...columnsConfig.map((col) => ({
                Header: col.label,
                accessor: col.key,
                Cell: ({ value, row }) => {
                    const rowIndex = row.index;
                    const [localValue, setLocalValue] = React.useState(value ?? "");
                    const isSpecialRow = row.original.rowType === 'subtotal' || row.original.rowType === 'grandtotal';

                    React.useEffect(() => {
                        setLocalValue(value ?? "");
                    }, [value]);

                    if (isSpecialRow) {
                        return <span className="font-bold text-gray-900">{value}</span>;
                    }

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
                    return <DropdownMenu row={row} rowIndex={row.index} />;
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
                                    className="px-4 py-2.5 text-left bg-custom-yellow text-sm font-medium text-gray-900"
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
                        const isSpecialRow = row.original.rowType === 'subtotal' || row.original.rowType === 'grandtotal';
                        return (
                            <tr
                                {...row.getRowProps()}
                                key={row.id}
                                className={isSpecialRow ? 'bg-gray-50' : ''}
                            >
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