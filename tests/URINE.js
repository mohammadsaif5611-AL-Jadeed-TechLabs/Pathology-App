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

function toggleBileOther(sel) {
  const other = document.getElementById("Bpigment_other");
  other.style.display = sel.value === "OTHER" ? "block" : "none";
  if (sel.value !== "OTHER") other.value = "";
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

    Colour: Colour.value,
    Appearance: Appearance.value,

    Albumin: Albumin.value,
    Sugar: Sugar.value,
    Bsalt: Bsalt.value,
    Bpigment:
      Bpigment.value === "OTHER"
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
  pdf.text("RESULT", 140, y);
  y += 10;

  // ================= ROW FUNCTION =================
  function row(label, value, isManual = false) {
    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor(0);
    pdf.text(label, 20, y);
    pdf.text(":", 130, y);

    if (isManual) {
      pdf.setFont("Helvetica", "bold");
      pdf.setTextColor(255, 0, 0);
    }

    pdf.text(value || "-", 135, y);
    pdf.setTextColor(0);
    y += 7;
  }

  // ================= DATA =================
  pdf.setFont("Helvetica", "bold");
  pdf.text("PHYSICAL EXAMINATION", 20, y);
  y += 7;

  row("COLOUR", data.Colour);
  row("APPEARANCE", data.Appearance);

  y += 6;
  pdf.setFont("Helvetica", "bold");
  pdf.text("CHEMICAL EXAMINATION", 20, y);
  y += 7;

  row("ALBUMIN", data.Albumin);
  row("SUGAR", data.Sugar);
  row("BILE SALT", data.Bsalt);
  row("BILE PIGMENT", data.Bpigment, Bpigment.value === "OTHER");

  y += 6;
  pdf.setFont("Helvetica", "bold");
  pdf.text("MICROSCOPIC EXAMINATION", 20, y);
  y += 7;

  row("R.B.C.", data.RBC);
  row("PUS CELLS", data.Puscells);
  row("EPITHELIAL CELLS", data.Epithelialcells);
  row("AMORPHOUS MATERIAL", data.Amorphousmaterial);
  row("BACTERIA", data.Bacterial);
  row("CAST", data.Cast);
  row("CRYSTALS", data.Crystals);
  row("OTHER FINDINGS", data.Other);

  const suffix = colored ? "COLORED" : "NORMAL";
  pdf.save(`${data.patient}_URINE_${suffix}.pdf`);
}
