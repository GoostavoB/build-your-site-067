# 🤖 Lovable AI Prompt Engineering Guide - Subscription System

## 🎯 Purpose
This guide provides exact prompts and conversation templates to use with Lovable AI to ensure it maintains subscription system integrity and doesn't create fragmented code.

---

## 📝 Master Prompts Library

### 🏗️ Initial Project Context Prompt
**USE THIS FIRST** when starting any session with Lovable:

```markdown
PROJECT CONTEXT - SUBSCRIPTION ARCHITECTURE:

This project uses a CENTRALIZED subscription management system:
- Single SubscriptionContext at: /src/contexts/SubscriptionContext.tsx
- ALL subscription data flows through this context
- NO other hooks or direct queries for subscription data allowed
- Status queries MUST use: .in('status', ['active', 'trial'])
- NEVER default to 'free' during loading states

Current user state:
- Plan: Elite
- Credits: 150
- Status: Active

When implementing ANY feature involving plans, credits, or premium features:
1. Import: import { useSubscription } from '@/contexts/SubscriptionContext'
2. Use provided properties: plan, credits, isElite, isPro, isLoading
3. Handle isLoading state before checking plan
4. Do NOT create new subscription-related hooks or queries

Acknowledge that you understand these constraints before proceeding.
```

---

## 🎨 Feature Request Prompts

### Adding Plan-Gated Features

#### ❌ AVOID - Vague Request:
```
"Add a premium feature for analytics"
```

#### ✅ USE - Specific Request:
```markdown
Add an analytics dashboard feature.

REQUIREMENTS:
- Only accessible to Pro and Elite plans
- Show "Upgrade Required" for Free/Basic users

IMPLEMENTATION RULES:
- Use existing SubscriptionContext from /src/contexts/SubscriptionContext.tsx
- Import: import { useSubscription } from '@/contexts/SubscriptionContext'
- Check isPro || isElite for access
- Handle isLoading state with skeleton loader
- Do NOT create new subscription hooks
- Do NOT query subscriptions table directly

Show me the implementation plan before coding.
```

### Adding Credit-Consuming Features

#### ✅ Correct Prompt:
```markdown
Add a feature to generate AI images that consumes 5 credits per generation.

ARCHITECTURE REQUIREMENTS:
- Use SubscriptionContext for current credits: const { credits, refetch } = useSubscription()
- Check credits >= 5 before allowing generation
- Call API endpoint to consume credits (don't modify locally)
- Use refetch() after successful API call
- Show loading state during generation

FORBIDDEN:
- Do NOT create useCredits or similar hooks
- Do NOT query user_credits table directly
- Do NOT update credits in UI without API call

Implementation should follow existing patterns in the codebase.
```

### Modifying Subscription Display

#### ✅ Correct Prompt:
```markdown
Update the header to show current plan and credits.

REQUIREMENTS:
Display format: "[Plan] - [Credits]/[Max] credits"
Example: "Elite - 150/150 credits"

MUST USE:
- SubscriptionContext: import { useSubscription } from '@/contexts/SubscriptionContext'
- Properties: plan, credits, isLoading
- Show skeleton while isLoading is true
- Never show "Free - 0/0 credits" during loading

DO NOT:
- Create new queries to fetch this data
- Use defaults like plan || 'free'
- Access subscription data any other way

Maintain consistency with existing subscription UI patterns.
```

---

## 🔧 Debugging Prompts

### When Subscription Not Recognized

#### ✅ Diagnostic Prompt:
```markdown
The Elite plan is not being recognized. Debug this systematically.

STEP 1 - AUDIT (Do this first, show me results):
- List ALL files that import or query subscription data
- List ALL hooks with "subscription", "plan", or "credit" in the name
- Check how many different ways the app determines user plan
- Find all instances of .eq('status', 'active') vs .in('status', ['active', 'trial'])

STEP 2 - IDENTIFY ISSUES:
- Multiple sources of truth? (Should be only SubscriptionContext)
- Inconsistent status filters? (Should all include 'trial')
- Defensive defaults hiding the problem? (like || 'free')
- Race conditions with loading states?

STEP 3 - SHOW FINDINGS:
Present what you found before proposing fixes.

Do not fix anything yet, just diagnose.
```

### When Credits Show Wrong Value

#### ✅ Debug Prompt:
```markdown
Credits showing 0 instead of 150 for Elite user. Investigate.

CHECK IN ORDER:
1. How many places in the code determine credit count?
2. Is SubscriptionContext the only source?
3. Are there separate queries to user_credits table?
4. Is isLoading being checked before displaying credits?
5. Are there any "credits || 0" default patterns?

For each check, show me:
- File location
- Current implementation
- Whether it follows single source of truth pattern

Don't fix yet, just investigate and report.
```

---

## 🛠️ Fix Implementation Prompts

### Consolidating Fragmented System

#### ✅ Refactoring Prompt:
```markdown
Consolidate all subscription logic into single source of truth.

CURRENT ISSUES IDENTIFIED:
[List from diagnostic]

FIX REQUIREMENTS:
1. Create/update SubscriptionContext at /src/contexts/SubscriptionContext.tsx
2. Must query with: .in('status', ['active', 'trial'])
3. Include user_credits in the query
4. Provide these exports: subscription, plan, credits, isElite, isPro, isBasic, isFree, isLoading, error, refetch

MIGRATION STEPS:
1. Update SubscriptionContext first
2. List all components that need updating
3. Update each component to use the context
4. Remove all old hooks and direct queries
5. Verify no subscription queries remain outside context

Show me the implementation plan, then execute step by step.
```

### Fixing Race Conditions

#### ✅ Race Condition Fix Prompt:
```markdown
Fix race condition where UI briefly shows "free tier" before loading Elite status.

PROBLEM: Components check plan before subscription data loads

SOLUTION REQUIREMENTS:
1. Always check isLoading before plan
2. Show skeleton/spinner during loading
3. Never use default values like 'free' as fallback
4. Implement proper loading hierarchy:
   - If isLoading → show loading UI
   - If error → show error state
   - If !subscription → show unsubscribed state
   - Else → show correct tier

Update ALL components that check subscription status.
Show me affected components first, then implement fixes.
```

---

## 🚫 Error Prevention Prompts

### Before Adding New Features

#### ✅ Pre-Implementation Check:
```markdown
Before implementing [FEATURE], verify subscription architecture:

CHECKLIST:
1. Does SubscriptionContext exist at /src/contexts/SubscriptionContext.tsx?
2. Does it export all needed properties for this feature?
3. Are there any existing hooks that try to fetch subscription data?
4. How do other similar features handle plan checking?

Show me your findings, then propose implementation approach.
The implementation MUST use only SubscriptionContext, no new queries.
```

### Code Review Request

#### ✅ Review Prompt:
```markdown
Review this implementation for subscription system compliance:

[Paste code]

CHECK FOR:
1. Uses SubscriptionContext exclusively? (no direct queries)
2. Status filters include ['active', 'trial']?
3. Handles isLoading state properly?
4. No defensive defaults like || 'free'?
5. Follows single source of truth pattern?

Flag any violations and suggest corrections.
```

---

## 💬 Conversation Flow Templates

### Scenario 1: Adding New Premium Feature

```markdown
You: "Add a batch processing feature for Elite users only."

Lovable: [Might start creating new hooks]

You: "STOP. Use the existing SubscriptionContext from /src/contexts/SubscriptionContext.tsx. 
The isElite property already exists. Do not create new subscription queries. 
Show me your implementation approach first."

Lovable: [Shows approach]

You: "Confirm: You're using useSubscription hook and checking isElite after verifying !isLoading?"

Lovable: [Confirms and implements correctly]
```

### Scenario 2: Fixing Broken Subscription

```markdown
You: "Elite plan not recognized. Fix this."

Lovable: [Might try quick fixes]

You: "First, audit all subscription-related code. List every file and hook that determines plan or credits. 
Don't fix anything until we see the full picture."

Lovable: [Provides audit]

You: "I see [X] different sources of truth. Consolidate everything into SubscriptionContext. 
All queries must use .in('status', ['active', 'trial']). 
Show me the consolidation plan before implementing."
```

### Scenario 3: Debugging Issues

```markdown
You: "Debug why credits show as 0 for Elite user."

Lovable: [Might jump to solutions]

You: "Slow down. First, trace the data flow:
1. What does the database show?
2. What does the API return?
3. How does SubscriptionContext fetch it?
4. How do components consume it?
Show me each step's current implementation."

Lovable: [Shows investigation]

You: "The issue is in step [X]. The query doesn't include 'trial' status. 
Fix only that specific issue, don't refactor everything."
```

---

## ⚡ Quick Reference Card

### Copy-Paste Context Setter
```markdown
CONTEXT: Single SubscriptionContext at /src/contexts/SubscriptionContext.tsx
USE: import { useSubscription } from '@/contexts/SubscriptionContext'
NEVER: Create new subscription hooks or direct queries
ALWAYS: Check isLoading before using plan/credits
QUERY: Must use .in('status', ['active', 'trial'])
```

### Copy-Paste Rule Enforcer
```markdown
STOP - Before implementing:
✓ Using existing SubscriptionContext?
✓ No new subscription hooks?
✓ No direct Supabase queries?
✓ Handling isLoading state?
✓ Including 'trial' in status?
✗ No defaults like || 'free'?
```

### Copy-Paste Debug Starter
```markdown
DEBUG SYSTEMATICALLY:
1. List all subscription touch points
2. Check query consistency
3. Verify single source of truth
4. Check loading state handling
5. Identify race conditions
Show findings before fixing.
```

---

## 🔴 Emergency Stop Phrases

Use these to prevent Lovable from going off track:

### "STOP - Wrong Approach"
```markdown
STOP. You're creating a new subscription hook. 
We have SubscriptionContext for this.
Delete that approach and use the existing context instead.
```

### "STOP - Don't Fragment"
```markdown
STOP. You're fragmenting the subscription system.
All subscription data must come from SubscriptionContext.
Do not create separate queries or hooks.
```

### "STOP - Check First"
```markdown
STOP. Before implementing, show me:
1. Where is SubscriptionContext?
2. What properties does it provide?
3. How will you use it for this feature?
Don't code until I approve the approach.
```

---

## 📊 Success Metrics for Prompts

Your prompts are effective when Lovable:

1. **Asks for confirmation** before creating subscription-related code
2. **Uses existing context** without being reminded
3. **Shows investigation** before proposing fixes
4. **Handles loading states** automatically
5. **Includes 'trial' status** in all queries
6. **Avoids defensive defaults** without prompting
7. **Maintains single source of truth** throughout session

---

## 🎯 Golden Rules for Every Interaction

1. **Set context early** - First message should establish subscription architecture
2. **Be specific** - Include file paths and import statements
3. **Prevent, don't fix** - Stop wrong approaches before implementation
4. **Verify understanding** - Ask Lovable to confirm approach before coding
5. **Incremental progress** - Fix step by step, not all at once
6. **Document decisions** - Have Lovable explain why it's using certain patterns

---

## 📝 Session Template

Start every Lovable session with:

```markdown
Session Context:
- Project uses centralized SubscriptionContext
- Located at: /src/contexts/SubscriptionContext.tsx  
- Current user: Elite plan, 150 credits
- No new subscription hooks allowed
- All queries must include ['active', 'trial'] status

Today's Tasks:
1. [Task 1]
2. [Task 2]

Before starting, confirm you understand the subscription architecture constraints.
```

This ensures Lovable maintains context throughout the entire session.
