# Game Library Management - Show/Hide Games Feature

## Overview

The Game Library Management feature allows tenants to control the visibility of games in their environment. Each tenant can show or hide specific games without affecting other tenants or the global game configuration.

## API Endpoints

### 1. Update Client Game Status
**Endpoint:** `PUT /api/client-games/:id`

Update the active status of a client-specific game configuration to show or hide a game for a tenant.

**URL Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| id        | number | The ID of the client game config to update |

**Body Parameters:**
| Parameter | Type    | Description |
|-----------|---------|-------------|
| isActive  | boolean | true to show, false to hide the game |

**Example Request:**
```bash
curl -X PUT \
  'https://undallying-leisha-outbound.ngrok-free.dev/api/client-games/7' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "isActive": false
  }'
```

**Example Response:**
```json
{
  "id": 7,
  "gameId": 5,
  "tenantId": "tenant_1", 
  "isActive": false,
  "game": {
    "id": 5,
    "title": "Space Explorer",
    "description": "Explore the galaxy in this space adventure",
    "gameType": "HOSTED_LINK",
    "url": "https://example.com/space-explorer",
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-16T14:30:00Z"
}
```

### 2. Get Client Games
**Endpoint:** `GET /api/client-games?tenantId={tenantId}`

Get all client-specific game configurations for a tenant.

**Query Parameters:**
| Parameter | Type   | Description |
|-----------|--------|-------------|
| tenantId  | string | The ID of the tenant |

**Example Request:**
```bash
curl -X GET \
  'https://undallying-leisha-outbound.ngrok-free.dev/api/client-games?tenantId=tenant_1' \
  -H 'accept: application/json' \
  -H 'ngrok-skip-browser-warning: true'
```

## Frontend Implementation

### Components

#### 1. Games Page (`/src/pages/Games.tsx`)
- **Enhanced Table**: Uses the new reusable Table component with pagination
- **Visibility Controls**: Interactive toggle buttons to show/hide games
- **Statistics**: Updated stats showing visible/configured games
- **Real-time Updates**: Optimistic UI updates with error handling

#### 2. API Integration (`/src/store/api/gamesApi.ts`)
- **New Endpoints**: Added client games queries and mutations
- **TypeScript Types**: Full type safety with ClientGame interface
- **Cache Management**: Proper cache invalidation for real-time updates

### Features

#### Visibility Toggle Buttons
- **Visual States**: 
  - 🟢 **Visible** - Game is shown to tenant (green with Eye icon)
  - ⚫ **Hidden** - Game is hidden from tenant (gray with EyeOff icon)
  - 🔄 **Loading** - Update in progress (spinning icon)
  - ❌ **Not Configured** - Game not set up for tenant

#### Statistics Dashboard
- **Total Games**: All games in the system
- **Visible Games**: Games currently shown to the tenant
- **Configured Games**: Games with tenant-specific configurations
- **Active Rate**: Percentage of globally active games

### User Interface

#### Table Columns
1. **Game Title** - Name of the game
2. **Type** - HOSTED_LINK or UPLOADED_BUILD
3. **Global Status** - ACTIVE, DEPRECATED, or INACTIVE
4. **Visibility** - Interactive toggle button for show/hide
5. **URL** - Game access link
6. **Created Date** - When the game was added
7. **Description** - Game description

#### Interactive Elements
- **Sortable Columns**: Click headers to sort data
- **Pagination**: Navigate through large datasets
- **Search/Filter**: Find specific games quickly
- **Responsive Design**: Works on desktop and mobile

### Technical Details

#### State Management
- **RTK Query**: Efficient data fetching and caching
- **Optimistic Updates**: UI updates immediately while API call processes
- **Error Handling**: Graceful error recovery with user feedback

#### Styling
- **Dark Mode Support**: Full theme integration
- **Gaming Aesthetic**: Custom styles matching the gaming theme
- **Responsive Layout**: Mobile-first responsive design
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage Workflow

### For Administrators
1. **View Game Library**: Navigate to Games section
2. **Check Visibility**: See which games are visible/hidden for the current tenant
3. **Toggle Visibility**: Click toggle buttons to show/hide games
4. **Monitor Stats**: Track visibility metrics in the statistics cards

### For Developers
1. **API Integration**: Use the provided endpoints for backend integration
2. **Frontend Customization**: Modify components for specific requirements
3. **Testing**: Use the Postman collection for API testing

## File Structure

```
src/
├── pages/
│   ├── Games.tsx              # Main games management page
│   └── Games.css              # Styling for games page
├── components/
│   ├── Table.tsx              # Reusable table component
│   ├── Table.css              # Table styling
│   ├── Pagination.tsx         # Pagination controls
│   └── Pagination.css         # Pagination styling
├── store/api/
│   └── gamesApi.ts            # API endpoints and types
└── hooks/
    └── useGames.ts            # Custom hooks for games data

postman-requests/
└── client-game-management.json # Postman collection for API testing
```

## Benefits

### For Tenants
- **Customized Experience**: Show only relevant games
- **Content Control**: Hide inappropriate or unused games
- **Easy Management**: Simple toggle interface

### For Administrators
- **Multi-tenant Support**: Manage games per tenant
- **Real-time Updates**: Immediate visibility changes
- **Comprehensive Monitoring**: Track usage and visibility metrics

### For Developers
- **Type Safety**: Full TypeScript support
- **Reusable Components**: Modular, maintainable code
- **API Documentation**: Clear integration guidelines

## Future Enhancements

1. **Bulk Operations**: Show/hide multiple games at once
2. **Game Categories**: Group games by category for easier management
3. **Scheduling**: Set time-based visibility rules
4. **Analytics**: Track game visibility impact on engagement
5. **Permissions**: Role-based access to visibility controls
