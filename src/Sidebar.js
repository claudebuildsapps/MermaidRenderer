import React from 'react';

const Sidebar = ({ 
  showExamples, 
  setShowExamples, 
  showEditor,
  setShowEditor,
  fileName, 
  code, 
  setCode, 
  currentExample, 
  loadExample, 
  EXAMPLE_CATEGORIES 
}) => {
  return (
    <div className="editor">
      <div className="file-controls">
        <div className="editor-controls">
          <button 
            onClick={() => setShowEditor(!showEditor)} 
            className="editor-toggle"
            title={showEditor ? 'Hide code editor' : 'Show code editor'}
          >
            {showEditor ? '⬅ Hide Editor' : '➡ Show Editor'}
          </button>
          <button 
            onClick={() => setShowExamples(!showExamples)} 
            className={`examples-toggle ${showExamples ? 'active' : ''}`}
          >
            {showExamples ? '📝 Code' : '🎨 Examples'}
          </button>
        </div>
        {fileName && <span className="file-name">{fileName}</span>}
      </div>
      {showExamples ? (
        <div className="examples-browser">
          <h3>Showcase Diagrams</h3>
          <div className="examples-list">
            {Object.entries(EXAMPLE_CATEGORIES).map(([category, examples]) => (
              <div key={category} className="example-category">
                <h4>{category}</h4>
                <div className="example-buttons">
                  {Object.entries(examples).map(([name, code]) => {
                    const key = name.toLowerCase().replace(/\s+/g, '_');
                    return (
                      <button 
                        key={key}
                        onClick={() => loadExample(key)}
                        className={currentExample === key ? 'active' : ''}
                        title={`${name} - ${category}`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter Mermaid diagram code..."
        />
      )}
    </div>
  );
};

export default Sidebar;