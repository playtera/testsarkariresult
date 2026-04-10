'use client'

import React, { useState, useCallback } from 'react'
import { set, unset } from 'sanity'

export function HtmlBodyEditor(props) {
  const { onChange, value = '' } = props
  const [showPreview, setShowPreview] = useState(true)

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.target.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  // Sync changes from Visual Preview back to Code
  const handleVisualBlur = useCallback(
    (event) => {
      const nextValue = event.target.innerHTML
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>WordPress-Style Editor (Code & Visual Interconnected)</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
          <input 
            type="checkbox" 
            checked={showPreview} 
            onChange={() => setShowPreview(!showPreview)} 
          />
          Show Visual Editor
        </label>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', 
        gap: '20px',
        minHeight: '500px'
      }}>
        {/* Editor Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>HTML CODE</span>
          <textarea
            value={value}
            onChange={handleChange}
            style={{
              flex: 1,
              width: '100%',
              fontFamily: 'monospace',
              padding: '15px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="Paste or type HTML..."
          />
        </div>

        {/* Visual Side */}
        {showPreview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontSize: '11px', color: '#666', fontWeight: 'bold' }}>VISUAL EDITOR (CLICK TO EDIT)</span>
            <div 
              contentEditable={true}
              onBlur={handleVisualBlur}
              suppressContentEditableWarning={true}
              style={{
                flex: 1,
                border: '2px dashed #3b82f6',
                borderRadius: '5px',
                padding: '20px',
                backgroundColor: 'white',
                color: 'black',
                overflowY: 'auto'
              }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          </div>
        )}
      </div>
      
      <div style={{ 
        padding: '10px', 
        background: '#e7f5ff', 
        border: '1px solid #3b82f6', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#1864ab'
      }}>
        <strong>Tips:</strong> You can edit on either side. When you edit in the **Visual** box, click anywhere outside of it to save the changes back to the code.
      </div>
    </div>
  )
}
