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
                {=expression} shows a value calculated from the sliders, e.g. "b = {=2.45 - 2*w}".
  data-points   optional fixed data points "x,y x,y ...", drawn as red crosses
  data-x/data-y axis ranges, these never change while sliders move
  data-xlabel / data-ylabel  axis labels (default x and y)
  data-probe    optional name of a slider that picks an input x (e.g. "x"). It isn't passed
                to data-fn; instead a dotted guide and a circle mark the prediction at that x,
                and {yhat} in data-formula shows the predicted value.
  data-probe-label  text next to that dot (default "Prediction").
  data-errors   optional, no value needed. Draws a dotted line from every data point to the
                model's prediction at the same x, labelled with the gap length (absolute error).
                It also shows a squared-error readout above the graph automatically:
                total squared error, m, MSE, and J(w,b) = total / 2m.
                data-formula can also use {sse} {mse} {j} (squared), {total} {mean} (absolute)
                and {m}. Totals use full precision, labels are rounded.

  data-surface  3D variant (needs Plotly, loaded only on pages that use it). Value: the two
                params on the horizontal axes, e.g. "w,b". Height = the cost of data-fn on
                data-points for each (w, b) pair. Its sliders move a marker on the surface.
  data-cost     cost used by data-surface: "mae" (mean absolute error, default), "mse"
                (mean squared error) or "half-mse" (J(w,b) = sum of squared errors / 2m).
  data-zlabel   vertical axis label for data-surface (default: "Cost"). Phones show "Cost (MAE)".
  data-grid     surface resolution per axis for data-surface (default 61).
                data-formula can use {cost} for the selected point's cost.
  data-linked-plot  (data-surface only, no value) adds the 2D prediction graph of data-fn with
                its error gaps and squared-error readout next to the surface (stacked on
                phones). Both graphs share the same sliders.
  data-corners  (data-surface only) letters for the four floor corners, in the order
                (min,min) (max,min) (max,max) (min,max) of the two axis params, e.g. "A B C D".
                They are fixed to those parameter positions, so they rotate with the graph.
  data-minimum  (data-surface only, no value) marks the lowest point of the surface, found
                numerically within the slider ranges.
  data-presets  buttons that set sliders (2D graphs, data-surface, data-contour), e.g.
                "Try corner B: w=3, b=-3; Back to start: w=1.2, b=0.6".

  data-contour  top-down "map" of the same cost (needs Plotly). Value: the two params on the
                axes, e.g. "w,b". Uses data-fn, data-points, data-cost, data-params like
                data-surface. Rings join points of equal cost; w and b use the same scale so
                the downhill arrow really crosses the rings at right angles.
                Also takes data-minimum and data-presets, plus:
  data-gradient (data-contour, no value) draws the steepest-descent (downhill) arrow.
  data-descent  (data-contour) step size for gradient descent buttons, e.g. "0.3": adds
                "Move 1 step downhill" / "Move 20 steps downhill", draws the path and lists
                w, b and the cost at every step. data-formula can use {cost} and {step}.

  The 2D variants are just attributes on the same div, and can be combined:
    sliders only -> no extra attribute
    pick an x    -> data-probe="x"
    show errors  -> data-errors
  The 3D variant is data-surface="w,b".
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

  function compileModel(box, names) {
    try {
      return new Function(['x'].concat(names).join(','), 'with (Math) { return (' + box.dataset.fn + '); }');
    } catch (e) {
      box.textContent = 'fn-plot: bad formula in data-fn (' + e.message + ')';
      return null;
    }
  }

  function makeFormula(box) {
    var formula = document.createElement('div');
    formula.className = 'fn-plot-formula';
    formula.setAttribute('aria-live', 'polite');
    if (box.dataset.formula) box.appendChild(formula);
    return formula;
  }

  /* Fills {name} placeholders from the sliders and from extra, then shows the parts. */
  function setFormula(box, formula, params, extra) {
    if (!box.dataset.formula) return;
    var text = box.dataset.formula;
    params.forEach(function (p) { text = text.split('{' + p.name + '}').join(fmt(p.value, p.decimals)); });
    for (var k in extra) text = text.split('{' + k + '}').join(extra[k]);
    /* {=expression} shows a value calculated from the sliders, e.g. {=2.45 - 2*w}. */
    text = text.replace(/\{=([^}]+)\}/g, function (all, expr) {
      try {
        var f = new Function(params.map(function (p) { return p.name; }).join(','), 'with (Math) { return (' + expr + '); }');
        var v = f.apply(null, params.map(function (p) { return p.value; }));
        return isFinite(v) ? fmt(v, 2) : '?';
      } catch (e) { return '?'; }
    });
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

  function makeSliders(box, params, onChange) {
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
      p.input = input;
      input.addEventListener('input', function () { p.value = parseFloat(input.value); onChange(); });
    });
  }

  /* Buttons that set sliders: data-presets="Label: w=1, b=2; Other: w=0". */
  function makePresets(box, params, onChange) {
    var specs = (box.dataset.presets || '').split(';').filter(function (t) { return t.trim(); });
    if (!specs.length) return;
    var tools = document.createElement('div');
    tools.className = 'fn-plot-tools';
    specs.forEach(function (spec) {
      var m = /^\s*([^:]+):(.*)$/.exec(spec);
      if (!m) return;
      var sets = m[2].split(',').map(function (kv) { var a = kv.split('='); return [a[0].trim(), parseFloat(a[1])]; });
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'fn-plot-reset'; btn.textContent = m[1].trim();
      btn.addEventListener('click', function () {
        sets.forEach(function (kv) {
          params.forEach(function (p) { if (p.name === kv[0] && !isNaN(kv[1])) { p.value = kv[1]; if (p.input) p.input.value = kv[1]; } });
        });
        onChange();
      });
      tools.appendChild(btn);
    });
    box.appendChild(tools);
  }

  function showSliderValues(params) {
    params.forEach(function (p) {
      /* A preset can set a value between slider steps (e.g. 1.14 on a 0.1 slider): show it, not the rounded step. */
      var d = Math.abs(+p.value.toFixed(p.decimals) - p.value) > 1e-9 ? Math.max(p.decimals, 2) : p.decimals;
      p.output.textContent = p.name + ' = ' + fmt(p.value, d);
    });
  }

  /* ---------- 3D surface (Plotly) ---------- */

  /* Full bundle so future notes can use contour maps, heatmaps, 3D paths etc. */
  var PLOTLY_URL = 'https://cdn.jsdelivr.net/npm/plotly.js-dist-min@3.3.0/plotly.min.js';
  var plotlyReady = null;
  function loadPlotly() {
    if (window.Plotly) return Promise.resolve(window.Plotly);
    if (!plotlyReady) {
      plotlyReady = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = PLOTLY_URL;
        s.onload = function () { resolve(window.Plotly); };
        s.onerror = function () { plotlyReady = null; reject(new Error('Could not load the 3D graph library. Are you online?')); };
        document.head.appendChild(s);
      });
    }
    return plotlyReady;
  }

  var COOL_WARM = [[0, '#3b4cc0'], [0.25, '#7b9ff9'], [0.5, '#dddcdc'], [0.75, '#f49a7b'], [1, '#b40426']];
  var TEXT = '#e6edf3', GRID = 'rgba(255,255,255,0.15)';

  function buildSurface(box) {
    var params = parseParams(box.dataset.params);
    var axisNames = box.dataset.surface.split(',').map(function (s) { return s.trim(); });
    var pa = params.filter(function (p) { return p.name === axisNames[0]; })[0];
    var pb = params.filter(function (p) { return p.name === axisNames[1]; })[0];
    if (!pa || !pb) { box.textContent = 'fn-plot: data-surface must name two sliders from data-params'; return; }
    var fn = compileModel(box, params.map(function (p) { return p.name; }));
    if (!fn) return;
    var points = parsePoints(box.dataset.points);
    var costType = (box.dataset.cost || 'mae').toLowerCase();
    var squared = costType === 'mse' || costType === 'half-mse';
    var costName = { mae: 'MAE', mse: 'MSE', 'half-mse': 'J(w,b)' }[costType] || 'MAE';
    var costDigits = squared ? 4 : 3;

    /* Cost of the model over every data point, for one set of slider values. */
    function cost(values) {
      var total = 0;
      for (var i = 0; i < points.length; i++) {
        var e = fn.apply(null, [points[i][0]].concat(values)) - points[i][1];
        total += squared ? e * e : Math.abs(e);
      }
      return total / (costType === 'half-mse' ? 2 * points.length : points.length);
    }
    function valuesWith(a, b) {
      return params.map(function (p) { return p === pa ? a : p === pb ? b : p.value; });
    }

    var n = Math.max(11, Math.min(201, parseInt(box.dataset.grid, 10) || 61));
    var as = [], bs = [], z = [], i, j;
    for (i = 0; i < n; i++) as.push(pa.min + (pa.max - pa.min) * i / (n - 1));
    for (j = 0; j < n; j++) bs.push(pb.min + (pb.max - pb.min) * j / (n - 1));
    for (j = 0; j < n; j++) {
      var row = [];
      for (i = 0; i < n; i++) row.push(cost(valuesWith(as[i], bs[j])));
      z.push(row);
    }

    box.innerHTML = '';
    var formula = makeFormula(box);
    var plot = document.createElement('div');
    plot.className = 'fn-plot-3d';
    plot.setAttribute('role', 'img');
    plot.setAttribute('aria-label', '3D surface of the cost for every pair of ' + pa.name + ' and ' + pb.name);
    plot.textContent = 'Loading 3D graph…';
    var linkedDraw = null;
    if (box.hasAttribute('data-linked-plot')) {
      /* Surface and its prediction graph side by side (stacked on narrow screens). */
      var pair = document.createElement('div');
      pair.className = 'fn-plot-pair';
      pair.appendChild(plot);
      var linked = document.createElement('div');
      linked.className = 'fn-plot-linked';
      linked.dataset.fn = box.dataset.fn;
      linked.dataset.points = box.dataset.points || '';
      linked.dataset.formula = 'ŷ = {' + pa.name + '}x + {' + pb.name + '}';
      linked.setAttribute('data-errors', '');
      /* Fixed axes that keep every point and every prediction at a training input visible
         for any slider position. The model is checked at every corner of the slider box. */
      var pts = parsePoints(box.dataset.points), xs0 = pts.map(function (q) { return q[0]; });
      var lo = Infinity, hi = -Infinity, corners = [[]];
      params.forEach(function (p) {
        var next = [];
        corners.forEach(function (c) { next.push(c.concat(p.min)); next.push(c.concat(p.max)); });
        corners = next;
      });
      pts.forEach(function (q) { lo = Math.min(lo, q[1]); hi = Math.max(hi, q[1]); });
      corners.forEach(function (vals) {
        xs0.forEach(function (x) { var y = fn.apply(null, [x].concat(vals)); if (isFinite(y)) { lo = Math.min(lo, y); hi = Math.max(hi, y); } });
      });
      var xmax = Math.max.apply(null, xs0.concat([1]));
      linked.dataset.x = '0..' + (Math.ceil(xmax * 2 + 1) / 2);
      linked.dataset.y = Math.floor(lo - 0.5) + '..' + Math.ceil(hi + 0.5);
      pair.appendChild(linked);
      box.appendChild(pair);
      linkedDraw = build(linked, 'linked-' + Math.random().toString(36).slice(2), { params: params });
    } else {
      box.appendChild(plot);
    }

    var tools = document.createElement('div');
    tools.className = 'fn-plot-tools';
    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'fn-plot-reset';
    reset.textContent = '↺ Reset view';
    var hint = document.createElement('span');
    hint.className = 'fn-plot-hint';
    hint.textContent = 'Drag to rotate, pinch or scroll to zoom, tap for values';
    tools.appendChild(reset);
    (box.dataset.presets || '').split(';').forEach(function (spec) {
      var m = /^\s*([^:]+):(.*)$/.exec(spec);
      if (!m) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fn-plot-reset';
      btn.textContent = m[1].trim();
      var sets = m[2].split(',').map(function (kv) { var a = kv.split('='); return [a[0].trim(), parseFloat(a[1])]; });
      btn.addEventListener('click', function () {
        sets.forEach(function (kv) {
          params.forEach(function (p) { if (p.name === kv[0] && !isNaN(kv[1])) { p.value = kv[1]; if (p.input) p.input.value = kv[1]; } });
        });
        update();
      });
      tools.appendChild(btn);
    });
    tools.appendChild(hint);
    box.appendChild(tools);

    var ready = false;
    /* Plotly edits the camera object it is given, so always hand it a fresh copy. */
    function camera() { return { eye: { x: 1.7, y: -1.6, z: 1.65 }, center: { x: 0, y: 0, z: -0.2 } }; }
    var hover = pa.name + ' = %{x:.2f}<br>' + pb.name + ' = %{y:.2f}<br>' + costName + ' = %{z:.' + costDigits + 'f}<extra></extra>';

    var zmin = Infinity, zmax = -Infinity;
    z.forEach(function (r) { r.forEach(function (v) { if (v < zmin) zmin = v; if (v > zmax) zmax = v; }); });
    var zr = [Math.min(0, zmin), zmax * 1.05];
    var ASPECT = { x: 1, y: 1, z: 0.75 };

    /* The selected point is a real 3D ball (not a flat marker), so it gets smaller when it is
       further away and bigger when closer. Its radius is set per axis so it looks round even
       though w, b and the cost use different scales. It sits on top of the surface. */
    var R = 0.03, rx = R * (pa.max - pa.min) / ASPECT.x, ry = R * (pb.max - pb.min) / ASPECT.y, rz = R * (zr[1] - zr[0]) / ASPECT.z;
    var ball = { i: [], j: [], k: [] }, RINGS = 10, SEGS = 16, u, v;
    for (u = 0; u < RINGS; u++) for (v = 0; v < SEGS; v++) {
      var a0 = u * (SEGS + 1) + v, a1 = a0 + SEGS + 1;
      ball.i.push(a0, a0 + 1); ball.j.push(a1, a1); ball.k.push(a0 + 1, a1 + 1);
    }
    function ballAt(cx, cy, cz) {
      var xs = [], ys = [], zs = [];
      for (u = 0; u <= RINGS; u++) {
        var th = Math.PI * u / RINGS;
        for (v = 0; v <= SEGS; v++) {
          var ph = 2 * Math.PI * v / SEGS;
          xs.push(cx + rx * Math.sin(th) * Math.cos(ph));
          ys.push(cy + ry * Math.sin(th) * Math.sin(ph));
          zs.push(cz + rz * Math.cos(th));
        }
      }
      return { x: xs, y: ys, z: zs };
    }
    function selected() {
      var c = cost(params.map(function (p) { return p.value; }));
      var tip = 'Selected<br>' + pa.name + ' = ' + fmt(pa.value, pa.decimals) + '<br>' + pb.name + ' = ' + fmt(pb.value, pb.decimals) +
        '<br>' + costName + ' = ' + c.toFixed(costDigits) + '<extra></extra>';
      /* Yellow dotted drop line from the ball to the floor: its height is the cost. */
      var drop = { x: [pa.value, pa.value], y: [pb.value, pb.value], z: [zr[0], c] };
      var label = { x: [pa.value], y: [pb.value], z: [c + rz * 2.2], text: ['  ' + costName + ' = ' + c.toFixed(costDigits)] };
      return { c: c, ball: ballAt(pa.value, pb.value, c + rz * 0.85), tip: tip, drop: drop, label: label };
    }

    function update() {
      showSliderValues(params);
      var s = selected();
      setFormula(box, formula, params, { cost: s.c.toFixed(costDigits) });
      if (linkedDraw) linkedDraw();
      if (ready) {
        window.Plotly.restyle(plot, { x: [s.ball.x], y: [s.ball.y], z: [s.ball.z], hovertemplate: s.tip }, [1]);
        window.Plotly.restyle(plot, { x: [s.drop.x, s.label.x, [s.drop.x[0]]], y: [s.drop.y, s.label.y, [s.drop.y[0]]], z: [s.drop.z, s.label.z, [zr[0]]], text: [null, s.label.text, null] }, [2, 3, 4]);
      }
    }

    makeSliders(box, params, update);
    update();

    /* Optional: floor corner letters, fixed to their parameter positions. */
    function cornerTrace() {
      var letters = (box.dataset.corners || '').trim().split(/\s+/).filter(Boolean);
      if (letters.length !== 4) return [];
      var cw = [pa.min, pa.max, pa.max, pa.min], cb = [pb.min, pb.min, pb.max, pb.max];
      return [{ type: 'scatter3d', mode: 'markers+text', x: cw, y: cb, z: [zr[0], zr[0], zr[0], zr[0]],
        text: letters, textposition: 'top center', textfont: { color: '#ffffff', size: 16, family: 'system-ui, sans-serif' },
        marker: { size: 4, color: '#ffffff' },
        customdata: letters.map(function (l, k) { return [l, cw[k], cb[k]]; }),
        hovertemplate: 'Corner %{customdata[0]}<br>' + pa.name + ' = %{customdata[1]}<br>' + pb.name + ' = %{customdata[2]}<br>(on the floor, not the surface)<extra></extra>' }];
    }
    /* Optional: the lowest point. Start from the lowest grid cell, then shrink the search step. */
    function minimumTrace() {
      if (!box.hasAttribute('data-minimum')) return [];
      var bi = 0, bj = 0;
      for (j = 0; j < n; j++) for (i = 0; i < n; i++) if (z[j][i] < z[bj][bi]) { bi = i; bj = j; }
      var ma = as[bi], mb = bs[bj], mc = z[bj][bi];
      var sa = (pa.max - pa.min) / (n - 1), sb = (pb.max - pb.min) / (n - 1);
      for (var it = 0; it < 200 && (sa > 1e-9 || sb > 1e-9); it++) {
        var moved = false;
        [[sa, 0], [-sa, 0], [0, sb], [0, -sb]].forEach(function (d) {
          var na = Math.min(pa.max, Math.max(pa.min, ma + d[0])), nb = Math.min(pb.max, Math.max(pb.min, mb + d[1]));
          var nc = cost(valuesWith(na, nb));
          if (nc < mc) { ma = na; mb = nb; mc = nc; moved = true; }
        });
        if (!moved) { sa /= 2; sb /= 2; }
      }
      return [{ type: 'scatter3d', mode: 'markers+text', x: [ma], y: [mb], z: [mc], text: ['Minimum'], textposition: 'bottom center',
        textfont: { color: '#56d364', size: 13, family: 'system-ui, sans-serif' },
        marker: { size: 6, color: '#56d364', symbol: 'diamond', line: { color: '#ffffff', width: 1 } },
        hovertemplate: 'Minimum<br>' + pa.name + ' ≈ ' + ma.toFixed(6) + '<br>' + pb.name + ' ≈ ' + mb.toFixed(6) +
          '<br>' + costName + ' ≈ ' + mc.toFixed(6) + '<extra></extra>' }];
    }
    function extraTraces() { return cornerTrace().concat(minimumTrace()); }

    loadPlotly().then(function (Plotly) {
      plot.textContent = '';
      var s = selected();
      /* Plotly draws grid lines on whichever walls are furthest from the camera, so they jump
         sides while rotating. Turn those off and draw one fixed floor grid instead. */
      var axis = function (title, r) {
        return { title: { text: title, font: { size: 14 } }, range: r, color: TEXT, showgrid: false, zeroline: false,
          showline: true, linecolor: 'rgba(255,255,255,0.35)', showbackground: false, tickfont: { size: 11 } };
      };
      var floor = { x: [], y: [], z: [] }, f0 = zr[0], t;
      function floorLine(x1, y1, x2, y2) { floor.x.push(x1, x2, null); floor.y.push(y1, y2, null); floor.z.push(f0, f0, null); }
      var fa = niceStep(pa.max - pa.min), fb = niceStep(pb.max - pb.min);
      for (t = Math.ceil(pa.min / fa) * fa; t <= pa.max + 1e-9; t += fa) floorLine(t, pb.min, t, pb.max);
      for (t = Math.ceil(pb.min / fb) * fb; t <= pb.max + 1e-9; t += fb) floorLine(pa.min, t, pa.max, t);
      floorLine(pa.min, pb.min, pa.max, pb.min); floorLine(pa.max, pb.min, pa.max, pb.max);
      floorLine(pa.max, pb.max, pa.min, pb.max); floorLine(pa.min, pb.max, pa.min, pb.min);
      return Plotly.newPlot(plot, [
        /* A see-through wire mesh: faint fill, grid lines coloured by height. */
        { type: 'surface', x: as, y: bs, z: z, colorscale: COOL_WARM, hovertemplate: hover, hidesurface: true,
          colorbar: { title: { text: costName, side: 'top' }, thickness: 12, len: 0.75, x: 1, tickfont: { color: TEXT, size: 11 } },
          contours: {
            x: { show: true, start: pa.min, end: pa.max, size: (pa.max - pa.min) / 24, usecolormap: true, width: 2, highlight: false },
            y: { show: true, start: pb.min, end: pb.max, size: (pb.max - pb.min) / 24, usecolormap: true, width: 2, highlight: false },
            z: { show: false }
          } },
        { type: 'mesh3d', x: s.ball.x, y: s.ball.y, z: s.ball.z, i: ball.i, j: ball.j, k: ball.k,
          color: '#ff4d4d', flatshading: false, hovertemplate: s.tip,
          lighting: { ambient: 0.45, diffuse: 0.9, specular: 0.9, roughness: 0.25, fresnel: 0.3 },
          lightposition: { x: 1000, y: -1000, z: 3000 } },
        { type: 'scatter3d', mode: 'lines', x: s.drop.x, y: s.drop.y, z: s.drop.z, hoverinfo: 'skip',
          line: { color: '#f2cc60', width: 5, dash: 'dash' } },
        { type: 'scatter3d', mode: 'text', x: s.label.x, y: s.label.y, z: s.label.z, text: s.label.text, hoverinfo: 'skip',
          textposition: 'top right', textfont: { color: '#f2cc60', size: 14, family: 'system-ui, sans-serif' } },
        /* Small yellow dot where the drop line meets the floor. */
        { type: 'scatter3d', mode: 'markers', x: [s.drop.x[0]], y: [s.drop.y[0]], z: [zr[0]], hoverinfo: 'skip', marker: { size: 3, color: '#f2cc60' } },
        /* Fixed floor grid. */
        { type: 'scatter3d', mode: 'lines', x: floor.x, y: floor.y, z: floor.z, connectgaps: false, hoverinfo: 'skip',
          line: { color: 'rgba(255,255,255,0.22)', width: 2 } }
      ].concat(extraTraces()), {
        paper_bgcolor: 'rgba(0,0,0,0)', font: { color: TEXT }, margin: { l: 0, r: 0, t: 0, b: 0 }, showlegend: false,
        scene: {
          xaxis: axis(pa.name, [pa.min, pa.max]),
          yaxis: axis(pb.name, [pb.min, pb.max]),
          /* Long vertical labels get cut off on phones, so use a short one there. */
          zaxis: axis(plot.clientWidth < 560 ? (costType === 'half-mse' ? 'J(w,b)' : 'Cost (' + costName + ')') : (box.dataset.zlabel || 'Cost'), zr),
          aspectmode: 'manual', aspectratio: ASPECT, camera: camera(), dragmode: 'turntable'
        }
      }, { responsive: true, displayModeBar: false });
    }).then(function () {
      ready = true;
      reset.addEventListener('click', function () { window.Plotly.relayout(plot, { 'scene.camera': camera() }); });
      /* Keep the floor as the floor: if a drag swings the camera below it, lift it back up. */
      var MIN_EYE_Z = 0.25;
      function liveScene() { var sc = plot._fullLayout && plot._fullLayout.scene; return sc && sc._scene; }
      function clamped(cam) {
        return { eye: { x: cam.eye.x, y: cam.eye.y, z: MIN_EYE_Z }, center: cam.center, up: { x: 0, y: 0, z: 1 } };
      }
      /* When the drag ends (anywhere on the page), lift the camera back above the floor. */
      function settle() {
        setTimeout(function () {
          var sc = liveScene(), cam = sc && sc.getCamera && sc.getCamera();
          if (cam && cam.eye && cam.eye.z < MIN_EYE_Z) window.Plotly.relayout(plot, { 'scene.camera': clamped(cam) });
        }, 50);
      }
      ['mouseup', 'touchend', 'pointerup'].forEach(function (n) { window.addEventListener(n, settle, true); });
    }).catch(function (err) {
      plot.textContent = err.message;
    });
  }

  /* opts.params: share another graph's sliders (no sliders are drawn here). Returns draw(). */
  /* Colour on the cool-to-warm scale for t in 0..1. */
  function coolWarm(t) {
    t = Math.max(0, Math.min(1, t));
    for (var k = 1; k < COOL_WARM.length; k++) {
      if (t <= COOL_WARM[k][0]) {
        var a = COOL_WARM[k - 1], b = COOL_WARM[k], f = (t - a[0]) / (b[0] - a[0]);
        var ca = parseInt(a[1].slice(1), 16), cb = parseInt(b[1].slice(1), 16);
        var ch = [16, 8, 0].map(function (sh) { return Math.round(((ca >> sh) & 255) * (1 - f) + ((cb >> sh) & 255) * f); });
        return 'rgb(' + ch.join(',') + ')';
      }
    }
    return COOL_WARM[COOL_WARM.length - 1][1];
  }

  /* ---------- Contour map (Plotly): the cost surface seen from above ---------- */
  function buildContour(box) {
    var params = parseParams(box.dataset.params);
    var axisNames = box.dataset.contour.split(',').map(function (s) { return s.trim(); });
    var pa = params.filter(function (p) { return p.name === axisNames[0]; })[0];
    var pb = params.filter(function (p) { return p.name === axisNames[1]; })[0];
    if (!pa || !pb) { box.textContent = 'fn-plot: data-contour must name two sliders from data-params'; return; }
    var fn = compileModel(box, params.map(function (p) { return p.name; }));
    if (!fn) return;
    var points = parsePoints(box.dataset.points);
    var costType = (box.dataset.cost || 'mae').toLowerCase();
    var squared = costType === 'mse' || costType === 'half-mse';
    var costName = { mae: 'MAE', mse: 'MSE', 'half-mse': 'J(w,b)' }[costType] || 'MAE';
    var costDigits = squared ? 4 : 3;
    function cost(values) {
      var total = 0;
      for (var i = 0; i < points.length; i++) {
        var e = fn.apply(null, [points[i][0]].concat(values)) - points[i][1];
        total += squared ? e * e : Math.abs(e);
      }
      return total / (costType === 'half-mse' ? 2 * points.length : points.length);
    }
    function current() { return params.map(function (p) { return p.value; }); }
    function valuesWith(a, b) { return params.map(function (p) { return p === pa ? a : p === pb ? b : p.value; }); }
    /* Slope of the cost in the a and b directions (central differences). */
    function gradient(a, b) {
      var ha = (pa.max - pa.min) * 1e-6, hb = (pb.max - pb.min) * 1e-6;
      return [(cost(valuesWith(a + ha, b)) - cost(valuesWith(a - ha, b))) / (2 * ha),
              (cost(valuesWith(a, b + hb)) - cost(valuesWith(a, b - hb))) / (2 * hb)];
    }

    var n = Math.max(21, Math.min(201, parseInt(box.dataset.grid, 10) || 101));
    var as = [], bs = [], z = [], i, j;
    for (i = 0; i < n; i++) as.push(pa.min + (pa.max - pa.min) * i / (n - 1));
    for (j = 0; j < n; j++) bs.push(pb.min + (pb.max - pb.min) * j / (n - 1));
    var zmin = Infinity, zmax = -Infinity;
    for (j = 0; j < n; j++) {
      var row = [];
      for (i = 0; i < n; i++) { var v = cost(valuesWith(as[i], bs[j])); row.push(v); zmin = Math.min(zmin, v); zmax = Math.max(zmax, v); }
      z.push(row);
    }

    /* The lowest point: lowest grid cell, then shrink the search step. */
    var bi = 0, bj = 0;
    for (j = 0; j < n; j++) for (i = 0; i < n; i++) if (z[j][i] < z[bj][bi]) { bi = i; bj = j; }
    var ma = as[bi], mb = bs[bj], mc = z[bj][bi];
    var sa = (pa.max - pa.min) / (n - 1), sb = (pb.max - pb.min) / (n - 1);
    for (var it = 0; it < 200 && (sa > 1e-9 || sb > 1e-9); it++) {
      var moved = false;
      [[sa, 0], [-sa, 0], [0, sb], [0, -sb]].forEach(function (d) {
        var na = Math.min(pa.max, Math.max(pa.min, ma + d[0])), nb = Math.min(pb.max, Math.max(pb.min, mb + d[1]));
        var nc = cost(valuesWith(na, nb));
        if (nc < mc) { ma = na; mb = nb; mc = nc; moved = true; }
      });
      if (!moved) { sa /= 2; sb /= 2; }
    }

    /* Ring heights: close together near the bottom, further apart higher up. */
    var K = 10, levels = [];
    for (var k = 1; k <= K; k++) {
      var L = mc + (zmax - mc) * (Math.pow(2.2, k) - 1) / (Math.pow(2.2, K + 1) - 1);
      var mag = Math.pow(10, Math.floor(Math.log10(L)) - 1);
      levels.push(Math.round(L / mag) * mag);
    }

    box.innerHTML = '';
    var formula = makeFormula(box);
    var plot = document.createElement('div');
    plot.className = 'fn-plot-contour';
    plot.setAttribute('role', 'img');
    plot.setAttribute('aria-label', 'Contour map of the cost for every pair of ' + pa.name + ' and ' + pb.name);
    plot.textContent = 'Loading graph…';
    box.appendChild(plot);

    var tools = document.createElement('div');
    tools.className = 'fn-plot-tools';
    box.appendChild(tools);
    function addButton(text, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'fn-plot-reset'; btn.textContent = text;
      btn.addEventListener('click', onClick); tools.appendChild(btn); return btn;
    }

    var rate = parseFloat(box.dataset.descent);
    var path = [], table = null, tbody = null;
    function startPath() {
      path = [{ a: pa.value, b: pb.value, c: cost(current()) }];
      if (tbody) renderTable();
    }
    function renderTable() {
      tbody.innerHTML = '';
      path.forEach(function (s, k) {
        var tr = document.createElement('tr');
        [String(k), s.a.toFixed(4), s.b.toFixed(4), s.c.toFixed(costDigits)].forEach(function (t) {
          var td = document.createElement('td'); td.textContent = t; tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.parentNode.scrollTop = table.parentNode.scrollHeight;
    }
    function setValues(a, b) {
      pa.value = Math.min(pa.max, Math.max(pa.min, a)); pb.value = Math.min(pb.max, Math.max(pb.min, b));
      if (pa.input) pa.input.value = pa.value;
      if (pb.input) pb.input.value = pb.value;
    }
    function takeSteps(count) {
      for (var s = 0; s < count; s++) {
        var g = gradient(pa.value, pb.value);
        setValues(pa.value - rate * g[0], pb.value - rate * g[1]);
        path.push({ a: pa.value, b: pb.value, c: cost(current()) });
      }
      renderTable();
      draw();
    }

    (box.dataset.presets || '').split(';').forEach(function (spec) {
      var m = /^\s*([^:]+):(.*)$/.exec(spec);
      if (!m) return;
      var sets = m[2].split(',').map(function (kv) { var x = kv.split('='); return [x[0].trim(), parseFloat(x[1])]; });
      addButton(m[1].trim(), function () {
        sets.forEach(function (kv) { params.forEach(function (p) { if (p.name === kv[0] && !isNaN(kv[1])) { p.value = kv[1]; if (p.input) p.input.value = kv[1]; } }); });
        startPath(); draw();
      });
    });
    if (rate > 0) {
      addButton('Move 1 step downhill', function () { takeSteps(1); });
      addButton('Move 20 steps downhill', function () { takeSteps(20); });
      var stepHint = document.createElement('span');
      stepHint.className = 'fn-plot-hint';
      stepHint.textContent = 'Each step moves the red dot a short way along the downhill arrow, from wherever it is now. The table lists every step.';
      tools.appendChild(stepHint);
      var wrap = document.createElement('div');
      wrap.className = 'fn-plot-steps';
      table = document.createElement('table');
      var head = document.createElement('thead');
      head.innerHTML = '<tr><th>Step</th><th>' + pa.name + '</th><th>' + pb.name + '</th><th>' + costName + '</th></tr>';
      tbody = document.createElement('tbody');
      table.appendChild(head); table.appendChild(tbody); wrap.appendChild(table);
      box.appendChild(wrap);
    }

    var ready = false, showArrow = box.hasAttribute('data-gradient');
    function arrow() {
      if (!showArrow) return [];
      var g = gradient(pa.value, pb.value), len = Math.sqrt(g[0] * g[0] + g[1] * g[1]);
      if (len < 1e-6) return [];
      var size = 0.14 * Math.max(pa.max - pa.min, pb.max - pb.min);
      var ta = pa.value - g[0] / len * size, tb = pb.value - g[1] / len * size;
      return [{ x: ta, y: tb, ax: pa.value, ay: pb.value, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', text: '',
                showarrow: true, arrowhead: 3, arrowsize: 1.1, arrowwidth: 3, arrowcolor: '#f2cc60' },
              { x: ta, y: tb, xref: 'x', yref: 'y', text: 'downhill', showarrow: false, yshift: 12,
                font: { color: '#f2cc60', size: 13 } }];
    }

    function draw() {
      showSliderValues(params);
      var c = cost(current());
      setFormula(box, formula, params, { cost: c.toFixed(costDigits), step: String(Math.max(0, path.length - 1)) });
      if (!ready) return;
      window.Plotly.restyle(plot, { x: [[pa.value], path.map(function (s) { return s.a; })], y: [[pb.value], path.map(function (s) { return s.b; })] }, [K + 2, K + 3]);
      window.Plotly.relayout(plot, { annotations: arrow() });
    }

    makeSliders(box, params, function () { startPath(); draw(); });
    startPath();
    draw();

    loadPlotly().then(function (Plotly) {
      plot.textContent = '';
      var hover = pa.name + ' = %{x:.2f}<br>' + pb.name + ' = %{y:.2f}<br>' + costName + ' = %{z:.' + costDigits + 'f}<extra></extra>';
      var traces = [{ type: 'heatmap', x: as, y: bs, z: z, colorscale: COOL_WARM, zmin: mc, zmax: levels[K - 1],
                      opacity: 0.45, hovertemplate: hover, showscale: true,
                      colorbar: { title: { text: costName, side: 'top' }, thickness: 12, len: 0.8, tickfont: { color: TEXT, size: 11 } } }];
      levels.forEach(function (L, k) {
        traces.push({ type: 'contour', x: as, y: bs, z: z, showscale: false, hoverinfo: 'skip',
          contours: { start: L, end: L, size: 1, coloring: 'none', showlabels: true, labelfont: { color: TEXT, size: 10 } },
          line: { color: coolWarm(k / (K - 1)), width: 2 } });
      });
      traces.push({ type: 'scatter', mode: 'markers+text', x: [ma], y: [mb], text: ['Minimum'], textposition: 'bottom center',
        textfont: { color: '#56d364', size: 12 }, marker: { symbol: 'diamond', size: 11, color: '#56d364', line: { color: '#fff', width: 1 } },
        hovertemplate: 'Minimum<br>' + pa.name + ' ≈ ' + ma.toFixed(6) + '<br>' + pb.name + ' ≈ ' + mb.toFixed(6) + '<br>' + costName + ' ≈ ' + mc.toFixed(6) + '<extra></extra>' });
      traces.push({ type: 'scatter', mode: 'markers', x: [pa.value], y: [pb.value], hoverinfo: 'skip',
        marker: { size: 13, color: '#ff4d4d', line: { color: '#ffd6d6', width: 2 } } });
      traces.push({ type: 'scatter', mode: 'lines+markers', x: [], y: [], hoverinfo: 'skip',
        line: { color: '#ff9b9b', width: 2 }, marker: { size: 5, color: '#ff9b9b' } });
      var ax = function (title, r) {
        return { title: { text: title }, range: r, color: TEXT, gridcolor: 'rgba(255,255,255,0.08)', zeroline: false, fixedrange: true };
      };
      var ya = ax(pb.name, [pb.min, pb.max]); ya.scaleanchor = 'x'; ya.scaleratio = 1;
      return Plotly.newPlot(plot, traces, {
        paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', font: { color: TEXT }, showlegend: false,
        margin: { l: 48, r: 12, t: 10, b: 44 }, xaxis: ax(pa.name, [pa.min, pa.max]), yaxis: ya, annotations: arrow()
      }, { responsive: true, displayModeBar: false });
    }).then(function () { ready = true; draw(); })
      .catch(function (err) { plot.textContent = err.message; });
  }

  function build(box, index, opts) {
    if (box.hasAttribute('data-surface')) return buildSurface(box);
    if (box.hasAttribute('data-contour')) return buildContour(box);
    var shared = opts && opts.params;
    var params = shared || parseParams(box.dataset.params);
    var probeName = box.dataset.probe;
    var probe = params.filter(function (p) { return p.name === probeName; })[0];
    var fnParams = params.filter(function (p) { return p !== probe; });
    var names = fnParams.map(function (p) { return p.name; });
    var fn = compileModel(box, names);
    if (!fn) return;
    var xr = range(box.dataset.x, [-5, 5]);
    var yr = range(box.dataset.y, [-5, 5]);
    var points = parsePoints(box.dataset.points);

    function sx(x) { return PAD.left + (x - xr[0]) / (xr[1] - xr[0]) * (W - PAD.left - PAD.right); }
    function sy(y) { return H - PAD.bottom - (y - yr[0]) / (yr[1] - yr[0]) * (H - PAD.top - PAD.bottom); }

    box.innerHTML = '';
    var formula = makeFormula(box);
    var showErrors = box.hasAttribute('data-errors');
    var readout = null;
    if (showErrors) {
      readout = document.createElement('div');
      readout.className = 'fn-plot-formula fn-plot-readout';
      readout.setAttribute('aria-live', 'polite');
      box.appendChild(readout);
    }

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
      markerLabel.textContent = box.dataset.probeLabel || 'Prediction';
    }

    /* Fixed data points as red crosses. */
    var dots = el('g', { class: 'fn-plot-points' }, svg);
    points.forEach(function (p) {
      var cx = sx(p[0]), cy = sy(p[1]), r = 6;
      el('path', { d: 'M' + (cx - r) + ' ' + (cy - r) + 'L' + (cx + r) + ' ' + (cy + r) + 'M' + (cx - r) + ' ' + (cy + r) + 'L' + (cx + r) + ' ' + (cy - r) }, dots);
    });

    if (!shared) {
      makePresets(box, params, function () { draw(); });
      makeSliders(box, params, function () { draw(); });
    }

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
      var total = 0, sse = 0;
      if (showErrors) {
        points.forEach(function (pt, i) {
          var pred = fn.apply(null, [pt[0]].concat(values));
          var err = Math.abs(pred - pt[1]);
          total += err;
          sse += err * err;
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
      if (!shared) showSliderValues(params);
      var extra = {};
      if (probe) extra.yhat = isFinite(yhat) ? +yhat.toFixed(2) + '' : '?';
      if (showErrors) {
        var m = points.length;
        extra.total = total.toFixed(2);
        extra.mean = m ? (total / m).toFixed(2) : '?';
        extra.m = String(m);
        extra.sse = sse.toFixed(4);
        extra.mse = m ? (sse / m).toFixed(4) : '?';
        extra.j = m ? (sse / (2 * m)).toFixed(4) : '?';
        readout.innerHTML = '';
        ['Total squared error = ' + extra.sse, 'm = ' + extra.m, 'MSE = ' + extra.mse, 'J(w,b) = ' + extra.j].forEach(function (t) {
          var span = document.createElement('span');
          span.className = 'fn-plot-formula-part';
          span.textContent = t;
          readout.appendChild(span);
        });
      }
      setFormula(box, formula, params, extra);
    }
    draw();
    return draw;
  }

  function init() {
    var boxes = document.querySelectorAll('.fn-plot');
    for (var i = 0; i < boxes.length; i++) build(boxes[i], i);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
