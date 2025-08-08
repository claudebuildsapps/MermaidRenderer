import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import Sidebar from './Sidebar';
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
  },
  
  'Specialized Systems': {
    'Social Media Analytics': `pie title Social Media Engagement Distribution
    "Instagram" : 35
    "Twitter" : 25
    "Facebook" : 20
    "LinkedIn" : 12
    "TikTok" : 5
    "YouTube" : 3`,
    
    'Healthcare Patient Portal': `mindmap
  root((Patient Portal))
    Appointments
      Schedule New
      View Upcoming
      Cancel/Reschedule
      Virtual Visits
        Video Chat
        Phone Call
    Medical Records
      Lab Results
      Imaging Reports
      Prescription History
      Vaccination Records
      Insurance Info
    Communication
      Message Provider
      Appointment Reminders
      Test Result Notifications
      Prescription Refill Alerts
    Health Tracking
      Vital Signs
      Symptoms Log
      Medication Tracker
      Exercise Log
    Billing
      View Statements
      Payment History
      Insurance Claims
      Payment Plans`,
    
    'Financial Trading Platform': `flowchart TD
    A[User Login] --> B[Account Verification]
    B --> C{Account Type?}
    C -->|Basic| D[Limited Trading]
    C -->|Premium| E[Full Access]
    C -->|Professional| F[Advanced Tools]
    
    D --> G[Market Data]
    E --> G
    F --> G
    
    G --> H[Select Asset]
    H --> I[Analyze Charts]
    I --> J{Trading Decision}
    J -->|Buy| K[Create Buy Order]
    J -->|Sell| L[Create Sell Order]
    J -->|Hold| M[Monitor Position]
    
    K --> N[Order Validation]
    L --> N
    N --> O{Sufficient Funds?}
    O -->|No| P[Reject Order]
    O -->|Yes| Q[Execute Trade]
    
    Q --> R[Update Portfolio]
    R --> S[Send Confirmation]
    S --> T[Risk Assessment]
    T --> U[Generate Reports]
    
    M --> V[Price Alerts]
    V --> W{Alert Triggered?}
    W -->|Yes| G
    W -->|No| V`
  },
  
  'Advanced Architecture': {
    'Smart Home IoT': `graph TB
    subgraph "Home Network"
        R[WiFi Router] --> H[Smart Hub]
        H --> T1[Temperature Sensors]
        H --> L1[Smart Lights]
        H --> S1[Security Cameras]
        H --> D1[Door Locks]
        H --> A1[Appliances]
        
        T1 --> T2[Living Room]
        T1 --> T3[Bedroom]
        T1 --> T4[Kitchen]
        
        L1 --> L2[LED Strips]
        L1 --> L3[Bulbs]
        L1 --> L4[Motion Sensors]
        
        S1 --> S2[Front Door]
        S1 --> S3[Backyard]
        S1 --> S4[Garage]
        
        D1 --> D2[Main Entry]
        D1 --> D3[Garage Door]
        
        A1 --> A2[Smart Thermostat]
        A1 --> A3[Washing Machine]
        A1 --> A4[Coffee Maker]
    end
    
    subgraph "Cloud Services"
        C[Cloud Platform] --> AI[AI Processing]
        C --> DB[Device Database]
        C --> AN[Analytics Engine]
    end
    
    subgraph "User Interfaces"
        M[Mobile App] --> C
        V[Voice Assistant] --> C
        W[Web Dashboard] --> C
    end
    
    R --> I[Internet]
    I --> C
    
    style H fill:#e1f5fe
    style C fill:#f3e5f5
    style M fill:#e8f5e8`,
    
    'Video Streaming State Machine': `stateDiagram-v2
    [*] --> Idle
    
    Idle --> Loading : User selects video
    Loading --> Buffering : Metadata loaded
    Loading --> Error : Load failed
    
    Buffering --> Playing : Buffer sufficient
    Buffering --> Error : Buffer failed
    
    Playing --> Paused : User pauses
    Playing --> Buffering : Buffer empty
    Playing --> Seeking : User seeks
    Playing --> Ended : Video complete
    Playing --> Error : Playback error
    
    Paused --> Playing : User resumes
    Paused --> Seeking : User seeks
    Paused --> Idle : User stops
    
    Seeking --> Buffering : Seek complete
    Seeking --> Error : Seek failed
    
    Ended --> Idle : User exits
    Ended --> Loading : Auto-next video
    
    Error --> Idle : User retries
    Error --> Loading : Auto-retry
    
    state Playing {
        [*] --> StandardQuality
        StandardQuality --> HDQuality : Network good
        StandardQuality --> LowQuality : Network poor
        HDQuality --> StandardQuality : Network degraded
        LowQuality --> StandardQuality : Network improved
    }`,
    
    'Cryptocurrency Exchange': `sequenceDiagram
    participant U as User
    participant UI as Trading Interface
    participant OE as Order Engine
    participant MB as Match Book
    participant WS as Wallet Service
    participant BC as Blockchain
    participant KYC as KYC Service
    participant N as Notification Service
    
    U->>UI: Login & 2FA
    UI->>KYC: Verify identity
    KYC-->>UI: Identity confirmed
    
    U->>UI: Place buy order (BTC/USD)
    UI->>OE: Submit order request
    OE->>WS: Check USD balance
    WS-->>OE: Balance confirmed
    OE->>MB: Add to order book
    
    Note over MB: Matching algorithm runs
    MB->>MB: Find matching sell order
    MB->>OE: Orders matched
    
    OE->>WS: Transfer USD to seller
    OE->>WS: Transfer BTC to buyer
    WS->>BC: Record BTC transaction
    BC-->>WS: Transaction confirmed
    
    OE->>N: Trade executed event
    N->>U: Push notification
    N->>UI: Update portfolio
    UI-->>U: Display updated balances
    
    par Settlement
        WS->>BC: Batch withdrawal requests
    and Reporting
        OE->>N: Daily trading summary
        N->>U: Email report
    end`,
    
    'Gaming Leaderboard': `classDiagram
    class Player {
        +UUID playerId
        +String username
        +String email
        +DateTime joinDate
        +Int totalScore
        +Int gamesPlayed
        +Double winRate
        +updateScore(points)
        +getStats()
        +resetStats()
    }
    
    class Game {
        +UUID gameId
        +String gameName
        +GameType type
        +DateTime startTime
        +DateTime endTime
        +GameStatus status
        +Int maxPlayers
        +startGame()
        +endGame()
        +addPlayer()
        +removePlayer()
    }
    
    class GameSession {
        +UUID sessionId
        +UUID gameId
        +UUID playerId
        +Int score
        +DateTime sessionStart
        +DateTime sessionEnd
        +Int rank
        +calculateRank()
        +updateScore()
    }
    
    class Leaderboard {
        +UUID leaderboardId
        +String name
        +LeaderboardType type
        +DateTime periodStart
        +DateTime periodEnd
        +List~Player~ topPlayers
        +updateRankings()
        +getTopN(n)
        +resetPeriod()
    }
    
    class Achievement {
        +UUID achievementId
        +String name
        +String description
        +AchievementType type
        +Int pointValue
        +String iconUrl
        +checkCriteria()
    }
    
    class PlayerAchievement {
        +UUID playerAchievementId
        +UUID playerId
        +UUID achievementId
        +DateTime earnedDate
        +Boolean isDisplayed
    }
    
    class Tournament {
        +UUID tournamentId
        +String name
        +DateTime startDate
        +DateTime endDate
        +Int entryFee
        +Int prizePool
        +TournamentStatus status
        +List~Player~ participants
        +registerPlayer()
        +calculatePrizes()
        +generateBracket()
    }
    
    Player "1" --> "many" GameSession : participates
    Game "1" --> "many" GameSession : hosts
    Player "many" --> "many" Leaderboard : ranked_in
    Player "1" --> "many" PlayerAchievement : earns
    Achievement "1" --> "many" PlayerAchievement : awarded_as
    Tournament "1" --> "many" Player : includes
    
    <<enumeration>> GameType
    GameType : PUZZLE
    GameType : ACTION
    GameType : STRATEGY
    GameType : SPORTS
    
    <<enumeration>> LeaderboardType
    LeaderboardType : DAILY
    LeaderboardType : WEEKLY
    LeaderboardType : MONTHLY
    LeaderboardType : ALL_TIME`,
    
    'Food Delivery App': `mindmap
  root((Food Delivery App))
    User Management
      Registration
        Email/Phone
        Social Login
        Identity Verification
      Profile
        Preferences
        Dietary Restrictions
        Payment Methods
        Delivery Addresses
    Restaurant Management
      Restaurant Onboarding
        Business Verification
        Menu Upload
        Photo Management
        Operating Hours
      Order Management
        Order Queue
        Kitchen Display
        Preparation Times
        Status Updates
    Delivery System
      Driver Management
        Driver Onboarding
        Background Checks
        Vehicle Registration
        Availability Status
      Route Optimization
        GPS Tracking
        Traffic Analysis
        Multi-order Batching
        ETA Calculation
    Payment Processing
      Multiple Payment Methods
        Credit/Debit Cards
        Digital Wallets
        Cash on Delivery
        Corporate Accounts
      Transaction Management
        Payment Gateway
        Refund Processing
        Commission Calculation
        Financial Reporting
    Order Lifecycle
      Browse & Search
        Restaurant Discovery
        Menu Browsing
        Reviews & Ratings
        Filters & Sorting
      Order Placement
        Cart Management
        Customization Options
        Promo Code Application
        Order Confirmation
      Tracking & Delivery
        Real-time Tracking
        Push Notifications
        Delivery Confirmation
        Rating & Feedback`
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
  const firstExampleKey = Object.keys(EXAMPLES)[0] || 'todo_app';
  const [code, setCode] = useState(EXAMPLES[firstExampleKey] || EXAMPLES.todo_app || '');
  const [currentExample, setCurrentExample] = useState(firstExampleKey);
  const [zoom, setZoom] = useState(1);
  const [fileName, setFileName] = useState('');
  const [showExamples, setShowExamples] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const diagramRef = useRef();
  const fileInputRef = useRef();

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false, 
      theme: 'base',
      themeVariables: {
        // Vibrant but soft pastel colors for diagram shapes
        primaryColor: '#c7d2fe',
        primaryTextColor: '#475569',
        primaryBorderColor: '#a5b4fc',
        
        // Secondary vibrant pink
        secondaryColor: '#f9a8d4',
        secondaryTextColor: '#475569',
        secondaryBorderColor: '#f472b6',
        
        // Tertiary vibrant mint
        tertiaryColor: '#86efac',
        tertiaryTextColor: '#475569',
        tertiaryBorderColor: '#4ade80',
        
        // Background and surfaces (light tints)
        background: '#fefefe',
        mainBkg: '#f8fafc',
        secondBkg: '#c7d2fe',
        tertiaryBkg: '#f9a8d4',
        
        // Shape backgrounds (vibrant pastels)
        c0: '#c7d2fe',    // Vibrant lavender
        c1: '#f9a8d4',    // Vibrant pink
        c2: '#86efac',    // Vibrant mint
        c3: '#fde047',    // Vibrant yellow
        c4: '#7dd3fc',    // Vibrant sky
        c5: '#fb7185',    // Vibrant rose
        c6: '#2dd4bf',    // Vibrant teal
        c7: '#facc15',    // Vibrant gold
        
        // Lines and borders (visible)
        lineColor: '#a5b4fc',
        primaryBorderColor: '#a5b4fc',
        secondaryBorderColor: '#f472b6',
        
        // Section backgrounds (colorful)
        sectionBkgColor: '#c7d2fe',
        altSectionBkgColor: '#f9a8d4',
        
        // Grid and accents (vibrant)
        gridColor: '#cbd5e1',
        cScale0: '#c7d2fe',
        cScale1: '#f9a8d4',
        cScale2: '#86efac',
        cScale3: '#fde047',
        cScale4: '#7dd3fc',
        cScale5: '#fb7185',
        cScale6: '#2dd4bf',
        cScale7: '#facc15',
        
        // Node and shape fills (vibrant pastels)
        fill0: '#c7d2fe',
        fill1: '#f9a8d4',
        fill2: '#86efac',
        fill3: '#fde047',
        fill4: '#7dd3fc',
        fill5: '#fb7185',
        fill6: '#2dd4bf',
        fill7: '#facc15',
        
        // Pie chart colors (vibrant pastels)
        pie1: '#c7d2fe',
        pie2: '#f9a8d4', 
        pie3: '#86efac',
        pie4: '#fde047',
        pie5: '#7dd3fc',
        pie6: '#fb7185',
        pie7: '#2dd4bf',
        pie8: '#facc15',
        pie9: '#c084fc',
        pie10: '#fbbf24',
        pie11: '#34d399',
        pie12: '#60a5fa'
      }
    });
    renderDiagram();

  }, []);

  const renderDiagram = async () => {
    renderDiagramWithCode(code);
  };

  const fitDiagramToScreen = () => {
    const container = diagramRef.current;
    const svgElement = container?.querySelector('svg');
    
    if (!svgElement || !container) return;

    // Remove any SVG-level transforms
    svgElement.style.transform = 'none';

    const containerRect = container.getBoundingClientRect();
    // Minimal padding - take ENTIRE panel
    const availableWidth = containerRect.width - 20;
    const availableHeight = containerRect.height - 20;
    
    const svgBBox = svgElement.getBBox();
    const naturalWidth = svgBBox.width || svgElement.clientWidth || 400;
    const naturalHeight = svgBBox.height || svgElement.clientHeight || 300;
    
    if (naturalWidth > 0 && naturalHeight > 0) {
      // Calculate individual scale factors
      const scaleX = (availableWidth / naturalWidth) * 0.98;
      const scaleY = (availableHeight / naturalHeight) * 0.98;
      
      // Check aspect ratio difference to decide on stretching
      const aspectRatioContainer = availableWidth / availableHeight;
      const aspectRatioDiagram = naturalWidth / naturalHeight;
      const aspectDifference = Math.abs(aspectRatioContainer - aspectRatioDiagram);
      
      if (aspectDifference > 0.2) {
        // Different aspect ratios - stretch only the dimension that needs it
        if (aspectRatioDiagram > aspectRatioContainer) {
          // Diagram is wider than container - only stretch height, keep width at natural size
          svgElement.style.transform = `scale(1, ${scaleY})`;
        } else {
          // Diagram is taller than container - only stretch width, keep height at natural size
          svgElement.style.transform = `scale(${scaleX}, 1)`;
        }
        svgElement.style.transformOrigin = 'center center';
        
        // Ensure the diagram stays centered and visible
        const parent = svgElement.parentElement;
        if (parent) {
          parent.style.display = 'flex';
          parent.style.alignItems = 'center';
          parent.style.justifyContent = 'center';
          parent.style.overflow = 'visible';
        }
        
        // Set zoom to 1 - SVG is already properly scaled
        setZoom(1);
      } else {
        // Similar aspect ratios - use uniform scaling
        const uniformScale = Math.min(scaleX, scaleY);
        setZoom(Math.max(uniformScale, 0.1));
      }
    }
  };

  const handleZoom = (factor) => {
    setZoom(prev => Math.max(0.1, Math.min(5, prev * factor)));
  };

  const resetZoom = () => {
    setTimeout(() => {
      fitDiagramToScreen();
    }, 50);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const newCode = e.target.result;
        setCode(newCode);
        setTimeout(() => {
          renderDiagramWithCode(newCode);
        }, 200);
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
    const newCode = EXAMPLES[exampleKey];
    setCode(newCode);
    setCurrentExample(exampleKey);
    setFileName('');
    
    // Use a more reliable approach with longer timeout and explicit code reference
    setTimeout(() => {
      renderDiagramWithCode(newCode);
    }, 200);
  };

  const renderDiagramWithCode = async (diagramCode) => {
    if (diagramRef.current && diagramCode && diagramCode.trim()) {
      try {
        // Re-initialize mermaid with pastel theme before each render
        mermaid.initialize({ 
          startOnLoad: false, 
          theme: 'base',
          themeVariables: {
            // Vibrant but soft pastel colors for diagram shapes
            primaryColor: '#c7d2fe',
            primaryTextColor: '#475569',
            primaryBorderColor: '#a5b4fc',
            
            // Secondary vibrant pink
            secondaryColor: '#f9a8d4',
            secondaryTextColor: '#475569',
            secondaryBorderColor: '#f472b6',
            
            // Tertiary vibrant mint
            tertiaryColor: '#86efac',
            tertiaryTextColor: '#475569',
            tertiaryBorderColor: '#4ade80',
            
            // Background and surfaces (light tints)
            background: '#fefefe',
            mainBkg: '#f8fafc',
            secondBkg: '#c7d2fe',
            tertiaryBkg: '#f9a8d4',
            
            // Shape backgrounds (vibrant pastels)
            c0: '#c7d2fe',    // Vibrant lavender
            c1: '#f9a8d4',    // Vibrant pink
            c2: '#86efac',    // Vibrant mint
            c3: '#fde047',    // Vibrant yellow
            c4: '#7dd3fc',    // Vibrant sky
            c5: '#fb7185',    // Vibrant rose
            c6: '#2dd4bf',    // Vibrant teal
            c7: '#facc15',    // Vibrant gold
            
            // Lines and borders (visible)
            lineColor: '#a5b4fc',
            primaryBorderColor: '#a5b4fc',
            secondaryBorderColor: '#f472b6',
            
            // Section backgrounds (colorful)
            sectionBkgColor: '#c7d2fe',
            altSectionBkgColor: '#f9a8d4',
            
            // Grid and accents (vibrant)
            gridColor: '#cbd5e1',
            cScale0: '#c7d2fe',
            cScale1: '#f9a8d4',
            cScale2: '#86efac',
            cScale3: '#fde047',
            cScale4: '#7dd3fc',
            cScale5: '#fb7185',
            cScale6: '#2dd4bf',
            cScale7: '#facc15',
            
            // Node and shape fills (vibrant pastels)
            fill0: '#c7d2fe',
            fill1: '#f9a8d4',
            fill2: '#86efac',
            fill3: '#fde047',
            fill4: '#7dd3fc',
            fill5: '#fb7185',
            fill6: '#2dd4bf',
            fill7: '#facc15',
            
            // Pie chart colors (vibrant pastels)
            pie1: '#c7d2fe',
            pie2: '#f9a8d4', 
            pie3: '#86efac',
            pie4: '#fde047',
            pie5: '#7dd3fc',
            pie6: '#fb7185',
            pie7: '#2dd4bf',
            pie8: '#facc15',
            pie9: '#c084fc',
            pie10: '#fbbf24',
            pie11: '#34d399',
            pie12: '#60a5fa'
          }
        });
        
        const { svg } = await mermaid.render('diagram', diagramCode);
        diagramRef.current.innerHTML = svg;
        
        // Fit diagram to screen without cutting off
        setTimeout(() => {
          fitDiagramToScreen();
        }, 100);
      } catch (error) {
        diagramRef.current.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error.message}</div>`;
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>MermaidRenderer</h1>
        <div className="header-controls">
          <button onClick={renderDiagram} className="btn btn-success">
            Render
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mmd,.md,.txt"
            onChange={handleFileUpload}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="btn btn-secondary">
            Open File
          </label>
          <button onClick={downloadFile} className="btn btn-secondary">
            Save .mmd
          </button>
          <button onClick={downloadSVG} className="btn btn-primary">
            Export SVG
          </button>
          <div className="zoom-controls">
            <button 
              onClick={() => handleZoom(0.8)} 
              className="btn"
              title="Zoom out"
            >
              −
            </button>
            <span className="zoom-display">{Math.round(zoom * 100)}%</span>
            <button 
              onClick={() => handleZoom(1.25)} 
              className="btn"
              title="Zoom in"
            >
              +
            </button>
            <button 
              onClick={resetZoom} 
              className="btn"
              title="Reset zoom"
            >
              ↻
            </button>
          </div>
        </div>
      </header>
      
      
      
      <div className="main">
        {showEditor && (
          <Sidebar
            showExamples={showExamples}
            setShowExamples={setShowExamples}
            showEditor={showEditor}
            setShowEditor={setShowEditor}
            fileName={fileName}
            code={code}
            setCode={setCode}
            currentExample={currentExample}
            loadExample={loadExample}
            EXAMPLE_CATEGORIES={EXAMPLE_CATEGORIES}
          />
        )}
        
        <div className={`preview ${!showEditor ? 'preview-full' : ''}`}>
          {!showEditor && (
            <button 
              onClick={() => setShowEditor(true)} 
              className="show-editor-btn"
              title="Show code editor"
            >
              ➡ Show Editor
            </button>
          )}
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