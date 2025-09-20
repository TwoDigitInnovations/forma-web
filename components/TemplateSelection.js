import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

export default function BOQTemplateModal({ isOpen, onClose, onLoadTemplate, templatesData }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);

  const categories = [
    "General Construction", "Buildings", "Solar Installation", "Electrical",
    "Plumbing", "HVAC", "Structural", "Civil Works", "Road Construction",
    "Interior Design", "Landscaping", "Renovation", "Commercial",
    "Residential", "Infrastructure"
  ];

  // get current template from data
  const getCurrentTemplate = () => {
    if (!selectedTemplate) return null;

    const template = templatesData.find(
      (t) =>
        (selectedCategory === "" || t.categoryName === selectedCategory) &&
        t.name === selectedTemplate
    ) || null;

    return template;
  };

  // available templates based on category
  const availableTemplates =
    selectedCategory === ""
      ? templatesData
      : templatesData.filter((t) => t.categoryName === selectedCategory);

  const handleSectionToggle = (section) => {
    setSelectedSections((prev) =>
      prev.some((s) => s.sectionId === section.sectionId)
        ? prev.filter((s) => s.sectionId !== section.sectionId)
        : [...prev, section]
    );
  };

  const handleLoadTemplate = () => {
    const template = getCurrentTemplate();
    if (!template) return;

    const sectionsToLoad =
      selectedSections.length > 0 ? selectedSections : template.sections;

    const templateResult = {
      ...template,
      sections: sectionsToLoad,
    };

    onLoadTemplate(templateResult);
    onClose();
    setSelectedCategory('');
    setSelectedTemplate('');
    setSelectedSections([]);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedTemplate('');
    setSelectedSections([]);
  };

  if (!isOpen) return null;

  const currentTemplate = getCurrentTemplate();

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg md:p-6 p-4 mx-4 max-h-[90vh] overflow-y-auto w-[30rem]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Load BOQ Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6">
          Choose a pre-built template to quickly start your BOQ with common construction items
        </p>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm text-black appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Template</label>
          <div className="relative">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-400 text-sm appearance-none text-black cursor-pointer"
            >
              <option value="">Select template</option>
              {availableTemplates.map((template) => (
                <option key={template._id} value={template.name}>
                  {template.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Template Description */}
        {currentTemplate && (
          <div className="mb-4">
            <p className="text-gray-600 text-sm">{currentTemplate.description}</p>
          </div>
        )}

        {/* Sections Selection */}
        {currentTemplate && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-3">
              Sections (Optional)
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {currentTemplate.sections.map((section) => (
                <label
                  key={section.sectionId}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.some(
                      (s) => s.sectionId === section.sectionId
                    )}
                    onChange={() => handleSectionToggle(section)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                  />
                  <span className="text-gray-700 text-sm">{section.sectionName}</span>
                </label>
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Leave unchecked to load all sections
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full">
          <button
            onClick={onClose}
            className="w-1/2 cursor-pointer px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLoadTemplate}
            disabled={!currentTemplate}
            className="w-1/2 bg-custom-yellow text-black py-2.5 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Load Template
          </button>
        </div>
      </div>
    </div>
  );
}
