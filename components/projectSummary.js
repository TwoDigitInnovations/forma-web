import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ProjectSummaryTable = ({
    projectName = "proposed construction of daynille road",
    date = "10/1/2025",
    items = [],
    showTax = false,
    showContingency = false,
    showSubtotal = false,
    showGrandTotal = false,
    onToggleTax,
    onToggleContingency,
    onToggleSubtotal,
    onToggleGrandTotal,

}) => {
    const [taxRate, setTaxRate] = useState(15);
    const [contingencyRate, setContingencyRate] = useState(15);

    const formatCurrency = (num) =>
        num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const subtotal = items.reduce(
        (sum, item) => (item.include ? sum + item.quantity * item.rate : sum),
        0
    );

    const rowsConfig = [
        { key: 'tax', label: 'TAX', show: showTax, value: (subtotal * taxRate) / 100, rate: taxRate, setRate: setTaxRate },
        { key: 'contingency', label: 'CONTINGENCY', show: showContingency, value: (subtotal * contingencyRate) / 100, rate: contingencyRate, setRate: setContingencyRate },
        { key: 'subtotal', label: 'SUBTOTAL', show: showSubtotal, value: subtotal + (showTax ? (subtotal * taxRate) / 100 : 0) + (showContingency ? (subtotal * contingencyRate) / 100 : 0), isSummary: true },
        { key: 'grandTotal', label: 'GRAND TOTAL', show: showGrandTotal, value: subtotal + (showTax ? (subtotal * taxRate) / 100 : 0) + (showContingency ? (subtotal * contingencyRate) / 100 : 0), isSummary: true, isGrand: true },
    ];


    return (
        <div className="w-full rounded-lg md:p-8 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">Project Summary</h1>
                <div className="flex gap-3">
                    {[
                        { label: 'Add Subtotal', toggle: onToggleSubtotal, active: showSubtotal },
                        { label: 'Add Tax', toggle: onToggleTax, active: showTax },
                        { label: 'Add Contingency', toggle: onToggleContingency, active: showContingency },
                        { label: 'Add Grand Total', toggle: onToggleGrandTotal, active: showGrandTotal },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={btn.toggle}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${btn.active ? 'bg-custom-yellow text-gray-900' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            + {btn.label}
                        </button>
                    ))}
                    <button className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Project Info */}
            <div className="flex gap-8 mb-6 text-white">
                <div><span className="font-semibold">Project: </span>{projectName}</div>
                <div><span className="font-semibold">Date: </span>{date}</div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-custom-yellow">
                            {['Include', 'Item Name', 'Unit', 'Quantity', 'Rate', 'Amount', 'Actions'].map((h, i) => (
                                <th key={i} className="px-4 py-3 text-left font-semibold text-gray-900">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Regular Items */}
                        {items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="px-4 py-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.include ? 'bg-custom-yellow' : 'bg-gray-200'}`}>
                                        {item.include && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-white">{item.name}</td>
                                <td className="px-4 py-3 text-white">{item.unit}</td>
                                <td className="px-4 py-3 text-white">{item.quantity}</td>
                                <td className="px-4 py-3 text-white">{formatCurrency(item.rate)}</td>
                                <td className="px-4 py-3 font-semibold text-white">{formatCurrency(item.quantity * item.rate)}</td>
                                <td className="px-4 py-3">

                                </td>
                            </tr>
                        ))}

                        {rowsConfig.map((row) => row.show && (
                            <tr key={row.key} className={`${row.isSummary ? (row.isGrand ? 'bg-custom-black' : 'bg-custom-black') : 'border-b border-gray-100'}`}>
                                <td className="px-4 py-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${row.isSummary ? (row.isGrand ? 'bg-custom-green' : ' bg-custom-green') : 'bg-custom-yellow'}`}>
                                        {!row.isSummary && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                </td>
                                <td className={`px-4 py-3 font-bold ${row.isSummary ? (row.isGrand ? 'text-green-700' : 'text-blue-700') : 'text-white'}`}>{row.label}</td>
                                <td className="px-4 py-3 text-white">{row.rate ? '%' : 'No'}</td>
                                <td className="px-4 py-3 text-white">{row.rate ? formatCurrency(subtotal) : '1'}</td>
                                <td className="px-4 py-3">
                                    {row.rate && (
                                        <div className="flex items-center gap-2">
                                            <input type="number" value={row.rate} onChange={(e) => row.setRate(Number(e.target.value))} className="w-16 px-2 py-1 border border-gray-300 rounded text-center" />
                                            <span className="text-white">%</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 font-semibold text-white">{formatCurrency(row.value)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button className={`text-gray-600 hover:text-yellow-600 transition-colors`}><Edit2 size={18} /></button>
                                        <button className={`text-gray-600 hover:text-red-500 transition-colors`}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function App({ selectedOption, loader }) {
    const [showTax, setShowTax] = useState(true);
    const [showContingency, setShowContingency] = useState(true);
    const [showSubtotal, setShowSubtotal] = useState(true);
    const [showGrandTotal, setShowGrandTotal] = useState(true);

    const sampleItems = [
        { name: "Subtotal 1", unit: "No", quantity: 5, rate: 5000.0, include: true },
        { name: "Grand Total", unit: "No", quantity:1, rate: 15000.0, include: true },
    ];
    if (selectedOption === "boqTable" || selectedOption === "template") return null;

    return (
        <div className="min-h-screen bg-custom-black text-white mt-6 rounded-lg">
            <ProjectSummaryTable
                projectName="proposed construction of daynille road"
                date="10/1/2025"
                items={sampleItems}
                showTax={showTax}
                showContingency={showContingency}
                showSubtotal={showSubtotal}
                showGrandTotal={showGrandTotal}
                onToggleTax={() => setShowTax(!showTax)}
                onToggleContingency={() => setShowContingency(!showContingency)}
                onToggleSubtotal={() => setShowSubtotal(!showSubtotal)}
                onToggleGrandTotal={() => setShowGrandTotal(!showGrandTotal)}
            />
        </div>
    );
}
