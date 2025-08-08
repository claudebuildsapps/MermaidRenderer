import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';

// Example diagrams for showcase
const EXAMPLES = {
  flowchart: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
  sequence: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!`,
  gitgraph: `gitgraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    commit
    merge develop`,
  classDiagram: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +String breed
      +bark()
    }
    Animal <|-- Dog`,
  gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
    Research: 2024-01-01, 7d
    Design: 2024-01-05, 5d
    section Development
    Frontend: 2024-01-10, 14d
    Backend: 2024-01-15, 10d`,
  mindmap: `mindmap
  root((MermaidJS))
    Origins
      GitHub
      2014
    Types
      Flowchart
      Sequence
      Class
      State
      Gantt
    Features
      Live Editor
      Export
      Themes`
};

function App() {
  const [code, setCode] = useState(EXAMPLES.flowchart);
  const [currentExample, setCurrentExample] = useState('flowchart');
  const [zoom, setZoom] = useState(1);
  const [fileName, setFileName] = useState('');
  const [showExamples, setShowExamples] = useState(false);
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

  const downloadSVG = () => {
    const svg = diagramRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const loadExample = (exampleKey) => {
    setCode(EXAMPLES[exampleKey]);
    setCurrentExample(exampleKey);
    setFileName('');
    setTimeout(renderDiagram, 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧜‍♀️ MermaidRenderer</h1>
        <p>Interactive Mermaid.js diagram editor and renderer</p>
      </header>
      
      <div className="controls">
        <button onClick={renderDiagram} className="primary">Render</button>
        <button onClick={() => setShowExamples(!showExamples)} className="secondary">
          {showExamples ? 'Hide Examples' : 'Show Examples'}
        </button>
        <div className="zoom-controls">
          <button onClick={() => handleZoom(0.8)}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => handleZoom(1.25)}>+</button>
          <button onClick={resetZoom}>Reset</button>
        </div>
      </div>
      
      {showExamples && (
        <div className="examples">
          <h3>Example Diagrams:</h3>
          <div className="example-buttons">
            {Object.keys(EXAMPLES).map(key => (
              <button 
                key={key}
                onClick={() => loadExample(key)}
                className={currentExample === key ? 'active' : ''}
              >
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      )}
      
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
              Save .mmd
            </button>
            <button onClick={downloadSVG} className="file-label">
              Export SVG
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