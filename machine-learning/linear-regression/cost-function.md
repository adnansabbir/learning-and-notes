---
layout: default
title: "3.3 Cost Function"
parent: "3 Linear Regression"
grand_parent: Machine Learning
nav_order: 3
---

# 3.3 Cost Function

## Quick summary

Let's explore how changing $$w$$ and $$b$$ changes our predictions, then build a way to measure how well those predictions fit the data.

Our goal is to find parameter values that make this error as small as possible.

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

For now, we only want to know **how far apart the two values are**, regardless of which one is higher. We use the **absolute value**:

$$
\text{Absolute error} = |\hat{y} - y|
$$

The vertical bars mean “take the absolute value.” Both $$|0.55|$$ and $$|-0.55|$$ give us 0.55.

Using our prediction of 3 and observed value of 2.45:

$$
|\hat{y} - y| = |3 - 2.45| = 0.55
$$

On the graph, this is the length of the **vertical gap** between the observed point and the prediction at the same input.

If the prediction matches the observation, the error is zero.

### Writing the error for a specific example

We use $$i$$ to identify a particular training example. Adding this example number to our formula gives:

$$
\text{Absolute error for example } i
=
\left|\hat{y}^{(i)} - y^{(i)}\right|
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
     data-formula="Total absolute error = {total} | m = {m} | MAE = {mean}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"></div>

Each yellow segment shows the absolute error for one training example.

Move $$w$$ and $$b$$. Some gaps become smaller while others become larger.

Look at the unusually high point at $$(2.3, 5.5)$$. With $$w = 1.2$$ and $$b = 0.6$$, we calculate its prediction using the same rule:

$$
\hat{y} = 1.2 \times 2.3 + 0.6 = 3.36
$$

Its absolute error is the gap between this prediction and the observed value of 5.5:

$$
|3.36 - 5.5| = 2.14
$$

Moving the line closer to this point could reduce its error, but might increase the errors for other points.

We need a way to consider all those errors together.

## Add up the errors

We can add every absolute error to get the **total absolute error**:

$$
\text{Total absolute error}
=
\sum_{i=1}^{m}
\left|\hat{y}^{(i)} - y^{(i)}\right|
$$

The symbol $$\sum$$ means **sum**, or “add them all together.” Inside the sum is the same absolute-error calculation we used for one example.

It tells us to:

1. Start with example $$i = 1$$.
2. Calculate its absolute error.
3. Repeat for every example, up to $$m$$.
4. Add the errors together.

Here, $$m$$ is the number of training examples. Our graph has seven points, so $$m = 7$$.

With $$w = 1.2$$ and $$b = 0.6$$, the errors are:

| Input | Observed value | Prediction | Absolute error |
|---:|---:|---:|---:|
| 0.5 | 2.15 | 1.20 | 0.95 |
| 1 | 1.15 | 1.80 | 0.65 |
| 1.5 | 2.95 | 2.40 | 0.55 |
| 2 | 2.45 | 3.00 | 0.55 |
| 2.3 | 5.50 | 3.36 | 2.14 |
| 2.5 | 4.15 | 3.60 | 0.55 |
| 3 | 3.65 | 4.20 | 0.55 |

Adding the absolute errors gives:

$$
0.95 + 0.65 + 0.55 + 0.55 + 2.14 + 0.55 + 0.55 = 5.94
$$

As you move the sliders, watch how the individual errors and their total change.

## Find the average error

A total depends partly on how many examples we have. With thousands or millions of examples, adding all the errors can produce a large number.

Instead, we can ask:

> On average, how far is each prediction from its observed value?

We divide the total absolute error by the number of examples:

$$
\text{Mean absolute error}
=
\frac{1}{m}
\sum_{i=1}^{m}
\left|\hat{y}^{(i)} - y^{(i)}\right|
$$

The sum still adds all the absolute errors. The new part, $$\frac{1}{m}$$, divides that total by the number of examples.

This is called **mean absolute error**, or **MAE**. “Mean” simply means average.

For our current settings, the total is 5.94 and we have seven examples:

$$
\text{MAE} = \frac{5.94}{7} \approx 0.85
$$

So the predictions differ from the observed values by approximately **0.85 units on average**.

This is an average error in the same units as $$y$$, not a percentage.

## What is the cost function?

We now have one number that measures how well a particular line fits all our training examples.

We can use this mean absolute error as a **cost function**, written as $$J(w,b)$$:

$$
J(w,b)
=
\frac{1}{m}
\sum_{i=1}^{m}
\left|\hat{y}^{(i)} - y^{(i)}\right|
$$

The calculation has not changed. We have given it a name: $$J(w,b)$$ means **the cost for a particular choice of w and b**, using our fixed training dataset.

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
\frac{1}{m}
\sum_{i=1}^{m}
\left|f_{w,b}(x^{(i)}) - y^{(i)}\right|
$$

Now replace that function with its calculation, $$wx^{(i)} + b$$:

$$
J(w,b)
=
\frac{1}{m}
\sum_{i=1}^{m}
\left|(wx^{(i)} + b) - y^{(i)}\right|
$$

These are the same cost function, just written in different ways.

For each example, we calculate a prediction, compare it with the observed value, and take the absolute error. Then we average those errors.

### What does the cost tell us?

For our fixed dataset, changing $$w$$ and $$b$$ changes the predictions, which changes the cost.

- **Smaller cost:** smaller absolute errors on average.
- **Larger cost:** larger absolute errors on average.

MAE is one choice of cost function. Here, we used it to build the idea step by step.

## Finding the best w and b

We can now state our training goal:

> Find values of $$w$$ and $$b$$ that make the cost as small as possible.

Here, “best” means **the smallest cost for our chosen model and training dataset**. The line does not have to touch every point; it should fit the observations well overall according to our cost function.

So far, we have searched by moving sliders. How can a computer find suitable parameter values?

There are different approaches, including:

- **Gradient descent:** repeatedly adjusts parameters to reduce the cost.
- **Grid search:** tries combinations of parameter values and compares their costs.
- **Linear programming:** can be used to find parameters that minimize the absolute-error cost we built here.

We will explore **gradient descent** in the next note. We will introduce it using a **squared-error cost**, which gives us a smooth function to work with. The goal stays the same: adjust the parameters to reduce the chosen cost.

## Remember

- **w** changes the slope; **b** shifts the line up or down.
- **Absolute error** measures the vertical gap between a prediction and its observed value.
- We calculate an error for **each training example**.
- Adding those errors gives the **total absolute error**.
- Dividing by $$m$$ gives the **mean absolute error**.
- **J(w,b)** names the cost for a particular choice of parameters.
- Training aims to find parameter values that **minimize the chosen cost**.
- A good fit describes the data's overall pattern; it does not require every prediction to match an observation exactly.