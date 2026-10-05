---
layout: default
title: Classification
parent: Supervised Learning
grand_parent: Machine Learning
nav_order: 2
---

# Supervised Learning — Classification

## 💡 Quick Summary

- Classification is a type of **supervised learning**, just like regression.
- It predicts a **class or category** from a finite set of possible classes.
- We train the model using examples with known **inputs (x)** and correct **labels (y)**.
- **Binary classification** has two classes; **multiclass classification** has more than two.
- **Regression predicts a numerical value; classification predicts a category.**

## 📊 Example: Classifying Tumors

Suppose we want to build a breast cancer detection system. In this simplified example, we have tumor sizes and their known diagnoses. The model learns from these labeled examples to predict a class for a new input.

- **Input (x):** Tumor size.
- **Output (y):** Diagnosis label.

| Label | Class | Meaning | Chart marker |
| --- | --- | --- | --- |
| 0 | Benign | Not cancerous | Green circle |
| 1 | Malignant | Cancerous | Red cross |

![Classification: benign or malignant]({{ "/machine-learning/supervised-learning/fig-1-classification.png" | relative_url }})

### Sample Training Data

| Tumor size (example units) | Diagnosis label |
| --- | --- |
| 2 | 0 — Benign |
| 5 | 1 — Malignant |
| 1 | 0 — Benign |
| 7 | 1 — Malignant |
| … | … |

This is a teaching example. Tumor size alone does not determine whether a tumor is cancerous.

## 🔍 How It Works

1. We have a dataset with **inputs** (tumor sizes) and known **labels** (benign or malignant).
2. The model learns patterns that help distinguish the classes.
3. After training, we give it a **new input**, and it predicts a **class**.

The numbers **0 and 1 are category labels**, not numerical quantities to estimate. Their assignment is a convention: we could also represent the classes using words.

## ⚖️ Regression vs. Classification

| | Regression | Classification |
| --- | --- | --- |
| Predicts | A continuous numerical value | A class or category |
| Example | House price | Benign or malignant |
| Possible outputs | Values across a continuous range | A finite set of classes |
| Learning type | Supervised learning | Supervised learning |

## 📌 Key Points to Remember

- Classification assigns an input to a **category**.
- It is **supervised learning** because we train using known input–label pairs.
- **Binary classification:** Two classes, such as benign/malignant or spam/not spam.
- **Multiclass classification:** More than two classes, such as cat/dog/bird.
- A model may estimate **class probabilities**, but the predicted class comes from the defined set of categories.
