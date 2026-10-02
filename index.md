---
layout: default
title: Home
nav_order: 1
---

# Learning & Notes

Personal technical learning journal. Command-first, short, rewarding to re-read.

<div class="card-grid">

  <a class="card" href="tryhackme/">
    <div class="card-emoji">🔐</div>
    <div class="card-title">TryHackMe</div>
    <div class="card-desc">Cyber Security 101 — Linux, Windows, networking, recon, defenses.</div>
  </a>

</div>

<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.card {
  display: block;
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  text-decoration: none !important;
  color: inherit !important;
  transition: box-shadow 0.15s, transform 0.15s;
  background: #fff;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  transform: translateY(-3px);
}
.card-emoji { font-size: 2rem; margin-bottom: 0.5rem; }
.card-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.35rem;
  color: #0969da;
}
.card-desc {
  font-size: 0.875rem;
  color: #57606a;
  line-height: 1.4;
}
</style>
