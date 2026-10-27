---
layout: default
title: "3.5 Cost Surface Math"
description: "Why the linear regression cost surface has exactly one lowest point: dots and lines first, then measuring input spread and deriving the best line's slope and intercept."
parent: "3 Linear Regression"
grand_parent: Machine Learning
nav_order: 5
---

# 3.5 Cost Surface Math

## Quick summary

In **[3.4 Cost Surface]({{ "/machine-learning/linear-regression/cost-surface/" | relative_url }})**, we saw that our cost surface has one lowest point. This note shows **why**: first with pictures (dots and lines), then with a little maths that measures how spread out the inputs are and works out the best line directly.

Our seven training examples, as before:

| Input: x | Observed value: y |
|---:|---:|
| 0.5 | 2.15 |
| 1 | 1.15 |
| 1.5 | 2.95 |
| 2 | 2.45 |
| 2.3 | 5.50 |
| 2.5 | 4.15 |
| 3 | 3.65 |

## Why there is only one lowest point

Remember that every pair of $$w$$ and $$b$$ is **one straight line**. So "one lowest point" means "**one best line**". Let's see why our data has exactly one.

**One dot: endless perfect lines.** Say our data had only one point: $$x = 2$$, $$y = 2.45$$.

Whatever $$w$$ we pick, we can choose a $$b$$ that makes the line pass right through that dot: $$b = 2.45 - 2w$$. Move the slider below. Each position is a different pair of $$w$$ and $$b$$, and each pair draws a different line, but every one of them passes through the dot.

<div class="fn-plot"
     data-fn="w * x + (2.45 - 2 * w)"
     data-params="w: -2..3 step 0.1 = 1.2"
     data-errors
     data-formula="w = {w} | b = {=2.45 - 2*w} | ŷ at x = 2: {=2*w + 2.45 - 2*w}"
     data-points="2,2.45"
     data-x="0..3.5" data-y="-4..8"></div>

The error stays at **0** however you move it. For example, all of these fit the dot perfectly:

| w | b | Line |
|---:|---:|---|
| 1.2 | 0.05 | $$\hat{y} = 1.2x + 0.05$$ |
| 0 | 2.45 | $$\hat{y} = 0x + 2.45$$ (flat) |
| 2 | −1.55 | $$\hat{y} = 2x - 1.55$$ |

…and endlessly many more. With one dot there is no single best line. On the cost surface, that would look like a valley with a long, flat floor instead of one lowest point.

**Two dots at different x: one perfect line.** Now add a second point with a different input: $$x = 0.5$$, $$y = 2.15$$.

Try to find a line that passes through **both** dots. Most lines miss at least one of them, so the error is above zero.

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -2..3 step 0.1 = 1.2; b: -3..5 step 0.05 = 0.6"
     data-errors
     data-formula="w = {=w} | b = {=b}"
     data-points="0.5,2.15 2,2.45"
     data-x="0..3.5" data-y="-4..8"
     data-presets="Show the perfect line: w=0.2, b=2.05; Back to start: w=1.2, b=0.6"></div>

Only **one** line goes through both: $$\hat{y} = 0.2x + 2.05$$, with $$w = 0.2$$ and $$b = 2.05$$. Tap **Show the perfect line** and the error drops to exactly 0. Change either slider even a little and one of the dots is missed again.

So two dots at different inputs pin down a single best pair of $$w$$ and $$b$$.

**Our seven dots: one best line.** Here is our full dataset again:

<div class="fn-plot"
     data-fn="w * x + b"
     data-params="w: -2..3 step 0.1 = 1.2; b: -3..5 step 0.1 = 0.6"
     data-errors
     data-formula="w = {=w} | b = {=b}"
     data-points="0.5,2.15 1,1.15 1.5,2.95 2,2.45 2.3,5.5 2.5,4.15 3,3.65"
     data-x="0..3.5" data-y="-2..6"
     data-presets="Show the best line: w=1.142879, b=1.053021; Back to start: w=1.2, b=0.6"></div>

No straight line passes through all seven dots, so some yellow gaps always remain and the cost never reaches 0. But exactly **one** line makes the cost as small as possible. Tap **Show the best line**: $$J(w,b)$$ drops to about 0.4464, and no other pair of $$w$$ and $$b$$ does better. That line is the single lowest point on the surface.

**When it would break:** imagine every dot had the same $$x$$, all stacked in one vertical column above $$x = 2$$:

<div class="fn-plot"
     data-fn="w * x + (2.45 - 2 * w)"
     data-params="w: -2..3 step 0.1 = 1.2"
     data-errors
     data-formula="w = {w} | b = {=2.45 - 2*w}"
     data-points="2,1.6 2,2.45 2,3.3"
     data-x="0..3.5" data-y="-4..8"></div>

Move the slider to tilt the line around that column, steeper or flatter. Its prediction at $$x = 2$$ never changes, so the gaps never change either, and the cost stays at $$J = 0.2408$$ for every tilt. That is also the smallest cost these three dots allow, so **all of these lines tie for best**. There is no single lowest point, just a flat-floored valley on the cost surface.

Our inputs are spread out from 0.5 to 3, so that cannot happen here.

## Putting a number on the spread

We said one best line needs the inputs to be **spread out**. Here is how to measure that, using the same trick we used for errors.

### 1. Find the average input

Our seven inputs add up to 12.8:

$$
\bar{x} = \frac{12.8}{7} \approx 1.8286
$$

($$\bar{x}$$, read "x bar", means the average of $$x$$.)

### 2. Measure how far each input is from the average, and square it

Just like squared errors, squaring stops the inputs below the average from cancelling out the ones above it:

| x | Distance from average, $$x - \bar{x}$$ | Squared |
|---:|---:|---:|
| 0.5 | −1.3286 | 1.7651 |
| 1 | −0.8286 | 0.6865 |
| 1.5 | −0.3286 | 0.1080 |
| 2 | 0.1714 | 0.0294 |
| 2.3 | 0.4714 | 0.2222 |
| 2.5 | 0.6714 | 0.4508 |
| 3 | 1.1714 | 1.3722 |

### 3. Add them up

That gives the total spread:

$$
\sum \left(x - \bar{x}\right)^2 \approx 4.634
$$

If every input were the same, every distance would be 0, so this total would be 0. Any spread at all makes it bigger than 0.

### 4. Where the formula comes from

Working out every distance from the average is slow. Let's rearrange the total spread so it only needs two sums we can get straight from the data: $$\sum x = 12.8$$ and $$\sum x^2 = 28.04$$ (each input squared, then added).

First, expand one squared distance. It works like $$(a - b)^2 = a^2 - 2ab + b^2$$:

$$
\left(x - \bar{x}\right)^2 = x^2 - 2\bar{x}x + \bar{x}^2
$$

Now add that up for all seven inputs. The $$\bar{x}^2$$ part is the same every time, so it gets added 7 times:

$$
\sum \left(x - \bar{x}\right)^2 = \sum x^2 - 2\bar{x}\sum x + 7\bar{x}^2
$$

Check with our numbers: $$28.04 - 46.8114 + 23.4057 = 4.6343$$. Same total as the table.

The middle part simplifies. The sum of the inputs is 7 times their average ($$\sum x = 7\bar{x}$$), so $$2\bar{x}\sum x = 2 \times 7\bar{x}^2$$, exactly twice the last part. Twice minus once leaves minus once:

$$
\sum \left(x - \bar{x}\right)^2 = \sum x^2 - 7\bar{x}^2
$$

$$
= 28.04 - 23.4057 = 4.6343
$$

Last, write $$7\bar{x}^2$$ without the average. Since $$\bar{x} = \frac{\sum x}{7}$$, we get $$7\bar{x}^2 = \frac{\left(\sum x\right)^2}{7} = \frac{163.84}{7} = 23.4057$$. Using $$m$$ for the number of examples:

$$
\sum \left(x - \bar{x}\right)^2 = \sum x^2 - \frac{\left(\sum x\right)^2}{m}
$$

Multiplying both sides by $$m$$ removes the fraction:

$$
m\sum \left(x - \bar{x}\right)^2 = m\sum x^2 - \left(\sum x\right)^2
$$

So the formula is just **$$m$$ times the total spread**. With our numbers:

$$
m\sum x^2 - \left(\sum x\right)^2 = 7 \times 28.04 - 12.8^2
$$

$$
= 196.28 - 163.84 = 32.44
$$

and from the table, $$7 \times 4.634 \approx 32.44$$. Same number, two routes.

### 5. Why the spread decides whether there is one best line

Now let's see where the best line actually comes from. This is where $$y$$ comes in.

*The best line passes through the middle of the data.* The middle is the point (average $$x$$, average $$y$$). Our seven outputs add up to 22, so:

$$
\bar{x} \approx 1.8286,\qquad \bar{y} = \frac{22}{7} \approx 3.1429
$$

If a line sat above this middle point, its predictions would be too high on average, and shifting it down (changing $$b$$) would lower the cost. If it sat below, shifting it up would. So the best line goes right through $$(\bar{x}, \bar{y})$$.

*Its slope is "how y moves with x" divided by "how spread out x is".* For each dot, multiply how far it is to the right of the middle ($$x - \bar{x}$$) by how far it is above the middle ($$y - \bar{y}$$). The product is positive when a dot is right-and-above or left-and-below the middle, which are the dots that suggest a rising line:

| x | y | $$x - \bar{x}$$ | $$y - \bar{y}$$ | Product |
|---:|---:|---:|---:|---:|
| 0.5 | 2.15 | −1.33 | −0.99 | 1.32 |
| 1 | 1.15 | −0.83 | −1.99 | 1.65 |
| 1.5 | 2.95 | −0.33 | −0.19 | 0.06 |
| 2 | 2.45 | 0.17 | −0.69 | −0.12 |
| 2.3 | 5.50 | 0.47 | 2.36 | 1.11 |
| 2.5 | 4.15 | 0.67 | 1.01 | 0.68 |
| 3 | 3.65 | 1.17 | 0.51 | 0.59 |

(Rounded to 2 decimals.) These add up to about 5.2964: how strongly $$y$$ rises as $$x$$ rises. Dividing by the spread of $$x$$ (4.6343, from step 3) turns that into "rise per one step of $$x$$", which is the slope:

$$
w = \frac{\sum \left(x - \bar{x}\right)\left(y - \bar{y}\right)}{\sum \left(x - \bar{x}\right)^2} = \frac{5.2964}{4.6343} \approx 1.1429
$$

Then the line through the middle point with that slope has $$b = \bar{y} - w\bar{x} \approx 3.1429 - 1.1429 \times 1.8286 \approx 1.0530$$. That is exactly the minimum we marked on the surface: $$w \approx 1.143$$, $$b \approx 1.053$$.

*Why the spread matters.* The spread is on the **bottom** of the slope's fraction. If every input were the same, every $$x - \bar{x}$$ would be 0, so the top and the bottom would both be 0. $$\frac{0}{0}$$ has no single answer: you cannot measure how much $$y$$ rises per step of $$x$$ if $$x$$ never moves. Any slope through the middle point does equally well, which is exactly the tied lines in the stacked-column graph.

Our spread is 4.6343, not 0 (that is the 32.44 from step 4, divided by $$m$$), so the fraction gives one slope, one line, and one lowest point.

## Remember

- The **spread** of the inputs is the sum of their squared distances from the average, $$\sum (x - \bar{x})^2$$. For our data it is about 4.634.
- $$m\sum x^2 - \left(\sum x\right)^2$$ is the same thing multiplied by $$m$$ (32.44 here). It only needs two sums from the data.
- The best line passes through the middle point $$(\bar{x}, \bar{y})$$.
- Its slope is "how $$y$$ moves with $$x$$" divided by the spread of $$x$$.
- If the spread is 0, the slope has no single answer, so many lines tie. A spread above 0 gives one best line.

## Next

In **3.6 Gradient Descent**, we will see how a computer finds this lowest point step by step, without solving the formula directly.
