const app = document.querySelector("#app");
const metaDescription = document.querySelector('meta[name="description"]');
const contentUrl = new URL("./content.json", import.meta.url);

init();

async function init() {
  try {
    const response = await fetch(contentUrl);

    if (!response.ok) {
      throw new Error(`Failed to load content: ${response.status}`);
    }

    const content = await response.json();
    renderPage(content);
    bindContactForm();
  } catch (error) {
    renderError();
    console.error(error);
  }
}

function renderPage(content) {
  const totalQuestions = content.sections.reduce(
    (sum, section) => sum + section.questions.length,
    0
  );

  document.title = content.site.metaTitle || document.title;

  if (metaDescription && content.site.metaDescription) {
    metaDescription.setAttribute("content", content.site.metaDescription);
  }

  const navItems = [
    ...content.sections.map((section) => ({
      href: `#${section.id}`,
      label: section.navLabel || section.title,
    })),
    content.contact
      ? {
          href: `#${content.contact.id}`,
          label: content.contact.navLabel || content.contact.title,
        }
      : null,
  ].filter(Boolean);

  let questionNumber = 0;

  app.innerHTML = `
    ${renderHero(content.site, navItems, totalQuestions)}
    ${content.sections
      .map((section) => {
        const sectionQuestions = section.questions
          .map((question) => {
            questionNumber += 1;
            return renderQuestion(question, questionNumber);
          })
          .join("");

        return `
          <section id="${section.id}" class="section-shell mt-8">
            <div class="max-w-3xl">
              <span class="section-kicker">${escapeHtml(section.kicker)}</span>
              <h2 class="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">${escapeHtml(section.title)}</h2>
              <p class="mt-4 text-sm leading-8 text-slate-600 sm:text-base">${escapeHtml(section.description)}</p>
            </div>
            <div class="mt-8 grid gap-6 xl:grid-cols-2">
              ${sectionQuestions}
            </div>
          </section>
        `;
      })
      .join("")}
    ${content.contact ? renderContact(content.contact) : ""}
    ${renderFooter(content.footer)}
  `;
}

function renderHero(site, navItems, totalQuestions) {
  const stats = site.stats
    .map((stat) => {
      const value =
        stat.type === "questionsCount"
          ? toPersianNumber(totalQuestions)
          : escapeHtml(stat.value);

      return `
        <div class="stat-card">
          <span class="text-sm text-slate-500">${escapeHtml(stat.label)}</span>
          <strong class="mt-3 block text-lg font-bold text-slate-900 sm:text-2xl">${value}</strong>
        </div>
      `;
    })
    .join("");

  const nav = navItems
    .map(
      (item) => `<a class="nav-pill" href="${item.href}">${escapeHtml(item.label)}</a>`
    )
    .join("");

  return `
    <header class="glass-surface rounded-[32px] p-6 sm:p-8 lg:p-10">
      <div class="grid gap-8 lg:grid-cols-[1.45fr_0.95fr] lg:items-end">
        <div>
          <span class="inline-flex items-center rounded-full border border-slate-900/10 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm">
            ${escapeHtml(site.badge)}
          </span>
          <h1 class="mt-5 text-3xl font-black leading-[1.6] text-slate-900 sm:text-4xl lg:text-5xl">
            ${escapeHtml(site.title)}
          </h1>
          <p class="mt-5 max-w-3xl text-sm leading-8 text-slate-700 sm:text-base">
            ${escapeHtml(site.intro)}
          </p>
        </div>
        <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          ${stats}
        </div>
      </div>
      <nav class="mt-8 flex flex-wrap gap-3">
        ${nav}
      </nav>
    </header>
  `;
}

function renderQuestion(question, number) {
  const blocks = question.blocks.map(renderBlock).join("");
  const note = question.note ? `<p class="note">${question.note}</p>` : "";
  const wideClass = question.wide ? " xl:col-span-2" : "";

  return `
    <article class="qa-card${wideClass}">
      <div class="flex items-center justify-between gap-4">
        <span class="qa-number">${toPersianNumber(number, 2)}</span>
        <span class="qa-category">${escapeHtml(question.category)}</span>
      </div>
      <h3 class="qa-question">${escapeHtml(question.question)}</h3>
      <div class="answer">
        ${blocks}
      </div>
      ${note}
    </article>
  `;
}

function renderBlock(block) {
  if (block.type === "list") {
    return `
      <ul class="answer-list">
        ${block.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  return `<p>${block.html}</p>`;
}

function renderContact(contact) {
  const methods = contact.methods
    .map((method) => {
      const isExternal = method.href.startsWith("http");
      const target = isExternal ? ' target="_blank" rel="noreferrer"' : "";

      return `
        <a class="contact-card contact-link" href="${method.href}"${target}>
          <span class="contact-label">${escapeHtml(method.label)}</span>
          <strong class="contact-value">${escapeHtml(method.value)}</strong>
        </a>
      `;
    })
    .join("");

  return `
    <section id="${contact.id}" class="section-shell mt-8">
      <div class="max-w-3xl">
        <span class="section-kicker">${escapeHtml(contact.kicker)}</span>
        <h2 class="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">${escapeHtml(contact.title)}</h2>
        <p class="mt-4 text-sm leading-8 text-slate-600 sm:text-base">${escapeHtml(contact.description)}</p>
      </div>

      <div class="contact-layout mt-8">
        <div class="contact-grid">
          ${methods}
        </div>

        <div class="contact-form-shell">
          <h3 class="text-xl font-black text-slate-900">${escapeHtml(contact.form.title)}</h3>
          <p class="mt-3 text-sm leading-8 text-slate-600 sm:text-base">${escapeHtml(contact.form.description)}</p>

          <form class="mt-6 grid gap-4" data-contact-form data-recipient="${escapeHtml(
            contact.form.recipient
          )}" data-subject-prefix="${escapeHtml(contact.form.subjectPrefix)}">
            <label class="field-label">
              ${escapeHtml(contact.form.fields.name.label)}
              <input class="field-input" type="text" name="name" placeholder="${escapeHtml(
                contact.form.fields.name.placeholder
              )}">
            </label>

            <label class="field-label">
              ${escapeHtml(contact.form.fields.contact.label)}
              <input class="field-input" type="text" name="contact" placeholder="${escapeHtml(
                contact.form.fields.contact.placeholder
              )}">
            </label>

            <label class="field-label">
              ${escapeHtml(contact.form.fields.message.label)}
              <textarea class="field-textarea" name="message" placeholder="${escapeHtml(
                contact.form.fields.message.placeholder
              )}"></textarea>
            </label>

            <button class="submit-button" type="submit">${escapeHtml(contact.form.submitLabel)}</button>
          </form>

          <p class="helper-text">${escapeHtml(contact.form.helper)}</p>
        </div>
      </div>
    </section>
  `;
}

function renderFooter(footer) {
  return `
    <footer class="section-shell mt-8">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-3xl">
          <h2 class="text-xl font-black text-slate-900">${escapeHtml(footer.title)}</h2>
          <p class="mt-3 text-sm leading-8 text-slate-600 sm:text-base">${escapeHtml(footer.summary)}</p>
        </div>
        <a href="#top" class="jump-link">
          ${escapeHtml(footer.backToTopLabel)}
        </a>
      </div>
    </footer>
  `;
}

function bindContactForm() {
  const form = document.querySelector("[data-contact-form]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const recipient = form.dataset.recipient || "";
    const subjectPrefix = form.dataset.subjectPrefix || "پیام جدید";
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = name ? `${subjectPrefix} - ${name}` : subjectPrefix;
    const body = [
      `نام: ${name || "-"}`,
      `راه ارتباطی: ${contact || "-"}`,
      "",
      "متن پیام:",
      message || "-",
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  });
}

function renderError() {
  const localHint =
    window.location.protocol === "file:"
      ? `<p class="status-text">این نسخه برای خواندن فایل JSON به یک سرور ساده نیاز دارد. مثلاً می‌توانید داخل پوشه پروژه دستور <code>python3 -m http.server 4173</code> را اجرا کنید و بعد صفحه را از آدرس <code>http://localhost:4173</code> باز کنید.</p>`
      : `<p class="status-text">فایل JSON یا مسیر آن در دسترس نیست. یک بار ساختار فایل‌ها را بررسی کنید و دوباره صفحه را باز کنید.</p>`;

  app.innerHTML = `
    <section class="error-shell">
      <span class="section-kicker">خطا در بارگذاری</span>
      <h1 class="status-title">خواندن داده‌ها از JSON انجام نشد</h1>
      ${localHint}
    </section>
  `;
}

function toPersianNumber(value, minimumIntegerDigits = 1) {
  return new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits,
    useGrouping: false,
  }).format(value);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
