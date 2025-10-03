# Game Admin Dashboard

A responsive React admin dashboard application designed for game domain management. Built with React, TypeScript, and modern web technologies.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Player count, active games, revenue metrics, and user engagement data
- **Interactive Charts**: Player growth trends and revenue analytics using Chart.js
- **Top Players Table**: Sortable data table with player rankings and status

### 👥 Player Management
- **Player Directory**: Comprehensive list of all registered players
- **Player Statistics**: Level, score, join date, and activity status
- **Real-time Metrics**: Daily active users, new registrations, and retention rates

### 🎮 Game Management
- **Game Library**: Complete catalog of available games
- **Performance Metrics**: Player count, revenue, and ratings per game
- **Status Tracking**: Active/inactive game monitoring

### 🎨 Responsive Design
- **Mobile-First**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Accessibility**: Proper contrast ratios and keyboard navigation

## Tech Stack

- **Frontend**: React 18, TypeScript
- **Build Tool**: Vite
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Styling**: CSS Modules with modern CSS features
- **Navigation**: React Router DOM

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Top navigation bar
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── StatsCard.tsx   # Statistics display cards
│   ├── ChartCard.tsx   # Chart container component
│   └── DataTable.tsx   # Sortable data table
├── pages/              # Main application pages
│   ├── Dashboard.tsx   # Main dashboard overview
│   ├── Players.tsx     # Player management page
│   └── Games.tsx       # Game management page
├── data/               # Mock data and API utilities
│   └── mockData.ts     # Sample data for development
└── styles/             # Global styles and themes
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seigenowpoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   **Note**: If you encounter file watcher limit errors on Linux, increase the limit:
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Dashboard Metrics
- **Total Players**: 147,832 players (+12.5% growth)
- **Active Games**: 23 games (+2 new this week)
- **Revenue**: $892,456 (+18.2% monthly growth)
- **Session Time**: 24.5 minutes average
- **Daily Active Users**: 45,231 users
- **Conversion Rate**: 3.24%

### Responsive Breakpoints
- **Mobile**: < 768px (Single column layout)
- **Tablet**: 768px - 1024px (Adaptive grid)
- **Desktop**: > 1024px (Full multi-column layout)

## Development Notes

### Component Architecture
- **Modular Design**: Each component is self-contained with its own styles
- **TypeScript**: Fully typed for better development experience
- **Props Interface**: Clear prop definitions for component reusability

### State Management
- **Local State**: Using React hooks for component-level state
- **Context Ready**: Architecture supports easy integration of global state management

### Styling Approach
- **CSS Modules**: Component-scoped styles
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Design System**: Consistent color palette and typography

## Future Enhancements

- **Authentication**: User login and role-based access
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Analytics**: More detailed reporting and insights
- **Game Performance**: Individual game analytics dashboards
- **Player Profiles**: Detailed player information and history
- **Revenue Tracking**: Advanced financial reporting and forecasting

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
