'use client'

import React, { useCallback } from 'react'
import { set, insert } from 'sanity'

export function SmartTags(props) {
  // Prevent SSR issues
  if (typeof window === 'undefined') {
    return props.renderDefault(props)
  }

  const { onChange, value = [] } = props

  const handlePaste = useCallback(
    (event) => {
      const paste = event.clipboardData.getData('text')
      if (paste && paste.includes(',')) {
        event.preventDefault()
        const newTags = paste
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '' && !value.includes(tag))

        if (newTags.length > 0) {
          onChange(insert(newTags, 'after', [-1]))
        }
      }
    },
    [onChange, value]
  )

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === ',') {
        event.preventDefault()
        const inputValue = event.target.value
        const newTag = inputValue.trim()
        if (newTag && !value.includes(newTag)) {
          onChange(insert([newTag], 'after', [-1]))
        }
        event.target.value = ''
      }
    },
    [onChange, value]
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {props.renderDefault({
        ...props,
        elementProps: {
          ...props.elementProps,
          onKeyDown: handleKeyDown,
          onPaste: handlePaste,
        },
      })}
      <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '5px' }}>
        ✨ Smart Tags: Comma and Paste-Split are active!
      </span>
    </div>
  )
}
