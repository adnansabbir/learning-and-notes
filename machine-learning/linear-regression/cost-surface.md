---
layout: default
title: "3.4 Cost Surface"
description: "Explore the linear regression cost surface, connect it to prediction errors, and see its U-shaped slices and single lowest point."
parent: "3 Linear Regression"
grand_parent: Machine Learning
nav_order: 4
---

# 3.4 Cost Surface

## Quick summary

Our goal is to find values of $$w$$ and $$b$$ that make the cost as small as possible.

Before we see how a computer does that, let's picture how the cost changes across different pairs of $$w$$ and $$b$$. That picture is called the **cost surface**.

We will connect this surface to our model's predictions and see why a point that looks low is not necessarily the lowest.

If you haven't read the previous notes, or don't remember them clearly, open this quick refresher.

<details markdown="1">
<summary>Quick refresher: model functions and cost functions</summary>

## Our model makes predictions

A model uses a **function** to make predictions.

We write a function as $$f(x)$$. Here, $$f$$ is the function's name, and $$x$$ is the input we give it.

For linear regression with one input, our model uses:

$$
f_{w,b}(x) = wx + b
$$

This means: take the input $$x$$, multiply it by $$w$$, and add $$b$$.

The small $$w,b$$ below $$f$$ show which parameters the function uses.

The output is a **prediction**, so we call it $$\hat{y}$$, read as “y hat”:

$$
\hat{y} = f_{w,b}(x) = wx + b
$$

Remember the difference:

- $$y$$ is the actual observed value in our data.
- $$\hat{y}$$ is the model's predicted value.

The prediction may be close to the observed value, but it does not have to match it exactly.

## How close are our predictions to the data?

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -3..3 step 0.1 = 1.2; b: -3..5 step 0.1 = 0.6"
     data-errors
     data-formula="w = {w} | b = {b}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"></div>

The **red crosses** show the observed data. The **line** shows our model's predictions.

Each yellow segment is the **vertical gap** between an observed value and the prediction at the same input.

Move the $$w$$ and $$b$$ sliders. Changing these parameters moves the line, so the gaps become larger or smaller.

For one training example, the squared error is:

$$
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

Here, $$i$$ identifies the training example. Inside the brackets, we subtract the observed value from the prediction. Then we square that difference.

Squaring prevents positive and negative differences from cancelling when we add them. It also gives larger errors more weight.

The yellow segment shows the gap itself. **Its length squared** gives the squared error.

To find the **mean squared error**, or **MSE**, we add the squared errors for all examples and divide by the number of examples:

$$
\text{MSE}
=
\frac{1}{m}
\sum_{i=1}^{m}
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

The expression inside the sum is the squared error for one example. The symbol $$\sum$$ tells us to add those errors from example $$1$$ to example $$m$$, where $$m$$ is the total number of training examples.

Multiplying by $$\frac{1}{m}$$ gives us the average.

For our cost function, we use **half the MSE**:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(\hat{y}^{(i)} - y^{(i)}\right)^2
$$

The squared errors and their sum stay the same. Dividing by $$2m$$ instead of $$m$$ simply halves the result.

This extra factor of $$\frac{1}{2}$$ makes the derivative simpler later. It does not change which values of $$w$$ and $$b$$ give the smallest cost.

## A function that takes parameters and returns the cost

Our model function uses chosen parameters to turn an input into a prediction.

The cost function, $$J(w,b)$$, does a different job: it takes **the parameter values** $$w$$ and $$b$$ and returns **the cost of using them on our fixed training dataset**.

Changing the parameters changes the predictions, which changes the cost.

### Connect the cost function to the model function

For training example $$i$$, our model's prediction is:

$$
\hat{y}^{(i)}
=
f_{w,b}(x^{(i)})
=
wx^{(i)} + b
$$

Here, $$x^{(i)}$$ is that example's input. All three expressions describe the same predicted output.

So we can replace $$\hat{y}^{(i)}$$ in our cost formula with the function that produces it:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left(f_{w,b}(x^{(i)}) - y^{(i)}\right)^2
$$

The sum, squaring, and division by $$2m$$ have not changed. We have only written out where each prediction comes from.

Now replace $$f_{w,b}(x^{(i)})$$ with its calculation, $$wx^{(i)} + b$$:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left((wx^{(i)} + b) - y^{(i)}\right)^2
$$

This is still the same cost function.

For any chosen values of $$w$$ and $$b$$, it:

1. Calculates a prediction for each training input.
2. Subtracts the observed value from each prediction.
3. Squares each difference.
4. Adds those squared errors together.
5. Divides by $$2m$$ to return the cost.

So we have two functions with different jobs:

| Function | What we give it | What it returns |
|---|---|---|
| $$f_{w,b}(x)$$ | An input $$x$$, using chosen parameters $$w$$ and $$b$$ | A prediction $$\hat{y}$$ |
| $$J(w,b)$$ | Parameter values $$w$$ and $$b$$, using our fixed training dataset | The cost: half the MSE |

We want the parameter values that make $$J(w,b)$$ as small as possible. Using those values in our model gives us the line with the **smallest squared-error cost on our training dataset**.

Here, “best” means the best overall fit according to our chosen cost function. Every individual prediction does not have to match its observed value.

For more detail, see **[3.2 From Data to a Model Function]({{ "/machine-learning/linear-regression/from-data-to-a-model-function/" | relative_url }})** and **[3.3 Cost Function]({{ "/machine-learning/linear-regression/cost-function/" | relative_url }})**.

</details>

## See the cost as a landscape

We want to find values of $$w$$ and $$b$$ that make this cost as small as possible:

$$
J(w,b)
=
\frac{1}{2m}
\sum_{i=1}^{m}
\left((wx^{(i)} + b) - y^{(i)}\right)^2
$$

Here, $$w$$ and $$b$$ are the parameters we choose. The values of $$x^{(i)}$$ and $$y^{(i)}$$ come from our training dataset, and $$m$$ is the number of training examples.

For each example, we calculate a prediction, subtract its observed value, and square the difference. We add those squared errors and divide by $$2m$$.

Let's use the same dataset as before:

| Input: x | Observed value: y |
|---:|---:|
| 0.5 | 2.15 |
| 1 | 1.15 |
| 1.5 | 2.95 |
| 2 | 2.45 |
| 2.3 | 5.50 |
| 2.5 | 4.15 |
| 3 | 3.65 |

These seven examples stay fixed. We will try different values of $$w$$ and $$b$$ and see how the cost changes.

<div class="fn-plot"
     data-surface="w,b"
     data-fn="w * x + b"
     data-cost="half-mse"
     data-params="w: 0..2.5 step 0.1 = 1.2; b: -1..3 step 0.1 = 0.6"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-zlabel="Cost: J(w,b), half the MSE"
     data-formula="w = {w} | b = {b} | J(w,b) = {cost}"></div>

### What are we looking at?

Previously, our graph showed an input $$x$$ and a prediction $$\hat{y}$$.

This graph shows something different:

- One horizontal axis is $$w$$.
- The other horizontal axis is $$b$$.
- The vertical axis is the cost, $$J(w,b)$$.

The function has **two inputs and one output**, so we use three axes to display them together.

### One pair of parameters gives one height

Choose:

$$
w = 1.2,\qquad b = 0.6
$$

Using these parameters, we calculate predictions for **all seven training examples**. Then we calculate their squared errors, add them together, and divide by $$2m$$.

The total squared error for these parameters is 7.1146:

$$
J(1.2,0.6)
=
\frac{7.1146}{2\times7}
\approx 0.5082
$$

So this pair gives us one point on the graph:

$$
(w,b,J(w,b)) \approx (1.2,0.6,0.5082)
$$

We do not plot each training example separately here. **All seven examples contribute to this one cost value.**

Choose another pair of parameters, and we get another cost, giving us another point.

### Many parameter pairs form a surface

Imagine trying many combinations of $$w$$ and $$b$$.

Each pair has its own position across the two horizontal axes. Its cost determines its height.

Together, these points form a **cost surface**, which we can think of as a landscape:

- Higher places represent larger squared errors on average.
- Lower places represent smaller squared errors on average.

Rotate the graph and move the sliders to see where different parameter pairs sit.

The surface is smooth, but it can look like a long, shallow valley rather than a round cup. Let's look more closely before deciding where its lowest point is.

## A point can look low without being the lowest

Here is a wider range of the same surface, alongside the model's predictions.

<div class="fn-plot"
     data-surface="w,b"
     data-fn="w * x + b"
     data-cost="half-mse"
     data-params="w: -1..3 step 0.1 = 1.2; b: -3..5 step 0.1 = 0.6"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-zlabel="Cost: J(w,b), half the MSE"
     data-formula="w = {w} | b = {b} | J(w,b) = {cost}"
     data-linked-plot
     data-corners="A B C D"
     data-minimum
     data-presets="Try corner B: w=3, b=-3; Back to start: w=1.2, b=0.6"></div>

The dataset and cost formula have not changed. We are showing more combinations of $$w$$ and $$b$$ and connecting each selected pair to the line it produces.

The letters **A, B, C and D** mark the four corners of the floor beneath the surface. These are reference positions, not points on the surface itself.

From some viewing angles, the surface rises clearly above two opposite corners. Near the other two, it may look almost flat or close to the floor.

But **looking low on the screen does not mean having the lowest cost**. We need to compare heights using the cost axis and the calculated values.

### Try a corner that looks low

Tap **Try corner B**, which sets:

$$
w = 3,\qquad b = -3
$$

On the prediction graph, this gives the line:

$$
\hat{y} = 3x - 3
$$

Look at the first training example:

$$
x^{(1)} = 0.5,\qquad y^{(1)} = 2.15
$$

Our prediction is:

$$
\hat{y}^{(1)} = 3 \times 0.5 - 3 = -1.5
$$

The prediction is well below the observed value. Its squared error is:

$$
\left(\hat{y}^{(1)} - y^{(1)}\right)^2
=
(-1.5 - 2.15)^2
=
13.3225
$$

That is just one example's contribution. After calculating all seven squared errors and dividing their total by $$2m$$, we get:

$$
J(3,-3) \approx 1.8039
$$

Compare that with our original settings:

$$
J(1.2,0.6) \approx 0.5082
$$

So the surface point above corner B has a higher cost, even if the viewing angle makes it appear close to the bottom.

Move the sliders and watch both graphs. The surface shows **the overall cost**, while the prediction graph shows **the line and individual gaps that produce it**.

### There is one lowest point for this dataset

For our dataset and squared-error cost, there is **one pair of parameters** that gives the smallest cost.

The marked minimum is approximately:

$$
w \approx 1.143,\qquad b \approx 1.053,\qquad J(w,b) \approx 0.4464
$$

Neither the low-looking corners nor our original settings are the actual minimum.

The minimum is above zero because no single straight line passes through all seven observations.

The surface is easier to read if we change only one parameter at a time.

## Fix one parameter and you get a U

Hold $$b = 1$$ and change only $$w$$. The cost changes like this:

| w | Cost J(w, 1), rounded |
|---:|---:|
| −1 | 9.85 |
| 0 | 3.17 |
| 0.5 | 1.34 |
| 1 | **0.50** |
| 1.5 | 0.67 |
| 2 | 1.84 |
| 3 | 7.18 |

Going down the table, the cost is high, then low, then high again. That is a **U-shaped curve**.

With $$b$$ fixed, only $$w$$ changes, so we can draw it on a flat graph: $$w$$ across, cost up. The formula is the same; we have just put $$b = 1$$ into it.

<div class="fn-plot"
     data-fn="((x*0.5+b-2.15)**2+(x*1+b-1.15)**2+(x*1.5+b-2.95)**2+(x*2+b-2.45)**2+(x*2.3+b-5.5)**2+(x*2.5+b-4.15)**2+(x*3+b-3.65)**2) / 14"
     data-params="b: -3..5 step 0.1 = 1; w: -1..3 step 0.1 = -1"
     data-probe="w"
     data-probe-label="Current w"
     data-formula="b = {b} (fixed) | w = {w} | J(w,b) = {yhat}"
     data-x="-1..3" data-y="0..12"
     data-xlabel="w" data-ylabel="J(w,b)"></div>

Move $$w$$:

- **Far left:** the slope is too small or negative, so the predictions fit poorly and the cost is high.
- **Far right:** the slope is too large, so the predictions overshoot and the cost is high again.
- **In between:** there is one lowest point on this curve, at approximately $$w = 1.167$$.

Try a different fixed $$b$$ too. The U moves, but it stays a U with one lowest point.

That lowest point is the best $$w$$ **for that fixed b**, not necessarily the lowest point of the whole surface.

## The same works for b

Now hold $$w$$ fixed and change only $$b$$:

<div class="fn-plot"
     data-fn="((w*0.5+x-2.15)**2+(w*1+x-1.15)**2+(w*1.5+x-2.95)**2+(w*2+x-2.45)**2+(w*2.3+x-5.5)**2+(w*2.5+x-4.15)**2+(w*3+x-3.65)**2) / 14"
     data-params="w: -1..3 step 0.1 = 1.2; b: -3..5 step 0.1 = -3"
     data-probe="b"
     data-probe-label="Current b"
     data-formula="w = {w} (fixed) | b = {b} | J(w,b) = {yhat}"
     data-x="-3..5" data-y="0..12"
     data-xlabel="b" data-ylabel="J(w,b)"></div>

With $$w = 1.2$$, a $$b$$ that is too small pushes the whole line too far down, and one that is too large pushes it too far up. The lowest cost is in between, at approximately $$b \approx 0.949$$: the best $$b$$ **when w is fixed at 1.2**.

### How the slices connect to the surface

These flat graphs are **vertical slices through the same cost surface**. Every slice is a U.

The full surface rises steeply in some directions and gently in others. That is because changing $$w$$ and $$b$$ together can partly cancel out: increasing $$w$$ raises the predictions for our positive inputs, while decreasing $$b$$ shifts the line back down. Along that direction the cost rises slowly, which makes the surface look like a long valley, but **there is still only one lowest point**.

## Why there is only one lowest point

For our dataset, the surface has exactly **one** lowest point, even though it can look like a long, flat valley from some angles.

Why? It comes down to our inputs being spread out from 0.5 to 3. **[3.5 Cost Surface Math]({{ "/machine-learning/linear-regression/cost-surface-math/" | relative_url }})** shows this step by step, with graphs, and works out where the best line comes from.

## Look at it from above

A **contour map** shows the same cost from directly above, like a weather map that colours each area by its temperature. Here the colour is the cost: each ring joins points with the same cost, and the number on a ring is that cost.

<div class="fn-plot"
     data-contour="w,b"
     data-fn="w * x + b"
     data-cost="half-mse"
     data-params="w: -1..3 step 0.1 = 1.2; b: -1..4 step 0.1 = 0.6"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-formula="w = {w} | b = {b} | J(w,b) = {cost}"
     data-minimum></div>

- **Colour shows the cost:** blue means a small cost, red means a large one. The colour bar on the right gives the values.
- **Each ring joins every pair of $$w$$ and $$b$$ with the same cost.** The number on the ring is that cost. Move the red dot along a ring and the cost readout barely changes.
- The rings are **long, thin, tilted ovals**. That is the long valley from the 3D view: in one direction the cost changes quickly (rings close together), in the other it changes slowly (rings far apart).
- The green diamond is the **minimum**, inside the smallest ring.

## Finding that point

We now know what we are searching for: the parameter pair with the smallest cost.

Moving sliders lets us explore the surface ourselves. In **3.6 Gradient Descent**, we will see how a computer uses the slope of the cost surface to move toward that point, step by step.

## Remember

- The cost function turns a parameter pair into **one cost**, using all the training examples.
- Plotting many parameter pairs and their costs creates the **cost surface**.
- A point that looks low from one angle can still have a higher cost than another point. Compare the numbers.
- Holding one parameter fixed gives a **U-shaped cost curve** for the other. Its lowest point is the best value for that fixed parameter only.
- Every $$(w, b)$$ pair is a line. Because our inputs are spread out, exactly **one line** fits best, so the surface has **one lowest point**.
- A **contour map** shows the same surface from above: each ring joins points with the same cost.
- That smallest cost is above zero because one straight line cannot fit every observation exactly.
