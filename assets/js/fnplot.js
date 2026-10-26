/*
  Interactive function plots with sliders.

  In a note:
    <div class="fn-plot"
         data-fn="w * x + b"
         data-params="w: -3..3 step 0.1 = 1; b: -2..5 step 0.1 = 0"
         data-formula="ŷ = {w}x + {b}"
         data-points="0.5,2 1,1 1.5,2.8"
         data-x="0..3.5" data-y="-2..6"></div>

  data-fn       JavaScript expression using x and the param names (x ** 2, Math.sin(x) work)
  data-params   name: min..max step S = start, separated by ;
  data-formula  optional text shown above the graph, {name} is replaced by the value.
                Use | to split it into parts that wrap separately on narrow screens.
  data-points   optional fixed data points "x,y x,y ...", drawn as red crosses
  data-x/data-y axis ranges, these never change while sliders move
  data-xlabel / data-ylabel  axis labels (default x and y)
  data-probe    optional name of a slider that picks an input x (e.g. "x"). It isn't passed
                to data-fn; instead a dotted guide and a circle mark the prediction at that x,
                and {yhat} in data-formula shows the predicted value.
  data-errors   optional, no value needed. Draws a dotted line from every data point to the
                model's prediction at the same x, labelled with its absolute error.
                data-formula can then use {total} (sum of absolute errors), {mean} (total / m)
                and {m} (number of points). Totals use full precision, labels are rounded.

  The three variants are just attributes on the same div, and can be combined:
    sliders only -> no extra attribute
    pick an x    -> data-probe="x"
    show errors  -> data-errors
*/
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var W = 600, H = 400;
  var PAD = { left: 48, right: 16, top: 16, bottom: 44 };

  function range(text, fallback) {
    var m = /(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)/.exec(text || '');
    return m ? [parseFloat(m[1]), parseFloat(m[2])] : fallback;
  }

  function parseParams(text) {
    return (text || '').split(';').map(function (part) {
      var m = /^\s*([A-Za-z_]\w*)\s*:\s*(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)(?:\s*step\s*([\d.]+))?(?:\s*=\s*(-?[\d.]+))?\s*$/.exec(part);
      if (!m) return null;
      var min = parseFloat(m[2]), max = parseFloat(m[3]);
      var step = m[4] ? parseFloat(m[4]) : (max - min) / 100;
      var start = m[5] !== undefined ? parseFloat(m[5]) : (min + max) / 2;
      var decimals = (String(step).split('.')[1] || '').length;
      return { name: m[1], min: min, max: max, step: step, value: start, decimals: decimals };
    }).filter(Boolean);
  }

  function parsePoints(text) {
    return (text || '').trim().split(/\s+/).filter(Boolean).map(function (pair) {
      var xy = pair.split(',');
      return [parseFloat(xy[0]), parseFloat(xy[1])];
    }).filter(function (p) { return !isNaN(p[0]) && !isNaN(p[1]); });
  }

  function niceStep(span) {
    var raw = span / 8, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    var n = raw / mag;
    return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
  }

  function el(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function fmt(value, decimals) {
    var s = value.toFixed(decimals);
    return s === '-' + (0).toFixed(decimals) ? (0).toFixed(decimals) : s;
  }

  function build(box, index) {
    var params = parseParams(box.dataset.params);
    var probeName = box.dataset.probe;
    var probe = params.filter(function (p) { return p.name === probeName; })[0];
    var fnParams = params.filter(function (p) { return p !== probe; });
    var names = fnParams.map(function (p) { return p.name; });
    var fn;
    try {
      fn = new Function(['x'].concat(names).join(','), 'with (Math) { return (' + box.dataset.fn + '); }');
    } catch (e) {
      box.textContent = 'fn-plot: bad formula in data-fn (' + e.message + ')';
      return;
    }
    var xr = range(box.dataset.x, [-5, 5]);
    var yr = range(box.dataset.y, [-5, 5]);
    var points = parsePoints(box.dataset.points);

    function sx(x) { return PAD.left + (x - xr[0]) / (xr[1] - xr[0]) * (W - PAD.left - PAD.right); }
    function sy(y) { return H - PAD.bottom - (y - yr[0]) / (yr[1] - yr[0]) * (H - PAD.top - PAD.bottom); }

    box.innerHTML = '';
    var formula = document.createElement('div');
    formula.className = 'fn-plot-formula';
    if (box.dataset.formula) box.appendChild(formula);

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'fn-plot-svg', role: 'img', 'aria-label': 'Interactive graph' }, box);
    var clipId = 'fn-plot-clip-' + index;
    var clip = el('clipPath', { id: clipId }, el('defs', {}, svg));
    el('rect', { x: PAD.left, y: PAD.top, width: W - PAD.left - PAD.right, height: H - PAD.top - PAD.bottom }, clip);

    /* Grid, ticks and axes. These never move. */
    var grid = el('g', { class: 'fn-plot-grid' }, svg);
    var xs = niceStep(xr[1] - xr[0]), ys = niceStep(yr[1] - yr[0]);
    var t, label;
    for (t = Math.ceil(xr[0] / xs) * xs; t <= xr[1] + 1e-9; t += xs) {
      el('line', { x1: sx(t), x2: sx(t), y1: PAD.top, y2: H - PAD.bottom }, grid);
      label = el('text', { x: sx(t), y: H - PAD.bottom + 18, 'text-anchor': 'middle', class: 'fn-plot-tick' }, svg);
      label.textContent = +t.toFixed(6);
    }
    for (t = Math.ceil(yr[0] / ys) * ys; t <= yr[1] + 1e-9; t += ys) {
      el('line', { x1: PAD.left, x2: W - PAD.right, y1: sy(t), y2: sy(t) }, grid);
      label = el('text', { x: PAD.left - 8, y: sy(t) + 4, 'text-anchor': 'end', class: 'fn-plot-tick' }, svg);
      label.textContent = +t.toFixed(6);
    }
    var axes = el('g', { class: 'fn-plot-axis' }, svg);
    if (yr[0] <= 0 && yr[1] >= 0) el('line', { x1: PAD.left, x2: W - PAD.right, y1: sy(0), y2: sy(0) }, axes);
    if (xr[0] <= 0 && xr[1] >= 0) el('line', { x1: sx(0), x2: sx(0), y1: PAD.top, y2: H - PAD.bottom }, axes);
    el('rect', { x: PAD.left, y: PAD.top, width: W - PAD.left - PAD.right, height: H - PAD.top - PAD.bottom, class: 'fn-plot-frame' }, svg);

    label = el('text', { x: (PAD.left + W - PAD.right) / 2, y: H - 6, 'text-anchor': 'middle', class: 'fn-plot-label' }, svg);
    label.textContent = box.dataset.xlabel || 'x';
    label = el('text', { x: 14, y: (PAD.top + H - PAD.bottom) / 2, 'text-anchor': 'middle', class: 'fn-plot-label',
      transform: 'rotate(-90 14 ' + (PAD.top + H - PAD.bottom) / 2 + ')' }, svg);
    label.textContent = box.dataset.ylabel || 'y';

    var curve = el('path', { class: 'fn-plot-line', 'clip-path': 'url(#' + clipId + ')' }, svg);

    /* Optional error gaps: one dotted segment + label per data point. */
    var showErrors = box.hasAttribute('data-errors');
    var gaps = [];
    if (showErrors) {
      var gapLayer = el('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);
      points.forEach(function () {
        gaps.push({
          line: el('line', { class: 'fn-plot-guide' }, gapLayer),
          label: el('text', { class: 'fn-plot-error-label' }, gapLayer)
        });
      });
    }

    /* Optional probe: guide from the x-axis up to the prediction, plus a labelled circle. */
    var guide, marker, markerLabel;
    if (probe) {
      var probeLayer = el('g', { 'clip-path': 'url(#' + clipId + ')' }, svg);
      guide = el('line', { class: 'fn-plot-guide' }, probeLayer);
      marker = el('circle', { r: 5, class: 'fn-plot-marker' }, probeLayer);
      markerLabel = el('text', { class: 'fn-plot-marker-label' }, probeLayer);
      markerLabel.textContent = 'Prediction';
    }

    /* Fixed data points as red crosses. */
    var dots = el('g', { class: 'fn-plot-points' }, svg);
    points.forEach(function (p) {
      var cx = sx(p[0]), cy = sy(p[1]), r = 6;
      el('path', { d: 'M' + (cx - r) + ' ' + (cy - r) + 'L' + (cx + r) + ' ' + (cy + r) + 'M' + (cx - r) + ' ' + (cy + r) + 'L' + (cx + r) + ' ' + (cy - r) }, dots);
    });

    /* Sliders. */
    var controls = document.createElement('div');
    controls.className = 'fn-plot-controls';
    box.appendChild(controls);
    params.forEach(function (p) {
      var row = document.createElement('label');
      row.className = 'fn-plot-slider';
      var name = document.createElement('span');
      name.className = 'fn-plot-name';
      var input = document.createElement('input');
      input.type = 'range';
      input.min = p.min; input.max = p.max; input.step = p.step; input.value = p.value;
      input.setAttribute('aria-label', p.name);
      row.appendChild(name);
      row.appendChild(input);
      controls.appendChild(row);
      p.output = name;
      input.addEventListener('input', function () { p.value = parseFloat(input.value); draw(); });
    });

    function draw() {
      var values = fnParams.map(function (p) { return p.value; });
      var yhat = probe ? fn.apply(null, [probe.value].concat(values)) : NaN;
      var d = '', n = 240, penDown = false;
      for (var i = 0; i <= n; i++) {
        var x = xr[0] + (xr[1] - xr[0]) * i / n;
        var y = fn.apply(null, [x].concat(values));
        if (!isFinite(y)) { penDown = false; continue; }
        var py = Math.max(-H, Math.min(2 * H, sy(y)));
        d += (penDown ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + py.toFixed(1);
        penDown = true;
      }
      curve.setAttribute('d', d);
      var total = 0;
      if (showErrors) {
        points.forEach(function (pt, i) {
          var pred = fn.apply(null, [pt[0]].concat(values));
          var err = Math.abs(pred - pt[1]);
          total += err;
          var gx = sx(pt[0]), gy1 = sy(pt[1]);
          var gy2 = Math.max(-H, Math.min(2 * H, sy(pred)));
          var g = gaps[i];
          g.line.setAttribute('x1', gx); g.line.setAttribute('x2', gx);
          g.line.setAttribute('y1', gy1); g.line.setAttribute('y2', gy2);
          var mid = Math.max(PAD.top + 12, Math.min(H - PAD.bottom - 4, (gy1 + gy2) / 2 + 4));
          g.label.setAttribute('x', gx + 7);
          g.label.setAttribute('y', mid);
          g.label.textContent = err.toFixed(2);
          g.label.style.display = err < 0.005 ? 'none' : '';
        });
      }
      if (probe && isFinite(yhat)) {
        var px = sx(probe.value), py0 = sy(0), py = sy(yhat);
        guide.setAttribute('x1', px); guide.setAttribute('x2', px);
        guide.setAttribute('y1', py0); guide.setAttribute('y2', py);
        marker.setAttribute('cx', px); marker.setAttribute('cy', py);
        var leftSide = px > W - PAD.right - 110;
        markerLabel.setAttribute('x', leftSide ? px - 14 : px + 14);
        markerLabel.setAttribute('text-anchor', leftSide ? 'end' : 'start');
        markerLabel.setAttribute('y', py + (yhat < yr[1] - (yr[1] - yr[0]) * 0.08 ? -12 : 24));
      }
      params.forEach(function (p) { p.output.textContent = p.name + ' = ' + fmt(p.value, p.decimals); });
      if (box.dataset.formula) {
        var text = box.dataset.formula;
        params.forEach(function (p) { text = text.split('{' + p.name + '}').join(fmt(p.value, p.decimals)); });
        if (probe) text = text.split('{yhat}').join(isFinite(yhat) ? +yhat.toFixed(2) + '' : '?');
        if (showErrors) {
          text = text.split('{total}').join(total.toFixed(2))
                     .split('{mean}').join(points.length ? (total / points.length).toFixed(2) : '?')
                     .split('{m}').join(String(points.length));
        }
        text = text.replace(/\+\s*-/g, '− ').replace(/-\s*-/g, '+ ');
        /* "a | b | c" shows as separate parts that only wrap between each other. */
        formula.innerHTML = '';
        text.split('|').forEach(function (part) {
          var span = document.createElement('span');
          span.className = 'fn-plot-formula-part';
          span.textContent = part.trim();
          formula.appendChild(span);
        });
      }
    }
    draw();
  }

  function init() {
    var boxes = document.querySelectorAll('.fn-plot');
    for (var i = 0; i < boxes.length; i++) build(boxes[i], i);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
