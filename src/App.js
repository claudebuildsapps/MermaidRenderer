import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './App.css';

// Comprehensive showcase diagrams organized by category
const EXAMPLE_CATEGORIES = {
  'Basic Applications': {
    'Todo App': `flowchart TD
    A[User Opens App] --> B{Has Account?}
    B -->|No| C[Sign Up]
    B -->|Yes| D[Login]
    C --> E[Create Profile]
    E --> F[Dashboard]
    D --> F
    F --> G[View Tasks]
    G --> H{Action?}
    H -->|Add| I[Create Task]
    H -->|Edit| J[Update Task]
    H -->|Delete| K[Remove Task]
    H -->|Complete| L[Mark Complete]
    I --> G
    J --> G
    K --> G
    L --> G`,
    
    'Weather Dashboard': `journey
    title Weather Dashboard User Experience
    section Morning Check
      Open App: 5: User
      View Current Weather: 4: User
      Check Hourly Forecast: 3: User
      Set Location Alert: 4: User
    section Planning Day
      View 7-Day Forecast: 5: User
      Check Rain Probability: 4: User
      View UV Index: 3: User
      Save Favorite Locations: 4: User
    section Weather Alerts
      Receive Push Notification: 5: System
      View Alert Details: 4: User
      Share Weather Info: 3: User`,
    
    'Chat Application': `sequenceDiagram
    participant U1 as User 1
    participant C as Client App
    participant WS as WebSocket Server
    participant DB as Database
    participant U2 as User 2
    
    U1->>C: Type message
    C->>WS: Send message via WebSocket
    WS->>DB: Store message
    DB-->>WS: Confirm stored
    WS->>U2: Broadcast message
    U2->>C: Receive message
    C->>U2: Display notification
    U2->>C: Read message
    C->>WS: Mark as read
    WS->>DB: Update read status`
  },
  
  'Medium Complexity': {
    'E-commerce Platform': `erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string customer_id
        string email
        string name
        string address
        datetime created_at
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        string order_id
        string customer_id
        decimal total_amount
        string status
        datetime order_date
    }
    ORDER_ITEM }|--|| PRODUCT : references
    ORDER_ITEM {
        string order_id
        string product_id
        int quantity
        decimal unit_price
    }
    PRODUCT ||--o{ REVIEW : has
    PRODUCT {
        string product_id
        string name
        text description
        decimal price
        int stock_quantity
        string category
    }
    CUSTOMER ||--o{ REVIEW : writes
    REVIEW {
        string review_id
        string customer_id
        string product_id
        int rating
        text comment
        datetime created_at
    }`,
    
    'Learning Management System': `classDiagram
    class User {
        +String userId
        +String email
        +String name
        +DateTime lastLogin
        +login()
        +logout()
        +updateProfile()
    }
    
    class Student {
        +String studentId
        +enrollInCourse()
        +submitAssignment()
        +takeQuiz()
        +viewGrades()
    }
    
    class Instructor {
        +String instructorId
        +createCourse()
        +gradeAssignment()
        +publishContent()
        +generateReports()
    }
    
    class Course {
        +String courseId
        +String title
        +String description
        +DateTime startDate
        +DateTime endDate
        +addStudent()
        +removeStudent()
        +publishLesson()
    }
    
    class Assignment {
        +String assignmentId
        +String title
        +DateTime dueDate
        +Integer maxPoints
        +create()
        +submit()
        +grade()
    }
    
    User <|-- Student
    User <|-- Instructor
    Student "many" -- "many" Course : enrolled in
    Instructor "1" -- "many" Course : teaches
    Course "1" -- "many" Assignment : contains`,
    
    'Project Management': `gantt
    title Software Development Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Analysis    :done, req, 2024-01-01, 2024-01-15
    System Design          :done, design, after req, 20d
    Architecture Planning   :done, arch, after design, 10d
    
    section Development
    Backend Development     :active, backend, 2024-02-15, 45d
    Frontend Development    :frontend, after arch, 40d
    Database Setup         :db, 2024-02-20, 15d
    API Integration        :api, after backend, 20d
    
    section Testing
    Unit Testing           :testing, after frontend, 15d
    Integration Testing    :int-test, after api, 10d
    User Acceptance Testing :uat, after int-test, 15d
    
    section Deployment
    Production Setup       :prod, after uat, 5d
    Go Live               :milestone, golive, after prod, 1d`
  },
  
  'Workflows & Processes': {
    'CI/CD Pipeline': `flowchart LR
    A[Developer Push] --> B[GitHub Webhook]
    B --> C[Build Trigger]
    C --> D[Pull Source Code]
    D --> E[Install Dependencies]
    E --> F[Run Unit Tests]
    F --> G{Tests Pass?}
    G -->|No| H[Notify Developer]
    G -->|Yes| I[Build Application]
    I --> J[Security Scan]
    J --> K{Vulnerabilities?}
    K -->|Yes| H
    K -->|No| L[Deploy to Staging]
    L --> M[Integration Tests]
    M --> N{Tests Pass?}
    N -->|No| H
    N -->|Yes| O{Manual Approval?}
    O -->|No| P[Auto Deploy to Prod]
    O -->|Yes| Q[Wait for Approval]
    Q --> R[Deploy to Production]
    P --> S[Health Check]
    R --> S
    S --> T[Success Notification]`,
    
    'User Onboarding': `stateDiagram-v2
    [*] --> LandingPage
    LandingPage --> SignUp : Click Sign Up
    LandingPage --> Login : Click Login
    
    SignUp --> EmailVerification : Submit Form
    EmailVerification --> ProfileSetup : Verify Email
    EmailVerification --> SignUp : Resend Email
    
    Login --> Dashboard : Valid Credentials
    Login --> Login : Invalid Credentials
    
    ProfileSetup --> InterestsSelection : Save Profile
    InterestsSelection --> Tutorial : Select Interests
    Tutorial --> Dashboard : Complete Tutorial
    Tutorial --> Dashboard : Skip Tutorial
    
    Dashboard --> [*] : User Active
    
    state ProfileSetup {
        [*] --> BasicInfo
        BasicInfo --> Avatar : Next
        Avatar --> Preferences : Next
        Preferences --> [*] : Save
    }`,
    
    'Order Processing': `sequenceDiagram
    participant C as Customer
    participant UI as Web Interface
    participant API as Order API
    participant INV as Inventory Service
    participant PAY as Payment Service
    participant SHP as Shipping Service
    participant EMAIL as Email Service
    
    C->>UI: Add items to cart
    C->>UI: Proceed to checkout
    UI->>API: Create order request
    API->>INV: Check inventory
    INV-->>API: Confirm availability
    API->>PAY: Process payment
    PAY-->>API: Payment confirmed
    API->>SHP: Create shipping label
    SHP-->>API: Tracking number
    API->>EMAIL: Send confirmation
    EMAIL-->>C: Order confirmation email
    API-->>UI: Order success
    UI-->>C: Display confirmation
    
    Note over SHP: Package ships
    SHP->>EMAIL: Shipping notification
    EMAIL-->>C: Tracking email`
  }
};

// Flatten examples for backward compatibility
const EXAMPLES = {};
Object.entries(EXAMPLE_CATEGORIES).forEach(([category, examples]) => {
  Object.entries(examples).forEach(([name, code]) => {
    const key = name.toLowerCase().replace(/\s+/g, '_');
    EXAMPLES[key] = code;
  });
});

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