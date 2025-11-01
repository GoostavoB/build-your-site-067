# 🚨 CRITICAL: Fix Subscription System - Elite Plan Not Recognized

## Problem Summary
The backend correctly identifies the user as Elite with 150 credits, but the frontend inconsistently shows "free/starter" mode with 0/20 credits. This is caused by fragmented state management and inconsistent database queries across multiple hooks and components.

## Root Cause Analysis
1. **Multiple sources of truth**: Different hooks independently query subscription data with different criteria
2. **Inconsistent status filters**: Some queries use `status = 'active'`, others use `status IN ('active', 'trial')`
3. **Premature default values**: Components default to 'free' plan before data loads
4. **Race conditions**: UI makes plan decisions before subscription data arrives

## 🎯 REQUIRED FIXES

### Step 1: Audit Existing Code
**FIRST, locate and document ALL subscription-related code:**

Search for these patterns across the entire codebase:
- Files containing: `useSubscription`, `useUserSubscription`, `usePlan`, `useCredits`, `useUserCredits`
- Components checking: `plan ===`, `credits >`, `isElite`, `isPro`, `isFree`
- Direct Supabase queries to: `subscriptions`, `user_credits` tables
- Contexts: `SubscriptionProvider`, `SubscriptionContext`, `UserProvider`

**List all files found and their current implementation approach.**

### Step 2: Create Unified Subscription System

**CREATE A SINGLE SOURCE OF TRUTH:**

```typescript
// src/contexts/SubscriptionContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: any | null;
  credits: number;
  plan: 'free' | 'basic' | 'pro' | 'elite' | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  // Computed properties
  isElite: boolean;
  isPro: boolean;
  isBasic: boolean;
  isFree: boolean;
  hasActiveSubscription: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    if (!user?.id) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // CRITICAL: Use correct status filter
      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user_credits (
            amount,
            updated_at
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['active', 'trial']) // MUST include both statuses
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      setSubscription(data);
    } catch (err) {
      console.error('Failed to fetch subscription:', err);
      setError(err as Error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subscription when user changes
  useEffect(() => {
    if (!authLoading && user) {
      fetchSubscription();
    } else if (!user) {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Computed values - NEVER use defaults during loading
  const value: SubscriptionContextType = {
    subscription,
    credits: subscription?.user_credits?.amount ?? 0,
    plan: isLoading ? null : (subscription?.plan ?? 'free'),
    isLoading,
    error,
    refetch: fetchSubscription,
    // Computed properties - safe because they check loading state
    isElite: !isLoading && subscription?.plan === 'elite',
    isPro: !isLoading && subscription?.plan === 'pro',
    isBasic: !isLoading && subscription?.plan === 'basic',
    isFree: !isLoading && !subscription,
    hasActiveSubscription: !isLoading && !!subscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
```

### Step 3: Update App Root

**ENSURE PROPER PROVIDER HIERARCHY:**

```typescript
// src/App.tsx or src/main.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        {/* Rest of your app */}
      </SubscriptionProvider>
    </AuthProvider>
  );
}
```

### Step 4: Replace ALL Direct Queries

**CRITICAL: Remove/replace every instance of direct subscription queries:**

❌ **REMOVE patterns like:**
```typescript
// In any component or hook
const { data } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .single();

// Or
const subscription = data || { plan: 'free', credits: 0 };
```

✅ **REPLACE with:**
```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';

function MyComponent() {
  const { subscription, credits, plan, isLoading, isElite } = useSubscription();

  // ALWAYS handle loading state
  if (isLoading) {
    return <Skeleton />; // Or spinner, or nothing - but NOT "Upgrade" button
  }

  // Now safe to check plan
  if (isElite) {
    // Elite features
  }
}
```

### Step 5: Fix All Components

**UPDATE every component that checks subscription status:**

```typescript
// ❌ OLD (problematic) patterns to find and fix:
const plan = user?.subscription_tier || 'free';
const credits = userData?.credits || 0;
const isElite = subscriptionData?.plan === 'elite' || false;

// ✅ NEW (correct) pattern:
const { plan, credits, isElite, isLoading } = useSubscription();

if (isLoading) {
  return <LoadingSpinner />;
}

// Now use the values directly
```

### Step 6: Update Database Queries

**VERIFY these RLS policies exist in Supabase:**

```sql
-- Ensure users can read their own subscription
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Ensure status includes both active and trial
CREATE POLICY "Users can view active or trial subscription" ON subscriptions
  FOR SELECT USING (
    auth.uid() = user_id 
    AND status IN ('active', 'trial')
  );
```

### Step 7: Handle Edge Cases

**ADD proper error boundaries and fallbacks:**

```typescript
// In components that absolutely need a plan value
function PricingComponent() {
  const { plan, isLoading, error } = useSubscription();

  if (isLoading) {
    return <PricingCardSkeleton />;
  }

  if (error) {
    console.error('Subscription error:', error);
    // Show error state, not default to free
    return <SubscriptionErrorMessage />;
  }

  // Only NOW make plan decisions
  const displayPlan = plan || 'free';
}
```

### Step 8: Clear Cache and Test

**AFTER implementing all changes:**

1. Clear all browser storage:
   ```javascript
   // Run in browser console
   localStorage.clear();
   sessionStorage.clear();
   ```

2. Sign out completely

3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

4. Sign back in

5. Verify in Network tab that all subscription queries include:
   - `status IN ('active', 'trial')`
   - Proper user_id filter

## 🚫 CRITICAL RULES - NEVER VIOLATE THESE

### Rule 1: Single Source of Truth
- **NEVER** create new hooks for subscription data
- **NEVER** query subscriptions table directly in components
- **ALWAYS** use the SubscriptionContext

### Rule 2: Status Consistency
- **ALWAYS** query with `.in('status', ['active', 'trial'])`
- **NEVER** use just `.eq('status', 'active')`
- **NEVER** assume a default status

### Rule 3: Loading State Handling
- **ALWAYS** show loading UI while data loads
- **NEVER** show "Upgrade" or "0 credits" during loading
- **NEVER** return defaults like `{ plan: 'free' }` as a fallback

### Rule 4: No Defensive Defaults
- **NEVER** use `|| 'free'` or `|| 'basic'` patterns
- **ALWAYS** explicitly handle null/undefined states
- **ALWAYS** wait for data before making UI decisions

## 📋 Testing Checklist

After implementation, verify:

- [ ] Only ONE SubscriptionContext exists
- [ ] No components make direct supabase queries for subscriptions
- [ ] All status checks use `['active', 'trial']`
- [ ] Loading states show skeletons, not wrong tier
- [ ] Credits show correctly (150 for Elite)
- [ ] Plan shows correctly ('elite')
- [ ] No "Upgrade to Pro/Elite" buttons appear for Elite users
- [ ] Realtime updates work when subscription changes
- [ ] Browser refresh maintains correct state
- [ ] Sign out/in cycle maintains correct state

## 🎯 Expected Outcome

After these fixes:
1. The UI will consistently recognize Elite status
2. Credits will show 150/150, not 0/20
3. No upgrade prompts for Elite users
4. Single source of truth prevents future inconsistencies
5. Loading states prevent false "free tier" displays

## ⚠️ Implementation Order

1. **FIRST**: Create the SubscriptionContext (don't modify anything else yet)
2. **SECOND**: Update App.tsx to include the provider
3. **THIRD**: Find and list all components using subscription data
4. **FOURTH**: Update components one by one to use the context
5. **FIFTH**: Remove all old hooks and direct queries
6. **FINALLY**: Test thoroughly with cache cleared

## 🔴 STOP - Before Starting

**CONFIRM you have:**
1. Located all existing subscription-related code
2. Backed up current implementation
3. Access to update Supabase RLS policies if needed
4. Ability to test as an Elite user

**DO NOT** start refactoring until you've mapped out all affected files.

---

**NOTE TO LOVABLE AI**: This is a critical architectural fix. The fragmentation of subscription logic is causing significant user experience issues and wasting credits on support. Follow these instructions exactly - do not create shortcuts or additional subscription hooks. The goal is consolidation, not just fixing symptoms.
