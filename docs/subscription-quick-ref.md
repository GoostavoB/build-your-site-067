# 🚀 SUBSCRIPTION FIX - QUICK REFERENCE CARD

## 🔴 IMMEDIATE ACTIONS

### 1. COPY THIS TO LOVABLE NOW:
```markdown
CRITICAL FIX NEEDED: Elite plan (150 credits) not recognized, showing as free (0 credits).

ROOT CAUSE: Multiple subscription hooks with inconsistent queries.

FIX REQUIRED:
1. Consolidate ALL subscription logic into /src/contexts/SubscriptionContext.tsx
2. ALL queries MUST use: .in('status', ['active', 'trial']) 
3. NO components should query subscriptions directly
4. Handle isLoading states - never default to 'free'

Start by auditing ALL files with subscription logic. List them first before making changes.
```

### 2. VERIFICATION CHECKLIST
```bash
# Run these checks in browser console:

# Check 1: Auth token exists
localStorage.getItem('supabase.auth.token') ? '✅ Auth OK' : '❌ No auth'

# Check 2: Look for subscription keys
Object.keys(localStorage).filter(k => k.includes('subscription'))

# Check 3: Network tab - should see MAX 2 subscription queries
# Filter by: subscription
```

### 3. THE GOLDEN QUERY
```typescript
// This is the ONLY correct way to query subscriptions:
const { data } = await supabase
  .from('subscriptions')
  .select(`
    *,
    user_credits (amount, updated_at)
  `)
  .eq('user_id', user.id)
  .in('status', ['active', 'trial'])  // ← CRITICAL
  .single();
```

---

## ⚡ QUICK FIXES

### If Elite Not Recognized:
1. Clear all storage: `localStorage.clear(); sessionStorage.clear();`
2. Hard refresh: Ctrl+Shift+R
3. Sign out → Sign in

### If Credits Show 0:
1. Check Network tab for subscription query
2. Verify it includes `status IN ('active', 'trial')`
3. Check response contains `user_credits` with amount: 150

### If "Upgrade" Button Shows:
1. Component is checking plan before data loads
2. Add: `if (isLoading) return <Skeleton />;`
3. Remove any `|| 'free'` defaults

---

## 🎯 CORRECT PATTERNS

### ✅ ALWAYS DO:
```typescript
// 1. Import from single source
import { useSubscription } from '@/contexts/SubscriptionContext';

// 2. Check loading first
if (isLoading) return <Skeleton />;

// 3. Use computed properties
if (isElite) { /* elite features */ }
```

### ❌ NEVER DO:
```typescript
// 1. Direct queries
await supabase.from('subscriptions')...

// 2. Defensive defaults  
const plan = data?.plan || 'free';

// 3. New hooks
export const useCredits = () => ...
```

---

## 📊 STATE HIERARCHY

```
1. isLoading=true  → Show skeleton ⌛
2. error exists    → Show error ⚠️
3. !subscription   → Show free tier 🆓
4. subscription    → Show real tier ⭐
```

---

## 🔍 DEBUG COMMANDS

### Check Database:
```sql
-- Your subscription record
SELECT * FROM subscriptions 
WHERE user_id = 'YOUR_ID';

-- Your credits
SELECT * FROM user_credits 
WHERE user_id = 'YOUR_ID';
```

### Check Frontend:
```javascript
// Count subscription queries (should be 1-2)
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('subscription')).length

// Find all subscription hooks (should be 1)
console.log(window.React?.version);
```

---

## 🚨 RED FLAGS

If you see ANY of these, STOP:
- Multiple `useSubscription` implementations
- Components with `supabase.from('subscriptions')`
- Any `|| 'free'` or `|| 0` defaults
- `.eq('status', 'active')` without 'trial'
- More than 2 subscription queries per page

---

## 📝 LOVABLE PROMPT TEMPLATE

```markdown
[TASK DESCRIPTION]

CONTEXT: 
- Use SubscriptionContext from /src/contexts/SubscriptionContext.tsx
- Current user: Elite plan, 150 credits
- Never create new subscription hooks
- Query with .in('status', ['active', 'trial'])
- Handle isLoading before checking plan

Show implementation plan before coding.
```

---

## 🎯 SUCCESS INDICATORS

✅ Network: 1-2 subscription queries
✅ UI: Shows "Elite - 150/150 credits"  
✅ No upgrade prompts for Elite
✅ No flash of free tier
✅ Real-time updates work
✅ Multi-tab sync works

---

## 📞 EMERGENCY PROCEDURE

If completely broken:
1. Revert recent commits
2. Clear all browser storage
3. Check Supabase status
4. Verify RLS policies
5. Test in incognito mode
6. Check WebSocket connection

---

## 🔗 FULL DOCUMENTATION

- **Fix Instructions**: `/home/lovable_ai_fix_instructions.md`
- **Testing Script**: `/home/subscription_testing_script.md`
- **Future Dev**: `/home/future_development_checklist.md`
- **Prompt Guide**: `/home/lovable_prompt_engineering_guide.md`

---

**REMEMBER**: One source of truth. One context. One query pattern.

**DO NOT**: Fragment. Default to free. Create new hooks.

**ALWAYS**: Check loading. Include trial. Use context.
