import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from './contexts/ThemeContext'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Games from './pages/Games'
import RuleCreation from './pages/RuleCreation'
import AnalyticsOverview from './components/AnalyticsOverview'
import AnalyticsWrapper from './components/AnalyticsWrapper'
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
              <Route path="/games" element={<Games />} />
              <Route path="/games/create-rule" element={<RuleCreation />} />
              
              {/* Analytics Routes */}
              <Route path="/analytics" element={<AnalyticsOverview />} />
              <Route path="/analytics/traffic" element={<AnalyticsWrapper />}>
                <Route index element={<TrafficAnalytics />} />
              </Route>
              <Route path="/analytics/game-engagement" element={<AnalyticsWrapper />}>
                <Route index element={<GameEngagement />} />
              </Route>
              <Route path="/analytics/performance" element={<AnalyticsWrapper />}>
                <Route index element={<PerformanceAnalytics />} />
              </Route>
              <Route path="/analytics/popular-games" element={<AnalyticsWrapper />}>
                <Route index element={<PopularGamesAnalytics />} />
              </Route>
              <Route path="/analytics/conversion-funnel" element={<AnalyticsWrapper />}>
                <Route index element={<ConversionFunnelAnalytics />} />
              </Route>
              
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
