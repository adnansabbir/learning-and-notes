---
layout: default
title: Regression
parent: Supervised Learning
grand_parent: Machine Learning
nav_order: 1
---

# Supervised Learning — Regression

## 💡 Quick Summary

- Regression is a type of **supervised learning**.
- It predicts a **continuous numerical value**.
- We train the model using examples where we already know the **input (x)** and the correct **output (y)**.
- After training, we can give a new input and the model predicts the output.

## 📊 Example: Predicting House Prices

We have data on house size (input) and price (output). The model learns the relationship and can predict the price for a new house size.

![Regression: predicting house prices]({{ "/machine-learning/supervised-learning/fig-1-regression.png" | relative_url }})

### Sample Training Data

| Size (sq ft) | Price ($1,000s) |
| --- | --- |
| 500 | 100 |
| 800 | 150 |
| 1,200 | 170 |
| 1,500 | 230 |
| 2,000 | 300 |
| 2,500 | 350 |
| … | … |

## 🔍 How It Works

1. We have a dataset with **input** (house size) and **output** (house price).
2. The model learns the relationship between input and output (e.g., the green curve).
3. After training, we can give a **new input** (e.g., 750 sq ft) and it predicts a **numerical value** (e.g., ~$150,000).

## 📌 Key Points to Remember

- Regression predicts a **continuous numerical value**.
- It is a **supervised learning** problem (we train using known input–output pairs).
- Input is usually denoted as **x**, output as **y**.
- The predicted value is often denoted as **ŷ (y-hat)**.
- There can be infinitely many possible output values (not limited to a few classes).
