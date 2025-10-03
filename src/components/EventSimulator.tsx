import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  CheckCircle, 
  Globe, 
  User, 
  Monitor,
  Play,
  Square,
  Check,
  X,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import './EventSimulator.css';

// Type definitions
interface GamingHubEnterData {
  source_url: string;
  hub_version: string;
}

interface GamePlayStartData {
  game_id: string;
  mini_game_type: string;
  difficulty: string;
  category: string;
  game_mode: string;
}

interface GamePlayEndData {
  game_id: string;
  mini_game_type: string;
  duration: number;
  final_score: number;
  completion_status: string;
  questions_attempted: number;
  questions_correct: number;
}

interface CorrectAnswerData {
  game_id: string;
  question_id: string;
  time_taken: number;
  score: number;
  hint_used: boolean;
  streak_bonus: number;
}

interface WrongAnswerData {
  game_id: string;
  question_id: string;
  time_taken: number;
  attempts: number;
  correct_answer_id: string;
  hint_used: boolean;
}

interface ErrorData {
  error_code: string;
  error_message: string;
  stack_trace: string;
  game_id: string;
}

interface EventSpecificData {
  gaming_hub_enter: GamingHubEnterData;
  game_play_start: GamePlayStartData;
  game_play_end: GamePlayEndData;
  correct_answer: CorrectAnswerData;
  wrong_answer: WrongAnswerData;
  error: ErrorData;
}

const EventSimulator: React.FC = () => {
  const [selectedEventType, setSelectedEventType] = useState<keyof EventSpecificData>('gaming_hub_enter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [useMockResponse, setUseMockResponse] = useState(false);
  
  // Ref for the form section to enable auto-scroll
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Auto-close toast after 4 seconds
  useEffect(() => {
    if (response) {
      const timer = setTimeout(() => {
        setResponse(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [response]);

  // Base event data structure
  const [baseEventData, setBaseEventData] = useState({
    tenant_id: "sports-fanzone-123",
    player_id: "fan_002",
    session_id: "session_game_002",
    app_version: "3.2.1",
    locale: "en_US",
    region: "NA",
    consent_state: "granted",
    schema_version: "2.0"
  });

  // Event-specific data for each type
  const [eventSpecificData, setEventSpecificData] = useState<EventSpecificData>({
    gaming_hub_enter: {
      source_url: "https://example.com/sports",
      hub_version: "3.1.0"
    },
    game_play_start: {
      game_id: "premier-league-predictor",
      mini_game_type: "predictor",
      difficulty: "medium",
      category: "football",
      game_mode: "daily_challenge"
    },
    game_play_end: {
      game_id: "premier-league-predictor",
      mini_game_type: "predictor",
      duration: 120000,
      final_score: 850,
      completion_status: "completed",
      questions_attempted: 10,
      questions_correct: 7
    },
    correct_answer: {
      game_id: "football-trivia-master",
      question_id: "q_12345",
      time_taken: 8500,
      score: 150,
      hint_used: false,
      streak_bonus: 25
    },
    wrong_answer: {
      game_id: "football-trivia-master",
      question_id: "q_67890",
      time_taken: 15000,
      attempts: 2,
      correct_answer_id: "ans_c",
      hint_used: true
    },
    error: {
      error_code: "NETWORK_TIMEOUT",
      error_message: "Failed to load game assets due to network timeout",
      stack_trace: "Error at fetchGameData() line 42",
      game_id: "premier-league-predictor"
    }
  });

  const eventTypes = [
    { 
      value: "gaming_hub_enter" as keyof EventSpecificData, 
      label: "Gaming Hub Enter", 
      icon: LogIn, 
      color: "#3b82f6",
      description: "Track when players enter the gaming hub"
    },
    { 
      value: "game_play_start" as keyof EventSpecificData, 
      label: "Game Play Start", 
      icon: Play, 
      color: "#8b5cf6",
      description: "Track when players start playing a specific game"
    },
    { 
      value: "game_play_end" as keyof EventSpecificData, 
      label: "Game Play End", 
      icon: Square, 
      color: "#6366f1",
      description: "Track when players finish playing a game"
    },
    { 
      value: "correct_answer" as keyof EventSpecificData, 
      label: "Correct Answer", 
      icon: Check, 
      color: "#10b981",
      description: "Track when players answer questions correctly"
    },
    { 
      value: "wrong_answer" as keyof EventSpecificData, 
      label: "Wrong Answer", 
      icon: X, 
      color: "#ef4444",
      description: "Track when players answer questions incorrectly"
    },
    { 
      value: "error" as keyof EventSpecificData, 
      label: "Error Event", 
      icon: AlertTriangle, 
      color: "#f59e0b",
      description: "Track system errors and issues"
    }
  ];

  const locales = ["en_US", "en_GB", "es_ES", "fr_FR", "de_DE", "pt_BR"];
  const regions = ["NA", "EU", "APAC", "SA", "MEA"];
  const difficulties = ["easy", "medium", "hard"];
  const categories = ["football", "basketball", "soccer", "tennis", "sports"];
  const gameModes = ["daily_challenge", "quick_play", "tournament", "practice"];
  const completionStatuses = ["completed", "abandoned", "timeout", "error"];

  const selectedEvent = eventTypes.find(et => et.value === selectedEventType);

  const handleBaseInputChange = (field: string, value: any) => {
    setBaseEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventDataChange = (field: string, value: any) => {
    setEventSpecificData(prev => ({
      ...prev,
      [selectedEventType]: {
        ...prev[selectedEventType as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleEventTypeChange = (eventType: keyof EventSpecificData) => {
    setSelectedEventType(eventType);
    setIsScrolling(true);
    
    // Update base event data based on event type
    if (eventType === 'correct_answer') {
      setBaseEventData(prev => ({
        ...prev,
        player_id: "fan_003",
        session_id: "session_quiz_003"
      }));
    } else if (eventType === 'wrong_answer') {
      setBaseEventData(prev => ({
        ...prev,
        player_id: "fan_004",
        session_id: "session_quiz_004"
      }));
    } else if (eventType === 'error') {
      setBaseEventData(prev => ({
        ...prev,
        player_id: "fan_005",
        session_id: "session_error_005"
      }));
    } else if (eventType === 'game_play_start' || eventType === 'game_play_end') {
      setBaseEventData(prev => ({
        ...prev,
        player_id: "fan_002",
        session_id: "session_game_002"
      }));
    } else {
      // Default for other events (gaming_hub_enter)
      setBaseEventData(prev => ({
        ...prev,
        player_id: "fan_001",
        session_id: "session_hub_001"
      }));
    }
    
    // Auto-scroll to form section after a brief delay to allow UI update
    setTimeout(() => {
      if (formSectionRef.current) {
        // Add a subtle highlight effect
        formSectionRef.current.style.transform = 'scale(1.01)';
        formSectionRef.current.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
        
        formSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Remove highlight effect after scroll
        setTimeout(() => {
          if (formSectionRef.current) {
            formSectionRef.current.style.transform = '';
            formSectionRef.current.style.boxShadow = '';
          }
          setIsScrolling(false);
        }, 800);
      }
    }, 100);
  };

  const generateSessionId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `session_${selectedEventType}_${timestamp}_${random}`;
  };

  const generatePlayerId = () => {
    const random = Math.random().toString(36).substring(2, 8);
    return `player_${random}`;
  };

  const generateQuestionId = () => {
    const random = Math.random().toString(36).substring(2, 8);
    return `q_${random}`;
  };

  const buildEventPayload = () => {
    return {
      ...baseEventData,
      event_type: selectedEventType,
      event_data: eventSpecificData[selectedEventType as keyof typeof eventSpecificData]
    };
  };

  const submitEvent = async () => {
    setIsSubmitting(true);
    setResponse(null);
    
    // Use mock response or real API based on toggle
    const showMockSuccess = useMockResponse;
    
    if (showMockSuccess) {
      // Mock successful response for demonstration
      setTimeout(() => {
        setResponse({
          status: "success",
          message: "Event created successfully"
        });
        setIsSubmitting(false);
      }, 1500);
      return;
    }
    
    try {
      const payload = buildEventPayload();
      const apiUrl = import.meta.env.VITE_EVENTS_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
      const authToken = import.meta.env.VITE_API_AUTH_TOKEN || 'Basic YWRtaW46Z2FtaW5nMTIz';
      
      console.log('Sending request to:', `${apiUrl}/events`);
      console.log('Payload:', payload);
      
      const response = await fetch(`${apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        console.log('Request successful:', response.status);
        setResponse({
          status: "success",
          message: "Event created successfully"
        });
      } else {
        console.log('Request failed:', response.status, response.statusText);
        setResponse({
          status: "error",
          message: `Failed to create event (${response.status})`
        });
      }
    } catch (error) {
      console.error('Request error:', error);
      setResponse({
        status: "error",
        message: "Connection failed"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurlCommand = () => {
    const payload = buildEventPayload();
    const apiUrl = import.meta.env.VITE_EVENTS_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const authToken = import.meta.env.VITE_API_AUTH_TOKEN || 'Basic YWRtaW46Z2FtaW5nMTIz';
    return `curl -X POST "${apiUrl}/events" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ${authToken}" \\
  -d '${JSON.stringify(payload, null, 2)}'`;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const currentEventData = eventSpecificData[selectedEventType];

  return (
    <div className="event-simulator">
      <div className="simulator-header">
        <div className="header-content">
          <div className="header-main">
            <div>
              <h1 className="simulator-title">
                <Monitor className="title-icon" />
                Gaming Events Creator
              </h1>
              <p className="simulator-description">
                Create and submit gaming events with dynamic form fields for each event type
              </p>
            </div>
            
            <div className="api-toggle">
              <label className="toggle-label">
                <span className="toggle-text">
                  {useMockResponse ? '🎭 Mock API' : '🌐 Real API'}
                </span>
                <div className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={!useMockResponse}
                    onChange={(e) => setUseMockResponse(!e.target.checked)}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
              {!useMockResponse && (
                <p className="toggle-hint">⚠️ Requires CORS-enabled server</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="simulator-content">
        {/* Event Type Selector */}
        <div className="event-type-section">
          <h2 className="section-title">Select Event Type</h2>
          <div className="event-type-grid">
            {eventTypes.map(type => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.value}
                  className={`event-type-card ${selectedEventType === type.value ? 'active' : ''}`}
                  onClick={() => handleEventTypeChange(type.value)}
                  style={{ '--accent-color': type.color } as any}
                >
                  <div className="event-type-header">
                    <IconComponent className="event-type-icon" size={24} />
                    <span className="event-type-label">{type.label}</span>
                  </div>
                  <p className="event-type-description">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form */}
        <div className={`event-form-section ${isScrolling ? 'scrolling' : ''}`} ref={formSectionRef}>
          <div className="form-header" style={{ '--accent-color': selectedEvent?.color } as any}>
            {selectedEvent && (
              <>
                <selectedEvent.icon className="form-header-icon" size={32} />
                <div>
                  <h3 className="form-title">{selectedEvent.label} Event</h3>
                  <p className="form-subtitle">POST /events - {selectedEvent.description}</p>
                </div>
              </>
            )}
          </div>

          <div className="form-grid">
            {/* Base Event Fields */}
            <div className="form-section">
              <h4 className="subsection-title">
                <Globe size={20} />
                Base Event Information
              </h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Tenant ID</label>
                  <input
                    type="text"
                    className="form-input"
                    value={baseEventData.tenant_id}
                    onChange={(e) => handleBaseInputChange('tenant_id', e.target.value)}
                    placeholder="sports-fanzone-123"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Player ID</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      className="form-input"
                      value={baseEventData.player_id}
                      onChange={(e) => handleBaseInputChange('player_id', e.target.value)}
                      placeholder="fan_001"
                    />
                    <button 
                      className="generate-btn"
                      onClick={() => handleBaseInputChange('player_id', generatePlayerId())}
                      title="Generate Random Player ID"
                    >
                      <User size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Session ID</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      className="form-input"
                      value={baseEventData.session_id}
                      onChange={(e) => handleBaseInputChange('session_id', e.target.value)}
                      placeholder="session_hub_001"
                    />
                    <button 
                      className="generate-btn"
                      onClick={() => handleBaseInputChange('session_id', generateSessionId())}
                      title="Generate Random Session ID"
                    >
                      🔄
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">App Version</label>
                  <input
                    type="text"
                    className="form-input"
                    value={baseEventData.app_version}
                    onChange={(e) => handleBaseInputChange('app_version', e.target.value)}
                    placeholder="3.2.1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Locale</label>
                  <select
                    className="form-select"
                    value={baseEventData.locale}
                    onChange={(e) => handleBaseInputChange('locale', e.target.value)}
                  >
                    {locales.map(locale => (
                      <option key={locale} value={locale}>{locale}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select
                    className="form-select"
                    value={baseEventData.region}
                    onChange={(e) => handleBaseInputChange('region', e.target.value)}
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Event-Specific Fields */}
            <div className="form-section">
              <h4 className="subsection-title" style={{ color: selectedEvent?.color }}>
                {selectedEvent && <selectedEvent.icon size={20} />}
                {selectedEvent?.label} Specific Data
              </h4>
              
              {/* Gaming Hub Enter Fields */}
              {selectedEventType === 'gaming_hub_enter' && (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Source URL</label>
                    <input
                      type="url"
                      className="form-input"
                      value={(currentEventData as GamingHubEnterData).source_url}
                      onChange={(e) => handleEventDataChange('source_url', e.target.value)}
                      placeholder="https://example.com/sports"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Hub Version</label>
                    <input
                      type="text"
                      className="form-input"
                      value={(currentEventData as GamingHubEnterData).hub_version}
                      onChange={(e) => handleEventDataChange('hub_version', e.target.value)}
                      placeholder="3.1.0"
                    />
                  </div>
                </div>
              )}

              {/* Game Play Start Fields */}
              {selectedEventType === 'game_play_start' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Game ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as GamePlayStartData).game_id}
                        onChange={(e) => handleEventDataChange('game_id', e.target.value)}
                        placeholder="premier-league-predictor"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Mini Game Type</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as GamePlayStartData).mini_game_type}
                        onChange={(e) => handleEventDataChange('mini_game_type', e.target.value)}
                        placeholder="predictor"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Difficulty</label>
                      <select
                        className="form-select"
                        value={(currentEventData as GamePlayStartData).difficulty}
                        onChange={(e) => handleEventDataChange('difficulty', e.target.value)}
                      >
                        {difficulties.map(diff => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={(currentEventData as GamePlayStartData).category}
                        onChange={(e) => handleEventDataChange('category', e.target.value)}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Game Mode</label>
                      <select
                        className="form-select"
                        value={(currentEventData as GamePlayStartData).game_mode}
                        onChange={(e) => handleEventDataChange('game_mode', e.target.value)}
                      >
                        {gameModes.map(mode => (
                          <option key={mode} value={mode}>{mode}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Game Play End Fields */}
              {selectedEventType === 'game_play_end' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Game ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as GamePlayEndData).game_id}
                        onChange={(e) => handleEventDataChange('game_id', e.target.value)}
                        placeholder="premier-league-predictor"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Duration (ms)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as GamePlayEndData).duration}
                        onChange={(e) => handleEventDataChange('duration', parseInt(e.target.value))}
                        placeholder="120000"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Final Score</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as GamePlayEndData).final_score}
                        onChange={(e) => handleEventDataChange('final_score', parseInt(e.target.value))}
                        placeholder="850"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Completion Status</label>
                      <select
                        className="form-select"
                        value={(currentEventData as GamePlayEndData).completion_status}
                        onChange={(e) => handleEventDataChange('completion_status', e.target.value)}
                      >
                        {completionStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Questions Attempted</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as GamePlayEndData).questions_attempted}
                        onChange={(e) => handleEventDataChange('questions_attempted', parseInt(e.target.value))}
                        placeholder="10"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Questions Correct</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as GamePlayEndData).questions_correct}
                        onChange={(e) => handleEventDataChange('questions_correct', parseInt(e.target.value))}
                        placeholder="7"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Correct Answer Fields */}
              {selectedEventType === 'correct_answer' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Game ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as CorrectAnswerData).game_id}
                        onChange={(e) => handleEventDataChange('game_id', e.target.value)}
                        placeholder="football-trivia-master"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Question ID</label>
                      <div className="input-with-action">
                        <input
                          type="text"
                          className="form-input"
                          value={(currentEventData as CorrectAnswerData).question_id}
                          onChange={(e) => handleEventDataChange('question_id', e.target.value)}
                          placeholder="q_12345"
                        />
                        <button 
                          className="generate-btn"
                          onClick={() => handleEventDataChange('question_id', generateQuestionId())}
                          title="Generate Random Question ID"
                        >
                          🔄
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Time Taken (ms)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as CorrectAnswerData).time_taken}
                        onChange={(e) => handleEventDataChange('time_taken', parseInt(e.target.value))}
                        placeholder="8500"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Score</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as CorrectAnswerData).score}
                        onChange={(e) => handleEventDataChange('score', parseInt(e.target.value))}
                        placeholder="150"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Hint Used</label>
                      <select
                        className="form-select"
                        value={(currentEventData as CorrectAnswerData).hint_used.toString()}
                        onChange={(e) => handleEventDataChange('hint_used', e.target.value === 'true')}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Streak Bonus</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as CorrectAnswerData).streak_bonus}
                        onChange={(e) => handleEventDataChange('streak_bonus', parseInt(e.target.value))}
                        placeholder="25"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Wrong Answer Fields */}
              {selectedEventType === 'wrong_answer' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Game ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as WrongAnswerData).game_id}
                        onChange={(e) => handleEventDataChange('game_id', e.target.value)}
                        placeholder="football-trivia-master"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Question ID</label>
                      <div className="input-with-action">
                        <input
                          type="text"
                          className="form-input"
                          value={(currentEventData as WrongAnswerData).question_id}
                          onChange={(e) => handleEventDataChange('question_id', e.target.value)}
                          placeholder="q_67890"
                        />
                        <button 
                          className="generate-btn"
                          onClick={() => handleEventDataChange('question_id', generateQuestionId())}
                          title="Generate Random Question ID"
                        >
                          🔄
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Time Taken (ms)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as WrongAnswerData).time_taken}
                        onChange={(e) => handleEventDataChange('time_taken', parseInt(e.target.value))}
                        placeholder="15000"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Attempts</label>
                      <input
                        type="number"
                        className="form-input"
                        value={(currentEventData as WrongAnswerData).attempts}
                        onChange={(e) => handleEventDataChange('attempts', parseInt(e.target.value))}
                        placeholder="2"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Correct Answer ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as WrongAnswerData).correct_answer_id}
                        onChange={(e) => handleEventDataChange('correct_answer_id', e.target.value)}
                        placeholder="ans_c"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Hint Used</label>
                      <select
                        className="form-select"
                        value={(currentEventData as WrongAnswerData).hint_used.toString()}
                        onChange={(e) => handleEventDataChange('hint_used', e.target.value === 'true')}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Error Event Fields */}
              {selectedEventType === 'error' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Error Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as ErrorData).error_code}
                        onChange={(e) => handleEventDataChange('error_code', e.target.value)}
                        placeholder="NETWORK_TIMEOUT"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Game ID (Optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        value={(currentEventData as ErrorData).game_id}
                        onChange={(e) => handleEventDataChange('game_id', e.target.value)}
                        placeholder="premier-league-predictor"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Error Message</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        value={(currentEventData as ErrorData).error_message}
                        onChange={(e) => handleEventDataChange('error_message', e.target.value)}
                        placeholder="Failed to load game assets due to network timeout"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Stack Trace</label>
                      <textarea
                        className="form-textarea"
                        rows={4}
                        value={(currentEventData as ErrorData).stack_trace}
                        onChange={(e) => handleEventDataChange('stack_trace', e.target.value)}
                        placeholder="Error at fetchGameData() line 42"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              className="submit-btn primary"
              onClick={submitEvent}
              disabled={isSubmitting}
              style={{ '--accent-color': selectedEvent?.color } as any}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  Sending to API...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send {selectedEvent?.label} Event
                </>
              )}
            </button>
            
            <button 
              className="submit-btn secondary"
              onClick={() => setShowJson(!showJson)}
            >
              <Copy size={18} />
              {showJson ? 'Hide' : 'Show'} cURL Command
            </button>
          </div>
        </div>

      {/* Toast Notification */}
      {response && (
        <div className="toast-overlay">
          <div className={`toast ${response.status === 'success' ? 'toast-success' : 'toast-error'}`}>
            <div className="toast-content">
              {response.status === 'success' ? (
                <CheckCircle className="toast-icon success-icon" />
              ) : (
                <X className="toast-icon error-icon" />
              )}
              
              <div className="toast-text">
                <h4 className="toast-heading">
                  {response.status === 'success' ? 'Success' : 'Error'}
                </h4>
                <p className="toast-message">{response.message}</p>
              </div>
              
              <button 
                className="toast-close"
                onClick={() => setResponse(null)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
            
            {response.status === 'error' && (
              <button 
                className="toast-retry"
                onClick={submitEvent}
                disabled={isSubmitting}
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

        {/* JSON/Curl Section */}
        {showJson && (
          <div className="json-section">
            <div className="json-header">
              <h3>Generated cURL Command</h3>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(getCurlCommand())}
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
            </div>
            <pre className="json-content">
              <code>{getCurlCommand()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventSimulator;
