// ================= GLOBAL LAYOUT CONSTANTS =================
const TOP_MARGIN = 56;
const PAGE_BOTTOM = 270;

const L_LABEL = 20;
const L_COLON = 36;
const L_VALUE = 39;

const R_LABEL = 142;
const R_COLON = 160;
const R_VALUE = 163;

// ================= IMAGES =================
let bgImgBase64 = null;
let topImgBase64 = null;
let bottomImgBase64 = null;

function loadImages() {
  return Promise.all([
    loadImageToBase64("../assets/top.jpeg").then(b => topImgBase64 = b),
    loadImageToBase64("../assets/bottom.jpeg").then(b => bottomImgBase64 = b),
    loadImageToBase64("../assets/BG.jpg", "jpeg").then(b => bgImgBase64 = b),
  ]);
}

function loadImageToBase64(path, format = "png") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0);
      resolve(
        format === "jpeg"
          ? c.toDataURL("image/jpeg")
          : c.toDataURL("image/png")
      );
    };
    img.onerror = reject;
    img.src = path;
  });
}

window.onload = async () => {
  await loadImages();
};

// ================= HELPERS =================
function formatDateDDMMYY(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function toggleOther(select) {
  const otherInput = document.getElementById(select.id + "_other");
  if (!otherInput) return;

  if (select.value === "OTHER") {
    otherInput.style.display = "block";
    otherInput.required = true;
  } else {
    otherInput.style.display = "none";
    otherInput.value = "";
    otherInput.required = false;
  }
}



// ================= GENERATE PDF =================
function generatePDF() {
 const data = {
  patient: patient_name.value,
  refBy: ref_by.value,
  sample: sample.value,
  age: age.value,
  sex: sex.value,
  date: formatDateDDMMYY(date.value),
  lrn: lrn.value,

  Colour: getSelectValue("Colour"),
  Appearance: getSelectValue("Appearance"),

  Albumin: getSelectValue("Albumin"),
  Sugar: getSelectValue("Sugar"),
  Bsalt: getSelectValue("Bsalt"),
  Bpigment: getSelectValue("Bpigment"),

  RBC: getSelectValue("RBC"),
  Puscells: getSelectValue("Puscells"),
  Epithelialcells: getSelectValue("Epithelialcells"),
  Amorphousmaterial: getSelectValue("Amorphousmaterial"),
  Bacterial: getSelectValue("Bacterial"),
  Cast: getSelectValue("Cast"),
  Crystals: getSelectValue("Crystals"),
  Other: getSelectValue("Other"),
};


  createUrinePdf(data, false);
  createUrinePdf(data, true);
}

function getSelectValue(id) {
  const sel = document.getElementById(id);
  const other = document.getElementById(id + "_other");

  if (sel.value === "OTHER" && other && other.value.trim() !== "") {
    return other.value.trim();
  }
  return sel.value;
}
function isDefaultSelected(id) {
  const sel = document.getElementById(id);
  if (!sel) return true;

  const defaultOption = sel.options[sel.selectedIndex];
  return defaultOption.hasAttribute("selected");
}



// ================= CREATE PDF =================
function createUrinePdf(data, colored = false) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  if (colored && bgImgBase64) {
    pdf.setGState(new pdf.GState({ opacity: 0.18 }));
    pdf.addImage(bgImgBase64, "JPEG", 30, 95, 150, 120);
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  }

  if (colored && topImgBase64) {
    pdf.addImage(topImgBase64, "JPEG", 0, 0, 210, 52);
  }

  let y = TOP_MARGIN;

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text("Patient", L_LABEL, y);
  pdf.text(":", L_COLON, y);
  pdf.text(data.patient, L_VALUE, y);

  pdf.text("Age/Sex", R_LABEL, y);
  pdf.text(":", R_COLON, y);
  pdf.text(`${data.age} / ${data.sex}`, R_VALUE, y);

  y += 7;

  pdf.text("Reff. By", L_LABEL, y);
  pdf.text(":", L_COLON, y);
  pdf.text(data.refBy, L_VALUE, y);

  pdf.text("Date", R_LABEL, y);
  pdf.text(":", R_COLON, y);
  pdf.text(data.date, R_VALUE, y);

  y += 7;

  pdf.text("Sample", L_LABEL, y);
  pdf.text(":", L_COLON, y);
  pdf.text(data.sample, L_VALUE, y);

  pdf.text("LRN", R_LABEL, y);
  pdf.text(":", R_COLON, y);
  pdf.text(data.lrn, R_VALUE, y);

  y += 15;

  pdf.setFontSize(13);
  pdf.text("URINE ANALYSIS REPORT", 105, y, { align: "center" });
  y += 10;

  pdf.rect(10, y - 6, 190, 8);
  pdf.text("INVESTIGATION", 20, y);
  pdf.text("RESULT", 100, y);
  y += 10;

  // ================= ROW FUNCTION =================
  function row(label, value, isManual = false) {
    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor(0);
    pdf.text(label, 20, y);
    pdf.text(":", 100, y);

    if (isManual) {
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(255, 0, 0);
    }

    pdf.text(value || "-", 105, y);
    pdf.setTextColor(0);
    y += 7;
  }

  // ================= DATA =================
  pdf.setFont("Helvetica", "bold");
  pdf.text("PHYSICAL EXAMINATION", 20, y);
  y += 7;

// FIXED ROWS (hard-coded)
row("QUANTITY", "10 ML");
row("COLOUR", data.Colour, !isDefaultSelected("Colour"));
row("NATURE", "Random");
row("APPEARANCE", data.Appearance, !isDefaultSelected("Appearance"));
row("REACTION", "Acidic");


  y += 4;
  pdf.setFont("Helvetica", "bold");
  pdf.text("CHEMICAL EXAMINATION", 20, y);
  y += 7;

row("ALBUMIN", data.Albumin, !isDefaultSelected("Albumin"));

row("SUGAR", data.Sugar, !isDefaultSelected("Sugar"));
row("BILE SALT", data.Bsalt, !isDefaultSelected("Bsalt"));
row(
  "BILE PIGMENT",
  data.Bpigment,
  !isDefaultSelected("Bpigment")
);


  y += 4;
  pdf.setFont("Helvetica", "bold");
  pdf.text("MICROSCOPIC EXAMINATION", 20, y);
  y += 7;

row("R.B.C.", data.RBC, !isDefaultSelected("RBC"));
row("PUS CELLS", data.Puscells, !isDefaultSelected("Puscells"));
row("EPITHELIAL CELLS", data.Epithelialcells, !isDefaultSelected("Epithelialcells"));
row("AMORPHOUS MATERIAL", data.Amorphousmaterial, !isDefaultSelected("Amorphousmaterial"));
row("BACTERIA", data.Bacterial, !isDefaultSelected("Bacterial"));
row("CAST", data.Cast, !isDefaultSelected("Cast"));
row("CRYSTALS", data.Crystals, !isDefaultSelected("Crystals"));
row("OTHER FINDINGS", data.Other, !isDefaultSelected("Other"));




  // ---------- FOOTER ----------
function drawFooter() {
  const footerY = 250; // A4 safe footer position

  pdf.line(10, footerY, 200, footerY);
  pdf.setFontSize(11);

  pdf.text(
    "P.NO : 1 *** ADVANCE BLOOD CLINICAL LABORATORY, WADNER BHOLJI ***",
    20,
    footerY + 6
  );

  pdf.text('"Thanks for Referral"', 150, footerY + 12);

  // BOTTOM IMAGE (FIXED AT PAGE END)
  if (colored && bottomImgBase64) {
    const imgHeight = 30;
    pdf.addImage(
      bottomImgBase64,
      "JPEG",
      0,
      297 - imgHeight,
      210,
      imgHeight
    );
  }
}


  drawFooter();

   const suffix = colored ? "COLORED" : "NORMAL";
  pdf.save(`${data.patient}_URINE_${suffix}.pdf`);
}

// ================= FLAG LOGIC =================
function checkFlag(value, refList, sex) {
  const val = parseFloat(String(value).replace(/,/g, ""));
  sex = sex.toLowerCase();

  for (let ref of refList) {
    if (ref.includes(":")) {
      const [prefix, range] = ref.split(":");
      if (
        (prefix.toLowerCase() === "f" && sex.startsWith("f")) ||
        (prefix.toLowerCase() === "m" && sex.startsWith("m"))
      ) {
        return compare(val, range);
      }
    } else {
      return compare(val, ref);
    }
  }
  return { flag: "", abnormal: false };
}

function compare(val, range) {
  const clean = range.replace(/,/g, "");
  const [low, high] = clean.split("-").map(Number);

  if (val < low) return { flag: "L", abnormal: true };
  if (val > high) return { flag: "H", abnormal: true };
  return { flag: "", abnormal: false };
}
function toUpperCaseInput(el) {
  el.value = el.value.toUpperCase();
}

function onlyNumberCommaDot(el) {
  el.value = el.value.replace(/[^0-9.,]/g, "");
}

function autoSelectGender() {
  // optional – leave empty or remove call
}

