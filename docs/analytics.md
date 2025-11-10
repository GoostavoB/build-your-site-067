# Analytics Events Documentation

## Upgrade Modal Events

This document describes the analytics events fired by the upgrade modal system.

### Event: `upgrade_modal_view`

**Description**: Fired when the upgrade modal is displayed to the user.

**When**: Automatically fired when `openUpgradeModal()` is called or when the modal opens.

**Properties**:
```typescript
{
  source: string,          // Where the modal was triggered from
  required_plan?: string,  // The minimum plan required (if applicable)
  timestamp: string        // ISO 8601 timestamp
}
```

**Source Values**:
- `upload_zero_credits` - User tried to upload when out of AI credits
- `batch_upload_zero_credits` - User tried batch upload when out of credits
- `feature_lock` - User clicked on a premium-locked feature
- `rate_limit` - User hit rate limits
- `manual` - Manually triggered from code

**Example**:
```javascript
{
  event: 'upgrade_modal_view',
  source: 'upload_zero_credits',
  required_plan: undefined,
  timestamp: '2025-01-09T14:30:00.000Z'
}
```

---

### Event: `upgrade_modal_dismiss`

**Description**: Fired when the user closes/dismisses the upgrade modal without selecting a plan.

**When**: Modal is closed via X button, clicking outside, or pressing ESC.

**Properties**:
```typescript
{
  source: string,     // Where the modal was originally triggered from
  timestamp: string   // ISO 8601 timestamp
}
```

**Example**:
```javascript
{
  event: 'upgrade_modal_dismiss',
  source: 'feature_lock',
  timestamp: '2025-01-09T14:31:15.000Z'
}
```

---

### Event: `upgrade_modal_plan_click`

**Description**: Fired when the user clicks on a plan's CTA button in the upgrade modal.

**When**: User clicks "Get Started" or similar CTA on any pricing card.

**Properties**:
```typescript
{
  source: string,     // Where the modal was originally triggered from
  plan_id: string,    // The plan that was clicked ('basic', 'pro', 'elite')
  timestamp: string   // ISO 8601 timestamp
}
```

**Example**:
```javascript
{
  event: 'upgrade_modal_plan_click',
  source: 'upload_zero_credits',
  plan_id: 'pro',
  timestamp: '2025-01-09T14:32:00.000Z'
}
```

---

## Implementation

### Using Google Analytics 4

The events are automatically sent to GA4 if `window.gtag` is available:

```typescript
// Automatically called by UpgradeModalContext
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'upgrade_modal_view', {
    source: config.source,
    required_plan: config.requiredPlan,
    timestamp: new Date().toISOString(),
  });
}
```

### Custom Analytics Provider

To use a different analytics provider, modify `src/contexts/UpgradeModalContext.tsx`:

```typescript
// Replace gtag calls with your provider
// Example for Mixpanel:
if (typeof window !== 'undefined' && (window as any).mixpanel) {
  (window as any).mixpanel.track('Upgrade Modal View', {
    source: config.source,
    required_plan: config.requiredPlan,
  });
}
```

---

## Funnel Analysis

### Conversion Funnel

Track the upgrade flow:

1. **Modal View** (`upgrade_modal_view`) - User sees upgrade prompt
2. **Plan Click** (`upgrade_modal_plan_click`) - User engages with pricing
3. **Checkout Started** (external) - User initiates payment
4. **Subscription Created** (external) - User completes upgrade

### Drop-off Analysis

Calculate drop-off rates:

```
Modal Views       : 1000
Plan Clicks       : 300  (30% engagement)
Checkouts Started : 120  (12% of views, 40% of clicks)
Subscriptions     : 60   (6% of views, 50% of checkouts)
```

### Source Performance

Compare conversion by source:

| Source | Views | Plan Clicks | Conv. Rate |
|--------|-------|-------------|------------|
| upload_zero_credits | 500 | 180 | 36% |
| feature_lock | 300 | 75 | 25% |
| rate_limit | 200 | 45 | 22.5% |

**Insight**: Credit exhaustion drives highest engagement (36%).

---

## A/B Testing

### Testing Modal Copy

Track which messages drive more conversions:

```typescript
openUpgradeModal({
  source: 'upload_zero_credits',
  title: variantA ? 'Out of Credits' : 'Unlock More AI Power',
  message: variantA
    ? "You've used your monthly budget."
    : "Get unlimited AI extractions with Pro.",
});
```

Add variant tracking:
```javascript
gtag('event', 'upgrade_modal_view', {
  source: 'upload_zero_credits',
  variant: variantA ? 'direct' : 'benefit',
});
```

---

## Debugging

### Verify Events in Console

```javascript
// Add to UpgradeModalContext for debugging
console.log('[Analytics] upgrade_modal_view', { source, required_plan });
```

### Test Events Manually

```javascript
import { openUpgradeModal } from '@/lib/openUpgradeModal';

// Trigger modal and check console/GA debugger
openUpgradeModal({
  source: 'manual',
  title: 'Test Modal',
});
```

---

## Queries for BigQuery (GA4)

### Get all upgrade modal views:

```sql
SELECT
  event_name,
  event_timestamp,
  user_id,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source') AS source,
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'required_plan') AS required_plan
FROM `your-project.analytics_123456789.events_*`
WHERE event_name = 'upgrade_modal_view'
  AND _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
ORDER BY event_timestamp DESC
LIMIT 1000
```

### Calculate conversion rate by source:

```sql
WITH views AS (
  SELECT
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source') AS source,
    COUNT(*) as view_count
  FROM `your-project.analytics_123456789.events_*`
  WHERE event_name = 'upgrade_modal_view'
    AND _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
  GROUP BY source
),
clicks AS (
  SELECT
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source') AS source,
    COUNT(*) as click_count
  FROM `your-project.analytics_123456789.events_*`
  WHERE event_name = 'upgrade_modal_plan_click'
    AND _TABLE_SUFFIX BETWEEN '20250101' AND '20250131'
  GROUP BY source
)
SELECT
  v.source,
  v.view_count,
  COALESCE(c.click_count, 0) as click_count,
  ROUND(COALESCE(c.click_count, 0) / v.view_count * 100, 2) as conversion_rate_pct
FROM views v
LEFT JOIN clicks c ON v.source = c.source
ORDER BY v.view_count DESC
```

---

## Best Practices

1. **Always provide source**: Makes analysis easier
2. **Test events in dev**: Use browser console to verify
3. **Monitor drop-offs**: High view count + low clicks = poor messaging
4. **A/B test copy**: Different users respond to different messages
5. **Track time-to-action**: How long between view and click?

---

**Last Updated**: 2025-01-09
**Maintained By**: Development Team
