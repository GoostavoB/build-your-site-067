# 🛡️ Future Development Checklist - Preventing Subscription System Issues

## 🎯 Purpose
This checklist ensures that new features involving subscriptions, credits, or premium features maintain system integrity and don't fragment the single source of truth.

---

## 📋 BEFORE Starting Any Subscription-Related Feature

### 1. Architecture Review Checklist
Before writing any code, verify:

- [ ] **Locate the SubscriptionContext** at `/src/contexts/SubscriptionContext.tsx`
- [ ] **Confirm it's the ONLY subscription source** - no other hooks exist
- [ ] **Review available properties**:
  - `subscription` - raw subscription object
  - `credits` - current credit amount  
  - `plan` - user's plan tier
  - `isElite`, `isPro`, `isBasic`, `isFree` - computed booleans
  - `isLoading` - loading state
  - `error` - error state
  - `refetch()` - manual refresh function
- [ ] **Check provider hierarchy** in App.tsx - SubscriptionProvider wraps your components
- [ ] **No new subscription hooks needed** - the context has everything

### 2. Requirements Analysis Questions
Before implementing, answer:

- [ ] Does this feature need subscription data? **Use SubscriptionContext**
- [ ] Does this feature modify subscription data? **Use Supabase triggers + refetch()**
- [ ] Does this feature need new subscription fields? **Extend existing context, don't create new one**
- [ ] Does this feature gate content by plan? **Use computed properties (isElite, isPro, etc.)**
- [ ] Does this feature consume credits? **Update via API, let real-time sync handle UI**

---

## 🚀 DURING Development

### 3. Implementation Checklist

#### When Reading Subscription Data:
```typescript
// ✅ CORRECT approach - ALWAYS follow this pattern:
import { useSubscription } from '@/contexts/SubscriptionContext';

function MyNewFeature() {
  const { plan, credits, isElite, isLoading } = useSubscription();
  
  // ALWAYS handle loading state first
  if (isLoading) {
    return <Skeleton />; // Or spinner, or placeholder
  }
  
  // Now safe to use subscription data
  if (isElite) {
    // Elite feature code
  }
}
```

#### ❌ NEVER Do These:
```typescript
// ❌ NEVER create new subscription hooks
const useMyFeatureSubscription = () => {
  const { data } = await supabase.from('subscriptions')...
}

// ❌ NEVER query subscription table directly
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')

// ❌ NEVER use defensive defaults
const plan = subscription?.plan || 'free'; // This hides bugs!

// ❌ NEVER check status without including trial
.eq('status', 'active') // Must be .in('status', ['active', 'trial'])
```

### 4. State Management Rules

#### For New Features That Need Plan Checking:
- [ ] Import `useSubscription` from existing context
- [ ] Use computed properties (isElite, isPro) not raw plan comparison
- [ ] Handle loading states explicitly
- [ ] Never default to 'free' during loading

#### For Features That Modify Credits:
- [ ] Call your API endpoint to modify credits
- [ ] Let real-time subscription handle UI updates
- [ ] Don't manually update UI credit display
- [ ] Call `refetch()` if real-time fails

#### For New Subscription Properties:
- [ ] Add to existing SubscriptionContext
- [ ] Update the TypeScript interface
- [ ] Add to the subscription query
- [ ] Create computed properties if needed
- [ ] DON'T create a new context

### 5. Component Development Patterns

#### Pattern A: Simple Plan Check
```typescript
function PremiumFeature() {
  const { isElite, isPro, isLoading } = useSubscription();
  
  if (isLoading) return <FeatureSkeleton />;
  
  if (!isElite && !isPro) {
    return <UpgradePrompt />;
  }
  
  return <FeatureContent />;
}
```

#### Pattern B: Credit Consumption
```typescript
function CreditConsumingAction() {
  const { credits, refetch } = useSubscription();
  
  const handleAction = async () => {
    if (credits < 10) {
      toast.error('Insufficient credits');
      return;
    }
    
    // Call API to consume credits
    const { error } = await consumeCredits(10);
    
    if (!error) {
      // Let real-time update the UI, or force refetch
      await refetch();
    }
  };
}
```

#### Pattern C: Conditional Rendering by Plan
```typescript
function TieredFeature() {
  const { plan, isLoading } = useSubscription();
  
  if (isLoading) return <LoadingState />;
  
  const features = {
    free: ['Basic Feature'],
    basic: ['Basic Feature', 'Extra Feature'],
    pro: ['Basic Feature', 'Extra Feature', 'Pro Feature'],
    elite: ['Basic Feature', 'Extra Feature', 'Pro Feature', 'Elite Feature']
  };
  
  return <FeatureList items={features[plan || 'free']} />;
}
```

---

## 🧪 AFTER Implementation

### 6. Testing Checklist

#### Unit Testing:
- [ ] Component renders loading state when `isLoading = true`
- [ ] Component shows correct content for each plan tier
- [ ] Component handles `null` plan appropriately
- [ ] No default values mask loading/error states

#### Integration Testing:
- [ ] Feature works with real SubscriptionContext
- [ ] No additional subscription queries in Network tab
- [ ] Real-time updates reflect in feature
- [ ] Multi-tab synchronization works

#### Edge Case Testing:
- [ ] Feature handles network failure gracefully
- [ ] Feature handles subscription expiration
- [ ] Feature handles plan downgrade
- [ ] Feature handles credit depletion

### 7. Code Review Checklist

Before merging, verify:
- [ ] **NO new subscription-related hooks created**
- [ ] **NO direct Supabase queries to subscription/credit tables**
- [ ] **ALL subscription data comes from SubscriptionContext**
- [ ] **ALL status queries include ['active', 'trial']**
- [ ] **NO defensive defaults like || 'free'**
- [ ] **Loading states handled explicitly**
- [ ] **Error states handled appropriately**

---

## 🔴 RED FLAGS - Immediate Review Required

If you see ANY of these, STOP and refactor:

1. **Multiple `useSubscription` implementations**
   - There should be exactly ONE

2. **Direct Supabase queries for subscription data**
   ```typescript
   // 🔴 RED FLAG
   const { data } = await supabase.from('subscriptions')...
   ```

3. **New hooks with "subscription" or "credit" in the name**
   ```typescript
   // 🔴 RED FLAG
   export const useUserCredits = () => {...}
   export const usePlanFeatures = () => {...}
   ```

4. **Defensive defaults hiding loading states**
   ```typescript
   // 🔴 RED FLAG
   const plan = data?.plan || 'free';
   const credits = data?.credits || 0;
   ```

5. **Status checks without trial**
   ```typescript
   // 🔴 RED FLAG
   .eq('status', 'active')
   // Should be: .in('status', ['active', 'trial'])
   ```

6. **Component-level subscription queries**
   ```typescript
   // 🔴 RED FLAG
   useEffect(() => {
     fetchSubscriptionData();
   }, []);
   ```

7. **Multiple sources of plan truth**
   ```typescript
   // 🔴 RED FLAG
   const planFromAuth = user?.plan;
   const planFromSubscription = subscription?.plan;
   const planFromProfile = profile?.subscription_tier;
   ```

---

## 📝 Documentation Template for New Features

When adding subscription-related features, document:

```markdown
## Feature: [Feature Name]

### Subscription Integration
- **Context Used**: SubscriptionContext
- **Properties Used**: [list: plan, credits, isElite, etc.]
- **Loading State**: [How loading is handled]
- **Error State**: [How errors are handled]

### Plan Requirements
- **Free**: [What free users see/can do]
- **Basic**: [What basic users see/can do]
- **Pro**: [What pro users see/can do]
- **Elite**: [What elite users see/can do]

### Credit Consumption
- **Credits Required**: [X credits]
- **Consumption Trigger**: [When credits are consumed]
- **Insufficient Credits**: [What happens]

### Testing Notes
- [Specific test cases for this feature]
- [Edge cases to verify]
```

---

## 🎨 Prompt Templates for Lovable AI

### When Requesting New Features:

```markdown
Add [FEATURE DESCRIPTION].

IMPORTANT: Use the existing SubscriptionContext from /src/contexts/SubscriptionContext.tsx
- Import: import { useSubscription } from '@/contexts/SubscriptionContext'
- Do NOT create new hooks for subscription data
- Do NOT query supabase subscriptions or user_credits tables directly
- Handle loading states with skeletons/spinners, not defaults
- The context provides: plan, credits, isElite, isPro, isBasic, isFree, isLoading

Current subscription architecture uses single source of truth pattern.
```

### When Fixing Issues:

```markdown
Fix [ISSUE DESCRIPTION].

CONTEXT: The app uses a centralized SubscriptionContext for all subscription data.
- Location: /src/contexts/SubscriptionContext.tsx
- All subscription checks must use this context
- Status queries must include: .in('status', ['active', 'trial'])
- Never default to 'free' plan during loading
- Check isLoading before making plan decisions

Do not create workarounds. Fix using the existing subscription system.
```

### When Debugging:

```markdown
Debug why [PROBLEM DESCRIPTION].

Check these potential issues IN ORDER:
1. Is SubscriptionContext being used? (not direct queries)
2. Are status filters including both 'active' and 'trial'?
3. Is loading state being handled? (not defaulting to free)
4. Is there more than one source of subscription truth?
5. Are there race conditions between auth and subscription loading?

Show me what you find at each step before proposing fixes.
```

---

## 🏗️ Architecture Principles to Maintain

### 1. Single Source of Truth
```
App
 └── AuthProvider
      └── SubscriptionProvider <-- ONLY source for subscription data
           └── All Components (consume via useSubscription)
```

### 2. Data Flow
```
Database Change
    ↓
Real-time Subscription
    ↓
SubscriptionContext Update
    ↓
All Components Re-render
```

### 3. Loading State Hierarchy
```
1. isLoading = true  → Show skeleton/spinner
2. isLoading = false → Check error
3. error exists      → Show error state
4. subscription null → Show free/unauthenticated state
5. subscription exists → Show appropriate tier content
```

### 4. Query Consistency
- **Every query**: `.in('status', ['active', 'trial'])`
- **Every component**: `import { useSubscription } from '@/contexts/SubscriptionContext'`
- **Every check**: Handle `isLoading` before checking plan

---

## 🚨 Emergency Procedures

### If Subscription System Breaks:

1. **Immediate Diagnosis**:
   ```javascript
   // Run in console
   console.log('=== SUBSCRIPTION DEBUG ===');
   console.log('LocalStorage:', localStorage);
   console.log('SessionStorage:', sessionStorage);
   // Check Network tab for subscription queries
   ```

2. **Quick Fix** (temporary):
   ```javascript
   // Force refetch in console
   window.location.reload(true); // Hard refresh
   ```

3. **Root Cause Analysis**:
   - Check recent commits for new subscription-related code
   - Verify no new hooks were created
   - Check if status filters were changed
   - Verify SubscriptionProvider still wraps app

4. **Recovery**:
   - Revert problematic commits
   - Clear all browser storage
   - Test with fresh browser profile
   - Verify database integrity

---

## ✅ Success Metrics

Your implementation is successful when:

1. **One Query** - Network tab shows 1 subscription query per page load
2. **Consistent State** - All components show same plan/credits
3. **No Flash** - No temporary free tier display
4. **Real-time Sync** - Changes reflect immediately
5. **Multi-tab Sync** - All tabs show same state
6. **Graceful Loading** - Skeletons, not wrong tier
7. **Error Resilience** - Network failures don't show free tier
8. **Clean Auth Cycles** - Sign out/in maintains correct state

---

## 📚 Additional Resources

- Subscription Context: `/src/contexts/SubscriptionContext.tsx`
- Test Script: `/home/subscription_testing_script.md`
- Fix Instructions: `/home/lovable_ai_fix_instructions.md`

**Remember**: Every subscription feature should make the system more unified, not more fragmented.
