/*
  Runnable Python blocks in notes.

  In a note, put {: .runnable} on the line right after a ```python block.
  The block gets a Run button; output and matplotlib figures show below it.
  Python (Pyodide) is only downloaded the first time someone taps Run.
  All blocks on a page share one Python session, like notebook cells.
*/
(function () {
  var PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.8/full/';
  var pyodideReady = null;

  var SETUP = [
    'import os, warnings',
    'os.environ["MPLBACKEND"] = "AGG"',
    'warnings.filterwarnings("ignore", message=".*non-interactive.*")'
  ].join('\n');

  /* Turns every open matplotlib figure into a base64 PNG, then closes them. */
  var COLLECT_FIGURES = [
    'def _pyrun_figures():',
    '    import sys',
    '    if "matplotlib.pyplot" not in sys.modules:',
    '        return []',
    '    import io, base64',
    '    import matplotlib.pyplot as plt',
    '    out = []',
    '    for num in plt.get_fignums():',
    '        buf = io.BytesIO()',
    '        plt.figure(num).savefig(buf, format="png", dpi=110, bbox_inches="tight")',
    '        out.append(base64.b64encode(buf.getvalue()).decode())',
    '    plt.close("all")',
    '    return out',
    '_pyrun_figures()'
  ].join('\n');

  function loadPyodideOnce(setStatus) {
    if (pyodideReady) return pyodideReady;
    pyodideReady = new Promise(function (resolve, reject) {
      setStatus('Loading Python (first time only, about 25 MB)…');
      var s = document.createElement('script');
      s.src = PYODIDE_URL + 'pyodide.js';
      s.onload = function () {
        window.loadPyodide({ indexURL: PYODIDE_URL })
          .then(function (py) { py.runPython(SETUP); resolve(py); })
          .catch(reject);
      };
      s.onerror = function () { reject(new Error('Could not download Python. Are you online?')); };
      document.head.appendChild(s);
    });
    pyodideReady.catch(function () { pyodideReady = null; });
    return pyodideReady;
  }

  function makeRunner(block) {
    var codeEl = block.querySelector('code');
    if (!codeEl) return;

    var bar = document.createElement('div');
    bar.className = 'pyrun-bar';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pyrun-btn';
    btn.textContent = '▶ Run';
    var status = document.createElement('span');
    status.className = 'pyrun-status';
    bar.appendChild(btn);
    bar.appendChild(status);

    var out = document.createElement('div');
    out.className = 'pyrun-output';
    out.hidden = true;

    block.insertAdjacentElement('afterend', bar);
    bar.insertAdjacentElement('afterend', out);

    function setStatus(text) { status.textContent = text; }

    function addText(text, isError) {
      if (!text) return;
      var pre = document.createElement('pre');
      pre.className = isError ? 'pyrun-text pyrun-error' : 'pyrun-text';
      pre.textContent = text;
      out.appendChild(pre);
    }

    btn.addEventListener('click', function () {
      btn.disabled = true;
      out.innerHTML = '';
      out.hidden = true;
      var printed = [];
      function keep(line) {
        /* Matplotlib's one-time setup notice isn't useful in a note. */
        if (line.indexOf('building the font cache') === -1) printed.push(line);
      }

      loadPyodideOnce(setStatus)
        .then(function (py) {
          setStatus('Installing packages…');
          var code = codeEl.textContent;
          return py.loadPackagesFromImports(code).then(function () {
            setStatus('Running…');
            py.setStdout({ batched: keep });
            py.setStderr({ batched: keep });
            return py.runPythonAsync(code);
          }).then(function (result) {
            addText(printed.join('\n'));
            if (result !== undefined && result !== null) {
              addText(String(result));
              if (result.destroy) result.destroy();
            }
            var figs = py.runPython(COLLECT_FIGURES);
            var list = figs.toJs();
            figs.destroy();
            list.forEach(function (b64) {
              var img = document.createElement('img');
              img.className = 'pyrun-figure';
              img.alt = 'Plot output';
              img.src = 'data:image/png;base64,' + b64;
              out.appendChild(img);
            });
            setStatus('Done');
          });
        })
        .catch(function (err) {
          addText(printed.join('\n'));
          addText(String(err && err.message ? err.message : err), true);
          setStatus('Error');
        })
        .then(function () {
          out.hidden = out.childNodes.length === 0;
          btn.disabled = false;
          btn.textContent = '▶ Run again';
        });
    });
  }

  function init() {
    var blocks = document.querySelectorAll('.runnable');
    for (var i = 0; i < blocks.length; i++) makeRunner(blocks[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
