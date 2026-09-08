// cursor.js - a trailing ring + dot that follows the mouse.
// Self-contained: injects its own styles, no CSS file changes needed.
// Skips touch devices and anyone who prefers reduced motion.
(function () {
  if (!window.matchMedia) return;
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    if (document.getElementById('cursor-fx-style')) return;

    var style = document.createElement('style');
    style.id = 'cursor-fx-style';
    style.textContent =
      '.cursor-dot,.cursor-ring{position:fixed;top:0;left:0;pointer-events:none;z-index:99999;' +
      'border-radius:50%;mix-blend-mode:difference;will-change:transform;opacity:0;transition:opacity .3s ease}' +
      '.cursor-dot{width:6px;height:6px;margin:-3px 0 0 -3px;background:#fff}' +
      '.cursor-ring{width:34px;height:34px;margin:-17px 0 0 -17px;border:1.6px solid #fff;' +
      'transition:opacity .3s ease,width .2s ease,height .2s ease,margin .2s ease,background-color .2s ease}' +
      '.cursor-ring.is-hover{width:54px;height:54px;margin:-27px 0 0 -27px;background-color:rgba(255,255,255,.16)}' +
      '.cursor-ring.is-down{width:24px;height:24px;margin:-12px 0 0 -12px}' +
      'body.cursor-ready .cursor-dot,body.cursor-ready .cursor-ring{opacity:1}';
    document.head.appendChild(style);

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var hoverSel = 'a,button,input,textarea,select,label,summary,[role="button"],[tabindex],' +
      '.sport-tile,.athlete-card,.athlete-slot,.filter,.level-tab,.sport-tabs a,.pack';

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      document.body.classList.add('cursor-ready');
      var t = e.target;
      ring.classList.toggle('is-hover', !!(t && t.closest && t.closest(hoverSel)));
    }, { passive: true });

    document.addEventListener('mousedown', function () { ring.classList.add('is-down'); });
    document.addEventListener('mouseup', function () { ring.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-ready'); });
    document.addEventListener('mouseenter', function () { document.body.classList.add('cursor-ready'); });

    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
