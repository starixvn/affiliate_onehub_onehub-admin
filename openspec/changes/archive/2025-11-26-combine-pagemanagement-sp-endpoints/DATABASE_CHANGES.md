# Database Changes Required for Page Management Consolidation

## Stored Procedure: OH_PageBuilder_ManageSel

This stored procedure needs to be modified to return TWO result sets instead of one.

### Current Behavior
Returns a single result set with paginated landing page records.

### Required Changes

**Add a second SELECT statement AFTER the existing main SELECT:**

```sql
-- After the existing SELECT that returns paging data, add:

SELECT COUNT(*) AS TotalPageBuilders
      ,SUM(CASE WHEN p.StatusId = 0 THEN 1 ELSE 0 END) AS DraftPageBuilders
      ,SUM(CASE WHEN p.StatusId = 1 THEN 1 ELSE 0 END) AS ActivePageBuilders
      ,SUM(CASE WHEN p.StatusId = 2 THEN 1 ELSE 0 END) AS InactivePageBuilders
FROM #Data p
```

### Important Notes

1. **Reuse #Data temp table**: The dashboard aggregates MUST be calculated from the existing `#Data` temporary table to ensure the dashboard reflects the same filtered dataset as the grid.

2. **Order matters**: The paging data SELECT must come FIRST, then the dashboard SELECT must come SECOND.

3. **Result set structure**:
   - First result set: Paginated landing page records (existing)
   - Second result set: Single row with 4 columns (TotalPageBuilders, DraftPageBuilders, ActivePageBuilders, InactivePageBuilders)

4. **Column names MUST match**: The second result set column names must exactly match the property names in the `PageManagementDashboard` C# class:
   - `TotalPageBuilders` (int)
   - `DraftPageBuilders` (int)
   - `ActivePageBuilders` (int)
   - `InactivePageBuilders` (int)

### Verification

After making changes, verify:
1. Stored procedure returns 2 result sets when executed
2. First result set contains paging data as before
3. Second result set contains exactly 1 row with 4 integer columns
4. `@NRows` output parameter still populates correctly with total count

### Rollback

If issues occur, remove the second SELECT statement to restore previous behavior.

## Stored Procedure: OH_PageBuilder_Dashboard_Sel

**This stored procedure is NO LONGER NEEDED and can be dropped** after the changes to `OH_PageBuilder_ManageSel` are deployed and verified.

Wait until the backend deployment is successful and the frontend has been updated before dropping this SP.
