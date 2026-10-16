---
layout: default
title: Plotting Data on a Graph
parent: Supervised Learning
grand_parent: Machine Learning
nav_order: 4
---

# Plotting Data on a Graph

A graph helps us see how $$y$$ changes as $$x$$ changes.

If you are already familiar with graphs and plotting, you can skip to the next section. Otherwise, open the introduction below.

<details markdown="1">
<summary>Getting started with graphs and plotting</summary>

## 1. When y equals x

Our first rule is:

$$
y = x
$$

Whatever number we give as $$x$$, we get the same number as $$y$$.

| x | y |
|---:|---:|
| 0 | 0 |
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
| 4 | 4 |

**Click Run to see the graph.** The first run may take a little while to load Python.

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.array([0, 1, 2, 3, 4])

plt.figure(figsize=(6, 4))
plt.plot(x, x, color="blue", label="y = x")
plt.scatter(x, x, color="red", zorder=3, label="Table values")
plt.xlabel("x")
plt.ylabel("y")
plt.xticks(x)
plt.yticks(x)
plt.grid(alpha=0.3)
plt.legend()
plt.show()
```
{: .runnable}

### Reading the graph

The graph has two numbered directions:

- **Across the bottom**, we have $$x$$. This is the horizontal axis.
- **Up the side**, we have $$y$$. This is the vertical axis.

Each red dot represents one row from our table.

Let's take the **third data row**, where $$x = 2$$ and $$y = 2$$:

1. Start at $$(0, 0)$$, where both values are zero.
2. Since **x is 2**, move **2 units to the right**, stopping at 2 on the horizontal axis.
3. Since **y is 2**, move **2 units up** from there.
4. Put a dot at that spot.

That dot represents the pair $$(2, 2)$$.

We do the same for every row. Because $$y$$ always equals $$x$$, each step of 1 to the right comes with a step of 1 up. The dots line up along a **straight line**.

We also draw a line through the dots. Our rule works between the table values too: when $$x = 1.5$$, $$y = 1.5$$.

## 2. When y is double x

Now change the rule to:

$$
y = 2x
$$

This means **multiply the input by 2** to get the output.

| x | y |
|---:|---:|
| 0 | 0 |
| 1 | 2 |
| 2 | 4 |
| 3 | 6 |
| 4 | 8 |

**Click Run to see the graph.** Run the first example above before this one.

```python
plt.figure(figsize=(6, 4))
plt.plot(x, x, color="green", label="Previous: y = x")
plt.plot(x, 2 * x, color="blue", label="New: y = 2x")
plt.scatter(x, 2 * x, color="red", zorder=3, label="New table values")
plt.xlabel("x")
plt.ylabel("y")
plt.xticks(x)
plt.yticks(range(9))
plt.grid(alpha=0.3)
plt.legend()
plt.show()
```
{: .runnable}

The **green line** shows our previous rule, $$y = x$$. The **blue line and red dots** show the new rule, $$y = 2x$$.

Let's take the third data row again. This time, $$x = 2$$ and $$y = 4$$:

1. Start at $$(0, 0)$$.
2. Move **2 units right**, because $$x = 2$$.
3. Move **4 units up**, because $$y = 4$$.
4. Put a dot there.

For the same input of 2, the old rule gives us 2, while the new rule gives us 4. So the new dot sits higher.

Each time $$x$$ increases by 1, $$y$$ now increases by 2. This makes the new line **steeper** than the old one.

We call this rate of change the **slope**:

- For $$y = x$$, the slope is **1**.
- For $$y = 2x$$, the slope is **2**.

Both rules produce straight lines, so both are **linear**.

## 3. When y is x squared

Now try:

$$
y = x^2
$$

Squaring means **multiplying the input by itself**. For example, $$3^2 = 3 \times 3 = 9$$.

| x | y |
|---:|---:|
| 0 | 0 |
| 1 | 1 |
| 2 | 4 |
| 3 | 9 |
| 4 | 16 |

**Click Run to compare all three rules.** Run the first example above before this one.

```python
smooth_x = np.linspace(0, 4, 100)

plt.figure(figsize=(6, 4))
plt.plot(smooth_x, smooth_x, color="green", label="y = x")
plt.plot(smooth_x, 2 * smooth_x, color="blue", label="y = 2x")
plt.plot(smooth_x, smooth_x ** 2, color="orange", label="y = x²")
plt.scatter(x, x ** 2, color="red", zorder=3, label="New table values")
plt.xlabel("x")
plt.ylabel("y")
plt.xticks(x)
plt.yticks(range(0, 17, 2))
plt.grid(alpha=0.3)
plt.legend()
plt.show()
```
{: .runnable}

The **orange curve and red dots** show our new rule, $$y = x^2$$.

For example, the fourth data row has $$x = 3$$ and $$y = 9$$. We place its dot by moving **3 units right** from $$(0, 0)$$, then **9 units up**.

This time, the dots do not form a straight line.

Look at how much $$y$$ increases each time $$x$$ increases by 1:

- From 0 to 1: it increases by **1**.
- From 1 to 4: it increases by **3**.
- From 4 to 9: it increases by **5**.
- From 9 to 16: it increases by **7**.

The output grows by larger amounts, so the curve gets steeper as we move right. The rate of change is not constant. This relationship is **nonlinear**.

The code calculates extra points between our table values to draw the curve smoothly.

## Remember

- Each **dot** represents one pair of values: $$(x, y)$$.
- **x** tells us how far across to go; **y** tells us how far up to go in these examples.
- $$y = x$$ and $$y = 2x$$ produce **straight lines** with different slopes.
- $$y = x^2$$ means **multiply x by itself**, and produces a curve.
- Here, the lines and curve follow rules we already know. A table of arbitrary data points may not follow such a neat pattern.

</details>