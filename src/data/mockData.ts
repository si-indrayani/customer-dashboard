// Mock data for game admin dashboard

export const dashboardStats = {
  totalPlayers: {
    value: '147,832',
    change: '+12.5% from last month',
    changeType: 'positive' as const
  },
  activeGames: {
    value: '23',
    change: '+2 new this week',
    changeType: 'positive' as const
  },
  totalRevenue: {
    value: '$892,456',
    change: '+18.2% from last month',
    changeType: 'positive' as const
  },
  avgSessionTime: {
    value: '24.5 min',
    change: '-2.3% from last week',
    changeType: 'negative' as const
  },
  dailyActiveUsers: {
    value: '45,231',
    change: '+8.7% from yesterday',
    changeType: 'positive' as const
  },
  conversionRate: {
    value: '3.24%',
    change: '+0.8% from last month',
    changeType: 'positive' as const
  }
};

export const playerGrowthData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'New Players',
      data: [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6800, 8100, 7500, 9200],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'rgba(59, 130, 246, 0.1)';
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
        return gradient;
      },
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Active Players',
      data: [12000, 15200, 14800, 18200, 17500, 21000, 19800, 24200, 22800, 26500, 25200, 29800],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'rgba(34, 197, 94, 0.1)';
        
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
        return gradient;
      },
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: 'rgb(34, 197, 94)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverBorderWidth: 3,
      tension: 0.4,
      fill: true,
    }
  ],
};

export const revenueData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Revenue ($)',
      data: [185000, 220000, 195000, 275000],
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const { ctx } = chart;
        const colors = [
          ['rgba(168, 85, 247, 0.9)', 'rgba(168, 85, 247, 0.6)'],
          ['rgba(59, 130, 246, 0.9)', 'rgba(59, 130, 246, 0.6)'],
          ['rgba(34, 197, 94, 0.9)', 'rgba(34, 197, 94, 0.6)'],
          ['rgba(249, 115, 22, 0.9)', 'rgba(249, 115, 22, 0.6)'],
        ];
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        const colorPair = colors[context.dataIndex] || colors[0];
        gradient.addColorStop(0, colorPair[0]);
        gradient.addColorStop(1, colorPair[1]);
        return gradient;
      },
      borderColor: [
        'rgb(168, 85, 247)',
        'rgb(59, 130, 246)',
        'rgb(34, 197, 94)',
        'rgb(249, 115, 22)',
      ],
      borderWidth: 3,
      borderRadius: 8,
      borderSkipped: false,
      hoverBackgroundColor: [
        'rgba(168, 85, 247, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(249, 115, 22, 1)',
      ],
      hoverBorderWidth: 4,
    },
  ],
};

export const topPlayersData = [
  {
    id: 1,
    name: 'ProGamer_2024',
    email: 'progamer@email.com',
    level: 95,
    score: 2847529,
    status: 'Active',
    joinDate: '2023-01-15',
    lastPlayed: '2024-09-28'
  },
  {
    id: 2,
    name: 'DragonSlayer',
    email: 'dragon@email.com', 
    level: 87,
    score: 2156789,
    status: 'Active',
    joinDate: '2023-03-22',
    lastPlayed: '2024-09-28'
  },
  {
    id: 3,
    name: 'CyberNinja',
    email: 'cyber@email.com',
    level: 92,
    score: 1987654,
    status: 'Inactive',
    joinDate: '2023-02-10',
    lastPlayed: '2024-09-25'
  },
  {
    id: 4,
    name: 'QuantumHero',
    email: 'quantum@email.com',
    level: 78,
    score: 1654321,
    status: 'Active',
    joinDate: '2023-05-18',
    lastPlayed: '2024-09-28'
  },
  {
    id: 5,
    name: 'StormBreaker',
    email: 'storm@email.com',
    level: 83,
    score: 1543210,
    status: 'Pending',
    joinDate: '2023-07-03',
    lastPlayed: '2024-09-27'
  }
];

// Games data based on actual API response structure
export const gamesData = [
  {
    id: 8,
    title: "Super Mario Bros - Updated",
    description: "Updated classic platformer game",
    gameType: "HOSTED_LINK",
    url: "https://example.com/super-mario",
    status: "DEPRECATED",
    createdAt: "2025-09-26T11:02:26.833Z"
  },
  {
    id: 7,
    title: "Dummy",
    description: "Dummy",
    gameType: "HOSTED_LINK",
    url: "https://dummy.com",
    status: "ACTIVE",
    createdAt: "2025-09-26T08:33:30.824Z"
  },
  {
    id: 6,
    title: "Retro Platformer",
    description: null,
    gameType: "HOSTED_LINK",
    url: "https://retro-platformer.netlify.app",
    status: "ACTIVE",
    createdAt: "2025-09-26T07:05:55.763Z"
  },
  {
    id: 5,
    title: "Space Adventure",
    description: "An epic space exploration game with stunning visuals and immersive gameplay.",
    gameType: "UPLOADED_BUILD",
    url: "https://cdn.example.com/games/space-adventure/index.html",
    status: "ACTIVE",
    createdAt: "2025-09-26T07:05:55.757Z"
  },
  {
    id: 4,
    title: "Puzzle Master",
    description: "A challenging puzzle game with multiple levels and brain-teasing mechanics.",
    gameType: "HOSTED_LINK",
    url: "https://puzzle-master-demo.vercel.app",
    status: "ACTIVE",
    createdAt: "2025-09-26T07:05:55.753Z"
  },
  {
    id: 3,
    title: "Racing Thunder",
    description: "High-speed racing game with realistic physics and stunning graphics.",
    gameType: "UPLOADED_BUILD",
    url: "https://cdn.example.com/games/racing-thunder/index.html",
    status: "ACTIVE",
    createdAt: "2025-09-25T15:30:42.123Z"
  },
  {
    id: 2,
    title: "Mystic Quest",
    description: "Fantasy RPG adventure with magical creatures and epic quests.",
    gameType: "HOSTED_LINK",
    url: "https://mystic-quest-game.herokuapp.com",
    status: "INACTIVE",
    createdAt: "2025-09-24T09:15:18.456Z"
  },
  {
    id: 1,
    title: "Asteroid Shooter",
    description: "Classic space shooter game with modern graphics and sound effects.",
    gameType: "UPLOADED_BUILD",
    url: "https://cdn.example.com/games/asteroid-shooter/index.html",
    status: "DEPRECATED",
    createdAt: "2025-09-23T12:45:33.789Z"
  }
];
