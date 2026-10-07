---
layout: default
title: Machine Learning
nav_order: 3
has_children: true
---

# Machine Learning

Teaching a computer to pick up patterns from data and use them to make predictions, instead of writing every rule by hand.

## Quick summary

Two main types:

- **Supervised learning:** learns from data that has the answers (labels).
- **Unsupervised learning:** finds patterns in data with no answers given.

![Supervised vs. unsupervised learning]({{ "/machine-learning/fig-1-learning-types.png" | relative_url }})

## Supervised learning

You give the model examples with an input (x) and the right output (y). It learns how they relate, then predicts y for a new x.

- **[Regression]({{ "/machine-learning/supervised-learning/regression/" | relative_url }}):** predicts a number, like a house price.
- **[Classification]({{ "/machine-learning/supervised-learning/classification/" | relative_url }}):** predicts a category, like spam or not spam.

## Unsupervised learning

You give the model data without labels and it finds structure on its own, like grouping customers who shop the same way (clustering).

More here: **[Unsupervised Learning]({{ "/machine-learning/unsupervised-learning/" | relative_url }})** (clustering, using the tumor example)

## Remember

**Supervised = learn from known answers.**  
**Unsupervised = find patterns with no answers given.**

There are other types too, like reinforcement learning, where an agent learns by taking actions and getting rewards.
