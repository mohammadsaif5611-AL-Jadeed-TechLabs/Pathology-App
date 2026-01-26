// ===============================
// INPUT FILTER : Number, Comma, Dot
// ===============================
function onlyNumberCommaDot(el) {
  if (!el) return;

  // allow digits, comma and dot only
  el.value = el.value.replace(/[^0-9.,]/g, "");

  // prevent starting with dot or comma
  el.value = el.value.replace(/^[.,]+/, "");
}


// ===============================
// AUTO GENDER SELECT FROM NAME
// ===============================
function autoSelectGender() {
  const nameInput = document.getElementById("patient_name");
  const sexSelect = document.getElementById("sex");

  if (!nameInput || !sexSelect) return;

  const name = nameInput.value.trim().toUpperCase();

  if (name.startsWith("MR ")) {
    sexSelect.value = "Male";
  } 
  else if (
    name.startsWith("MRS ") ||
    name.startsWith("MS ") ||
    name.startsWith("MISS ")
  ) {
    sexSelect.value = "Female";
  }
}
