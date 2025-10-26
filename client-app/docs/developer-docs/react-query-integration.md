# React Query Specification

**Version**: 1.0
**Based on**: TanStack Query v5
**Last Updated**: 2025

## Table of Contents

1. [Core Philosophy](#core-philosophy)
2. [Project Structure](#project-structure)
3. [Query Patterns](#query-patterns)
4. [Query Key Architecture](#query-key-architecture)
5. [Custom Hooks](#custom-hooks)
6. [Data Selectors](#data-selectors)
7. [Parameterized Queries](#parameterized-queries)
8. [Pagination Pattern](#pagination-pattern)
9. [Conditional Queries](#conditional-queries)
10. [Prefetching Strategy](#prefetching-strategy)
11. [Infinite Queries](#infinite-queries)
12. [Mutation Patterns](#mutation-patterns)
13. [Cache Invalidation Strategies](#cache-invalidation-strategies)
14. [Global Error Handling](#global-error-handling)
15. [Optimistic Updates](#optimistic-updates)
16. [Suspense Integration](#suspense-integration)
17. [TypeScript Integration](#typescript-integration)
18. [Best Practices](#best-practices)

---

## Core Philosophy

### Design Principles

1. **Separation of Concerns** - Separate API client, query definitions, and hooks
2. **Reusability** - Use `queryOptions` factory pattern for reusable query configurations
3. **Type Safety** - Full TypeScript support with automatic type inference
4. **Predictability** - Standardized Query Key structure and naming conventions
5. **Maintainability** - Centralized Query Key management and error handling

### Architecture Layers

```
┌─────────────────────────────────────┐
│   Components (UI Layer)             │
│   - Use custom hooks                │
│   - Handle UI state and interactions│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Custom Hooks Layer                │
│   - useQuery + queryOptions         │
│   - useMutation                     │
│   - Business logic encapsulation    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Query Configuration Layer         │
│   - queryOptions factory functions  │
│   - Query Key factories             │
│   - Query configuration definitions │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   API Client Layer                  │
│   - HTTP requests                   │
│   - Data transformation             │
│   - Error handling                  │
└─────────────────────────────────────┘
```

---

## Project Structure

### Recommended File Organization

```
src/
├── api/
│   ├── client.ts              # API client and type definitions
│   ├── query.ts              # Query configurations (queryOptions)
│   └── hooks.ts              # Custom Query/Mutation hooks (optional)
├── components/
│   └── ...                   # React components
└── types/
    └── ...                   # Shared type definitions
```

### File Responsibilities

#### `api/client.ts`

```
// Define data types
export type Contact = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};

export type GetContactsResponse = {
  contacts: Contact[];
  totalPages: number;
  totalContacts: number;
};

// API client implementation
export const client = {
  async getContacts(page: number, count: number): Promise<GetContactsResponse> {
    const response = await fetch(`/api/contacts?page=${page}&count=${count}`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  async getContact(contactId: string): Promise<Contact> {
    const response = await fetch(`/api/contacts/${contactId}`);
    if (!response.ok) throw new Error('Failed to fetch contact');
    return response.json();
  },

  async deleteContact(contactId: string): Promise<void> {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete contact');
  },
};
```

#### `api/query.ts`

```
import { queryOptions, infiniteQueryOptions } from "@tanstack/react-query";
import { client } from "./client";

// Query Options definitions
export const getContactsQueryOptions = (page: number, count: number) =>
  queryOptions({
    queryKey: ["contacts", "list", { page }, { count }],
    queryFn: () => client.getContacts(page, count),
  });

export const getContactQueryOptions = (contactId: string | undefined) =>
  queryOptions({
    queryKey: ["contacts", "detail", { contactId }],
    queryFn: () => client.getContact(contactId!),
    enabled: !!contactId,
  });
```

#### `api/hooks.ts` (Optional)

```
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContactsQueryOptions } from "./query";
import { client } from "./client";

// Method 1: Direct useQuery wrapper
export const useContacts = (page: number, count: number) =>
  useQuery(getContactsQueryOptions(page, count));

// Method 2: Custom hook with additional logic
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => client.deleteContact(contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

---

## Query Patterns

### Using queryOptions Factory

`queryOptions` is the core pattern for creating reusable query configurations.

#### ✅ Advantages

1. **Type Safety** - Automatic return type inference
2. **Reusability** - Use same configuration in multiple places
3. **Testability** - Easy to unit test
4. **Composability** - Can be combined with other `useQuery` options

#### Basic Usage

```
// api/query.ts
import { queryOptions } from "@tanstack/react-query";
import { client } from "./client";

export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: () => client.getContacts(),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
});
```

#### Using in Components

```
// components/ContactsList.tsx
import { useQuery } from "@tanstack/react-query";
import { getContactsQueryOptions } from "../api/query";

export function ContactsList() {
  const { data, isLoading, error } = useQuery(getContactsQueryOptions);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.contacts.map(contact => (
        <li key={contact.id}>{contact.firstName} {contact.lastName}</li>
      ))}
    </ul>
  );
}
```

#### Composing with Additional Options

```
// Override or add options in specific components
const { data } = useQuery({
  ...getContactsQueryOptions,
  refetchInterval: 30000, // Refetch every 30 seconds
  select: (data) => data.contacts.slice(0, 10), // Take first 10 only
});
```

### Parameterized queryOptions

For queries that need parameters, define queryOptions as functions:

```
export const getContactQueryOptions = (contactId: string) =>
  queryOptions({
    queryKey: ["contacts", "detail", { contactId }],
    queryFn: () => client.getContact(contactId),
  });

// Usage
const { data } = useQuery(getContactQueryOptions("123"));
```

---

## Query Key Architecture

Query Keys are the core of React Query's caching system. A good Query Key structure is crucial for cache management.

### Query Key Structure Principles

#### Hierarchical Structure

```
// ✅ Recommended hierarchical structure
["resource", "operation", ...parameters]

// Examples
["contacts", "list"]                          // All contacts list
["contacts", "list", { page: 1 }]            // Paginated list
["contacts", "detail", { contactId: "123" }] // Single contact
["contacts", "search", { query: "john" }]    // Search results
```

#### Query Key Best Practices

1. **First Level: Resource Name** - Represents data entity (e.g., "contacts", "users", "posts")
2. **Second Level: Operation Type** - Represents query type (e.g., "list", "detail", "search")
3. **Third Level: Parameters** - Use objects to contain all parameters for partial matching

```
// ❌ Not recommended - flat structure
["contacts-list"]
["contact-123"]

// ❌ Not recommended - parameters directly in array
["contacts", "list", 1, 10]

// ✅ Recommended - hierarchical structure
["contacts", "list", { page: 1, count: 10 }]
["contacts", "detail", { contactId: "123" }]
```

### Query Key Factory Pattern

Centralize Query Key management to ensure consistency and ease refactoring.

#### Basic Query Key Factory

```
// api/queryKeys.ts
export const contactsKeys = {
  // All contact-related queries
  all: () => ["contacts"] as const,

  // Contact list related
  lists: () => [...contactsKeys.all(), "list"] as const,
  list: (page: number, count: number) =>
    [...contactsKeys.lists(), { page, count }] as const,

  // Single contact related
  details: () => [...contactsKeys.all(), "detail"] as const,
  detail: (contactId: string) =>
    [...contactsKeys.details(), { contactId }] as const,

  // Search related
  searches: () => [...contactsKeys.all(), "search"] as const,
  search: (query: string) =>
    [...contactsKeys.searches(), { query }] as const,
};
```

#### Using in queryOptions

```
// api/query.ts
import { queryOptions } from "@tanstack/react-query";
import { contactsKeys } from "./queryKeys";
import { client } from "./client";

export const getContactsQueryOptions = (page: number, count: number) =>
  queryOptions({
    queryKey: contactsKeys.list(page, count),
    queryFn: () => client.getContacts(page, count),
  });

export const getContactQueryOptions = (contactId: string) =>
  queryOptions({
    queryKey: contactsKeys.detail(contactId),
    queryFn: () => client.getContact(contactId),
  });
```

#### Advantages of Query Key Factories

```
// Invalidate all contact-related queries
queryClient.invalidateQueries({ queryKey: contactsKeys.all() });

// Invalidate all contact list queries (but not detail queries)
queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });

// Invalidate specific page
queryClient.invalidateQueries({ queryKey: contactsKeys.list(1, 20) });

// Invalidate specific contact
queryClient.invalidateQueries({ queryKey: contactsKeys.detail("123") });
```

### Advanced: Multi-level Resources

```
// Handle nested resource relationships
export const postsKeys = {
  all: () => ["posts"] as const,
  lists: () => [...postsKeys.all(), "list"] as const,
  list: (filters: string) => [...postsKeys.lists(), { filters }] as const,
  details: () => [...postsKeys.all(), "detail"] as const,
  detail: (id: string) => [...postsKeys.details(), { id }] as const,

  // Nested resource: post comments
  comments: (postId: string) =>
    [...postsKeys.detail(postId), "comments"] as const,
  comment: (postId: string, commentId: string) =>
    [...postsKeys.comments(postId), { commentId }] as const,
};
```

---

## Custom Hooks

There are two main approaches to creating custom query hooks.

### Method 1: Direct Wrapper (Recommended for Simple Cases)

```
// api/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getContactsQueryOptions } from "./query";

export const useContacts = () =>
  useQuery(getContactsQueryOptions);
```

**Advantages**:
- Concise
- Maintains queryOptions reusability
- Automatic type inference

**Usage**:
```
function ContactsList() {
  const { data, isLoading } = useContacts();
  // ...
}
```

### Method 2: Adding Business Logic (Recommended for Complex Cases)

```
// api/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { getContactsQueryOptions } from "./query";

export const useContacts = (options?: { sortBy?: string }) => {
  const query = useQuery({
    ...getContactsQueryOptions,
    select: (data) => {
      // Add client-side sorting logic
      if (options?.sortBy === 'firstName') {
        return {
          ...data,
          contacts: [...data.contacts].sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
          ),
        };
      }
      return data;
    },
  });

  return {
    ...query,
    // Add computed properties
    totalContacts: query.data?.contacts.length ?? 0,
    hasContacts: (query.data?.contacts.length ?? 0) > 0,
  };
};
```

### Method Comparison

| Feature | Method 1: Direct Wrapper | Method 2: Adding Logic |
|---------|-------------------------|------------------------|
| Simplicity | ⭐⭐⭐ | ⭐⭐ |
| Reusability | ⭐⭐⭐ | ⭐⭐ |
| Business Logic | ❌ | ✅ |
| Client-side Transform | ❌ | ✅ |
| Computed Properties | ❌ | ✅ |
| Use Case | Simple data fetching | Needs additional processing |

### Custom Hook Naming Conventions

```
// ✅ Recommended naming patterns
useContacts()         // Fetch list
useContact(id)        // Fetch single resource
useCreateContact()    // Mutation: create
useUpdateContact()    // Mutation: update
useDeleteContact()    // Mutation: delete

// ❌ Avoid
getContacts()         // Don't start with get (not a hook)
fetchContacts()       // Don't start with fetch
contactsQuery()       // Don't omit use prefix
```

---

## Data Selectors

Selectors allow you to derive data from query results without triggering additional network requests.

### Basic Selector

```
import { useQuery } from "@tanstack/react-query";
import { getContactsQueryOptions } from "../api/query";

export function ContactCount() {
  // Only subscribe to count, won't re-render when contacts array changes
  const { data: count } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts.length,
  });

  return <div>{count} contacts</div>;
}
```

### Advantages of Selectors

1. **Avoid Duplicate Requests** - Multiple components can use the same query but select different data
2. **Automatic Memoization** - React Query automatically memoizes selector results
3. **Precise Subscriptions** - Only re-render when selected data changes

### Multiple Components Sharing Same Query

```
// TopBar.tsx - only needs count
function TopBar() {
  const { data: count } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts.length,
  });
  return <div>{count} Contacts</div>;
}

// ContactsList.tsx - needs full contact data
function ContactsList() {
  const { data: contacts } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts,
  });
  return <ul>{contacts.map(c => <li key={c.id}>{c.firstName}</li>)}</ul>;
}

// FirstContact.tsx - only needs first contact
function FirstContact() {
  const { data: first } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts[0],
  });
  return <div>{first?.firstName}</div>;
}
```

**Note**: All three components share the same query (same queryKey), so only one network request is made, but each component only re-renders when its selected data changes.

### Selector Best Practices

#### ✅ Use Selectors for Data Transformation

```
// Filtering
const { data: activeContacts } = useQuery({
  ...getContactsQueryOptions,
  select: (data) => data.contacts.filter(c => c.isActive),
});

// Mapping
const { data: fullNames } = useQuery({
  ...getContactsQueryOptions,
  select: (data) => data.contacts.map(c => `${c.firstName} ${c.lastName}`),
});

// Aggregation
const { data: summary } = useQuery({
  ...getContactsQueryOptions,
  select: (data) => ({
    total: data.contacts.length,
    avgAge: data.contacts.reduce((sum, c) => sum + c.age, 0) / data.contacts.length,
  }),
});
```

#### ⚠️ Watch Out for Selector Stability

```
// ❌ Not recommended - creates new selector function every render
function BadExample() {
  const { data } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts.filter(c => c.isActive), // New function every time!
  });
}

// ✅ Recommended - extract selector outside or use useCallback
const selectActiveContacts = (data) => data.contacts.filter(c => c.isActive);

function GoodExample() {
  const { data } = useQuery({
    ...getContactsQueryOptions,
    select: selectActiveContacts, // Stable function reference
  });
}

// ✅ Or use useCallback (when selector needs dependencies)
function GoodExampleWithDeps({ minAge }) {
  const selectByAge = useCallback(
    (data) => data.contacts.filter(c => c.age >= minAge),
    [minAge]
  );

  const { data } = useQuery({
    ...getContactsQueryOptions,
    select: selectByAge,
  });
}
```

---

## Parameterized Queries

Parameterized queries are the core pattern for handling dynamic data.

### Basic Parameterization

```
// api/query.ts
export const getContactQueryOptions = (contactId: string | undefined) =>
  queryOptions({
    queryKey: ["contacts", "detail", { contactId }],
    queryFn: () => client.getContact(contactId!),
    enabled: !!contactId, // Only execute when contactId exists
  });

// Usage
function ContactDetail({ contactId }: { contactId?: string }) {
  const { data, isLoading } = useQuery(
    getContactQueryOptions(contactId)
  );

  if (!contactId) return <div>Please select a contact</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>{data.firstName} {data.lastName}</div>;
}
```

### Multi-parameter Queries

```
// api/query.ts
export const getContactsQueryOptions = (
  page: number,
  count: number,
  filters?: { status?: string; search?: string }
) =>
  queryOptions({
    queryKey: ["contacts", "list", { page, count, ...filters }],
    queryFn: () => client.getContacts(page, count, filters),
  });

// Usage
function FilteredContactsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>();

  const { data } = useQuery(
    getContactsQueryOptions(page, 20, { status, search })
  );

  // Automatically triggers new query when search or status changes
}
```

### Parameter Serialization Rules

Parameters in Query Keys must be serializable:

```
// ✅ Recommended - serializable parameters
{ page: 1, count: 20, status: "active" }
{ filters: { name: "john", age: 30 } }
{ dates: { from: "2024-01-01", to: "2024-12-31" } }

// ❌ Avoid - non-serializable parameters
{ callback: () => {} }           // Functions
{ element: <div /> }             // React elements
{ date: new Date() }             // Date objects (use ISO strings instead)
{ regex: /pattern/ }             // Regular expressions
```

### Dependent Queries

```
// First fetch user data, then fetch their contacts using user ID
function UserContacts({ userId }: { userId: string }) {
  // First query: get user
  const { data: user } = useQuery(getUserQueryOptions(userId));

  // Second query: only execute when user exists
  const { data: contacts } = useQuery(
    getContactsByUserQueryOptions(user?.id, {
      enabled: !!user?.id, // Depends on first query result
    })
  );

  return <div>{/* Render contacts */}</div>;
}
```

---

## Pagination Pattern

Standard patterns for handling paginated data.

### Page-based Pagination

```
// api/query.ts
export const getContactsQueryOptions = (page: number, count: number) =>
  queryOptions({
    queryKey: ["contacts", "list", { page, count }],
    queryFn: () => client.getContacts(page, count),
    // Keep previous page data until new data loads
    placeholderData: (previousData) => previousData,
  });

// Component usage
function PaginatedContacts() {
  const [page, setPage] = useState(1);
  const count = 20;

  const { data, isLoading, isPlaceholderData } = useQuery(
    getContactsQueryOptions(page, count)
  );

  return (
    <div>
      <ContactsList
        contacts={data?.contacts}
        isStale={isPlaceholderData} // Show old data is loading
      />

      <Pagination
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        disabled={isPlaceholderData} // Disable pagination buttons while loading
      />
    </div>
  );
}
```

### Prefetch Next Page

Improve user experience:

```
function PaginatedContactsWithPrefetch() {
  const [page, setPage] = useState(1);
  const count = 20;
  const queryClient = useQueryClient();

  const { data } = useQuery(getContactsQueryOptions(page, count));

  // Prefetch next page
  useEffect(() => {
    if (data && page < data.totalPages) {
      queryClient.prefetchQuery(
        getContactsQueryOptions(page + 1, count)
      );
    }
  }, [page, data, queryClient, count]);

  return (
    <div>
      <ContactsList contacts={data?.contacts} />
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### Pagination Best Practices

```
// ✅ Use placeholderData to keep UI stable
const { data, isPlaceholderData } = useQuery({
  ...getContactsQueryOptions(page, count),
  placeholderData: (previousData) => previousData,
});

// ✅ Include pagination parameters in Query Key
queryKey: ["contacts", "list", { page, count }]

// ✅ Disable interactions while loading
<button disabled={isPlaceholderData} onClick={() => setPage(p => p + 1)}>
  Next Page
</button>

// ❌ Don't show loading spinner during pagination
if (isLoading) return <Spinner />; // This causes entire list to disappear

// ✅ Use subtle loading indicator
{isPlaceholderData && <div className="loading-overlay">Loading...</div>}
```

---

## Conditional Queries

Use the `enabled` option to control query execution timing.

### Basic Conditional Query

```
export const getContactQueryOptions = (contactId: string | undefined) =>
  queryOptions({
    queryKey: ["contacts", "detail", { contactId }],
    queryFn: () => client.getContact(contactId!),
    enabled: !!contactId, // Only execute when contactId exists
  });

// Usage
function ContactModal({ contactId }: { contactId?: string }) {
  const { data, isLoading, isFetching } = useQuery(
    getContactQueryOptions(contactId)
  );

  // When contactId is undefined:
  // - isLoading: false
  // - isFetching: false
  // - data: undefined

  if (!contactId) return null;
  if (isLoading) return <div>Loading...</div>;

  return <div>{data.firstName}</div>;
}
```

### Depending on Multiple Conditions

```
function UserProfile({ userId, canViewProfile }: Props) {
  const { data: user } = useQuery({
    ...getUserQueryOptions(userId),
    // Must satisfy both: userId exists AND has permission
    enabled: !!userId && canViewProfile,
  });

  if (!canViewProfile) return <div>No permission</div>;
  if (!userId) return <div>No user selected</div>;

  return <div>{user?.name}</div>;
}
```

### Manual Query Trigger

```
function ManualFetchContact() {
  const [contactId, setContactId] = useState<string>();

  // Query will never execute automatically
  const { data, refetch, isFetching } = useQuery({
    ...getContactQueryOptions(contactId),
    enabled: false, // Disable automatic execution
  });

  const handleFetch = () => {
    if (contactId) {
      refetch(); // Manually trigger query
    }
  };

  return (
    <div>
      <input
        value={contactId}
        onChange={(e) => setContactId(e.target.value)}
      />
      <button onClick={handleFetch} disabled={isFetching}>
        Fetch Contact
      </button>
      {data && <ContactDetails contact={data} />}
    </div>
  );
}
```

### Common Conditional Query Patterns

```
// 1. Based on permissions
enabled: hasPermission && !!userId

// 2. Based on feature flags
enabled: featureFlags.enableNewAPI && !!data

// 3. Based on route or URL parameters
enabled: !!params.id

// 4. Based on form state
enabled: formValid && !!formData.email

// 5. Based on time conditions
enabled: isBusinessHours() && !!storeId

// 6. Based on other query results
enabled: !!userData?.subscriptionActive
```

---

## Prefetching Strategy

Prefetching is a key technique to improve user experience by loading data before the user needs it.

### Basic Prefetching

```
import { useQueryClient } from "@tanstack/react-query";
import { getContactQueryOptions } from "../api/query";

function ContactRow({ contact }: { contact: Contact }) {
  const queryClient = useQueryClient();

  // Prefetch detail data on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery(getContactQueryOptions(contact.id));
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link to={`/contacts/${contact.id}`}>
        {contact.firstName} {contact.lastName}
      </Link>
    </div>
  );
}
```

### Prefetching Strategies

#### 1. Hover Prefetch (Most Common)

```
function ContactList({ contacts }: { contacts: Contact[] }) {
  const queryClient = useQueryClient();

  const prefetchContact = (contactId: string) => {
    queryClient.prefetchQuery(getContactQueryOptions(contactId));
  };

  return (
    <ul>
      {contacts.map(contact => (
        <li
          key={contact.id}
          onMouseEnter={() => prefetchContact(contact.id)}
        >
          <Link to={`/contacts/${contact.id}`}>
            {contact.firstName}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

#### 2. Pagination Prefetch

```
function PaginatedList({ page, setPage }: Props) {
  const queryClient = useQueryClient();
  const { data } = useQuery(getContactsQueryOptions(page, 20));

  // Prefetch next and previous pages
  useEffect(() => {
    if (page > 1) {
      queryClient.prefetchQuery(getContactsQueryOptions(page - 1, 20));
    }
    if (data && page < data.totalPages) {
      queryClient.prefetchQuery(getContactsQueryOptions(page + 1, 20));
    }
  }, [page, data, queryClient]);

  return <ContactsList contacts={data?.contacts} />;
}
```

#### 3. Route Prefetch

```
// Prefetch data before navigation
function Navigation() {
  const queryClient = useQueryClient();

  const prefetchRoute = (route: string) => {
    switch (route) {
      case '/contacts':
        queryClient.prefetchQuery(getContactsQueryOptions(1, 20));
        break;
      case '/dashboard':
        queryClient.prefetchQuery(getDashboardQueryOptions());
        break;
    }
  };

  return (
    <nav>
      <Link
        to="/contacts"
        onMouseEnter={() => prefetchRoute('/contacts')}
      >
        Contacts
      </Link>
    </nav>
  );
}
```

#### 4. Initial Load Prefetch

```
// Prefetch critical data on app startup
function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Prefetch commonly used data
    queryClient.prefetchQuery(getCurrentUserQueryOptions());
    queryClient.prefetchQuery(getNotificationsQueryOptions());
  }, [queryClient]);

  return <Router />;
}
```

### Prefetch Configuration Options

```
// Basic prefetch
queryClient.prefetchQuery(getContactQueryOptions(contactId));

// Prefetch with staleTime (avoid duplicate prefetching)
queryClient.prefetchQuery({
  ...getContactQueryOptions(contactId),
  staleTime: 5 * 60 * 1000, // Won't prefetch again within 5 minutes
});
```

### Prefetch vs Set Query Data

```
// prefetchQuery - only fetches if cache doesn't have data
queryClient.prefetchQuery(getContactQueryOptions(contactId));

// setQueryData - directly set cache data (useful for list to detail optimization)
queryClient.setQueryData(
  ["contacts", "detail", { contactId }],
  cachedContactFromList
);

// ensureQueryData - ensure data exists, fetch if not
await queryClient.ensureQueryData(getContactQueryOptions(contactId));
```

### Prefetching Best Practices

```
// ✅ Use staleTime to avoid over-prefetching
queryClient.prefetchQuery({
  ...getContactQueryOptions(id),
  staleTime: 30000, // Don't prefetch again within 30 seconds
});

// ✅ Prefetch on hover (not click)
onMouseEnter={() => prefetch(id)}

// ✅ Prefetch next page for better pagination experience
useEffect(() => {
  if (hasNextPage) {
    prefetchQuery(getNextPage());
  }
}, [page]);

// ❌ Avoid prefetching all data
// Don't prefetch all item details on list page, only likely-to-be-clicked items

// ❌ Avoid prefetching during rapid actions
// E.g., don't prefetch every item during fast scrolling
```

---

## Infinite Queries

Infinite queries are used for "load more" and infinite scroll features.

### Basic Infinite Query

```
// api/client.ts
export type GetContactsResponse = {
  contacts: Contact[];
  nextCursor: string | undefined; // Cursor for next page
  hasMore: boolean;
};

export const client = {
  async getContacts(cursor?: string): Promise<GetContactsResponse> {
    const response = await fetch(
      `/api/contacts?cursor=${cursor ?? ''}`
    );
    return response.json();
  },
};

// api/query.ts
import { infiniteQueryOptions } from "@tanstack/react-query";

export const contactsInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ["contacts", "infinite"],
  queryFn: ({ pageParam }) => client.getContacts(pageParam),
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  getPreviousPageParam: (firstPage) => firstPage.prevCursor, // Optional
});
```

### Using Infinite Query

```
import { useInfiniteQuery } from "@tanstack/react-query";
import { contactsInfiniteQueryOptions } from "../api/query";

function InfiniteContactsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(contactsInfiniteQueryOptions);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

### Infinite Scroll Implementation

```
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

function InfiniteScrollContacts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(contactsInfiniteQueryOptions);

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      ))}

      {/* Trigger point */}
      <div ref={observerTarget} />

      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
```

### Flattening Infinite Query Data

```
function FlatInfiniteList() {
  const { data } = useInfiniteQuery(contactsInfiniteQueryOptions);

  // Flatten all pages into a single array
  const allContacts = data?.pages.flatMap(page => page.contacts) ?? [];

  return (
    <div>
      {allContacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
```

### Bi-directional Infinite Query

```
export const messagesInfiniteQueryOptions = infiniteQueryOptions({
  queryKey: ["messages", "infinite"],
  queryFn: ({ pageParam }) => client.getMessages(pageParam),
  initialPageParam: undefined as string | undefined,

  // Load down (older messages)
  getNextPageParam: (lastPage) => lastPage.nextCursor,

  // Load up (newer messages)
  getPreviousPageParam: (firstPage) => firstPage.prevCursor,
});

function ChatMessages() {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(messagesInfiniteQueryOptions);

  return (
    <div>
      {hasPreviousPage && (
        <button onClick={() => fetchPreviousPage()}>
          Load Newer Messages
        </button>
      )}

      {data?.pages.map(page => (
        page.messages.map(msg => <Message key={msg.id} {...msg} />)
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load Older Messages
        </button>
      )}
    </div>
  );
}
```

### Infinite Query Best Practices

```
// ✅ Use stable keys to avoid duplicate renders
{data?.pages.map((page, pageIndex) => (
  <div key={pageIndex}> {/* Use pageIndex not dynamic key */}
    {page.contacts.map(contact => (
      <div key={contact.id}>{contact.firstName}</div>
    ))}
  </div>
))}

// ✅ Provide loading state feedback
{isFetchingNextPage && <Spinner />}

// ✅ Disable load more at appropriate times
<button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetchingNextPage}
>
  Load More
</button>

// ❌ Avoid showing "load more" button during initial load
{!isLoading && hasNextPage && <button>Load More</button>}

// ✅ Use select to optimize large lists
const { data } = useInfiniteQuery({
  ...contactsInfiniteQueryOptions,
  select: (data) => ({
    pages: data.pages,
    pageParams: data.pageParams,
    // Add flattened data
    allContacts: data.pages.flatMap(p => p.contacts),
  }),
});
```

---

## Mutation Patterns

Mutations are used for create, update, and delete operations.

### Basic Mutation

```
// api/client.ts
export const client = {
  async createContact(contact: CreateContactInput): Promise<Contact> {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to create contact');
    return response.json();
  },

  async deleteContact(contactId: string): Promise<void> {
    const response = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete contact');
  },
};

// api/mutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "./client";

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: CreateContactInput) =>
      client.createContact(contact),

    onSuccess: () => {
      // Invalidate contacts list queries
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => client.deleteContact(contactId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

### Mutation Lifecycle

```
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: Contact) => client.updateContact(contact),

    // 1. Before mutation starts (for optimistic updates)
    onMutate: async (contact) => {
      console.log('Starting update:', contact);
      // Return context for use in other lifecycle hooks
      return { startTime: Date.now() };
    },

    // 2. Mutation succeeded
    onSuccess: (data, variables, context) => {
      console.log('Update succeeded, took:', Date.now() - context.startTime);
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },

    // 3. Mutation failed
    onError: (error, variables, context) => {
      console.error('Update failed:', error);
      // Show error notification
    },

    // 4. Mutation completed (success or failure)
    onSettled: (data, error, variables, context) => {
      console.log('Mutation completed');
      // Cleanup work
    },
  });
};
```

### Using Mutations

```
function CreateContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const createContact = useCreateContact();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createContact.mutate(formData, {
      onSuccess: () => {
        // Reset form after success
        setFormData({ firstName: '', lastName: '', email: '' });
        alert('Contact created');
      },
      onError: (error) => {
        alert(`Creation failed: ${error.message}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        placeholder="First Name"
      />
      {/* Other input fields */}

      <button
        type="submit"
        disabled={createContact.isPending}
      >
        {createContact.isPending ? 'Creating...' : 'Create Contact'}
      </button>

      {createContact.error && (
        <div className="error">{createContact.error.message}</div>
      )}
    </form>
  );
}
```

### Mutation State Management

```
function DeleteContactButton({ contactId }: { contactId: string }) {
  const deleteContact = useDeleteContact();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      deleteContact.mutate(contactId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleteContact.isPending}
    >
      {deleteContact.isPending && <Spinner />}
      {deleteContact.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

### Mutation Key (for Tracking Multiple Mutations)

```
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-contact"], // Set mutation key for tracking
    mutationFn: (contactId: string) => client.deleteContact(contactId),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

// Track all pending delete operations
import { useMutationState } from "@tanstack/react-query";

function PendingDeletions() {
  const deletions = useMutationState({
    filters: { mutationKey: ["delete-contact"], status: 'pending' },
  });

  return (
    <div>
      Deleting {deletions.length} contacts...
    </div>
  );
}
```

### Sequential Mutations

```
function BulkActions() {
  const updateContact = useUpdateContact();

  const handleBulkUpdate = async (contacts: Contact[]) => {
    // Execute multiple mutations sequentially
    for (const contact of contacts) {
      await updateContact.mutateAsync(contact);
    }

    alert('Bulk update completed');
  };

  return <button onClick={() => handleBulkUpdate(selectedContacts)}>
    Bulk Update
  </button>;
}
```

---

## Cache Invalidation Strategies

Cache invalidation is key to keeping data synchronized.

### 1. Manual Invalidation (Most Common)

```
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => client.deleteContact(contactId),

    onSuccess: () => {
      // Invalidate all contact-related queries
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

### 2. Precise Invalidation

```
// Only invalidate specific queries
queryClient.invalidateQueries({
  queryKey: ["contacts", "list", { page: 1 }]
});

// Use Query Key factories for invalidation
queryClient.invalidateQueries({
  queryKey: contactsKeys.lists() // Invalidate all list queries
});

queryClient.invalidateQueries({
  queryKey: contactsKeys.detail(contactId) // Only invalidate specific detail
});
```

### 3. Automatic Invalidation (via Meta)

Build automatic invalidation system to reduce boilerplate.

#### Setup TypeScript Types

```
// types/react-query.d.ts
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}
```

#### Configure MutationCache

```
// App.tsx or main.tsx
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    // Automatically invalidate queries on mutation success
    onSettled: (_data, _error, _variables, _context, mutation) => {
      if (mutation.meta?.invalidatesQuery) {
        queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidatesQuery,
        });
      }
    },

    // Optional: automatically show success notification
    onSuccess: (_data, _variables, _context, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },

    // Optional: automatically show error notification
    onError: (_error, _variables, _context, mutation) => {
      if (mutation.meta?.errorMessage) {
        toast.error(mutation.meta.errorMessage);
      }
    },
  }),
});
```

#### Use Meta for Auto-invalidation

```
// api/mutations.ts
export const useDeleteContact = () =>
  useMutation({
    mutationFn: (contactId: string) => client.deleteContact(contactId),
    meta: {
      invalidatesQuery: ["contacts"], // Auto-invalidate
      successMessage: "Contact deleted",
      errorMessage: "Failed to delete contact",
    },
  });

// No need to manually write onSuccess, onError, onSettled!
```

### 4. Conditional Invalidation

```
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: Contact) => client.updateContact(contact),

    onSuccess: (updatedContact) => {
      // Invalidate contact lists
      queryClient.invalidateQueries({ queryKey: ["contacts", "list"] });

      // Only invalidate specific contact's detail query
      queryClient.invalidateQueries({
        queryKey: ["contacts", "detail", { contactId: updatedContact.id }]
      });

      // If update affects search results, also invalidate search queries
      queryClient.invalidateQueries({ queryKey: ["contacts", "search"] });
    },
  });
};
```

### 5. Partial Invalidation

```
// Invalidate all contact queries except details
queryClient.invalidateQueries({
  queryKey: ["contacts", "list"],
  exact: false, // Match all queries starting with ["contacts", "list"]
});

// Only invalidate exact matches
queryClient.invalidateQueries({
  queryKey: ["contacts", "list", { page: 1 }],
  exact: true,
});
```

### 6. Direct Cache Update (Avoid Invalidation)

Sometimes directly updating cache is more efficient than invalidation:

```
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: Contact) => client.updateContact(contact),

    onSuccess: (updatedContact) => {
      // Directly update detail query cache
      queryClient.setQueryData(
        ["contacts", "detail", { contactId: updatedContact.id }],
        updatedContact
      );

      // Update list query cache
      queryClient.setQueriesData(
        { queryKey: ["contacts", "list"] },
        (oldData: GetContactsResponse | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            contacts: oldData.contacts.map(c =>
              c.id === updatedContact.id ? updatedContact : c
            ),
          };
        }
      );
    },
  });
};
```

### Invalidation Strategy Comparison

| Strategy | Advantages | Disadvantages | Use Cases |
|----------|------------|---------------|-----------|
| Manual Invalidation | Precise control | More boilerplate | Simple projects |
| Auto-invalidation (Meta) | Reduce boilerplate | Initial setup required | Medium-large projects |
| Direct Cache Update | Avoid refetch | Manual sync logic needed | Known data changes |
| Conditional Invalidation | High flexibility | Complex logic | Complex relationships |

---

## Global Error Handling

Unified error handling for queries and mutations.

### 1. Global Mutation Error Handling

```
// types/react-query.d.ts
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: {
      status: number;
      message: string;
    };
  }
}

// App.tsx
import { MutationCache, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      // Handle specific error statuses
      if (error?.status === 401) {
        // Unauthorized, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else if (error?.status === 403) {
        // Forbidden
        toast.error("You don't have permission for this action");
      } else if (error?.status >= 500) {
        // Server error
        toast.error("Server error, please try again later");
      }
    },
  }),
});
```

### 2. Global Query Error Handling

```
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error: any) => {
        console.error("Query error:", error);

        // Handle global query errors
        if (error?.status === 401) {
          // Redirect to login
        }
      },
      retry: (failureCount, error: any) => {
        // Custom retry logic
        if (error?.status === 404) return false; // Don't retry 404
        if (error?.status === 401) return false; // Don't retry 401
        return failureCount < 3; // Retry up to 3 times for other errors
      },
    },
  },
});
```

### 3. Error Boundary Integration

```
// components/ErrorBoundary.tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h1>An error occurred</h1>
              <pre>{error.message}</pre>
              <button onClick={resetErrorBoundary}>Retry</button>
            </div>
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
```

### 4. Custom Error Types

```
// types/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// api/client.ts
async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || "Request failed",
      errorData.code
    );
  }

  return response.json();
}
```

### 5. Component-level Error Handling

```
function ContactsList() {
  const { data, error, isError } = useQuery(getContactsQueryOptions);

  // Handle specific errors
  if (isError) {
    if (error.status === 404) {
      return <div>No contacts found</div>;
    }

    if (error.status === 403) {
      return <div>You don't have permission to view contacts</div>;
    }

    // Other errors
    return <div>Loading failed: {error.message}</div>;
  }

  return <ContactsTable contacts={data.contacts} />;
}
```

---

## Optimistic Updates

Optimistic updates immediately update the UI for instant feedback without waiting for server response.

### Strategy 1: UI-level Optimistic Updates

Use `useMutationState` to track pending mutations.

#### Implementation

```
// api/mutations.ts
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-contact"], // Set mutation key for tracking
    mutationFn: (contactId: string) => client.deleteContact(contactId),

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};

// Track contacts being deleted
export const useContactsBeingDeleted = () => {
  const mutations = useMutationState({
    filters: { mutationKey: ["delete-contact"], status: 'pending' },
  });

  // Extract contactIds from all pending delete operations
  const contactIds = mutations
    .filter(m => m.status === "pending")
    .map(m => m.variables as string);

  return { contactIds };
};
```

#### Component Usage

```
function ContactsList() {
  const { data } = useQuery(getContactsQueryOptions(page, count));
  const { contactIds: deletingIds } = useContactsBeingDeleted();
  const deleteContact = useDeleteContact();

  return (
    <div>
      {data?.contacts.map(contact => {
        const isDeleting = deletingIds.includes(contact.id);

        return (
          <div
            key={contact.id}
            className={isDeleting ? 'opacity-50' : ''}
          >
            <div>{contact.firstName} {contact.lastName}</div>
            <button
              onClick={() => deleteContact.mutate(contact.id)}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

### Strategy 2: Cache-level Optimistic Updates

Update cache immediately before mutation executes, rollback if it fails.

#### Implementation

```
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => client.deleteContact(contactId),

    // 1. Update cache before mutation starts
    onMutate: async (contactId) => {
      // Cancel any ongoing queries to prevent overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ["contacts", "list"] });

      // Save current cache data (for rollback)
      const previousData = queryClient.getQueriesData<GetContactsResponse>({
        queryKey: ["contacts", "list"],
      });

      // Optimistic update: remove contact from all list queries
      queryClient.setQueriesData<GetContactsResponse>(
        { queryKey: ["contacts", "list"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            contacts: oldData.contacts.filter(c => c.id !== contactId),
          };
        }
      );

      // Return context for error rollback
      return { previousData };
    },

    // 2. Success: show notification (cache already updated)
    onSuccess: () => {
      toast.success("Contact deleted");
    },

    // 3. Failure: rollback cache
    onError: (_error, _variables, context) => {
      // Restore previous data
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Delete failed, reverted");
    },

    // 4. Complete: refetch to ensure synchronization
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

### Strategy 3: Optimistic Create

Optimistic update when creating new resources:

```
export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: CreateContactInput) => client.createContact(contact),

    onMutate: async (newContact) => {
      await queryClient.cancelQueries({ queryKey: ["contacts", "list"] });

      const previousData = queryClient.getQueriesData<GetContactsResponse>({
        queryKey: ["contacts", "list"],
      });

      // Create temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticContact = {
        id: tempId,
        ...newContact,
      };

      // Optimistically add contact to list
      queryClient.setQueriesData<GetContactsResponse>(
        { queryKey: ["contacts", "list"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            contacts: [optimisticContact, ...oldData.contacts],
          };
        }
      );

      return { previousData, tempId };
    },

    onSuccess: (createdContact, _variables, context) => {
      // Replace temporary ID with real ID
      queryClient.setQueriesData<GetContactsResponse>(
        { queryKey: ["contacts", "list"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            contacts: oldData.contacts.map(c =>
              c.id === context?.tempId ? createdContact : c
            ),
          };
        }
      );
    },

    onError: (_error, _variables, context) => {
      // Rollback
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

### Strategy 4: Optimistic Update

```
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: Contact) => client.updateContact(contact),

    onMutate: async (updatedContact) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] });

      // Save all related query caches
      const previousList = queryClient.getQueriesData<GetContactsResponse>({
        queryKey: ["contacts", "list"],
      });
      const previousDetail = queryClient.getQueryData(
        ["contacts", "detail", { contactId: updatedContact.id }]
      );

      // Update list queries
      queryClient.setQueriesData<GetContactsResponse>(
        { queryKey: ["contacts", "list"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            contacts: oldData.contacts.map(c =>
              c.id === updatedContact.id ? updatedContact : c
            ),
          };
        }
      );

      // Update detail query
      queryClient.setQueryData(
        ["contacts", "detail", { contactId: updatedContact.id }],
        updatedContact
      );

      return { previousList, previousDetail };
    },

    onError: (_error, updatedContact, context) => {
      // Rollback list
      if (context?.previousList) {
        context.previousList.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // Rollback detail
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ["contacts", "detail", { contactId: updatedContact.id }],
          context.previousDetail
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });
};
```

### Optimistic Update Best Practices

```
// ✅ Always cancel ongoing queries
await queryClient.cancelQueries({ queryKey: ["contacts"] });

// ✅ Save old data for rollback
const previousData = queryClient.getQueriesData({ queryKey: ["contacts"] });

// ✅ Rollback in onError
onError: (_error, _variables, context) => {
  if (context?.previousData) {
    // Restore old data
  }
}

// ✅ Refetch in onSettled to ensure sync
onSettled: () => {
  queryClient.invalidateQueries({ queryKey: ["contacts"] });
}

// ❌ Don't forget to handle error cases
// ❌ Don't execute complex logic in optimistic updates
// ❌ Don't assume optimistic updates always succeed
```

---

## Suspense Integration

React Suspense allows declarative loading state handling.

### Basic Suspense Setup

```
// api/query.ts
export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: () => client.getContacts(),
  suspense: true, // Enable Suspense support (deprecated in v5, use useSuspenseQuery instead)
});

// Recommended in v5: use useSuspenseQuery
import { useSuspenseQuery } from "@tanstack/react-query";

function ContactsList() {
  // No need to handle isLoading state
  const { data } = useSuspenseQuery(getContactsQueryOptions);

  // data is guaranteed to exist (never undefined)
  return (
    <ul>
      {data.contacts.map(contact => (
        <li key={contact.id}>{contact.firstName}</li>
      ))}
    </ul>
  );
}
```

### Using Suspense Boundaries

```
import { Suspense } from "react";

function ContactsPage() {
  return (
    <div>
      <h1>Contacts</h1>

      <Suspense fallback={<div>Loading contacts...</div>}>
        <ContactsList />
      </Suspense>
    </div>
  );
}
```

### Nested Suspense

```
function ContactDetailPage({ contactId }: { contactId: string }) {
  return (
    <div>
      {/* Outer Suspense: contact basic data */}
      <Suspense fallback={<SkeletonHeader />}>
        <ContactHeader contactId={contactId} />

        {/* Inner Suspense: contact details */}
        <Suspense fallback={<SkeletonDetails />}>
          <ContactDetails contactId={contactId} />
        </Suspense>

        {/* Another inner Suspense: activity log */}
        <Suspense fallback={<SkeletonActivity />}>
          <ContactActivity contactId={contactId} />
        </Suspense>
      </Suspense>
    </div>
  );
}

// Components use useSuspenseQuery
function ContactHeader({ contactId }: { contactId: string }) {
  const { data } = useSuspenseQuery(getContactQueryOptions(contactId));
  return <h2>{data.firstName} {data.lastName}</h2>;
}

function ContactDetails({ contactId }: { contactId: string }) {
  const { data } = useSuspenseQuery(getContactDetailsQueryOptions(contactId));
  return <div>{/* Details */}</div>;
}
```

### Suspense Error Boundaries

```
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

function ContactsPageWithErrorHandling() {
  return (
    <ErrorBoundary
      fallback={<div>Error loading contacts</div>}
      onReset={() => {
        // Reset query state
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ContactsList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### Suspense vs Traditional Approach Comparison

#### Traditional Approach

```
function ContactsList() {
  const { data, isLoading, error } = useQuery(getContactsQueryOptions);

  if (isLoading) return <Spinner />;
  if (error) return <Error error={error} />;
  if (!data) return null;

  return <ul>{data.contacts.map(c => <li key={c.id}>{c.firstName}</li>)}</ul>;
}
```

#### Suspense Approach

```
function ContactsList() {
  const { data } = useSuspenseQuery(getContactsQueryOptions);

  // No need to handle loading and error (handled by Suspense and ErrorBoundary)
  // data is guaranteed to exist
  return <ul>{data.contacts.map(c => <li key={c.id}>{c.firstName}</li>)}</ul>;
}

// Wrap in parent component
<ErrorBoundary fallback={<Error />}>
  <Suspense fallback={<Spinner />}>
    <ContactsList />
  </Suspense>
</ErrorBoundary>
```

### Suspense Best Practices

```
// ✅ Use useSuspenseQuery instead of useQuery + suspense: true
const { data } = useSuspenseQuery(getContactsQueryOptions);

// ✅ Set Suspense boundaries at appropriate levels
<Suspense fallback={<PageSkeleton />}>
  <PageContent />
</Suspense>

// ✅ Combine with ErrorBoundary for error handling
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<Loading />}>
    <Content />
  </Suspense>
</ErrorBoundary>

// ❌ Don't handle isLoading in Suspense components
// Suspense handles it automatically

// ❌ Don't forget ErrorBoundary
// Suspense only handles loading state, not errors
```

---

## TypeScript Integration

Fully leverage TypeScript's type safety.

### 1. Query Options Type Inference

```
// api/query.ts
import { queryOptions } from "@tanstack/react-query";
import { Contact } from "./client";

// queryOptions automatically infers return type
export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: async (): Promise<{ contacts: Contact[] }> => {
    const response = await fetch('/api/contacts');
    return response.json();
  },
});

// Type automatically inferred when used
function ContactsList() {
  const { data } = useQuery(getContactsQueryOptions);
  // data type automatically inferred as: { contacts: Contact[] } | undefined

  return <div>{data?.contacts.length}</div>;
}
```

### 2. Custom Mutation Meta Types

```
// types/react-query.d.ts
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    // Custom Mutation Meta
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };

    // Custom default error type
    defaultError: {
      status: number;
      message: string;
      code?: string;
    };
  }
}
```

### 3. Generic Query Options

```
// Reusable paginated query factory
function createPaginatedQueryOptions<T>(
  key: string,
  fetchFn: (page: number, count: number) => Promise<{ items: T[]; total: number }>
) {
  return (page: number, count: number) =>
    queryOptions({
      queryKey: [key, "list", { page, count }],
      queryFn: () => fetchFn(page, count),
    });
}

// Usage
const getContactsQueryOptions = createPaginatedQueryOptions(
  "contacts",
  (page, count) => client.getContacts(page, count)
);
```

### 4. Strict Query Key Types

```
// types/queryKeys.ts
type ContactsListKey = ["contacts", "list", { page: number; count: number }];
type ContactDetailKey = ["contacts", "detail", { contactId: string }];
type ContactsSearchKey = ["contacts", "search", { query: string }];

export type ContactsQueryKey =
  | ContactsListKey
  | ContactDetailKey
  | ContactsSearchKey;

// Usage
const contactsKeys = {
  list: (page: number, count: number): ContactsListKey =>
    ["contacts", "list", { page, count }],

  detail: (contactId: string): ContactDetailKey =>
    ["contacts", "detail", { contactId }],

  search: (query: string): ContactsSearchKey =>
    ["contacts", "search", { query }],
};
```

### 5. Type-safe Mutations

```
// api/mutations.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

// Explicitly define mutation parameter and return types
export function useCreateContact(
  options?: UseMutationOptions<
    Contact,              // Return type
    Error,                // Error type
    CreateContactInput,   // Variables type
    unknown               // Context type
  >
) {
  return useMutation({
    mutationFn: (contact: CreateContactInput) => client.createContact(contact),
    ...options,
  });
}

// Enjoy full type safety when using
function CreateContactForm() {
  const createContact = useCreateContact({
    onSuccess: (data) => {
      // data type is Contact
      console.log(data.id);
    },
    onError: (error) => {
      // error type is Error
      console.error(error.message);
    },
  });

  // variables type is CreateContactInput
  createContact.mutate({ firstName: "John", lastName: "Doe" });
}
```

### 6. Selector Type Safety

```
function ContactCount() {
  const { data } = useQuery({
    ...getContactsQueryOptions,
    // select parameter type automatically inferred
    // return type also automatically inferred as number
    select: (data) => data.contacts.length,
  });

  // data type is number | undefined
  return <div>{data} contacts</div>;
}
```

### 7. Conditional Type Query Options

```
// Support optional parameters with type safety
export const getContactQueryOptions = (contactId: string | undefined) =>
  queryOptions({
    queryKey: ["contacts", "detail", { contactId }] as const,
    queryFn: () => client.getContact(contactId!),
    enabled: !!contactId,
  });

// Usage
function ContactDetail({ id }: { id?: string }) {
  const { data } = useQuery(getContactQueryOptions(id));

  // TypeScript knows that when id is undefined, data will also be undefined
  if (!id) return null;

  return <div>{data?.firstName}</div>;
}
```

---

## Best Practices

### Project Organization

#### ✅ Recommended

```
// Completely separate API layer
src/
├── api/
│   ├── contacts/
│   │   ├── client.ts          // API client
│   │   ├── query.ts           // Query configurations
│   │   ├── mutations.ts       // Mutation configurations
│   │   └── keys.ts            // Query Key factories
│   └── users/
│       ├── client.ts
│       ├── query.ts
│       └── mutations.ts
├── components/
│   └── contacts/
│       ├── ContactsList.tsx
│       └── ContactDetail.tsx
└── types/
    └── contacts.ts
```

#### ❌ Avoid

```
// Don't mix API logic in components
components/
└── ContactsList.tsx  // Contains fetch logic + UI logic
```

### Query Key Management

#### ✅ Recommended

```
// Use Query Key factories
export const contactsKeys = {
  all: () => ["contacts"] as const,
  lists: () => [...contactsKeys.all(), "list"] as const,
  list: (filters: string) => [...contactsKeys.lists(), { filters }] as const,
  details: () => [...contactsKeys.all(), "detail"] as const,
  detail: (id: string) => [...contactsKeys.details(), { id }] as const,
};

// Invalidation becomes simple and safe
queryClient.invalidateQueries({ queryKey: contactsKeys.all() });
```

#### ❌ Avoid

```
// Scattered hardcoded Query Keys
queryKey: ["contacts"]
queryKey: ["contacts", "list"]
queryKey: ["contact-detail", contactId]  // Inconsistent naming
```

### Error Handling

#### ✅ Recommended

```
// Global error handling + component-level fine-grained handling
const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global handling (e.g., 401 redirect)
      if (error?.status === 401) {
        redirectToLogin();
      }
    },
  }),
});

// Handle specific errors in components
function ContactsList() {
  const { data, error } = useQuery(getContactsQueryOptions);

  if (error?.status === 403) {
    return <NoPermission />;
  }

  return <List data={data} />;
}
```

#### ❌ Avoid

```
// Every component handles all errors
function ContactsList() {
  const { error } = useQuery(getContactsQueryOptions);

  if (error?.status === 401) {
    // Handle 401 in every component
    redirectToLogin();
  }
  // ...
}
```

### Cache Strategy

#### ✅ Recommended

```
// Set appropriate staleTime and gcTime based on data characteristics
export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: () => client.getContacts(),
  staleTime: 5 * 60 * 1000,  // Fresh for 5 minutes
  gcTime: 10 * 60 * 1000,     // Clear cache after 10 minutes
});

// Static data can have longer staleTime
export const getCountriesQueryOptions = queryOptions({
  queryKey: ["countries"],
  queryFn: () => client.getCountries(),
  staleTime: Infinity,  // Never expires
});
```

#### ❌ Avoid

```
// All queries use default settings (may cause excessive requests)
export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: () => client.getContacts(),
  // No staleTime set, refetches on every mount
});
```

### Mutation Patterns

#### ✅ Recommended

```
// Use auto-invalidation (via Meta)
export const useDeleteContact = () =>
  useMutation({
    mutationFn: (id: string) => client.deleteContact(id),
    meta: {
      invalidatesQuery: ["contacts"],
      successMessage: "Deleted successfully",
    },
  });

// Or optimistic updates (improve UX)
export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contact: Contact) => client.updateContact(contact),
    onMutate: async (contact) => {
      // Optimistic update logic
    },
    onError: (error, variables, context) => {
      // Rollback logic
    },
  });
};
```

#### ❌ Avoid

```
// Don't handle cache invalidation or optimistic updates
export const useDeleteContact = () =>
  useMutation({
    mutationFn: (id: string) => client.deleteContact(id),
    // No onSuccess, onMutate, etc., UI won't auto-update
  });
```

### Performance Optimization

#### ✅ Recommended

```
// Use select to avoid unnecessary re-renders
function ContactCount() {
  const { data } = useQuery({
    ...getContactsQueryOptions,
    select: (data) => data.contacts.length,
  });
  // Only re-renders when count changes
  return <div>{data} contacts</div>;
}

// Prefetch next page
useEffect(() => {
  if (hasNextPage) {
    queryClient.prefetchQuery(getContactsQueryOptions(page + 1, count));
  }
}, [page]);

// Use placeholderData to keep UI stable
const { data, isPlaceholderData } = useQuery({
  ...getContactsQueryOptions(page, count),
  placeholderData: (previousData) => previousData,
});
```

#### ❌ Avoid

```
// Entire component subscribes to full data (even if only need count)
function ContactCount() {
  const { data } = useQuery(getContactsQueryOptions);
  // Re-renders when any contact in array changes even though only displaying count
  return <div>{data?.contacts.length} contacts</div>;
}

// Don't use placeholderData during pagination (causes entire list to disappear)
const { data, isLoading } = useQuery(getContactsQueryOptions(page, count));
if (isLoading) return <Spinner />; // Shows spinner on every page change
```

### Test-friendly

#### ✅ Recommended

```
// Export queryOptions for easy testing
export const getContactsQueryOptions = queryOptions({
  queryKey: ["contacts", "list"],
  queryFn: () => client.getContacts(),
});

// Testing
import { QueryClient } from "@tanstack/react-query";
import { getContactsQueryOptions } from "./query";

test("fetches contacts", async () => {
  const queryClient = new QueryClient();
  const data = await queryClient.fetchQuery(getContactsQueryOptions);

  expect(data.contacts).toHaveLength(10);
});
```

#### ❌ Avoid

```
// Only export hook, difficult to test query logic separately
export const useContacts = () =>
  useQuery({
    queryKey: ["contacts"],
    queryFn: () => client.getContacts(),
  });

// Testing requires rendering full React component
```

---

## Summary

This specification covers all core patterns of React Query in real projects:

1. **Basic Architecture** - queryOptions factory, Query Key management, file organization
2. **Advanced Patterns** - Pagination, infinite queries, conditional queries, prefetching
3. **Mutations** - CRUD operations, cache invalidation, optimistic updates
4. **Error Handling** - Global and local error handling strategies
5. **Performance Optimization** - Selectors, prefetching, cache strategies
6. **Type Safety** - Complete TypeScript integration

### Quick Checklist

When building new features, ensure following this checklist:

- [ ] API client defined in `api/client.ts`
- [ ] Query configurations use `queryOptions` factory
- [ ] Query Keys use hierarchical structure and managed via factories
- [ ] Mutations handle cache invalidation or optimistic updates
- [ ] Appropriate `staleTime` and `gcTime` set
- [ ] Error handling covers global and local levels
- [ ] TypeScript types complete and auto-inferred
- [ ] Consider prefetching for improved UX
- [ ] Use Selectors to optimize unnecessary re-renders

### Reference Resources

- [TanStack Query Official Docs](https://tanstack.com/query/latest)
- [React Query Best Practices](https://tkdodo.eu/blog/practical-react-query)
- [TypeScript with React Query](https://tanstack.com/query/latest/docs/react/typescript)

---

**Version History**

- v1.0 (2025) - Initial version, based on TanStack Query v5
