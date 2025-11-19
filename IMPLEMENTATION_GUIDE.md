# Page Management & Page Builder Implementation Guide

## 📊 Implementation Status

**Commit:** `78abd1ded` - "feat(api): Add Page Management and Page Builder backend with shared components"

### ✅ Completed (100%)

#### Backend (.NET 9) - 51 Files
- ✅ **Domain Layer** (13 files)
  - 7 entities (PageManagementEntity, PageBuilderEntity, Language, TargetCountry, ModuleInfo, ModuleMedia, StatusInfo)
  - 4 repository interfaces
  - 2 param files (12+ parameter classes)

- ✅ **Application Layer** (11 files)
  - 6 queries with handlers
  - 5 commands with handlers
  - Full CQRS pattern with MediatR

- ✅ **Infrastructure Layer** (15 files)
  - 6 criterias for SELECT operations
  - 5 Fanex.Data commands for INSERT/UPDATE/DELETE
  - 4 repository implementations
  - Updated BaseRepository with FetchDataAsync
  - All registered in DI

- ✅ **WebApi Layer** (4 files + 2 modified)
  - 2 endpoint files (10 endpoints total)
  - 2 model files with request/response DTOs
  - Endpoints registered in WebApplicationSetup
  - SpNames.xml updated with 11 stored procedures

#### Frontend - 3 Shared Components
- ✅ date-range-picker.tsx (159 lines)
- ✅ date-range-filter.tsx (75 lines)
- ✅ iframe-hover-preview.tsx (271 lines)

**Build Status:** ✅ SUCCESS (0 errors)

---

### 📋 Remaining Work

#### Page Management Frontend (~25-30 files)
The complete Page Management feature from commits needs to be implemented.

**Reference Commits:**
- Base implementation: `30e17fd4db32d9f927b88666baee11f97d486482`
- Refactoring + filters: `67829cf55d300013ff1046993a8594893a8e2b73`
- Date range components: `f3d1abeebafe1bede68e5e4633ae300340c757b9`

**Files Needed:**
1. **API Layer** (2 files)
   - `client-app/src/features/landing-page-cms/page-management/api/client.ts`
   - `client-app/src/features/landing-page-cms/page-management/api/queries.ts`

2. **Types** (1 file)
   - `client-app/src/features/landing-page-cms/page-management/types/index.ts`

3. **Data Layer** (2 files)
   - `client-app/src/features/landing-page-cms/page-management/data/schema.ts`
   - `client-app/src/features/landing-page-cms/page-management/data/data.tsx`

4. **Utilities** (1 file)
   - `client-app/src/features/landing-page-cms/page-management/utils/filter-storage.ts`

5. **Components** (15-20 files)
   - Provider: `page-provider.tsx`
   - Filters: `page-filters.tsx`, `page-status-filters.tsx`
   - Buttons: `page-primary-buttons.tsx`, `page-export-excel.tsx`
   - Dialogs: `dialog/page-dialog.tsx`, `dialog/page-delete-dialog.tsx`, `dialog/page-multi-delete-dialog.tsx`
   - Table: `table/page-table.tsx`, `table/page-columns.tsx`, `table/page-bulk-actions.tsx`, `table/page-status-cell.tsx`, `table/data-table-row-actions.tsx`

6. **Main Entry** (1 file)
   - `client-app/src/features/landing-page-cms/page-management/index.tsx`

#### Page Builder Frontend (~5-10 files)
Update existing page-builder to integrate with new API endpoints.

#### Localization (4 files)
- `client-app/src/locales/en/page-management.json` (~125 keys)
- `client-app/src/locales/zh/page-management.json` (~119 keys)
- Update `client-app/src/lib/i18n.ts` to register namespaces

---

## 🚀 Step-by-Step Implementation Guide

### Phase 1: Extract Files from Commits

Use git to extract the exact file contents from the commits:

```bash
# Navigate to project root
cd D:\Projects\ONEHub\onehub-admin

# Extract Page Management files from commit 67829cf (the refactored version)
# Use this command pattern for each file:

# Example: Extract API client
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/features/landing-page-cms/page-management/api/client.ts > client-app/src/features/landing-page-cms/page-management/api/client.ts

# Example: Extract types
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/features/landing-page-cms/page-management/types/index.ts > client-app/src/features/landing-page-cms/page-management/types/index.ts
```

### Phase 2: Create Directory Structure

```bash
# Create all necessary directories
mkdir -p client-app/src/features/landing-page-cms/page-management/api
mkdir -p client-app/src/features/landing-page-cms/page-management/components/dialog
mkdir -p client-app/src/features/landing-page-cms/page-management/components/table
mkdir -p client-app/src/features/landing-page-cms/page-management/data
mkdir -p client-app/src/features/landing-page-cms/page-management/types
mkdir -p client-app/src/features/landing-page-cms/page-management/utils
```

### Phase 3: Extract All Files Using Git

Here's a complete script to extract all files from commit `67829cf`:

```bash
#!/bin/bash
# save this as extract-page-management.sh

COMMIT="67829cf55d300013ff1046993a8594893a8e2b73"
BASE_PATH="client-app/src/features/landing-page-cms/page-management"

# API files
git show $COMMIT:$BASE_PATH/api/client.ts > $BASE_PATH/api/client.ts
git show $COMMIT:$BASE_PATH/api/queries.ts > $BASE_PATH/api/queries.ts

# Types
git show $COMMIT:$BASE_PATH/types/index.ts > $BASE_PATH/types/index.ts

# Data
git show $COMMIT:$BASE_PATH/data/schema.ts > $BASE_PATH/data/schema.ts
git show $COMMIT:$BASE_PATH/data/data.tsx > $BASE_PATH/data/data.tsx

# Utils
git show $COMMIT:$BASE_PATH/utils/filter-storage.ts > $BASE_PATH/utils/filter-storage.ts

# Components
git show $COMMIT:$BASE_PATH/components/page-provider.tsx > $BASE_PATH/components/page-provider.tsx
git show $COMMIT:$BASE_PATH/components/page-filters.tsx > $BASE_PATH/components/page-filters.tsx
git show $COMMIT:$BASE_PATH/components/page-status-filters.tsx > $BASE_PATH/components/page-status-filters.tsx
git show $COMMIT:$BASE_PATH/components/page-primary-buttons.tsx > $BASE_PATH/components/page-primary-buttons.tsx
git show $COMMIT:$BASE_PATH/components/page-export-excel.tsx > $BASE_PATH/components/page-export-excel.tsx

# Dialogs
git show $COMMIT:$BASE_PATH/components/dialog/page-dialog.tsx > $BASE_PATH/components/dialog/page-dialog.tsx
git show $COMMIT:$BASE_PATH/components/dialog/page-delete-dialog.tsx > $BASE_PATH/components/dialog/page-delete-dialog.tsx
git show $COMMIT:$BASE_PATH/components/dialog/page-multi-delete-dialog.tsx > $BASE_PATH/components/dialog/page-multi-delete-dialog.tsx

# Table
git show $COMMIT:$BASE_PATH/components/table/page-table.tsx > $BASE_PATH/components/table/page-table.tsx
git show $COMMIT:$BASE_PATH/components/table/page-columns.tsx > $BASE_PATH/components/table/page-columns.tsx
git show $COMMIT:$BASE_PATH/components/table/page-bulk-actions.tsx > $BASE_PATH/components/table/page-bulk-actions.tsx
git show $COMMIT:$BASE_PATH/components/table/page-status-cell.tsx > $BASE_PATH/components/table/page-status-cell.tsx
git show $COMMIT:$BASE_PATH/components/table/data-table-row-actions.tsx > $BASE_PATH/components/table/data-table-row-actions.tsx

# Main entry
git show $COMMIT:$BASE_PATH/index.tsx > $BASE_PATH/index.tsx

echo "✅ All Page Management files extracted!"
```

### Phase 4: Extract Localization Files

```bash
# Extract localization from commit 67829cf
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/locales/en/page-management.json > client-app/src/locales/en/page-management.json
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/locales/zh/page-management.json > client-app/src/locales/zh/page-management.json
```

### Phase 5: Update i18n Configuration

Add page-management namespace to `client-app/src/lib/i18n.ts`:

1. Import the page-management translations
2. Add 'page-management' to the ns array
3. Add the resources to the configuration

**Reference commit for i18n.ts changes:**
```bash
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/lib/i18n.ts
```

### Phase 6: Page Builder Updates (Optional)

Update the existing page-builder to work with new backend:

```bash
git show 67829cf55d300013ff1046993a8594893a8e2b73:client-app/src/features/landing-page-cms/page-builder/index.tsx > client-app/src/features/landing-page-cms/page-builder/index.tsx
```

---

## 🔍 File Reference Guide

### Complete List of Files from Commit 67829cf

**Page Management Frontend Files:**

```
client-app/src/features/landing-page-cms/page-management/
├── api/
│   ├── client.ts                               (API client methods)
│   └── queries.ts                              (TanStack Query hooks)
├── components/
│   ├── dialog/
│   │   ├── page-dialog.tsx                     (Dialog wrapper)
│   │   ├── page-delete-dialog.tsx              (Single delete)
│   │   └── page-multi-delete-dialog.tsx        (Batch delete)
│   ├── table/
│   │   ├── data-table-row-actions.tsx          (Row actions menu)
│   │   ├── page-bulk-actions.tsx               (Bulk operations)
│   │   ├── page-columns.tsx                    (Column definitions)
│   │   ├── page-status-cell.tsx                (Status badges)
│   │   └── page-table.tsx                      (Main data table)
│   ├── page-export-excel.tsx                   (Excel export)
│   ├── page-filters.tsx                        (Advanced filters)
│   ├── page-primary-buttons.tsx                (Action buttons)
│   ├── page-provider.tsx                       (React Context)
│   └── page-status-filters.tsx                 (Status filter chips)
├── data/
│   ├── data.tsx                                (Constants, mock data)
│   └── schema.ts                               (Zod schemas)
├── types/
│   └── index.ts                                (TypeScript types)
├── utils/
│   └── filter-storage.ts                       (LocalStorage utils)
└── index.tsx                                   (Main entry point)
```

**Localization:**
```
client-app/src/locales/
├── en/
│   └── page-management.json                    (125 keys)
└── zh/
    └── page-management.json                    (119 keys)
```

**i18n Update:**
```
client-app/src/lib/i18n.ts                      (Add page-management namespace)
```

---

## 🧪 Testing Checklist

### Backend API Testing

Before testing frontend, verify backend APIs work:

1. **Start the API:**
   ```bash
   cd D:\Projects\ONEHub\onehub-admin
   dotnet run --project src/ONEHub.WebApi/ONEHub.WebApi.csproj
   ```

2. **Test Swagger UI:**
   - Navigate to `https://localhost:7137/swagger`
   - Verify Page Management endpoints appear:
     - `GET /api/page-management/filters`
     - `GET /api/page-management/summary`
     - `GET /api/page-management`
     - `GET /api/page-management/export`
     - `PUT /api/page-management/status/batch`
     - `DELETE /api/page-management/batch`
   - Verify Page Builder endpoints appear:
     - `GET /api/page-builder/filters`
     - `GET /api/page-builder`
     - `POST /api/page-builder`
     - `PUT /api/page-builder/{pageId}`

3. **Test Authentication:**
   - Login and get JWT token
   - Use token to call `/api/page-management/filters`
   - Verify response structure

4. **Test Database:**
   - Ensure stored procedures exist in database:
     - `OH_PageBuilder_ManageSel`
     - `OH_PageBuilder_Dashboard_Sel`
     - `OH_PageBuilder_Status_Sel`
     - etc. (all 11 procedures)

### Frontend Testing

After implementing all frontend files:

1. **Build Check:**
   ```bash
   cd client-app
   npm run build
   ```
   - Should complete with 0 errors

2. **Dev Server:**
   ```bash
   npm run dev
   ```
   - Navigate to page management route
   - Verify page loads without errors

3. **Feature Testing:**
   - ✅ Filters work (search, status, country, language, date range)
   - ✅ Table displays data correctly
   - ✅ Pagination works
   - ✅ Sorting works
   - ✅ Bulk selection works
   - ✅ Bulk delete confirmation
   - ✅ Bulk status update (Activate/Deactivate)
   - ✅ Excel export downloads file
   - ✅ Iframe preview shows on hover
   - ✅ Filter persistence (saved to localStorage)
   - ✅ Dashboard summary shows correct counts

---

## 🐛 Common Issues & Solutions

### Issue 1: Build Errors - Missing Dependencies

**Error:** `Cannot find module '@tanstack/react-query'`

**Solution:**
```bash
cd client-app
npm install @tanstack/react-query
```

### Issue 2: API CORS Errors

**Error:** `Access to fetch at 'https://localhost:7137/api/page-management/filters' from origin 'http://localhost:5173' has been blocked by CORS`

**Solution:** Verify CORS is configured in `src/ONEHub.WebApi/Program.cs`

### Issue 3: 401 Unauthorized

**Error:** API returns 401 for all requests

**Solution:**
- Ensure you're logged in
- Check JWT token is being sent in headers
- Verify token hasn't expired

### Issue 4: Translation Keys Missing

**Error:** Console shows `i18next::translator: missingKey en page-management ...`

**Solution:**
- Verify `page-management.json` files are in correct location
- Ensure i18n.ts is updated to load the namespace
- Rebuild the frontend

### Issue 5: Stored Procedures Don't Exist

**Error:** `Could not find stored procedure 'OH_PageBuilder_ManageSel'`

**Solution:**
- Create the stored procedures in your database
- Ensure they match the expected input/output parameters
- Verify database connection string in appsettings.json

---

## 📝 API Endpoint Reference

### Page Management Endpoints

#### GET /api/page-management/filters
Returns filter options for the UI.

**Response:**
```json
{
  "errorCode": 0,
  "errorMessage": "",
  "data": {
    "landingPageUrl": "https://example.com",
    "today": "2025-01-19T00:00:00",
    "defaultFromDate": "2025-01-01T00:00:00",
    "defaultToDate": "2025-01-19T23:59:59",
    "targetCountries": [...],
    "languages": [...],
    "statusInfos": [...]
  }
}
```

#### GET /api/page-management/summary
Returns dashboard summary statistics.

**Query Parameters:**
- `search` (optional): Search text
- `statusIds` (optional): Comma-separated status IDs (e.g., "0,1")
- `countryCodes` (optional): Comma-separated country codes
- `languageCodes` (optional): Comma-separated language codes
- `fromDate` (required): Start date
- `toDate` (required): End date

**Response:**
```json
{
  "errorCode": 0,
  "errorMessage": "",
  "data": {
    "total": 150,
    "draft": 20,
    "active": 100,
    "inactive": 30
  }
}
```

#### GET /api/page-management
Returns paginated list of landing pages.

**Query Parameters:**
- `search` (optional): Search text
- `statusIds` (optional): Comma-separated status IDs
- `countryCodes` (optional): Comma-separated country codes
- `languageCodes` (optional): Comma-separated language codes
- `fromDate` (required): Start date
- `toDate` (required): End date
- `pageIndex` (required): Page number (1-based)
- `pageSize` (required): Items per page

**Response:**
```json
{
  "errorCode": 0,
  "errorMessage": "",
  "data": {
    "items": [...],
    "totalItem": 150,
    "pageIndex": 1,
    "pageSize": 20
  }
}
```

#### PUT /api/page-management/status/batch
Updates status for multiple landing pages.

**Request Body:**
```json
{
  "pageIds": "1,2,3",
  "statusId": 1
}
```

#### DELETE /api/page-management/batch
Deletes multiple landing pages.

**Request Body:**
```json
{
  "pageIds": "1,2,3"
}
```

---

## 🎯 Next Steps

1. **Extract Frontend Files** (~10 minutes)
   - Run the extraction script
   - Verify all files are created

2. **Update Localization** (~5 minutes)
   - Extract translation files
   - Update i18n.ts

3. **Test Build** (~5 minutes)
   - Run `npm run build`
   - Fix any TypeScript errors

4. **Test Backend APIs** (~15 minutes)
   - Create stored procedures in database
   - Test each endpoint in Swagger
   - Verify data is returned correctly

5. **Test Frontend** (~30 minutes)
   - Run dev server
   - Test all features
   - Verify filter persistence
   - Test bulk operations

6. **Final Commit** (~5 minutes)
   ```bash
   git add .
   git commit -m "feat(ui): Add Page Management and Page Builder frontend

   - Add complete Page Management feature with filters, table, and bulk operations
   - Add localization files (en/zh)
   - Update Page Builder to use new API
   - Add filter persistence with localStorage
   - Add iframe preview on hover

   🤖 Generated with Claude Code

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

---

## 📚 Additional Resources

**Commit References:**
- Base: `30e17fd4db32d9f927b88666baee11f97d486482`
- Refactored: `67829cf55d300013ff1046993a8594893a8e2b73`
- Date Range: `f3d1abeebafe1bede68e5e4633ae300340c757b9`

**Architecture Documentation:**
- CLAUDE.md - Project guidelines and patterns
- ARCHITECTURE_RULES.md - Clean Architecture details

**Key Technologies:**
- Backend: .NET 9, MediatR, Fanex.Data
- Frontend: React 19, TanStack Query, TanStack Router, ShadcnUI
- State: React Context + TanStack Query
- Validation: Zod schemas + MiniValidator

---

## ✅ Success Criteria

Your implementation is complete when:

- ✅ Backend builds with 0 errors
- ✅ Frontend builds with 0 errors
- ✅ All API endpoints return data correctly
- ✅ Page Management UI loads without errors
- ✅ Filters work and persist across page reloads
- ✅ Table pagination and sorting work
- ✅ Bulk operations (delete, status change) work
- ✅ Excel export downloads file
- ✅ Iframe preview shows on hover
- ✅ Both English and Chinese translations load correctly

---

**Total Estimated Time:** 1.5-2 hours for complete frontend implementation

**Difficulty:** Medium (mostly file extraction and verification)

Good luck! 🚀
