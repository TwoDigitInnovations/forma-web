import { X } from 'lucide-react'
import React from 'react'

function Templatedetails({ onClose, selectedTemplate }) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Template Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Template Sections ({selectedTemplate?.sections?.length || 0})
                    </h3>

                    {selectedTemplate?.sections?.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-8">

                            <div className="flex items-center justify-between mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800">
                                        {section.sectionName}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {section.items?.length || 0} items
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg px-3 py-1 shadow-sm">
                                    <span className="text-xs font-medium text-blue-600">
                                        Section {sectionIndex + 1}
                                    </span>
                                </div>
                            </div>

                            {section.items?.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Item No.
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Description
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                        Unit
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {section.items.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {item.itemNo}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700">
                                                            {item.description}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {item.unit}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {section.subSections?.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-5 w-1 bg-blue-500 rounded-full"></div>
                                        <h5 className="text-base font-semibold text-gray-800">
                                            Subsections ({section.subSections.length})
                                        </h5>
                                    </div>

                                    <div className="space-y-6">
                                        {section.subSections.map((sub, subIndex) => (
                                            <div
                                                key={subIndex}
                                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                                            >
                                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <h6 className="text-sm font-semibold text-gray-700">
                                                            {sub.subSectionName}
                                                        </h6>
                                                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                            {sub.items?.length || 0} items
                                                        </span>
                                                    </div>
                                                </div>

                                                {sub.items?.length > 0 ? (
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Item No.
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Description
                                                                    </th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Unit
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {sub.items.map((subItem, subItemIndex) => (
                                                                    <tr
                                                                        key={subItemIndex}
                                                                        className="transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                            {subItem.itemNo}
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm text-gray-700">
                                                                            {subItem.description}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            {subItem.unit}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="px-6 py-8 text-center">
                                                        <div className="text-gray-400 mb-2">
                                                            <svg
                                                                className="w-12 h-12 mx-auto"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={1.5}
                                                                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            No items in this subsection.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Templatedetails