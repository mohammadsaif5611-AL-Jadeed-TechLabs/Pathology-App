// ================= GLOBAL LAYOUT CONSTANTS =================
const TOP_MARGIN = 56;
const LEFT = 20;
const RIGHT = 195;
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
    loadImageToBase64("../assets/top.jpeg").then(b64 => topImgBase64 = b64),
    loadImageToBase64("../assets/bottom.jpeg").then(b64 => bottomImgBase64 = b64),
    loadImageToBase64("../assets/BG.jpg", "jpeg").then(b64 => bgImgBase64 = b64),
  ]);
}

function loadImageToBase64(path, format = "png") {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(
        format === "jpeg"
          ? canvas.toDataURL("image/jpeg")
          : canvas.toDataURL("image/png")
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
function formatDateDDMMYY(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

function toggleBileOther(select) {
  const other = document.getElementById("Bpigment_other");
  if (select.value === "OTHER") {
    other.style.display = "block";
  } else {
    other.style.display = "none";
    other.value = "";
  }
}

// ================= GENERATE PDF =================
function generatePDF() {
  if (!topImgBase64 || !bottomImgBase64 || !bgImgBase64) {
    alert("Images still loading, please wait...");
    return;
  }

  const data = {
    patient: patient_name.value,
    refBy: ref_by.value,
    sample: sample.value,
    age: age.value,
    sex: sex.value,
    date: formatDateDDMMYY(date.value),
    lrn: lrn.value,

    Colour: Colour.value,
    Appearance: Appearance.value,

    Albumin: Albumin.value,
    Sugar: Sugar.value,
    Bsalt: Bsalt.value,
    Bpigment:
      Bpigment.value === "OTHER" && Bpigment_other.value
        ? Bpigment_other.value
        : Bpigment.value,

    RBC: RBC.value,
    Puscells: Puscells.value,
    Epithelialcells: Epithelialcells.value,
    Amorphousmaterial: Amorphousmaterial.value,
    Bacterial: Bacterial.value,
    Cast: Cast.value,
    Crystals: Crystals.value,
    Other: Other.value,
  };

  createUrinePdf(data, false);
  createUrinePdf(data, true);
}

// ================= CREATE PDF =================
function createUrinePdf(data, colored = false) {
  const jsPDFLib = window.jspdf.jsPDF;
  const pdf = new jsPDFLib("p", "mm", "a4");

  // ---------- BACKGROUND ----------
  if (colored && bgImgBase64) {
    pdf.setGState(new pdf.GState({ opacity: 0.18 }));
    pdf.addImage(bgImgBase64, "JPEG", 30, 95, 150, 120);
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  }

  // ---------- TOP IMAGE ----------
  if (colored && topImgBase64) {
    pdf.addImage(topImgBase64, "JPEG", 0, 0, 210, 52);
  }

  let y = TOP_MARGIN;

  // ---------- PATIENT DETAILS ----------
  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text("Patient", L_LABEL, y);
  pdf.text(":", L_COLON, y);
  pdf.text(data.patient, L_VALUE, y);

  pdf.text("Age/Sex", R_LABEL, y);
  pdf.text(":", R_COLON, y);
  pdf.text(`${data.age} Yrs / ${data.sex}`, R_VALUE, y);

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

  // ---------- TITLE ----------
  pdf.setFontSize(13);
  pdf.text("URINE ANALYSIS REPORT", 105, y, { align: "center" });
  y += 10;

  // ---------- TABLE HEADER ----------
  pdf.setFontSize(12);
  pdf.rect(10, y - 6, 190, 8);
  pdf.text("INVESTIGATION", 20, y);
  pdf.text("RESULT", 140, y);
  y += 10;

  // ---------- ROW FUNCTION ----------
  function row(label, value) {
    pdf.setFont("Helvetica", "normal");
    pdf.text(label, 20, y);
    pdf.text(":", 130, y);
    pdf.text(value || "-", 135, y);
    y += 7;
  }

  // ---------- PHYSICAL ----------
  pdf.setFont("Helvetica", "bold");
  pdf.text("PHYSICAL EXAMINATION", 20, y);
  y += 7;

  pdf.setFont("Helvetica", "normal");
  row("QUANTITY", "10 ML");
  row("COLOUR", data.Colour);
  row("NATURE", "Random");
  row("APPEARANCE", data.Appearance);
  row("REACTION", "Acidic");

  y += 6;

  // ---------- CHEMICAL ----------
  pdf.setFont("Helvetica", "bold");
  pdf.text("CHEMICAL EXAMINATION", 20, y);
  y += 7;

  pdf.setFont("Helvetica", "normal");
  row("ALBUMIN", data.Albumin);
  row("SUGAR", data.Sugar);
  row("BILE SALT", data.Bsalt);
  row("BILE PIGMENT", data.Bpigment);

  y += 6;

  // ---------- MICROSCOPIC ----------
  pdf.setFont("Helvetica", "bold");
  pdf.text("MICROSCOPIC EXAMINATION", 20, y);
  y += 7;

  pdf.setFont("Helvetica", "normal");
  row("R.B.C.", data.RBC);
  row("PUS CELLS", data.Puscells);
  row("EPITHELIAL CELLS", data.Epithelialcells);
  row("AMORPHOUS MATERIAL", data.Amorphousmaterial);
  row("BACTERIA", data.Bacterial);
  row("CAST", data.Cast);
  row("CRYSTALS", data.Crystals);
  row("OTHER FINDINGS", data.Other);

  // ---------- FOOTER ----------
  let footerY = 265;
  pdf.line(10, footerY, 200, footerY);
  pdf.setFontSize(11);
  pdf.text(
    "P.NO : 1 *** ADVANCE BLOOD CLINICAL LABORATORY, WADNER BHOLJI ***",
    20,
    footerY + 6
  );

  if (colored && bottomImgBase64) {
    pdf.addImage(bottomImgBase64, "JPEG", 0, 297 - 30, 210, 30);
  }

  const suffix = colored ? "COLORED" : "NORMAL";
  pdf.save(`${data.patient}_URINE_${suffix}.pdf`);
}
