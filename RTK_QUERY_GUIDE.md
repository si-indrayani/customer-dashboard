# RTK Query Games API Integration

This implementation uses Redux Toolkit Query (RTK Query) to handle API calls with automatic caching, background refetching, and optimistic updates.

## 🚀 Features

- **Automatic Caching**: Responses are cached and shared across components
- **Background Refetching**: Data is kept fresh automatically
- **Optimistic Updates**: UI updates immediately, rolls back on error
- **Request Deduplication**: Multiple identical requests are merged
- **Loading & Error States**: Built-in loading and error handling
- **TypeScript Support**: Fully typed API responses and parameters

## 📁 File Structure

```
src/
├── store/
│   ├── index.ts              # Redux store configuration
│   └── api/
│       └── gamesApi.ts       # RTK Query API slice
├── hooks/
│   └── useGames.ts           # Custom hooks for games API
└── components/
    ├── GameForm.tsx          # Form for creating/editing games
    └── GamesManagement.tsx   # Complete CRUD example
```

## 🔧 API Configuration

### Base API Setup (`src/store/api/gamesApi.ts`)

```typescript
export const gamesApi = createApi({
  reducerPath: 'gamesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Game'],
  endpoints: (builder) => ({
    // Endpoints defined here
  }),
});
```

### Available Endpoints

- `getGames()` - Fetch all games
- `getGame(id)` - Fetch single game by ID  
- `createGame(data)` - Create new game
- `updateGame({id, updates})` - Update existing game
- `deleteGame(id)` - Delete game
- `getGamesByStatus(status)` - Fetch games by status

## 🎣 Custom Hooks Usage

### Basic Data Fetching

```typescript
import { useGames } from '../hooks/useGames';

const MyComponent = () => {
  const { 
    games,           // Array of games
    isLoading,       // Loading state
    isError,         // Error state
    error,           // Error details
    refetch,         // Manual refetch function
    totalGames,      // Computed: total count
    activeGames,     // Computed: active games count
  } = useGames();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Total Games: {totalGames}</h2>
      {games.map(game => (
        <div key={game.id}>{game.title}</div>
      ))}
    </div>
  );
};
```

### Filtering by Status

```typescript
import { useGamesByStatus } from '../hooks/useGames';

const ActiveGames = () => {
  const { games, isLoading, count } = useGamesByStatus('ACTIVE');

  return (
    <div>
      <h2>Active Games ({count})</h2>
      {/* Render games */}
    </div>
  );
};
```

### CRUD Operations

```typescript
import { useGameMutations } from '../hooks/useGames';

const GameManager = () => {
  const {
    handleCreateGame,
    handleUpdateGame, 
    handleDeleteGame,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
  } = useGameMutations();

  const createNew = async () => {
    const result = await handleCreateGame({
      title: 'New Game',
      gameType: 'HOSTED_LINK',
      url: 'https://example.com',
      status: 'ACTIVE',
    });
    
    if (result.success) {
      console.log('Game created:', result.data);
    } else {
      console.error('Failed:', result.error);
    }
  };

  const updateGame = async (id: number) => {
    const result = await handleUpdateGame(id, {
      title: 'Updated Title',
      status: 'DEPRECATED',
    });
    
    if (result.success) {
      console.log('Game updated:', result.data);
    }
  };

  const deleteGame = async (id: number) => {
    const result = await handleDeleteGame(id);
    
    if (result.success) {
      console.log('Game deleted');
    }
  };

  return (
    <div>
      <button onClick={createNew} disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create Game'}
      </button>
      {/* More buttons */}
    </div>
  );
};
```

## 📊 Statistics Hook

```typescript
import { useGamesStats } from '../hooks/useGames';

const GamesDashboard = () => {
  const {
    totalGames,
    activeGames,
    hostedLinks,
    uploadedBuilds,
    recentGames,
    averageGamesPerMonth,
    isLoading,
  } = useGamesStats();

  return (
    <div className="stats-grid">
      <div>Total: {totalGames}</div>
      <div>Active: {activeGames}</div>
      <div>Recent: {recentGames}</div>
      <div>Avg/Month: {averageGamesPerMonth}</div>
    </div>
  );
};
```

## 🔄 Caching & Performance

### Cache Configuration

- **keepUnusedDataFor**: 60 seconds (configurable)
- **Automatic Invalidation**: Updates invalidate related cache entries
- **Tag-based Invalidation**: Surgical cache updates using tags

### Tag Strategy

```typescript
providesTags: (result) => [
  ...result.map(({ id }) => ({ type: 'Game', id })),
  { type: 'Game', id: 'LIST' },
],
invalidatesTags: [{ type: 'Game', id: 'LIST' }],
```

## 🎯 API Response Format

The API expects this response format:

```typescript
interface Game {
  id: number;
  title: string;
  description: string | null;
  gameType: 'HOSTED_LINK' | 'UPLOADED_BUILD';
  url: string;
  status: 'ACTIVE' | 'DEPRECATED' | 'INACTIVE';
  createdAt: string;
}
```

## 🚦 Error Handling

RTK Query provides automatic error handling:

```typescript
const { data, isLoading, isError, error } = useGetGamesQuery();

if (isError) {
  console.log('Error details:', error);
  // error contains: { status, data, error }
}
```

## 🔧 Usage Examples

### 1. Simple List Component
```typescript
const GamesList = () => {
  const { games, isLoading } = useGames();
  
  return (
    <ul>
      {games.map(game => (
        <li key={game.id}>{game.title} - {game.status}</li>
      ))}
    </ul>
  );
};
```

### 2. Create Game Form
```typescript
const CreateGameForm = () => {
  const { handleCreateGame, isCreating } = useGameMutations();
  
  const onSubmit = async (formData) => {
    const result = await handleCreateGame(formData);
    if (result.success) {
      // Handle success
    }
  };
  
  return <form onSubmit={onSubmit}>/* Form fields */</form>;
};
```

### 3. Real-time Updates
The cache automatically updates across all components when mutations complete, providing real-time UI updates without manual refetching.

## 📱 Integration with Existing Pages

The `Games.tsx` page has been updated to use RTK Query:

- Displays real API data instead of mock data
- Shows loading and error states
- Updates stats based on actual game data
- Provides type badges and formatted dates

## 🔧 Development Notes

1. **Store Setup**: Redux store is configured in `src/main.tsx`
2. **TypeScript**: All types are properly defined and exported
3. **Error Boundaries**: Consider adding error boundaries for better UX
4. **Offline Support**: RTK Query works well with offline-first strategies
5. **DevTools**: Redux DevTools show all API state and actions

This implementation provides a robust, scalable foundation for managing game data with excellent developer experience and performance characteristics.
