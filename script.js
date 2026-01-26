function onlyNumberCommaDot(el) {
  // allow digits, dot and comma only
  el.value = el.value.replace(/[^0-9.,]/g, "");

  // optional: prevent starting with comma or dot
  el.value = el.value.replace(/^[.,]+/, "");
}
