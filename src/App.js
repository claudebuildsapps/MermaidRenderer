import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';

function App() {
  const [code, setCode] = useState(`graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`);
  
  const [zoom, setZoom] = useState(1);
  const [fileName, setFileName] = useState('');
  const diagramRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    renderDiagram();
  }, []);

  const renderDiagram = async () => {
    if (diagramRef.current && code.trim()) {
      try {
        const { svg } = await mermaid.render('diagram', code);
        diagramRef.current.innerHTML = svg;
      } catch (error) {
        diagramRef.current.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
      }
    }
  };

  const handleZoom = (factor) => {
    setZoom(prev => Math.max(0.1, Math.min(5, prev * factor)));
  };

  const resetZoom = () => setZoom(1);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
        setTimeout(renderDiagram, 100);
      };
      reader.readAsText(file);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'diagram.mmd';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <div className="controls">
        <button onClick={renderDiagram}>Render</button>
        <div className="zoom-controls">
          <button onClick={() => handleZoom(0.8)}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => handleZoom(1.25)}>+</button>
          <button onClick={resetZoom}>Reset</button>
        </div>
      </div>
      
      <div className="main">
        <div className="editor">
          <div className="file-controls">
            <input
              ref={fileInputRef}
              type="file"
              accept=".mmd,.md,.txt"
              onChange={handleFileUpload}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-label">
              Open File
            </label>
            <button onClick={downloadFile} className="file-label">
              Save
            </button>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Mermaid diagram code..."
          />
        </div>
        
        <div className="preview">
          <div 
            ref={diagramRef}
            className="diagram"
            style={{ transform: `scale(${zoom})` }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;