---
layout: default
title: Unsupervised Learning
parent: Machine Learning
nav_order: 2
---

# Unsupervised Learning

## Quick summary

- Finds patterns in data that has **no labels**.
- You give it inputs, but no right answers to learn from.
- Clustering is one kind: it groups examples with similar inputs.
- Classification learns from known groups. Clustering finds the groups itself.

## Start with classification

In supervised learning you give both inputs (x) and the right output (y), and the model learns to predict a number (regression) or a category (classification).

In the classification example, each patient has two inputs:

- **Age:** horizontal axis
- **Tumor size:** vertical axis

Each one also has a known class (benign, malignant type A or malignant type B), shown by the different markers.

![Classification: two input features and three known classes]({{ "/machine-learning/supervised-learning/fig-2-classification.png" | relative_url }})

So the model is learning: given age and tumor size, which class is it?

## Now take the labels away

Same points, but no diagnosis. Everything gets the same marker and color, so the model has no idea which ones are benign or malignant.

![Unsupervised learning: the same input points without class labels, grouped by similarity]({{ "/machine-learning/unsupervised-learning/fig-1-unsupervised.png" | relative_url }})

Instead of telling it the right group for each point, we ask:

**"Can you find groups of points that look alike?"**

A clustering algorithm looks at age and tumor size and puts similar points into clusters (the outlines in the figure).

Those outlines are clusters it found, not diagnoses. A cluster doesn't automatically mean "benign" or "type A", and it might not line up with the classes from the classification example at all.

## Why is this useful? A search engine example

Imagine a search engine that reads news and blog posts from lots of sites. It should group related articles, then write an up-to-date summary that links back to the sources.

Say it finds these (made-up) headlines:

| Source | Headline |
| --- | --- |
| News site A | Companies automate customer support with AI |
| Tech blog B | Will AI replace customer service jobs? |
| News site C | Workers retrain as AI changes office roles |
| Research blog D | AI may change tasks rather than eliminate entire jobs |
| News site E | A new electric car offers longer battery range |

The first four are all about AI and jobs, even though the wording and opinions differ. The car one is about something else.

Nobody tells the system which group each article belongs to. It turns each article into numbers that capture what it's about, then clusters the ones that end up close together.

![Clustering related articles about AI and jobs from different sources]({{ "/machine-learning/unsupervised-learning/fig-2-unsupervised-news.png" | relative_url }})

It can find the "AI and jobs" group without ever being told that category exists. We can give the group a name afterwards so it makes sense to readers.

### From related articles to a summary

1. **Collect** articles from different sources.
2. **Cluster** the ones about the same topic.
3. **Summarize** each group: what they agree on, where they differ, with links.
4. **Update** the summary as new articles come in.

Clustering only figures out which articles go together. Writing the summary is a separate step, and the articles in a group won't necessarily agree with each other.

Why bother: readers get several sources on the same story in one place, even when they're worded differently. And the output is just a group of similar articles, not a class someone defined up front.

## Another example: grouping listeners by music taste

Imagine a music app with 1,000 listeners. For each one it tracks which songs they play, skip and replay.

Nobody gets labeled "rock fan" or "jazz fan". A clustering algorithm just groups people who listen in similar ways.

![Clustering listeners with similar music preferences]({{ "/machine-learning/unsupervised-learning/fig-3-unsupervised-music.png" | relative_url }})

Looking at the groups afterwards, we might see:

| Group | What we notice afterwards |
| --- | --- |
| Group 1 | Mostly energetic rock |
| Group 2 | Mostly calm acoustic songs |
| Group 3 | A mix of jazz and instrumental |

Those descriptions come **after** clustering. The model was never given them as labels.

The app can then recommend songs that people in the same group like. You might find a song you've never played because others in your group keep replaying it.

**Listening habits → groups → figure out what each group likes → recommend songs**

Unlike the two-axis chart, this can use tons of input features: play counts, skip rates, replays across lots of songs.

## How clustering works

1. Give it examples with input features and no labels.
2. It groups examples that are similar on those features.
3. You look at the clusters and figure out what they mean.

Which features you pick, how they're scaled and which algorithm you use all change the groups you get. Some algorithms also need you to say how many clusters you want.

## Classification vs. clustering

| | Classification | Clustering |
| --- | --- | --- |
| Learning type | Supervised | Unsupervised |
| Training data | Inputs + known labels | Inputs only |
| Goal | Predict a class that already exists | Find groups of similar examples |
| What a group means | Set by the labels | You work it out afterwards |

## Remember

- **Unlabeled** = no right answer given for each training example.
- You still get results (like clusters) even without labels.
- Clustering is just one type of unsupervised learning. Dimensionality reduction is another.
- **Supervised = learn from known answers.**
- **Unsupervised = find structure with no answers given.**
