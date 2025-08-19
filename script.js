(function () {
  const dobEl = document.getElementById("dob");
  const calcBtn = document.getElementById("calcBtn");
  const msg = document.getElementById("msg");
  const res = document.getElementById("result");

  const yearsEl = document.getElementById("years");
  const ymdEl = document.getElementById("ymd");
  const daysEl = document.getElementById("days");
  const nextEl = document.getElementById("next");
  const nextDateEl = document.getElementById("nextDate");
  const todayEl = document.getElementById("today");

  const fmt = new Intl.DateTimeFormat(undefined, { dateStyle: "full" });

  function clampToNoon(d) {
    const dd = new Date(d);
    dd.setHours(12, 0, 0, 0);
    return dd;
  }

  function diffYMD(from, to) {
    let y = to.getFullYear() - from.getFullYear();
    let m = to.getMonth() - from.getMonth();
    let d = to.getDate() - from.getDate();
    if (d < 0) {
      const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
      d += prevMonth;
      m -= 1;
    }
    if (m < 0) {
      m += 12;
      y -= 1;
    }
    return { y, m, d };
  }

  function isValidDateStr(str) {
    const d = new Date(str);
    return str && !Number.isNaN(d.valueOf());
  }

  function daysBetween(a, b) {
    const MS = 24 * 60 * 60 * 1000;
    return Math.round((clampToNoon(b) - clampToNoon(a)) / MS);
  }

  function nextBirthday(from, today) {
    const thisYear = new Date(
      today.getFullYear(),
      from.getMonth(),
      from.getDate()
    );
    let next = thisYear;
    if (clampToNoon(next) <= clampToNoon(today)) {
      next = new Date(today.getFullYear() + 1, from.getMonth(), from.getDate());
    }
    if (
      from.getMonth() === 1 &&
      from.getDate() === 29 &&
      next.getMonth() !== 1
    ) {
      next = new Date(next.getFullYear(), 1, 28);
    }
    return next;
  }

  function updateToday() {
    todayEl.textContent = "Today: " + fmt.format(new Date());
  }

  calcBtn.addEventListener("click", () => {
    msg.textContent = "";
    res.hidden = true;
    const val = dobEl.value;
    if (!isValidDateStr(val)) {
      msg.textContent = "Please enter a valid date of birth.";
      return;
    }

    const dob = clampToNoon(new Date(val));
    const now = clampToNoon(new Date());
    if (dob > now) {
      msg.textContent = "Date of birth cannot be in the future.";
      return;
    }

    const { y, m, d } = diffYMD(dob, now);
    yearsEl.textContent = y;
    ymdEl.textContent = `${y} years, ${m} months, ${d} days`;

    daysEl.textContent = daysBetween(dob, now).toLocaleString();

    const nb = nextBirthday(dob, now);
    nextEl.textContent = `${daysBetween(now, nb)} days`;
    nextDateEl.textContent = `on ${fmt.format(nb)}`;

    res.hidden = false;
  });

  (function setMax() {
    const now = new Date();
    dobEl.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  })();

  updateToday();
})();
