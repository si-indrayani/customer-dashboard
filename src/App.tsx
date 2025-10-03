import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Players from './pages/Players'
import Games from './pages/Games'
import Analytics from './pages/Analytics'
import Events from './pages/Events'
import DailyActiveUsers from './pages/analytics/DailyActiveUsers'
import GamePlays from './pages/analytics/GamePlays'
import GameCompletions from './pages/analytics/GameCompletions'
import SessionTime from './pages/analytics/SessionTime'
import AnswerAccuracy from './pages/analytics/AnswerAccuracy'
import EventsByType from './pages/analytics/EventsByType'
import GamePerformance from './pages/analytics/GamePerformance'
import EventFlow from './pages/analytics/EventFlow'
import TrafficAnalytics from './components/TrafficAnalytics'
import GameEngagement from './components/GameEngagement'
import PerformanceAnalytics from './components/PerformanceAnalytics'
import PopularGamesAnalytics from './components/PopularGamesAnalytics'
import ConversionFunnelAnalytics from './components/ConversionFunnelAnalytics'
import './App.css'

function App() {
  // Get theme from context
  const { isDarkMode } = useTheme()
  
  // Set initial sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return window.innerWidth > 768
  })
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        
        <div className={`main-content ${sidebarOpen ? 'main-content-shifted' : ''}`}>
          <Header
            onSidebarToggle={toggleSidebar}
            sidebarOpen={sidebarOpen}
          />
          
          <main className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/players" element={<Players />} />
              <Route path="/games" element={<Games />} />
              <Route path="/events" element={<Events />} />
              
              {/* Analytics Routes */}
              <Route path="/analytics" element={<Analytics />}>
                <Route index element={<Navigate to="/analytics/game-performance" replace />} />
                <Route path="game-performance" element={<GamePerformance />} />
                <Route path="event-flow" element={<EventFlow />} />
                <Route path="daily-active-users" element={<DailyActiveUsers />} />
                <Route path="game-plays" element={<GamePlays />} />
                <Route path="completions" element={<GameCompletions />} />
                <Route path="session-time" element={<SessionTime />} />
                <Route path="accuracy" element={<AnswerAccuracy />} />
                <Route path="events" element={<EventsByType />} />
                <Route path="traffic" element={<TrafficAnalytics />} />
                <Route path="game-engagement" element={<GameEngagement />} />
                <Route path="performance" element={<PerformanceAnalytics />} />
                <Route path="popular-games" element={<PopularGamesAnalytics />} />
                <Route path="conversion-funnel" element={<ConversionFunnelAnalytics />} />
              </Route>
              
              {/* Placeholder routes */}
              <Route path="/revenue" element={<div className="page-placeholder">Revenue page coming soon...</div>} />
              <Route path="/settings" element={<div className="page-placeholder">Settings page coming soon...</div>} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
