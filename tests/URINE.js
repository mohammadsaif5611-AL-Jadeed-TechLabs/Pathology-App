window.showTestSelector = window.showTestSelector;

export function loadTest() {
  const app = document.getElementById("app");

  app.innerHTML = `
  <button onclick="showTestSelector()">⬅ Back</button>

  <h2>Complete Blood Count (CBC)</h2>

  <h3>Patient Information</h3>

  <label>Patient Name</label>
  <input id="patient_name" value="MRS. SAFIYA ANJUM">

  <label>Reff. By</label>
  <input id="ref_by" value="DR. MUJAHID KHAN SIR">

  <label>Sample</label>
  <input id="sample" value="RECEIVED FROM OUTSIDE">

  <label>Age</label>
  <input id="age" type="number" value="22">

  <label>Sex</label>
  <select id="sex">
    <option>Male</option>
    <option>Female</option>
    <option>Other</option>
  </select>

  <label>Date</label>
  <input id="date" type="date">

  <label>LRN</label>
  <input id="lrn" value="0590">

  <h3>CBC Test Values</h3>

  <div class="grid">
    ${cbcField("Haemoglobin", "9.7")}
    ${cbcField("TLC", "9500")}
    ${cbcField("Neutrophils", "75")}
    ${cbcField("Lymphocytes", "21")}
    ${cbcField("Eosinophils", "02")}
    ${cbcField("Monocytes", "02")}
    ${cbcField("Basophils", "00")}

    ${cbcField("RBC", "3.53")}
    ${cbcField("HCT", "28.1")}
    ${cbcField("MCV", "82.40")}
    ${cbcField("MCH", "27.40")}
    ${cbcField("MCHC", "33.30")}
    ${cbcField("RDW_CV", "16.40")}
    ${cbcField("RDW_SD", "54.80")}
    ${cbcField("Platelet", "286000")}
    ${cbcField("MPV", "6.9")}
    ${cbcField("PCT", "0.197")}
    ${cbcField("PDW", "16.9")}
  </div>

  <button onclick="generateCBC()">Generate PDF</button>
  `;

  // default date
  document.getElementById("date").valueAsDate = new Date();

  // uppercase logic
  forceUppercase("patient_name");
  forceUppercase("ref_by");
  forceUppercase("sample");
}

/* ===============================
   FIELD GENERATOR
================================ */
function cbcField(name, value) {
  return `
  <div>
    <label>${name}</label>
    <input id="${name}" type="number" value="${value}">
  </div>
  `;
}

/* ===============================
   FORCE UPPERCASE + AUTO SEX
================================ */
function forceUppercase(id) {
  const el = document.getElementById(id);
  el.addEventListener("input", () => {
    el.value = el.value.toUpperCase();
    autoSexFromName(el.value);
  });
}

function autoSexFromName(text) {
  const sex = document.getElementById("sex");
  text = text.trim().toUpperCase();

  if (text.startsWith("MR.")) {
    sex.value = "Male";
  } else if (
    text.startsWith("MRS.") ||
    text.startsWith("MS.")
  ) {
    sex.value = "Female";
  }
}

/* ===============================
   SUBMIT (DATA SAME AS PYTHON)
================================ */
function generateCBC() {
  const data = {
    "Patient Name": v("patient_name"),
    "Reff. By": v("ref_by"),
    "Sample": v("sample"),
    "Age": v("age"),
    "Sex": v("sex"),
    "Date": v("date"),
    "LRN": v("lrn"),

    "Haemoglobin": v("Haemoglobin"),
    "TLC": v("TLC"),
    "Neutrophils": v("Neutrophils"),
    "Lymphocytes": v("Lymphocytes"),
    "Eosinophils": v("Eosinophils"),
    "Monocytes": v("Monocytes"),
    "Basophils": v("Basophils"),

    "RBC": v("RBC"),
    "HCT": v("HCT"),
    "MCV": v("MCV"),
    "MCH": v("MCH"),
    "MCHC": v("MCHC"),
    "RDW_CV": v("RDW_CV"),
    "RDW_SD": v("RDW_SD"),
    "Platelet": v("Platelet"),
    "MPV": v("MPV"),
    "PCT": v("PCT"),
    "PDW": v("PDW"),
  };

  console.log("CBC DATA", data);

  alert("PDF generation backend se connect karna hai");
}
<button id="backBtn">⬅ Back</button>
document.getElementById("backBtn").onclick = () => {
  window.showTestSelector();
};


function v(id) {
  return document.getElementById(id).value;
}
