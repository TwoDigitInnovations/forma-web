import React, { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { userContext } from "@/pages/_app";

const categories = [
  "General Construction", "Buildings", "Solar Installation", "Electrical", 
  "Plumbing", "HVAC", "Structural", "Civil Works", "Road Construction", 
  "Interior Design", "Landscaping", "Renovation", "Commercial", 
  "Residential", "Infrastructure"
];

const CreateTemplateForm = ({ setIsOpen, loader, isOpen }) => {
  const router = useRouter();
  const [user] = useContext(userContext);
  const [formData, setFormData] = useState({
    categoryName: "",
    name: "",
    description: "",
    sections: [
      {
        sectionName: "General Items",
        description: "",
        items: [
          {
            itemNo: "1.0",
            description: "",
            quantity: "",
            unit: "",
            rate: "",
            rowType: "normal"
          }
        ],
        subSections: []
      }
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const updated = [...formData.sections];
    updated[sectionIndex][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    const updated = [...formData.sections];
    updated[sectionIndex].items[itemIndex][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleSubSectionChange = (sectionIndex, subSectionIndex, field, value) => {
    const updated = [...formData.sections];
    updated[sectionIndex].subSections[subSectionIndex][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleSubSectionItemChange = (sectionIndex, subSectionIndex, itemIndex, field, value) => {
    const updated = [...formData.sections];
    updated[sectionIndex].subSections[subSectionIndex].items[itemIndex][field] = value;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const addSection = () => {
    const newSection = {
      sectionName: `Section ${formData.sections.length + 1}`,
      description: "",
      items: [{
        itemNo: `${formData.sections.length + 1}.0`,
        description: "",
        quantity: "",
        unit: "",
        rate: "",
        rowType: "item"
      }],
      subSections: []
    };
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const removeSection = (sectionIndex) => {
    if (formData.sections.length > 1) {
      const updated = formData.sections.filter((_, i) => i !== sectionIndex);
      setFormData((prev) => ({ ...prev, sections: updated }));
    }
  };

  const addSubSection = (sectionIndex) => {
    const section = formData.sections[sectionIndex];
    const subSectionCount = section.subSections.length;
    const sectionNumber = sectionIndex + 1;

    const newSubSection = {
      subSectionName: `Sub Section ${subSectionCount + 1}`,
      items: [{
        itemNo: `${sectionNumber}.${subSectionCount + 1}.0`,
        description: "",
        quantity: "",
        unit: "",
        rate: "",
        rowType: "item"
      }]
    };

    const updated = [...formData.sections];
    updated[sectionIndex].subSections.push(newSubSection);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const removeSubSection = (sectionIndex, subSectionIndex) => {
    const updated = [...formData.sections];
    updated[sectionIndex].subSections.splice(subSectionIndex, 1);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const addItem = (sectionIndex) => {
    const section = formData.sections[sectionIndex];
    const itemCount = section.items.length;
    const sectionNumber = sectionIndex + 1;

    const newItem = {
      itemNo: `${sectionNumber}.${itemCount}`,
      description: "",
      quantity: "",
      unit: "",
      rate: "",
      rowType: "item"
    };

    const updated = [...formData.sections];
    updated[sectionIndex].items.push(newItem);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const removeItem = (sectionIndex, itemIndex) => {
    const section = formData.sections[sectionIndex];
    if (section.items.length > 1) {
      const updated = [...formData.sections];
      updated[sectionIndex].items.splice(itemIndex, 1);
      setFormData((prev) => ({ ...prev, sections: updated }));
    }
  };

  const addSubSectionItem = (sectionIndex, subSectionIndex) => {
    const subSection = formData.sections[sectionIndex].subSections[subSectionIndex];
    const itemCount = subSection.items.length;
    const sectionNumber = sectionIndex + 1;
    const subSectionNumber = subSectionIndex + 1;

    const newItem = {
      itemNo: `${sectionNumber}.${subSectionNumber}.${itemCount}`,
      description: "",
      quantity: "",
      unit: "",
      rate: "",
      rowType: "item"
    };

    const updated = [...formData.sections];
    updated[sectionIndex].subSections[subSectionIndex].items.push(newItem);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const removeSubSectionItem = (sectionIndex, subSectionIndex, itemIndex) => {
    const subSection = formData.sections[sectionIndex].subSections[subSectionIndex];
    if (subSection.items.length > 1) {
      const updated = [...formData.sections];
      updated[sectionIndex].subSections[subSectionIndex].items.splice(itemIndex, 1);
      setFormData((prev) => ({ ...prev, sections: updated }));
    }
  };

  const formatSectionName = (name) => {
    if (!name) return "";
    let baseName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const match = baseName.match(/(.*?)-(\d+)$/);
    if (match) {
      const text = match[1];
      const num = parseInt(match[2], 10);
      return `${text}-${num.toString().padStart(2, "0")}`;
    }
    return `${baseName}-01`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // loader(true);

   
    let hasValidItems = false;
    for (const section of formData.sections) {
      const validItems = section.items.filter(item => item.description.trim());
      if (validItems.length > 0) {
        hasValidItems = true;
        break;
      }
     
      for (const subSection of section.subSections) {
        const validSubItems = subSection.items.filter(item => item.description.trim());
        if (validSubItems.length > 0) {
          hasValidItems = true;
          break;
        }
      }
    }

    if (!hasValidItems) {
      loader(false);
      toast.error("Please add at least one item with description");
      return;
    }

    const cleanedSections = formData.sections
      .map(section => ({
        sectionName: section.sectionName,
        sectionId: formatSectionName(section.sectionName),
        description: section.description || undefined,
        items: section.items.filter(item => item.description.trim()),
        subSections: section.subSections
          .map(subSection => ({
            subSectionName: subSection.subSectionName,
            subSectionId: formatSectionName(subSection.subSectionName),
            items: subSection.items.filter(item => item.description.trim())
          }))
          .filter(subSection => subSection.items.length > 0)
      }))
      .filter(section => section.items.length > 0 || section.subSections.length > 0);

    const payload = {
      categoryName: formData.categoryName,
      categoryId: formatSectionName(formData.categoryName),
      name: formData.name,
      description: formData.description || undefined,
      sections: cleanedSections,
      createdBy: user._id
    };
     console.log(payload);
    

    try {
      const res = await Api("post", "template/createTemplate", payload, router);
      loader(false);
      
      if (res?.status === true) {
        toast.success("BOQ Template created successfully");
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Failed to create template");
      }
    } catch (err) {
      loader(false);
      toast.error(err?.message || "An error occurred");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-custom-black text-white rounded-[38px] p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-1">Create New BOQ Template</h2>
        <p className="text-sm text-gray-300 mb-4">
          Create a reusable BOQ template with sections and items.
        </p>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm block mb-1">Template Name *</label>
              <input
                type="text"
                name="name"
                placeholder="BOQ Template Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#5F5F5F] focus:outline-none text-sm border-gray-600 rounded-lg border"
                required
              />
            </div>

            <div>
              <label className="text-white text-sm block mb-1">Category Name *</label>
              <select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none text-sm"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-white text-sm block mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Template Description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 bg-[#5F5F5F] rounded-lg focus:outline-none text-sm"
            />
          </div>

          {/* Sections */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <label className="text-white text-lg font-medium">BOQ Sections</label>
              <button
                type="button"
                onClick={addSection}
                className="px-4 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="md:p-6 p-3 bg-[#2A2A2A] rounded-lg border border-gray-600">
                  <div className="flex md:flex-row flex-col justify-start items-start mb-4 gap-4">
                    <div className="flex-1">
                      <label className="text-white text-sm block mb-1">Section Name *</label>
                      <input
                        type="text"
                        placeholder="Section Name"
                        value={section.sectionName}
                        onChange={(e) => handleSectionChange(sectionIndex, "sectionName", e.target.value)}
                        className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-white text-sm block mb-1">Section Description</label>
                      <input
                        type="text"
                        placeholder="Optional description"
                        value={section.description}
                        onChange={(e) => handleSectionChange(sectionIndex, "description", e.target.value)}
                        className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-center items-end gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => addItem(sectionIndex)}
                        className="px-3 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-500"
                      >
                        + Item
                      </button>
                      <button
                        type="button"
                        onClick={() => addSubSection(sectionIndex)}
                        className="px-3 py-2 text-xs rounded-lg bg-blue-600 hover:bg-blue-500"
                      >
                        + SubSection
                      </button>
                      {formData.sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(sectionIndex)}
                          className="px-3 py-2 text-xs rounded-lg bg-red-600 hover:bg-red-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section Items */}
                  {section.items.length > 0 && (
                    <div className="space-y-3 mb-4">
                      <h4 className="text-white font-medium">Items</h4>
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 rounded-lg bg-[#353535]">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-300">
                              {item.itemNo} - Item
                            </span>
                            {section.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(sectionIndex, itemIndex)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            <div className="lg:col-span-2">
                              <label className="text-xs text-gray-400 mb-1 block">
                                Description *
                              </label>
                              <input
                                type="text"
                                placeholder="Item Description"
                                value={item.description}
                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, "description", e.target.value)}
                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                required
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                              <input
                                type="text"
                                placeholder="0"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, "quantity", e.target.value)}
                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Unit</label>
                              <input
                                type="text"
                                placeholder="Unit"
                                value={item.unit}
                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, "unit", e.target.value)}
                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Rate</label>
                              <input
                                type="text"
                                placeholder="0.00"
                                value={item.rate}
                                onChange={(e) => handleItemChange(sectionIndex, itemIndex, "rate", e.target.value)}
                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                              />
                            </div>
                          </div>

                          {(item.quantity && item.rate && !isNaN(parseFloat(item.quantity)) && !isNaN(parseFloat(item.rate))) && (
                            <div className="text-right mt-2">
                              <span className="text-xs text-gray-400">Estimated Amount: </span>
                              <span className="text-custom-yellow font-medium">
                                ₹{(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SubSections */}
                  {section.subSections.length > 0 && (
                    <div className="space-y-4 mt-4">
                      <h4 className="text-white font-medium">Sub Sections</h4>
                      {section.subSections.map((subSection, subSectionIndex) => (
                        <div key={subSectionIndex} className="p-4 bg-[#1A1A1A] rounded-lg border border-gray-700">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex-1 mr-4">
                              <label className="text-white text-sm block mb-1">Sub Section Name *</label>
                              <input
                                type="text"
                                placeholder="Sub Section Name"
                                value={subSection.subSectionName}
                                onChange={(e) => handleSubSectionChange(sectionIndex, subSectionIndex, "subSectionName", e.target.value)}
                                className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                required
                              />
                            </div>
                            <div className="flex gap-2 items-end">
                              <button
                                type="button"
                                onClick={() => addSubSectionItem(sectionIndex, subSectionIndex)}
                                className="px-3 py-2 text-xs rounded-lg bg-green-600 hover:bg-green-500"
                              >
                                + Item
                              </button>
                              <button
                                type="button"
                                onClick={() => removeSubSection(sectionIndex, subSectionIndex)}
                                className="px-3 py-2 text-xs rounded-lg bg-red-600 hover:bg-red-500"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {subSection.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="p-3 rounded-lg bg-[#404040]">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-sm font-medium text-gray-300">
                                    {item.itemNo} - Item
                                  </span>
                                  {subSection.items.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => removeSubSectionItem(sectionIndex, subSectionIndex, itemIndex)}
                                      className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                                  <div className="lg:col-span-2">
                                    <label className="text-xs text-gray-400 mb-1 block">
                                      Description *
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Item Description"
                                      value={item.description}
                                      onChange={(e) => handleSubSectionItemChange(sectionIndex, subSectionIndex, itemIndex, "description", e.target.value)}
                                      className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Quantity</label>
                                    <input
                                      type="text"
                                      placeholder="0"
                                      value={item.quantity}
                                      onChange={(e) => handleSubSectionItemChange(sectionIndex, subSectionIndex, itemIndex, "quantity", e.target.value)}
                                      className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Unit</label>
                                    <input
                                      type="text"
                                      placeholder="Unit"
                                      value={item.unit}
                                      onChange={(e) => handleSubSectionItemChange(sectionIndex, subSectionIndex, itemIndex, "unit", e.target.value)}
                                      className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Rate</label>
                                    <input
                                      type="text"
                                      placeholder="0.00"
                                      value={item.rate}
                                      onChange={(e) => handleSubSectionItemChange(sectionIndex, subSectionIndex, itemIndex, "rate", e.target.value)}
                                      className="w-full px-3 py-2 bg-[#5F5F5F] rounded-lg text-sm focus:outline-none"
                                    />
                                  </div>
                                </div>

                                {(item.quantity && item.rate && !isNaN(parseFloat(item.quantity)) && !isNaN(parseFloat(item.rate))) && (
                                  <div className="text-right mt-2">
                                    <span className="text-xs text-gray-400">Estimated Amount: </span>
                                    <span className="text-custom-yellow font-medium">
                                      ₹{(parseFloat(item.quantity) * parseFloat(item.rate)).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 text-sm rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 text-sm rounded-lg bg-custom-yellow text-black hover:bg-yellow-400"
            >
              Create BOQ Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateForm;