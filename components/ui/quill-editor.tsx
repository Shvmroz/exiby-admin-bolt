'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;
}

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-white animate-pulse">
      Loading editor...
    </div>
  )
});

const QuillEditor: React.FC<QuillEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter description...',
  disabled = false,
  className = '',
  style,
  rows = 4,
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'color', 'background', 'link'
  ];

  // Calculate height based on rows prop (similar to textarea)
  const editorHeight = rows * 24; // Approximate line height

  return (
    <div 
      className={`quill-editor-wrapper ${className}`}
      style={style}
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={disabled}
        modules={modules}
        formats={formats}
        style={{
          height: `${editorHeight + 42}px`, // +42px for toolbar
        }}
      />
      
      <style jsx global>{`
        .quill-editor-wrapper .ql-editor {
          min-height: ${editorHeight}px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .quill-editor-wrapper .ql-container {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          background: ${disabled ? 'rgb(249 250 251)' : 'white'};
        }
        
        .quill-editor-wrapper .ql-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          border-color: rgb(209 213 219);
        }
        
        .quill-editor-wrapper .ql-container {
          border-color: rgb(209 213 219);
        }
        
        .quill-editor-wrapper:focus-within .ql-toolbar,
        .quill-editor-wrapper:focus-within .ql-container {
          border-color: #0077ED;
          box-shadow: 0 0 0 2px rgba(0, 119, 237, 0.2);
        }
        
        /* Dark mode styles */
        .dark .quill-editor-wrapper .ql-toolbar {
          background: rgb(55 65 81);
          border-color: rgb(75 85 99);
          color: white;
        }
        
        .dark .quill-editor-wrapper .ql-container {
          background: rgb(55 65 81);
          border-color: rgb(75 85 99);
          color: white;
        }
        
        .dark .quill-editor-wrapper .ql-editor {
          background: ${disabled ? 'rgb(55 65 81)' : 'rgb(55 65 81)'};
          color: white;
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: white;
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-fill {
          fill: white;
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-picker-label {
          color: white;
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-picker-options {
          background: rgb(55 65 81);
          border-color: rgb(75 85 99);
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-picker-item {
          color: white;
        }
        
        .dark .quill-editor-wrapper .ql-toolbar .ql-picker-item:hover {
          background: rgb(75 85 99);
        }
        
        /* Disabled state */
        .quill-editor-wrapper .ql-toolbar.ql-disabled {
          opacity: 0.5;
          pointer-events: none;
        }
        
        .quill-editor-wrapper .ql-editor.ql-disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;