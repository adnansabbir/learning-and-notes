---
layout: default
title: Machine Learning
nav_order: 3
has_children: true
---

# Machine Learning

Machine learning is a way of teaching computers to learn patterns from data and use those patterns to make predictions or decisions, without explicitly programming every rule.

## 💡 Quick Summary

Two main types of machine learning are:

- **Supervised learning:** Learns from data with known answers (labels).
- **Unsupervised learning:** Finds patterns in data without given answers.

![Supervised vs. unsupervised learning]({{ "/machine-learning/fig-1-learning-types.png" | relative_url }})

## Supervised Learning

We give the model examples containing both an **input (x)** and the correct **output (y)**. It learns the relationship and predicts an output for a new input.

- **[Regression]({{ "/machine-learning/supervised-learning/regression/" | relative_url }}):** Predicts a numerical value, such as a house price.
- **[Classification]({{ "/machine-learning/supervised-learning/classification/" | relative_url }}):** Predicts a category, such as spam or not spam.

## Unsupervised Learning

We give the model data **without labels**. It discovers patterns or structure, such as grouping customers with similar shopping habits (**clustering**).

## 📌 Remember

**Supervised → Learn from known answers.**  
**Unsupervised → Discover patterns without given answers.**

These are two major types; other approaches include **reinforcement learning**, where an agent learns through actions and rewards.
