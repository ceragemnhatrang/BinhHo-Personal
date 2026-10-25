/* site.js */
(function () {
  function inc(id, file) {
    var el = document.getElementById(id);
    if (!el) return Promise.resolve();
    return fetch(file).then(function (r) { return r.text(); })
      .then(function (t) { el.innerHTML = t; })
      .catch(function () { el.innerHTML = '<p style="padding:12px">Không tải được ' + file + '.</p>'; });
  }

  function active() {
    var cur = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav > a').forEach(function (a) {
      if (a.getAttribute('href') === cur) a.classList.add('on');
    });
  }

  function initForm() {
    var form = document.getElementById("leadForm");
    if (!form) return;

    var TELEGRAM_BOT_TOKEN = "8904021955:AAEiu18Eqsn3cjbEI1x7yVpu8tHB-1lHWZM";
    var TELEGRAM_CHAT_ID = "8171055638";
    var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwHZYIu4DxUqUQQYaUNuhNhLYUo5fBKVqFr3lgp81JZItqX1153C7P1mKerSYpidx6X/exec";

    var pageUrl = document.getElementById("pageUrl");
    var pageTitle = document.getElementById("pageTitle");
    var messageEl = document.getElementById("formMessage");
    var submitBtn = document.getElementById("submitBtn");

    function fillPageInfo() {
      if (pageUrl) pageUrl.value = window.location.href;
      if (pageTitle) pageTitle.value = document.title;
    }
    fillPageInfo();

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = "Đang gửi...";
      messageEl.className = "";
      messageEl.textContent = "";

      var formData = new FormData(form);
      var data = Object.fromEntries(formData.entries());

      // Gửi Telegram
      try {
        var telegramMessage = "🔔 *Có đăng ký tư vấn mới!*\n\n" +
          "👤 *Họ tên:* " + (data.name || "Không có") + "\n" +
          "📧 *Email:* " + (data.email || "Không có") + "\n" +
          "📱 *SĐT:* " + (data.phone || "Không có") + "\n" +
          "🎯 *Nhu cầu:* " + (data.need || "Không chọn") + "\n" +
          "💬 *Lời nhắn:* " + (data.message || "Không có") + "\n\n" +
          "🔗 *Trang:* " + (data.pageTitle || "") + "\n" +
          "🌐 *URL:* " + (data.pageUrl || "");

        await fetch("https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: "Markdown"
          })
        });
      } catch (err) {
        console.warn("Telegram error:", err);
      }

      // Gửi Apps Script (nếu có)
      if (SCRIPT_URL) {
        try {
          await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "text/plain;charset=utf-8" }
          });
        } catch (err) {
          console.warn("Apps Script error:", err);
        }
      }

      messageEl.className = "success";
      messageEl.textContent = "Gửi thành công! Tôi sẽ liên hệ sớm.";
      form.reset();
      fillPageInfo();
      submitBtn.disabled = false;
      submitBtn.textContent = "Gửi thông tin đăng ký";
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

  Promise.all([
    inc('site-header', 'header.html'),
    inc('site-footer', 'footer.html'),
    inc('form-module', 'form-module.html')
  ]).then(function () {
    active();
    initForm(); // Gọi sau khi form đã được nạp
  });
})();
