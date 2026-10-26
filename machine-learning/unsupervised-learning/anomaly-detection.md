---
layout: default
title: "2.2 Anomaly Detection"
description: "Anomaly detection with a bank spending example: learn what normal looks like, flag what doesn't fit, and why an unusual transaction isn't automatically fraud."
parent: "2 Unsupervised Learning"
grand_parent: Machine Learning
nav_order: 2
---

# 2.2 Anomaly Detection

## Quick summary

- Anomaly detection finds activity that looks **unusually different from normal behavior**.
- The model learns normal patterns and flags things that don't fit.
- **Clustering finds groups. Anomaly detection finds unusual examples.**

## Example: bank transactions

Say a bank looks at how its customers usually spend. From several months of history, it notices these patterns:

| Customers | Usual daily spending |
| --- | --- |
| A and B | 150–200 USD |
| C and D | 300–500 USD |
| E | Around 1,000 USD |

We already saw how clustering can group customers with similar habits. Now let's look at something different.

### Something changes for Customer A

A normally spends 150–200 USD a day. But this month, A spends **1,000 USD a day for three days in a row**.

The graph shows all five customers' daily spending. A's three unusual days are **days 22, 23, and 24**, highlighted with red circles.

![Anomaly detection: unusual spending by Customer A]({{ "/machine-learning/unsupervised-learning/fig-1-anomaly-detection.png" | relative_url }})

Those three days stand out compared with A's usual activity, so the model flags them for review.

**But 1,000 USD is normal for E.** The amount alone doesn't make it an anomaly. What matters is how it compares with the relevant customer's normal behavior.

This sudden change could suggest that A's card details have been leaked and someone else is using the card. It could also be planned spending. **An unusual pattern isn't automatically fraud.**

We only use daily spending here to keep it simple. Real bank systems use many more signals, such as transaction timing, location, merchant, and how many payments happen in a short period.

## How it works

1. Learn the customer's usual spending patterns from past activity.
2. Compare new activity with those patterns.
3. Flag activity that looks unusually different.

For this unsupervised example, we don't give the model a fraud/not-fraud label for each transaction. It looks for departures from normal behavior. Customer identity tells it whose history to compare against; it isn't a fraud label.

## Remember

- **Clustering:** which examples belong together?
- **Anomaly detection:** which examples look unusual?
- Something normal for one customer can be unusual for another.
- A flag means **worth checking**, not **confirmed fraud**.
