# 🧪 Subscription System Testing Script

## Prerequisites
- Have browser DevTools open
- Know your user ID (check in Supabase Auth or localStorage)
- Have access to Supabase dashboard
- Clear browser cache before starting

## 🔍 Part 1: Database Verification

### Step 1.1: Check Your Subscription Record
Run in Supabase SQL Editor:

```sql
-- Replace 'YOUR_USER_ID' with your actual user ID
-- This should return exactly ONE record with plan = 'elite' and status IN ('active', 'trial')

SELECT 
    id,
    user_id,
    plan,
    status,
    credits,
    created_at,
    updated_at
FROM subscriptions 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC;

-- Expected result:
-- plan: 'elite'
-- status: 'active' or 'trial'
-- Only ONE record (no duplicates)
```

### Step 1.2: Check User Credits
```sql
SELECT 
    id,
    user_id,
    amount,
    updated_at
FROM user_credits 
WHERE user_id = 'YOUR_USER_ID';

-- Expected result:
-- amount: 150 (for Elite plan)
```

### Step 1.3: Verify RLS Policies
```sql
-- Check that RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity 
FROM pg_tables 
WHERE tablename IN ('subscriptions', 'user_credits');

-- Both should show rowsecurity = true

-- Check policies exist
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual 
FROM pg_policies 
WHERE tablename IN ('subscriptions', 'user_credits');

-- Should see policies allowing users to read their own records
```

## 🌐 Part 2: Frontend Testing

### Step 2.1: Console Tests
Open browser console (F12) and run these tests:

```javascript
// Test 1: Check if SubscriptionContext exists
console.log('=== TEST 1: Context Availability ===');
// Try to access the subscription hook (the exact import path may vary)
// This should not throw an error if context is properly set up

// Test 2: Check localStorage for auth
console.log('=== TEST 2: Auth Token ===');
const authToken = localStorage.getItem('supabase.auth.token');
console.log('Auth token exists:', !!authToken);

// Test 3: Check for subscription data in localStorage (if cached)
console.log('=== TEST 3: Cached Data ===');
const keys = Object.keys(localStorage).filter(k => k.includes('subscription') || k.includes('credit') || k.includes('plan'));
console.log('Subscription-related keys:', keys);
keys.forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
});

// Test 4: Check session storage
console.log('=== TEST 4: Session Storage ===');
const sessionKeys = Object.keys(sessionStorage).filter(k => k.includes('subscription') || k.includes('credit') || k.includes('plan'));
console.log('Session keys:', sessionKeys);
```

### Step 2.2: Network Tab Tests

1. **Clear Network tab** (🚫 icon in DevTools Network tab)
2. **Refresh the page** (F5)
3. **Filter by** "subscription" or "credit"
4. **Check each request**:

```javascript
// For each subscription-related request, verify:
// 1. Request URL includes proper filters
// 2. Response contains correct data

// CORRECT Request Payload should include:
{
    "filters": {
        "status": {"in": ["active", "trial"]},  // ✅ CORRECT
        "user_id": {"eq": "your-user-id"}
    }
}

// INCORRECT patterns to flag:
{
    "filters": {
        "status": {"eq": "active"}  // ❌ WRONG - missing 'trial'
    }
}

// Response should contain:
{
    "data": {
        "plan": "elite",
        "status": "active", // or "trial"
        "user_credits": {
            "amount": 150
        }
    }
}
```

### Step 2.3: Component Testing Checklist

Navigate through your app and verify each component:

| Component/Page | Expected Display | Actual Display | Pass/Fail |
|---------------|------------------|----------------|-----------|
| Header | "150/150 credits" | | |
| Header | "Elite" badge/label | | |
| Dashboard | No "Upgrade" button | | |
| Settings | Plan shows "Elite" | | |
| Pricing Page | "Current Plan" on Elite | | |
| Feature Gates | All features unlocked | | |
| API Limits | 150 credit limit | | |
| Customization | Full access | | |
| Rewards | Full access | | |

## 🔄 Part 3: State Change Testing

### Test 3.1: Loading State Test
```javascript
// In browser console, slow down network:
// DevTools -> Network tab -> Throttling -> Slow 3G

// Then refresh page and observe:
// ✅ CORRECT: Shows skeleton/spinner while loading
// ❌ WRONG: Shows "Free plan" or "0 credits" while loading
```

### Test 3.2: Real-time Update Test
```sql
-- In Supabase, temporarily update your credits:
UPDATE user_credits 
SET amount = 149 
WHERE user_id = 'YOUR_USER_ID';

-- The UI should update within 2-3 seconds WITHOUT refreshing

-- Then restore:
UPDATE user_credits 
SET amount = 150 
WHERE user_id = 'YOUR_USER_ID';
```

### Test 3.3: Session Persistence Test
1. Note current state (Elite, 150 credits)
2. Open new tab with same URL
3. Verify same state appears
4. Close all tabs
5. Open fresh browser window
6. Navigate to app
7. Verify state persists

### Test 3.4: Auth Cycle Test
1. Sign out completely
2. Clear all site data: DevTools -> Application -> Clear Storage -> Clear site data
3. Sign back in
4. Verify Elite plan recognized immediately
5. Check no "flash" of free tier

## 🐛 Part 4: Edge Case Testing

### Test 4.1: Network Failure Simulation
```javascript
// In console, block Supabase temporarily:
// DevTools -> Network -> Block request URLs -> Add pattern: *supabase*

// Refresh page
// Expected: Error state or cached data, NOT "free tier"
// Remove block after testing
```

### Test 4.2: Multiple Tab Synchronization
1. Open app in Tab A - verify Elite status
2. Open app in Tab B - verify Elite status
3. In Supabase, update credits to 149
4. Both tabs should update within seconds

### Test 4.3: Race Condition Test
```javascript
// Rapid navigation test - run in console:
const testRaceCondition = async () => {
    const pages = ['/dashboard', '/settings', '/pricing', '/profile'];
    for (let i = 0; i < 20; i++) {
        const page = pages[i % pages.length];
        console.log(`Navigating to ${page}`);
        window.location.href = page;
        await new Promise(r => setTimeout(r, 100)); // 100ms delay
    }
};
// After each navigation, plan should remain "Elite"
```

## 📊 Part 5: Performance Testing

### Test 5.1: Query Count Verification
```javascript
// In Network tab, count subscription-related requests
// After page load, there should be:
// ✅ 1-2 subscription queries MAX
// ❌ NOT 5+ separate queries for plan, credits, features, etc.
```

### Test 5.2: Bundle Size Check
```javascript
// Check if multiple subscription hooks are bundled:
// DevTools -> Sources -> Find "useSubscription" 
// Should find only ONE implementation, not multiple
```

## ✅ Part 6: Final Verification Checklist

Run through this checklist after all fixes:

### Database Level
- [ ] Only one active subscription record exists
- [ ] Status includes both 'active' and 'trial' in queries
- [ ] RLS policies are correctly configured
- [ ] No duplicate subscription records

### Application Level
- [ ] Single SubscriptionContext provides all subscription data
- [ ] No components make direct Supabase queries for subscriptions
- [ ] Loading states show skeletons, never wrong tier
- [ ] No "flash of free tier" on page load

### User Experience
- [ ] Elite badge/label visible in header
- [ ] Credits show 150/150
- [ ] No upgrade prompts anywhere
- [ ] All Elite features accessible
- [ ] Real-time updates work
- [ ] Multi-tab synchronization works
- [ ] Sign out/in cycle maintains state

### Code Quality
- [ ] No `|| 'free'` or `|| 'basic'` defaults in code
- [ ] All queries use `.in('status', ['active', 'trial'])`
- [ ] Consistent error handling across components
- [ ] Single source of truth for subscription state

## 🚨 Red Flags - If You See These, The Fix Failed

1. **Multiple subscription queries in Network tab** - Should be consolidated
2. **"Flash of free tier" on refresh** - Loading state not handled
3. **Different credit values on different pages** - Multiple sources of truth
4. **Upgrade button appears then disappears** - Race condition
5. **Credits show as 0 temporarily** - Premature defaults
6. **Need to refresh to see correct plan** - Real-time updates broken
7. **Different tabs show different plans** - State not synchronized
8. **Console errors about missing context** - Provider not wrapping app

## 📝 Test Report Template

```markdown
## Subscription System Test Report
Date: [DATE]
Tester: [NAME]
Version: [POST-FIX VERSION]

### Summary
- Total Tests: 25
- Passed: [X]
- Failed: [X]
- Blocked: [X]

### Critical Issues Found
1. [Issue description]
   - Where: [Component/Page]
   - Expected: [What should happen]
   - Actual: [What happened]
   - Severity: [Critical/High/Medium/Low]

### Database Tests
- [✅/❌] Single subscription record
- [✅/❌] Correct status filter
- [✅/❌] RLS policies active
- [✅/❌] Credits value correct

### Frontend Tests
- [✅/❌] Context properly initialized
- [✅/❌] No duplicate queries
- [✅/❌] Loading states correct
- [✅/❌] Real-time updates work
- [✅/❌] Multi-tab sync works

### Performance
- Query count: [X] (should be 1-2)
- Load time: [X]ms
- Bundle size impact: [X]kb

### Recommendations
[Any remaining issues or improvements needed]
```

## 🎯 Success Criteria

The fix is COMPLETE when:
1. **Zero** false "free tier" displays
2. **One** subscription query per page load
3. **150/150** credits shown consistently
4. **Elite** status recognized everywhere
5. **No** upgrade prompts for Elite user
6. **Instant** real-time updates
7. **Clean** sign out/in cycles
8. **Consistent** multi-tab experience

Save this testing script and run through it AFTER Lovable implements the fixes. Any failures indicate incomplete implementation.
