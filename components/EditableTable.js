import { Trash } from "lucide-react";
import React, { useMemo, useRef, useEffect } from "react";
import { useTable } from "react-table";

const ROW_TYPES = {
    NORMAL: 'normal',
    SUBTOTAL: 'subtotal',
    GRANDTOTAL: 'grandtotal',
    SECTION_TITLE: 'section_title',
    SECTION_DESC: 'section_desc',
    SUBSECTION: 'subsection',
    SUBSECTION_ITEM: 'subsection_item'
};

const ROW_TYPE_CONFIG = {
    [ROW_TYPES.NORMAL]: { label: 'Normal Item', bgColor: '', fontWeight: '' },
    [ROW_TYPES.SUBTOTAL]: { label: 'Subtotal', bgColor: 'bg-blue-50', fontWeight: 'font-bold' },
    [ROW_TYPES.GRANDTOTAL]: { label: 'Grand Total', bgColor: 'bg-gray-100', fontWeight: 'font-bold' },
    [ROW_TYPES.SECTION_TITLE]: { label: 'Section Title', bgColor: 'bg-yellow-50', fontWeight: 'font-semibold' },
    [ROW_TYPES.SECTION_DESC]: { label: 'Section Description', bgColor: 'bg-yellow-25', fontWeight: '' },
    [ROW_TYPES.SUBSECTION]: { label: 'Subsection', bgColor: 'bg-green-50', fontWeight: 'font-medium' },
    [ROW_TYPES.SUBSECTION_ITEM]: { label: 'Subsection Item', bgColor: '', fontWeight: '' }
};

export default function EditableTable({ columnsConfig, data, onChange, setTotal, setSummaryData }) {
    const tableData = useMemo(() => data, [data]);

    useEffect(() => {
        setSummaryData(tableData);
    }, [tableData, setSummaryData]);

    const calculateTotal = (dataArray) => {
        return dataArray
            .filter(row => !isCalculatedRow(row.rowType))
            .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const isCalculatedRow = (rowType) => {
        return [ROW_TYPES.SUBTOTAL, ROW_TYPES.GRANDTOTAL, , ROW_TYPES.SECTION_TITLE, ROW_TYPES.SECTION_DESC].includes(rowType);
    };

    const isEditableRow = (rowType) => {
        return ![ROW_TYPES.SUBTOTAL, ROW_TYPES.GRANDTOTAL].includes(rowType);
    };

    const handleUpdateRow = (rowIndex, field, value) => {
        const updatedData = [...data];
        const row = { ...updatedData[rowIndex] };

        row[field] = value;

        if ((field === "rate" || field === "quantity") && isEditableRow(row.rowType)) {
            const rate = field === "rate" ? parseFloat(value) || 0 : parseFloat(row.rate) || 0;
            const quantity = field === "quantity" ? parseFloat(value) || 0 : parseFloat(row.quantity) || 0;
            row.amount = rate * quantity;
        }

        updatedData[rowIndex] = row;

        const total = calculateTotal(updatedData);
        console.log("totalAmount", total);
        setTotal(total);

        onChange?.(updatedData);
    };

    const handleDeleteRow = (rowIndex) => {
        const updated = tableData.filter((_, idx) => idx !== rowIndex);
        const renumbered = recalculateItemNumbers(updated);
        onChange?.(renumbered);
    };

    const createBlankRow = (rowType = ROW_TYPES.NORMAL, tableData) => {
        const blankRow = { rowType };

        columnsConfig.forEach((col) => {
            if (col.type === "select" && col.options?.length > 0) {
                blankRow[col.key] = col.options[0];
            } else {
                if (col.key === "itemNo") {
                    let lastItem = tableData[tableData.length - 1]?.itemNo || "1.0";
                    let [main, sub] = lastItem.split(".");
                    sub = parseInt(sub) + 1;
                    blankRow[col.key] = `${main}.${sub}`;
                } else {
                    blankRow[col.key] = "";
                }
            }
        });

        return blankRow;
    };

    const handleAddRow = (position = 'end', rowIndex = null, rowType = ROW_TYPES.NORMAL) => {
        const blankRow = createBlankRow(rowType, tableData);
        let updated;

        if (position === 'above' && rowIndex !== null) {
            updated = [...tableData.slice(0, rowIndex), blankRow, ...tableData.slice(rowIndex)];
        } else if (position === 'below' && rowIndex !== null) {
            updated = [...tableData.slice(0, rowIndex + 1), blankRow, ...tableData.slice(rowIndex + 1)];
        } else {
            updated = [...tableData, blankRow];
        }

        const renumbered = recalculateItemNumbers(updated);
        onChange?.(renumbered);
    };

    const handleAddCalculatedRow = (position, rowIndex, rowType) => {
        const calculatedRow = { rowType };

       
        if (rowType === ROW_TYPES.GRANDTOTAL) {
            const totalAmount = tableData
                .filter(row => !isCalculatedRow(row.rowType))
                .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

            const existingGrandTotalIndex = tableData.findIndex(row => row.rowType === ROW_TYPES.GRANDTOTAL);

            const updatedRow = {
                ...calculatedRow,
            };

            columnsConfig.forEach((col) => {
                if (col.key === 'item' || col.key === 'description') {
                    updatedRow[col.key] = ROW_TYPE_CONFIG[rowType].label;
                } else if (col.key === 'amount') {
                    updatedRow[col.key] = totalAmount.toFixed(2);
                } else {
                    updatedRow[col.key] = '';
                }
            });

            let updatedData = [...tableData.filter(r => r.rowType !== ROW_TYPES.GRANDTOTAL)];

            // Always put Grand Total at the end
            updatedData.push(updatedRow);

            const renumbered = recalculateItemNumbers(updatedData);
            onChange?.(renumbered);
            console.log("totalAmount", totalAmount);
            setTotal(totalAmount);
            return;
        }

      
        columnsConfig.forEach((col) => {
            if (col.key === 'item' || col.key === 'description') {
                calculatedRow[col.key] = ROW_TYPE_CONFIG[rowType].label;
            } else if (col.key === 'amount' || col.key === 'rate') {
                const endIndex = position === 'above' ? rowIndex : rowIndex + 1;
                const amount = tableData
                    .slice(0, endIndex)
                    .filter(row => !isCalculatedRow(row.rowType))
                    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
                calculatedRow[col.key] = amount.toFixed(2);
            } else {
                calculatedRow[col.key] = '';
            }
        });

        let updated;
        if (position === 'above') {
            updated = [...tableData.slice(0, rowIndex), calculatedRow, ...tableData.slice(rowIndex)];
        } else if (position === 'below') {
            updated = [...tableData.slice(0, rowIndex + 1), calculatedRow, ...tableData.slice(rowIndex + 1)];
        } else {
            updated = [...tableData, calculatedRow];
        }

        const renumbered = recalculateItemNumbers(updated);
        onChange?.(renumbered);
    };


    const recalculateItemNumbers = (dataArray) => {
        let currentNumber = 1;

        return dataArray.map((row) => {
            const newRow = { ...row };

            if (isCalculatedRow(row.rowType) ||
                row.rowType === ROW_TYPES.SECTION_TITLE ||
                row.rowType === ROW_TYPES.SECTION_DESC) {
                return newRow;
            }

            const itemCol = columnsConfig.find(col => col.key === 'item');
            if (itemCol) {
                newRow.item = `${currentNumber}`;
                currentNumber++;
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
                const spaceBelow = window.innerHeight - buttonRect.bottom;
                setDropdownPosition(spaceBelow < 300 ? 'above' : 'below');
            }
        }, [open]);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                    buttonRef.current && !buttonRef.current.contains(event.target)) {
                    setOpen(false);
                }
            };

            if (open) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, [open]);

        const isSpecialRow = isCalculatedRow(row.original.rowType);

        const menuItems = [
            { label: 'Add Normal Item Above', action: () => handleAddRow('above', rowIndex, ROW_TYPES.NORMAL) },
            { label: 'Add Normal Item Below', action: () => handleAddRow('below', rowIndex, ROW_TYPES.NORMAL) },
            { label: 'Add Subsection Above', action: () => handleAddRow('above', rowIndex, ROW_TYPES.SUBSECTION) },
            { label: 'Add Subsection Below', action: () => handleAddRow('below', rowIndex, ROW_TYPES.SUBSECTION) },
            { label: 'Add Subtotal Above', action: () => handleAddCalculatedRow('above', rowIndex, ROW_TYPES.SUBTOTAL) },
            { label: 'Add Subtotal Below', action: () => handleAddCalculatedRow('below', rowIndex, ROW_TYPES.SUBTOTAL) },
            { label: 'Add Grand Total', action: () => handleAddCalculatedRow('end', null, ROW_TYPES.GRANDTOTAL) },
        ];


        return (
            <div className="relative inline-block">
                {!isSpecialRow ? (
                    <button
                        ref={buttonRef}
                        onClick={() => setOpen(!open)}
                        className="px-3 py-1 text-sm bg-custom-yellow text-black rounded-md cursor-pointer hover:bg-yellow-400"
                    >
                        ⋮
                    </button>
                ) : (
                    <button
                        className="w-full flex justify-center items-center py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteRow(rowIndex)}
                    >
                        <Trash size={20} />
                    </button>
                )}

                {open && (
                    <div
                        ref={dropdownRef}
                        className={`absolute ${dropdownPosition === 'above' ? 'top-full mb-2' : 'top-full mt-2'
                            } right-0 w-56 bg-white border rounded-md shadow-lg z-10 max-h-96 overflow-y-auto`}
                    >
                        {menuItems.map((item, idx) => (
                            <button
                                key={idx}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b cursor-pointer"
                                onClick={() => {
                                    item.action();
                                    setOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
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
                    const rowType = row.original.rowType || ROW_TYPES.NORMAL;
                    const config = ROW_TYPE_CONFIG[rowType];

                    React.useEffect(() => {
                        setLocalValue(value ?? "");
                    }, [value]);

                    if (isCalculatedRow(rowType)) {
                        return <span className={`${config.fontWeight} text-gray-900`}>{value}</span>;
                    }

                    if ([ROW_TYPES.SECTION_TITLE, ROW_TYPES.SUBSECTION].includes(rowType)) {
                        if (col.key === 'item' || col.key === 'description') {
                            return (
                                <input
                                    type="text"
                                    value={localValue}
                                    onChange={(e) => setLocalValue(e.target.value)}
                                    onBlur={() => handleUpdateRow(rowIndex, col.key, localValue)}
                                    className={`w-full bg-transparent border-b border-gray-300 px-1 py-1 text-sm ${config.fontWeight} focus:outline-none focus:border-blue-400`}
                                />
                            );
                        }
                    }

                    // Editable inputs
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
                Cell: ({ row }) => <DropdownMenu row={row} rowIndex={row.index} />,
            },
        ],
        [columnsConfig, data]
    );

    const tableInstance = useTable({ columns, data: tableData });
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

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
                        const rowType = row.original.rowType || ROW_TYPES.NORMAL;
                        const config = ROW_TYPE_CONFIG[rowType];

                        return (
                            <tr
                                {...row.getRowProps()}
                                key={row.id}
                                className={config.bgColor}
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