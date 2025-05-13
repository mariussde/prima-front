# Agents Management System Documentation

## Overview
The Agents Management System is a comprehensive solution for managing agent data within the Prima application. It provides a complete CRUD (Create, Read, Update, Delete) interface with advanced features like infinite scrolling, column management, and real-time filtering.

## Architecture

### 1. Type Definitions
Located in `types/agents.ts`, the system uses TypeScript interfaces to ensure type safety:

```typescript
export interface Agent {
  COMPID: string
  AGNTID: string
  AGNTDSC: string
  ADDRL1: string
  ADDRL2: string
  City: string
  ZIPCODE: string
  Phone: string
  Fax: string
  eMail: string
  WebSite: string
  FEDTXID: string
  STETXID: string
  CNTYCOD: string
  STAID: string
  CRTUSR: string
  CRTDAT: string
  CRTTIM: string
  CHGUSR: string
  CHGDAT: string
  CHGTIM: string
  RowNum: number
}
```

### 2. Components

#### 2.1 Agent Table Component (`components/general-settings/agents/agents-table.tsx`)
The table component provides a flexible and interactive interface for displaying agent data.

**Key Features:**
- Infinite scrolling with intersection observer
- Column visibility management
- Sorting and filtering capabilities
- Action buttons for edit/delete operations

**Column Configuration:**
```typescript
const columns: TableColumn<Agent>[] = [
  { accessorKey: 'COMPID', header: 'Company ID' },
  { accessorKey: 'AGNTID', header: 'ID' },
  { accessorKey: 'AGNTDSC', header: 'Description' },
  // ... additional columns
]
```

**Default Visible Columns:**
```typescript
export const defaultVisibleColumns = {
  'COMPID': false,
  'AGNTID': true,
  'AGNTDSC': true,
  // ... additional column visibility settings
}
```

#### 2.2 Agent Form Modal (`components/general-settings/agents/agents-form-modal.tsx`)
A modal component for creating and editing agents with form validation.

**Features:**
- Form validation using Zod
- Responsive grid layout
- Error handling
- Success notifications

**Form Schema:**
```typescript
const agentFormSchema = z.object({
  COMPID: z.string().min(1, "Company ID is required"),
  AGNTID: z.string().min(1, "Agent ID is required"),
  AGNTDSC: z.string().min(1, "Description is required"),
  // ... additional fields
})
```

### 3. API Routes (`app/api/general-settings/agents/route.ts`)

#### 3.1 GET Request
Retrieves agent data with support for:
- Pagination
- Filtering
- Sorting

```typescript
export async function GET(request: Request) {
  const params = {
    COMPID: searchParams.get('COMPID') || 'PLL',
    pageNumber: searchParams.get('pageNumber') || '1',
    pageSize: searchParams.get('pageSize') || '300',
    // ... additional parameters
  }
}
```

#### 3.2 POST Request
Creates new agents with:
- Authentication check
- Username tracking
- Error handling

#### 3.3 PUT Request
Updates existing agents with:
- Authentication check
- Username tracking
- Error handling

#### 3.4 DELETE Request
Removes agents with:
- Required parameter validation
- Error handling

### 4. Main Page (`app/general-settings/agents/page.tsx`)

#### 4.1 State Management
```typescript
const [agentData, setAgentData] = useState<Agent[]>([])
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)
const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(defaultVisibleColumns)
const [page, setPage] = useState<number>(1)
const [hasMore, setHasMore] = useState<boolean>(true)
```

#### 4.2 Data Fetching
Implements debounced data fetching with:
- Abort controller for request cancellation
- Error handling
- Loading states
- Pagination support

#### 4.3 Event Handlers
- `handleFilterChange`: Manages column filtering
- `handleSortChange`: Handles column sorting
- `handleLoadMore`: Implements infinite scrolling
- `handleAgentSubmit`: Manages form submissions
- `handleDelete`: Handles agent deletion

## Features

### 1. Data Management
- Infinite scrolling with pagination
- Real-time filtering
- Column sorting
- Column visibility toggles

### 2. User Interface
- Responsive design
- Loading states
- Error handling
- Toast notifications
- Modal forms

### 3. Form Handling
- Validation using Zod
- Error messages
- Success notifications
- Responsive layout

### 4. Security
- Authentication checks
- Username tracking
- Error handling
- CORS support

## Usage

### Viewing Agents
1. Navigate to `/general-settings/agents`
2. Use the column visibility toggle to customize the view
3. Use the filter inputs to search for specific agents
4. Click column headers to sort data

### Adding Agents
1. Click "Add Agent" button
2. Fill in required fields:
   - Company ID (defaults to "PLL")
   - Agent ID
   - Description
3. Fill in optional fields as needed
4. Click "Create Agent"

### Editing Agents
1. Click the edit icon on an agent row
2. Modify the required fields
3. Click "Update Agent"

### Deleting Agents
1. Click the delete icon on an agent row
2. Confirm the deletion

## Error Handling

### API Errors
- 401: Unauthorized access
- 400: Missing required parameters
- 500: Internal server error

### Form Validation
- Required field validation
- Format validation for email and URLs
- Custom error messages

## Performance Considerations

### 1. Data Loading
- Implements infinite scrolling
- Uses debouncing for filter changes
- Cancels pending requests on new requests

### 2. State Management
- Uses React hooks for state management
- Implements proper cleanup on unmount
- Uses refs for tracking initial load and abort controller

### 3. UI Optimization
- Responsive design with Tailwind CSS
- Conditional rendering for loading states
- Efficient form handling with React Hook Form

## Best Practices

### 1. Code Organization
- Separate components for different concerns
- Type definitions in dedicated files
- API routes following RESTful conventions

### 2. Error Handling
- Comprehensive error catching
- User-friendly error messages
- Proper error state management

### 3. Performance
- Debounced API calls
- Request cancellation
- Efficient state updates

### 4. Security
- Authentication checks
- Input validation
- Proper error handling

## Future Improvements

### Potential Enhancements
1. Batch operations for multiple agents
2. Advanced filtering options
3. Export functionality
4. Audit logging
5. Role-based access control

## Dependencies

### Core Dependencies
- Next.js
- React
- TypeScript
- Tailwind CSS
- Zod
- React Hook Form

### UI Components
- Shadcn UI
- Lucide Icons
- React Hot Toast

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server

### Code Style
- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Write comprehensive documentation

## Support

For issues and feature requests, please:
1. Check existing documentation
2. Review open issues
3. Create a new issue with detailed information 
