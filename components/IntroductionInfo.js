import React from 'react'
import TextAreaField from './UI/TextAreaField'
import ListEditor from './UI/ListEditer'

function IntroductionInfo({ formData, handleInputChange, setFormData }) {

    return (
        <div className="mt-6">
            <ListEditor
                label="Executive Summary"
                value={formData.ExcuetiveSummary}
                onChange={(content) => {
                    setFormData({ ...formData, ExcuetiveSummary: content });
                }}
            />

            <TextAreaField
                label="Location Description"
                name="LocationSummary"
                value={formData.LocationSummary}
                onChange={handleInputChange}
                rows="4"
                placeholder="Enter detailed location description..."
            />

            <ListEditor
                label="Scope of Work"
                value={formData.ProjectScope}
                onChange={(content) => {
                    setFormData({ ...formData, ProjectScope: content });
                }}
            />
        </div>
    )
}

export default IntroductionInfo