---
layout: default
title: Machine Learning
description: "My machine learning notes in plain words: supervised and unsupervised learning, then linear regression step by step, with interactive graphs and runnable Python."
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

## 1 Supervised learning

You give the model examples with an input (x) and the right output (y). It learns how they relate, then predicts y for a new x.

- **[1.1 Regression]({{ "/machine-learning/supervised-learning/regression/" | relative_url }}):** predicts a number, like a house price.
- **[1.2 Classification]({{ "/machine-learning/supervised-learning/classification/" | relative_url }}):** predicts a category, like spam or not spam.

## 2 Unsupervised learning

You give the model data without labels and it finds structure on its own, like grouping customers who shop the same way (clustering).

- **[2.1 Clustering]({{ "/machine-learning/unsupervised-learning/clustering/" | relative_url }}):** groups similar examples together.
- **[2.2 Anomaly Detection]({{ "/machine-learning/unsupervised-learning/anomaly-detection/" | relative_url }}):** spots examples that don't fit the usual pattern.
- **[2.3 Dimensionality Reduction]({{ "/machine-learning/unsupervised-learning/dimensionality-reduction/" | relative_url }}):** describes each example with fewer numbers but keeps what matters.

## 3 Linear regression

A closer look at the simplest model, a straight line fitted to data.

- **[3.1 Training Data and Notation]({{ "/machine-learning/linear-regression/training-data-and-notation/" | relative_url }}):** the symbols used to describe training data.
- **[3.2 From Data to a Model Function]({{ "/machine-learning/linear-regression/from-data-to-a-model-function/" | relative_url }}):** from plotting data to a trained function that predicts ŷ.
- **[3.3 Cost Function]({{ "/machine-learning/linear-regression/cost-function/" | relative_url }}):** one number that says how well a line fits.

## Remember

**Supervised = learn from known answers.**  
**Unsupervised = find patterns with no answers given.**

There are other types too, like reinforcement learning, where an agent learns by taking actions and getting rewards.
