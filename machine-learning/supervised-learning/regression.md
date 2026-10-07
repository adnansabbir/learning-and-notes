---
layout: default
title: Regression
parent: Supervised Learning
grand_parent: Machine Learning
nav_order: 1
---

# Regression

## Quick summary

- Supervised learning that predicts a **number** (any value in a range, not a fixed set of options).
- You train it on examples where you already know the input (x) and the right output (y).
- Once trained, give it a new input and it predicts the output.

## Example: house prices

Input is house size, output is price. The model learns how size relates to price, then you can ask it about a size it hasn't seen.

![Regression: predicting house prices]({{ "/machine-learning/supervised-learning/fig-1-regression.png" | relative_url }})

### Training data

| Size (sq ft) | Price ($1,000s) |
| --- | --- |
| 500 | 100 |
| 800 | 150 |
| 1,200 | 170 |
| 1,500 | 230 |
| 2,000 | 300 |
| 2,500 | 350 |
| … | … |

## How it works

1. Start with data: house size (input) and price (output).
2. The model learns the relationship between them (the green curve in the chart).
3. Give it a new size, say 750 sq ft, and it predicts a price, around $150,000.

## Remember

- Regression = predict a number.
- It's supervised because you train on known input/output pairs.
- Input is usually called **x**, output **y**.
- The prediction is written **ŷ** ("y-hat").
- The output can be basically any value, not one of a few fixed classes.
