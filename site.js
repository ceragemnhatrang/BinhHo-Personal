/* site.js – chạy menu (mobile, dropdown), tô sáng mục đang chọn, và tự nạp header/footer/form
   vào <div id="site-header">, <div id="site-footer"> và <div id="form-module"> 
   (chỉ khi chạy trên web server). */
(function () {
  function inc(id, file) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(file).then(function (r) { return r.text(); })
      .then(function (t) { el.innerHTML = t; })
      .catch(function () { el.innerHTML = '<p style="padding:12px">Không tải được ' + file + ' (cần chạy trên web server).</p>'; });
  }
  function active() {
    var cur = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav > a').forEach(function (a) {
      if (a.getAttribute('href') === cur) a.classList.add('on');
    });
  }
  document.addEventListener('click', function (e) {
    var nav = document.getElementById('nav');
    if (e.target.closest('#burger') && nav) { nav.classList.toggle('open'); return; }
    var dd = e.target.closest('[data-dd]');
    if (dd) { dd.parentElement.classList.toggle('open'); return; }
    var a = e.target.closest('a');
    if (a && a.getAttribute('href') === '#') e.preventDefault();
    if (nav) nav.classList.remove('open');
    document.querySelectorAll('.dd.open').forEach(function (x) { x.classList.remove('open'); });
  });

  // Nạp header, footer và form (nếu có thẻ #form-module)
  Promise.all([
    inc('site-header', 'header.html'),
    inc('site-footer', 'footer.html'),
    inc('form-module', 'form-module.html')
  ]).then(active);
})();