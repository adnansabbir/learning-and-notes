---
layout: default
title: "3.3 Cost Function"
description: "The linear regression cost function step by step: prediction error, squared error, mean squared error and J(w,b), with interactive sliders."
parent: "3 Linear Regression"
grand_parent: Machine Learning
nav_order: 3
---

# 3.3 Cost Function

## Quick summary

Let's explore how changing $$w$$ and $$b$$ changes our predictions, then build a way to measure how well those predictions fit the data.

We will square the difference between each prediction and its observed value, then combine these squared errors into one number called the **cost**.

Our goal is to find parameter values that make this cost as small as possible.

## Our model function

In **[3.2 From Data to a Model Function]({{ "/machine-learning/linear-regression/from-data-to-a-model-function/" | relative_url }})**, we saw that linear regression with one input uses:

$$
\hat{y} = f_{w,b}(x) = wx + b
$$

Here, $$x$$ is the input, and $$\hat{y}$$ is the predicted output.

The values $$w$$ and $$b$$ are the model's **parameters**. During training, these values are adjusted to make the line fit the data.

Let's first try adjusting them ourselves.

## Play with the line

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -3..3 step 0.1 = 1; b: -3..5 step 0.1 = 0"
     data-formula="ŷ = {w}x + {b}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"></div>

The **red crosses** represent our observed data. The **line** shows the model's predictions.

Move the sliders and watch what happens. The data stays the same; only the line changes.

### What happens when we change w?

Keep $$b$$ fixed and move the $$w$$ slider.

$$w$$ controls the **slope**: how much the prediction changes when $$x$$ increases by 1.

- When $$w$$ is positive, the line rises from left to right.
- When $$w = 0$$, the line is horizontal.
- When $$w$$ is negative, the line falls from left to right.

For example, if $$w = 2$$, increasing $$x$$ by 1 increases the prediction by 2.

### What happens when we change b?

Now keep $$w$$ fixed and move the $$b$$ slider.

$$b$$ shifts the whole line **up or down**, without changing its slope.

- Increasing $$b$$ moves the line up.
- Decreasing $$b$$ moves the line down.

It is also the height where the line crosses the vertical axis. To see why, put $$x = 0$$ into our model:

$$
f_{w,b}(0) = w \times 0 + b = b
$$

The multiplication becomes zero, leaving only $$b$$.

## Which line fits best?

Some settings make the line follow the data closely. Others put it far away from many of the red crosses.

We can move the sliders and judge the fit by eye. But how can we give each setting a number that tells us how well it fits?

That is what we will explore with a **cost function**.

Here, we are using **univariate linear regression**:

- **Univariate** means we have one input feature: $$x$$.
- **Linear regression** uses a straight line to make predictions in this example.

Our goal is to choose $$w$$ and $$b$$ so that the predictions fit the training data well overall.

Let's build a way to measure that, one step at a time.

## Start with one prediction

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -3..3 step 0.1 = 1.2; b: -3..5 step 0.1 = 0.6; x: 0..3.5 step 0.1 = 2"
     data-probe="x"
     data-formula="ŷ = {w} × {x} + {b} = {yhat}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"></div>

Keep $$w = 1.2$$ and $$b = 0.6$$, then set the input slider to $$x = 2$$.

The yellow dotted line starts at **2 on the horizontal axis** and extends up to the model's line. The red circle marks the **prediction**, calculated using $$wx + b$$:

$$
\hat{y} = 1.2 \times 2 + 0.6 = 3
$$

At this same input, the red cross shows the **observed value** from our dataset:

$$
y = 2.45
$$

So we have two different heights at $$x = 2$$:

- The **red cross** is at 2.45: the observed value.
- The **red circle** is at 3: the predicted value.

Now move the $$x$$ slider. The circle travels along the line, showing the prediction for each input.

Keep $$x = 2$$ and try changing $$w$$ or $$b$$. The prediction moves with the line, while the observed value stays fixed.

## How much error does this prediction have?

We can subtract the observed value from the prediction:

$$
\hat{y} - y = 3 - 2.45 = 0.55
$$

The prediction is **0.55 units above** the observed value.

If the prediction were below the observed value, this difference would be negative.

We want errors above and below the observations to contribute to our cost. If we simply added the signed differences, positive and negative values could cancel.

For example, one prediction could be 2 units too high and another 2 units too low:

$$
2 + (-2) = 0
$$

The total is zero, even though both predictions are wrong.

### Square the difference

To prevent this cancellation, we can **square each difference**:

$$
\text{Squared error} = (\hat{y} - y)^2
$$

The part inside the brackets is still **prediction minus observed value**. The new part is the square: multiply that difference by itself.

For errors of 2 and −2:

$$
2^2 = 4,\qquad (-2)^2 = 4
$$

Both contribute the same positive amount. If a prediction matches its observation, its squared error is zero.

Using our prediction of 3 and observed value of 2.45:

$$
(\hat{y} - y)^2 = (3 - 2.45)^2 = 0.55^2 = 0.3025
$$

On the graph, the vertical gap has a length of 0.55. **The squared error is that gap length squared**, which is 0.3025.

### Larger errors contribute more

Squaring also gives larger errors more weight:

- An error of 1 contributes $$1^2 = 1$$.
- An error of 3 contributes $$3^2 = 9$$.

The second error is three times as large, but contributes nine times as much to the cost.

So squaring does two useful things: it prevents positive and negative differences from cancelling, and it makes larger errors contribute more strongly.

### Writing the error for a specific example

We use $$i$$ to identify a particular training example. Adding this example number to our formula gives:

$$
\text{Squared error for example } i
=
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

Here:

- $$x^{(i)}$$ is that example's input.
- $$y^{(i)}$$ is its observed target.
- $$\hat{y}^{(i)}$$ is the model's prediction for that input.

Remember, $$i$$ is the example number, not the input value. In our current dataset, the point where $$x = 2$$ is the **fourth example**.

## See the errors for all the points

One gap tells us about one example. To judge the whole line, we need to look at every example.

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -3..3 step 0.1 = 1.2; b: -3..5 step 0.1 = 0.6"
     data-errors
     data-formula="w = {w} | b = {b}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"></div>

Each yellow segment shows the vertical gap between a prediction and its observed value. We square each gap length to calculate its contribution to the cost.

Move $$w$$ and $$b$$. Some gaps become smaller while others become larger.

Look at the unusually high point at $$(2.3, 5.5)$$. With $$w = 1.2$$ and $$b = 0.6$$, we calculate its prediction using the same rule:

$$
\hat{y} = 1.2 \times 2.3 + 0.6 = 3.36
$$

Its prediction is below the observed value of 5.5:

$$
\hat{y} - y = 3.36 - 5.5 = -2.14
$$

Squaring this difference gives:

$$
(\hat{y} - y)^2 = (-2.14)^2 = 4.5796
$$

Moving the line closer to this point could reduce its squared error, but might increase the errors for other points.

We need a way to consider all those errors together.

## Add up the squared errors

We can add every squared error to get the **total squared error**:

$$
\text{Total squared error}
=
\sum_{i=1}^{m}
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

The symbol $$\sum$$ means **sum**, or “add them all together.” Inside the sum is the same squared-error calculation we used for one example.

It tells us to:

1. Start with example $$i = 1$$.
2. Calculate its squared error.
3. Repeat for every example, up to $$m$$.
4. Add the squared errors together.

Here, $$m$$ is the number of training examples. Our graph has seven points, so $$m = 7$$.

With $$w = 1.2$$ and $$b = 0.6$$, the calculations are:

| Input | Observed value | Prediction | Prediction − observed | Squared error |
|---:|---:|---:|---:|---:|
| 0.5 | 2.15 | 1.20 | −0.95 | 0.9025 |
| 1 | 1.15 | 1.80 | 0.65 | 0.4225 |
| 1.5 | 2.95 | 2.40 | −0.55 | 0.3025 |
| 2 | 2.45 | 3.00 | 0.55 | 0.3025 |
| 2.3 | 5.50 | 3.36 | −2.14 | 4.5796 |
| 2.5 | 4.15 | 3.60 | −0.55 | 0.3025 |
| 3 | 3.65 | 4.20 | 0.55 | 0.3025 |

Adding the squared errors gives:

$$
0.9025 + 0.4225 + 0.3025 + 0.3025 + 4.5796 + 0.3025 + 0.3025
=
7.1146
$$

Notice how much the point at $$(2.3, 5.5)$$ contributes to this total. Its gap is larger than the others, and squaring makes that difference more pronounced.

## Find the average squared error

A total depends partly on how many examples we have. With thousands or millions of examples, adding all the squared errors can produce a large number.

Instead, we can calculate the **average squared error**.

We divide the total squared error by the number of examples:

$$
\text{Mean squared error}
=
\frac{1}{m}
\sum_{i=1}^{m}
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

The sum still adds all the squared errors. The new part, $$\frac{1}{m}$$, divides that total by the number of examples.

This is called **mean squared error**, or **MSE**. “Mean” simply means average.

For our current settings, the total is 7.1146 and we have seven examples:

$$
\text{MSE} = \frac{7.1146}{7} \approx 1.0164
$$

This is the average of the **squared differences**, not the average gap length and not a percentage.

If $$y$$ is measured in a particular unit, MSE is measured in that unit squared.

## What is the cost function?

We now have one number that measures how well a particular line fits all our training examples.

MSE can be used directly as a cost function. For our introduction to gradient descent, we will use a common version that is **half the MSE**, written as $$J(w,b)$$:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

The squared differences and their sum are unchanged. We now divide by $$2m$$ instead of $$m$$, so the result is half as large:

$$
J(w,b) = \frac{1}{2}\times\text{MSE}
$$

The extra factor of $$\frac{1}{2}$$ makes the derivative simpler when we study gradient descent. We will see how that works in 3.6 Gradient Descent.

It does **not** change which values of $$w$$ and $$b$$ give the smallest cost. Halving every candidate's cost keeps their order the same.

For our current parameters:

$$
J(1.2,0.6)
=
\frac{7.1146}{2\times7}
\approx 0.5082
$$

So $$J(w,b)$$ means **the cost for a particular choice of w and b**, using our fixed training dataset. Here, that cost is half the mean squared error.

### Put the model's formula inside the cost function

Remember, each prediction comes from our model. For training example $$i$$:

$$
\hat{y}^{(i)} = f_{w,b}(x^{(i)}) = wx^{(i)} + b
$$

These are three ways of describing the same prediction: its symbol, the function that produces it, and the calculation.

First, replace $$\hat{y}^{(i)}$$ in the cost function with $$f_{w,b}(x^{(i)})$$:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(f_{w,b}(x^{(i)}) - y^{(i)}\right)^2
$$

Now replace that function with its calculation, $$wx^{(i)} + b$$:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left((wx^{(i)} + b) - y^{(i)}\right)^2
$$

These are the same cost function, just written in different ways.

For each example, we calculate a prediction, subtract the observed value, and square the difference. Then we add those squared errors and divide by $$2m$$.

### What does the cost tell us?

For our fixed dataset, changing $$w$$ and $$b$$ changes the predictions, which changes the cost.

- **Smaller cost:** smaller squared errors on average.
- **Larger cost:** larger squared errors on average.

A cost of zero means every prediction matches its observed value exactly.

For scattered data like ours, a single straight line cannot pass through every point, so even the best-fitting line will have a cost above zero.

Squared error is one choice of cost function. Here, we used it to build the idea step by step.

## Finding the best w and b

We can now state our training goal:

> Find values of $$w$$ and $$b$$ that make the cost as small as possible.

Here, “best” means **the smallest cost for our chosen model and training dataset**. The line does not have to touch every point; it should fit the observations well overall according to our cost function.

So far, we have searched by moving sliders. How can a computer find suitable parameter values?

There are different approaches, including:

- **Gradient descent:** repeatedly adjusts parameters to reduce the cost.
- **Grid search:** tries combinations of parameter values and compares their costs.
- **Least-squares solvers:** calculate parameters that minimize the squared-error cost directly, without taking gradient-descent steps.

Next, **[3.4 Cost Surface]({{ "/machine-learning/linear-regression/cost-surface/" | relative_url }})** shows what this cost looks like for every $$w$$ and $$b$$. After that, 3.6 Gradient Descent explores how to find its lowest point, using the squared-error cost we built here.

## Remember

- $$w$$ changes the slope; $$b$$ shifts the line up or down.
- $$\hat{y}$$ is a prediction; $$y$$ is the observed value.
- **Prediction minus observed value** gives a signed difference.
- Squaring that difference prevents positive and negative errors from cancelling.
- Squaring also gives **larger errors more weight**.
- Adding the squared errors gives the **total squared error**.
- Dividing by $$m$$ gives the **mean squared error**, or **MSE**.
- Our cost $$J(w,b)$$ divides by $$2m$$, so it equals **half the MSE**.
- The extra factor of $$\frac{1}{2}$$ does not change which parameters minimize the cost.
- Training aims to find parameter values that **minimize the chosen cost**.
- A good fit describes the data's overall pattern; it does not require every prediction to match an observation exactly.