---
layout: default
title: Classification
parent: Supervised Learning
grand_parent: Machine Learning
nav_order: 2
---

# Classification

## Quick summary

- Supervised learning, same as regression, but it predicts a **category** out of a fixed set.
- You train it on examples with known inputs (x) and the right labels (y).
- Two classes = binary classification. More than two = multiclass.
- It can use more than one input feature.
- Regression predicts a number, classification predicts a category.

## Example: tumors

Say we're building a breast cancer detection system. Simplified version: we have tumor sizes and the known diagnosis for each one. The model learns from those and predicts a class for a new tumor.

- **Input (x):** tumor size
- **Output (y):** diagnosis label

| Label | Class | Meaning | Chart marker |
| --- | --- | --- | --- |
| 0 | Benign | Not cancerous | Green circle |
| 1 | Malignant | Cancerous | Red cross |

![Classification: benign or malignant]({{ "/machine-learning/supervised-learning/fig-1-classification.png" | relative_url }})

### Training data

| Tumor size (example units) | Diagnosis label |
| --- | --- |
| 2 | 0 (benign) |
| 5 | 1 (malignant) |
| 1 | 0 (benign) |
| 7 | 1 (malignant) |
| … | … |

Just a teaching example. Tumor size alone doesn't tell you if a tumor is cancerous.

## Another example: two inputs, three classes

You're not stuck with one input and two classes. You can use several features together and predict one of many categories.

Same example, but now with two inputs:

- **x₁:** patient age (horizontal axis)
- **x₂:** tumor size (vertical axis)

Each point is one example with both features. Where it sits shows age and size, and the marker shows its known class.

Three made-up classes for this one:

| Label | Class | Chart marker |
| --- | --- | --- |
| 0 | Benign | Green circle |
| 1 | Malignant, type A | Red cross |
| 2 | Malignant, type B | Red triangle |

![Classification: 2 input and 3 output]({{ "/machine-learning/supervised-learning/fig-2-classification.png" | relative_url }})

For a new patient, say age 45 and tumor size 3, the model looks at both and picks one class: benign, type A or type B.

That's multiclass classification: two inputs, three possible classes, one prediction per example. Type A and B are just placeholders here, age and size wouldn't really be enough for a diagnosis.

The axes are the inputs and the markers are the classes. Adding more inputs doesn't turn it into regression, since regression can use multiple inputs too. What matters is what you're predicting:

- **Classification:** which group does this belong to?
- **Regression:** what number should it be?

## How it works

1. Start with inputs (tumor sizes) and known labels (benign or malignant).
2. The model learns what separates the classes.
3. Give it a new input and it predicts a class.

The 0 and 1 are just labels, not amounts. You could use words instead, numbers are only a convention.

## Regression vs. classification

| | Regression | Classification |
| --- | --- | --- |
| Predicts | A number | A category |
| Example | House price | Benign or malignant |
| Possible outputs | Anything in a range | A fixed set of classes |
| Learning type | Supervised | Supervised |

## Remember

- Classification puts an input into a category.
- One input or many, the output is still a class.
- It's supervised because you train on known input/label pairs.
- **Binary:** two classes, like benign/malignant or spam/not spam.
- **Multiclass:** more than two, like cat/dog/bird.
- A model might give probabilities for each class, but the final prediction is always one of the defined classes.
