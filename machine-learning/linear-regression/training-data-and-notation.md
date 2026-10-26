---
layout: default
title: "3.1 Training Data and Notation"
description: "Machine learning notation for training data: x, y, m and the i-th training example (x(i), y(i)), explained with a simple house price table."
parent: "3 Linear Regression"
grand_parent: Machine Learning
nav_order: 1
---

# 3.1 Training Data and Notation

## Quick summary

To train a model that predicts house prices, we give it examples of houses with their sizes and known prices.

Let's look at the data first, then introduce the symbols we use to describe it.

## Our training data

Suppose we have collected data about **100 houses**. For each house, we know its size and price.

Here is an example dataset. We show the first 10 rows and the last row to keep the table short.

<table>
  <thead>
    <tr>
      <th style="opacity: 0.5;">Index (row number)</th>
      <th>Size in square feet</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="opacity: 0.5;">1</td>
      <td>900</td>
      <td>$180K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">2</td>
      <td>1,200</td>
      <td>$240K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">3</td>
      <td>1,500</td>
      <td>$310K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">4</td>
      <td>1,100</td>
      <td>$225K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">5</td>
      <td>1,800</td>
      <td>$360K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">6</td>
      <td>2,000</td>
      <td>$410K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">7</td>
      <td>1,350</td>
      <td>$270K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">8</td>
      <td>2,200</td>
      <td>$450K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">9</td>
      <td>1,650</td>
      <td>$330K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">10</td>
      <td>2,500</td>
      <td>$510K</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">…</td>
      <td>…</td>
      <td>…</td>
    </tr>
    <tr>
      <td style="opacity: 0.5;">100</td>
      <td>1,950</td>
      <td>$395K</td>
    </tr>
  </tbody>
</table>

Each row describes **one house**. We call that row a **training example**.

For example, the third row tells us that a **1,500-square-foot house has a known price of $310,000**.

The index helps us identify a row. It is not an input feature for our model.

## Input and target

What do we want the model to do with this data?

> When I give it the size of a house, I want it to predict the price.

So we give the two columns different roles:

- **House size is the input feature.** It is the information we give the model.
- **House price is the target value.** It is what we want the model to learn to predict.

During training, we provide both the size and the known price. After training, we can provide a house size and ask the model to predict its price.

The known price in our training data is the **target**. The price the model produces is its **prediction**.

## Symbols used to describe the data

Now that we understand the table, let's introduce a few symbols:

| Symbol                     | Meaning in our example                                |
|----------------------------|-------------------------------------------------------|
| $$x$$                      | The input feature: house size in square feet          |
| $$y$$                      | The target value: house price in thousands of dollars |
| $$m$$                      | The total number of training examples                 |
| $$i$$                      | The index of a particular training example            |
| $$\left(x^{(i)}, y^{(i)}\right)$$ | The $$i$$-th training example: the size and price from row $$i$$ |

### Input feature: $$x$$

We use **$$x$$** to represent the house size.

For example, for a house that is 1,500 square feet:

$$
x = 1500
$$

We may call $$x$$ the **input**, **input variable**, or **feature**.

In this example, we have just one input feature: house size.

### Target value: $$y$$

We use **$$y$$** to represent the known house price, in thousands of dollars.

For a house whose known price is $310,000:

$$
y = 310
$$

We may call $$y$$ the **target variable** or **target value**.

### Number of training examples: $$m$$

We use **$$m$$** to represent the total number of training examples.

Our dataset contains 100 houses, so:

$$
m = 100
$$

Even though we only display some rows, the full dataset still contains **100 training examples**.

We count the houses, not the columns or individual cells.

## A single training example: $$(x, y)$$

We write a single training example as a pair:

$$
(x, y)
$$

The two values belong to the same house:

- $$x$$: its size.
- $$y$$: its known price.

For example, the third row contains this pair:

$$
(1500, 310)
$$

This means:

> A house with a size of 1,500 square feet has a known price of $310,000.

## A specific training example: $$(x^{(i)}, y^{(i)})$$

Sometimes we want to refer to a particular row in the dataset.

For that, we use:

$$
\left(x^{(i)}, y^{(i)}\right)
$$

Here, **$$i$$ is the row number**, identifying the training example.

In these notes, we count examples starting from **1**:

- $$i = 1$$: the first training example.
- $$i = 2$$: the second training example.
- $$i = 3$$: the third training example.
- And so on, up to $$i = 100$$.

If you are used to Python, remember that Python indexing usually starts at 0. Here, we start at 1.

### Reading the third training example

Looking at the third row:

| Index (row number) | Size in square feet | Price in $ thousands |
|---|---:|---:|
| 3 | 1,500 | 310 |

We can write:

$$
x^{(3)} = 1500
$$

This means **the input value from the third training example is 1,500 square feet**.

Similarly:

$$
y^{(3)} = 310
$$

This means **the target value from the third training example is 310 thousand dollars**.

Together:

$$
\left(x^{(3)}, y^{(3)}\right) = (1500, 310)
$$

The parenthesized superscript **$$(3)$$** identifies the training example. It does **not** mean “raise to the power of 3.”

## Remember

- Each row describes one house and forms one **training example**.
- The index identifies the row; it is not an input feature.
- **$$x$$** is the input feature: house size in square feet.
- **$$y$$** is the target value: house price in thousands of dollars.
- **$$m$$** is the total number of training examples. Here, $$m = 100$$.
- **$$(x, y)$$** represents one training example.
- **$$(x^{(i)}, y^{(i)})$$** represents the $$i$$-th training example.
- In these notes, example numbering starts at **1**.
- The superscript **$$(i)$$** identifies an example; it is not a power.
- During training, we provide both the input and the target. Later, we give the model an input and ask it to predict the target.