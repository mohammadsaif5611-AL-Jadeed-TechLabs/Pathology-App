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


// only number and comma in input dot not allowed
//oninput="onlyNumberComma(this)"
function onlyNumberComma(input) {
  let value = input.value;

  // allow only digits and comma
  value = value.replace(/[^0-9,]/g, "");

  // allow only ONE comma
  const parts = value.split(",");
  if (parts.length > 2) {
    value = parts[0] + "," + parts.slice(1).join("");
  }

  input.value = value;
}

// only number and dot in input comma not allowed
//oninput="onlyNumberDot(this)"


function onlyNumberDot(input) {
  let value = input.value;

  // remove everything except digits and dot
  value = value.replace(/[^0-9.]/g, "");

  // allow only ONE dot
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  input.value = value;
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
// ===============================
// FORCE UPPERCASE INPUT
// ===============================
function toUpperCaseInput(el) {
  if (!el) return;
  el.value = el.value.toUpperCase();
}

function formatWithCommas(input) {
  let value = input.value.replace(/,/g, "");
  if (value === "") return;

  if (!isNaN(value)) {
    input.value = Number(value).toLocaleString("en-IN");
  }
}


