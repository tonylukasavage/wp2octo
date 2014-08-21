---
layout: post
title: "<%= title.replace(/"/g, '\\"') %>"
date: <%= date %>
comments: false
categories: [<%= categories.join(', ') %>]
published: false
---

<%= content %>