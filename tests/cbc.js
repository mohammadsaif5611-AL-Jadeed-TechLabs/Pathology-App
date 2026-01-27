// ================= GLOBAL LAYOUT CONSTANTS =================
const TOP_MARGIN = 56;     // ≈ old 160pt
const LEFT = 20;
const RIGHT = 195;
const FOOTER_GAP = 0;
const PAGE_BOTTOM = 270;

const L_LABEL = 20;   // Patient / Reff.By / Sample
const L_COLON = 36;  // : (left side)
const L_VALUE = 39;  // value start

const R_LABEL = 142; // Age/Sex / Date / LRN
const R_COLON = 160; // :
const R_VALUE = 163;



let bgImgBase64 = null;

let topImgBase64 = null;
let bottomImgBase64 = null;

function loadImages() {
  return Promise.all([
    loadImageToBase64("../assets/top.jpeg").then(b64 => topImgBase64 = b64),
    loadImageToBase64("../assets/bottom.jpeg").then(b64 => bottomImgBase64 = b64),
    loadImageToBase64("../assets/BG.jpg", "jpeg").then(b64 => bgImgBase64 = b64)
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
  console.log("Images loaded");
};


// ================= GENERATE PDF =================
function generatePDF() {

 
if (!topImgBase64 || !bottomImgBase64 || !bgImgBase64) {
  alert("Images still loading, please wait 1 second...");
  return;
}

const jsPDFLib =
  window.jspdf?.jsPDF || window.jsPDF;

if (!jsPDFLib) {
  alert("jsPDF library not loaded");
  return;
}



  


  const data = {
    "Patient Name": patient_name.value,
    "Reff. By": ref_by.value,
    "Sample": sample.value,
    "Age": age.value,
    "Sex": sex.value,
    "Date": date.value,
    "LRN": lrn.value,

    "Haemoglobin": Haemoglobin.value,
    "TLC": TLC.value,
    "Neutrophils": Neutrophils.value,
    "Lymphocytes": Lymphocytes.value,
    "Eosinophils": Eosinophils.value,
    "Monocytes": Monocytes.value,
    "Basophils": Basophils.value,
    "RBC": RBC.value,
    "HCT": HCT.value,
    "MCV": MCV.value,
    "MCH": MCH.value,
    "MCHC": MCHC.value,
    "RDW_CV": RDW_CV.value,
    "RDW_SD": RDW_SD.value,
    "Platelet": Platelet.value,
    "MPV": MPV.value,
    "PCT": PCT.value,
    "PDW": PDW.value
  };

  createCBCPdf(data, false); // NORMAL
  createCBCPdf(data, true);  // COLORED
}

// ================= CREATE CBC PDF =================
function createCBCPdf(data, colored = false) {
const jsPDFLib =
  window.jspdf?.jsPDF || window.jsPDF;

const pdf = new jsPDFLib("p", "mm", "a4");

// ---------- BACKGROUND IMAGE ----------
// ---------- BACKGROUND IMAGE (ONLY COLORED) ----------
if (colored && bgImgBase64) {
  const bgWidth = 150;
  const bgHeight = 120;
  const bgX = (210 - bgWidth) / 2;
  const bgY = 95; // 👈 thoda niche

  pdf.setGState(new pdf.GState({ opacity: 0.18 }));
  pdf.addImage(bgImgBase64, "JPEG", bgX, bgY, bgWidth, bgHeight);
  pdf.setGState(new pdf.GState({ opacity: 1 }));
}





  let y = TOP_MARGIN;

  // ---------- TOP IMAGE ----------
 if (colored && topImgBase64) {
  pdf.addImage(topImgBase64, "JPEG", 0, 0, 210, 52);
}


  // ---------- PATIENT DETAILS ----------
pdf.setFont("Helvetica", "bold");
pdf.setFontSize(11.2);

// -------- ROW 1 --------
pdf.text("Patient", L_LABEL, y);
pdf.text(":", L_COLON, y);
pdf.text(data["Patient Name"], L_VALUE, y);

pdf.text("Age/Sex", R_LABEL, y);
pdf.text(":", R_COLON, y);
pdf.text(`${data.Age} Yrs. / ${data.Sex}`, R_VALUE, y);

y += 7;

// -------- ROW 2 --------
pdf.text("Reff. By", L_LABEL, y);
pdf.text(":", L_COLON, y);
pdf.text(data["Reff. By"], L_VALUE, y);

pdf.text("Date", R_LABEL, y);
pdf.text(":", R_COLON, y);
pdf.text(data.Date, R_VALUE, y);

y += 7;

// -------- ROW 3 --------
pdf.text("Sample", L_LABEL, y);
pdf.text(":", L_COLON, y);
pdf.text(data.Sample, L_VALUE, y);

pdf.text("LRN.", R_LABEL, y);
pdf.text(":", R_COLON, y);
pdf.text(data.LRN, R_VALUE, y);

y += 15;


  // ---------- HEADING ----------
  pdf.setFontSize(13.2);
  pdf.text("COMPLETE BLOOD COUNT (CBC)", 105, y, { align: "center" });
  y += 10;

  // ---------- TABLE HEADER ----------
  pdf.setFontSize(12);
  pdf.rect(10, y - 6, 190, 8);
  pdf.text("INVESTIGATION", 20, y);
  pdf.text("RESULT", 90, y);
  pdf.text("UNIT", 120, y);
  pdf.text("REFERENCE RANGE", 149, y);

  y += 10;

  // ---------- PAGE BREAK ----------
 

  function nextPageCheck() {
  if (y > PAGE_BOTTOM) {
    pdf.addPage();

    // BACKGROUND AGAIN
// ---------- BACKGROUND IMAGE (ONLY COLORED) ----------
if (colored && bgImgBase64) {
  const bgWidth = 150;
  const bgHeight = 120;
  const bgX = (210 - bgWidth) / 2;
  const bgY = 95; // 👈 thoda niche

  pdf.setGState(new pdf.GState({ opacity: 0.18 }));
  pdf.addImage(bgImgBase64, "JPEG", bgX, bgY, bgWidth, bgHeight);
  pdf.setGState(new pdf.GState({ opacity: 1 }));
}



    y = TOP_MARGIN;
  }
}

// ---------- BACKGROUND IMAGE ----------


  // ---------- ROW FUNCTION ----------
 function row(name, result, unit, ref, sex, indent = 0) {

  nextPageCheck();

  let { flag, abnormal } = checkFlag(result, ref, sex);

  pdf.setFont("Helvetica", "normal");
  pdf.setTextColor(0);
  pdf.text(name, 20 + indent, y);

  if (abnormal) {
    pdf.setTextColor(255, 0, 0);
    pdf.setFont("Helvetica", "bold");
  }

  pdf.text(String(result), 90, y);
  if (flag) pdf.text(flag, 110, y);

  pdf.setTextColor(0);
  pdf.setFont("Helvetica", "normal");
  pdf.text(unit, 120, y);

  // ✅ FIXED REFERENCE COLUMN
  if (Array.isArray(ref)) {
  pdf.text(ref.join(" | "), 149, y);  // "F:11-16 | M:14-18"
} else {
  pdf.text(ref, 149, y);
}



 
y += 7; // row spacing


}


  // ================= CBC DATA (NO ROW REMOVED) =================
  row("HAEMOGLOBIN", data.Haemoglobin, "gm %", ["F: 11-16", "M: 14-18"], data.Sex);
  
  row("TOTAL LEUCOCYTE COUNT", data.TLC, "/cumm", ["4,000 - 10,000"], data.Sex);

  pdf.text("DIFF. LEUCOCYTE COUNT", 20, y);
  y += 6;

 row("NEUTROPHILS", data.Neutrophils, "%", ["40 - 75"], data.Sex, 10);
row("LYMPHOCYTES", data.Lymphocytes, "%", ["20 - 45"], data.Sex, 10);
row("EOSINOPHILS", data.Eosinophils, "%", ["1 - 6"], data.Sex, 10);
row("MONOCYTES", data.Monocytes, "%", ["2 - 10"], data.Sex, 10);
row("BASOPHILS", data.Basophils, "%", ["0 - 1"], data.Sex, 10);


  row("RBC", data.RBC, "million/cumm", ["F: 4.1- 4.7", "M: 4.7-5.4"], data.Sex);

  
  row("HCT", data.HCT, "%", ["F: 37- 47", "M: 40-54"], data.Sex);
  
  row("MCV", data.MCV, "fl", ["76 - 96"], data.Sex);
  row("MCH", data.MCH, "pg", ["27 - 34"], data.Sex);
  row("MCHC", data.MCHC, "g/dl", ["31 - 36"], data.Sex);
  row("RDW-CV", data.RDW_CV, "%", ["10 - 15"], data.Sex);
  row("RDW-SD", data.RDW_SD, "fl", ["39 - 46"], data.Sex);
  row("PLATELET COUNT", data.Platelet, "/cumm", ["1,50,000 - 4,50,000"], data.Sex);
  row("MPV", data.MPV, "fl", ["6.5 - 11"], data.Sex);
  row("PCT", data.PCT, " ", ["0.100 - 0.280"], data.Sex);
  row("PDW", data.PDW, "%", ["9.0 - 17.0"], data.Sex);

  // ---------- FOOTER ----------
  function drawFooter() {
    let footerY = y ;   // tight spacing under last row


    if (footerY + 45 > 297) {
      pdf.addPage();
      footerY = TOP_MARGIN;
    }

    pdf.line(10, footerY, 200, footerY);
    pdf.setFontSize(11);

    pdf.text(
      "P.NO : 1 *** ADVANCE BLOOD CLINICAL LABORATORY, WADNER BHOLJI ***",
      20,
      footerY + 6
    );

    pdf.text('"Thanks for Referral"', 150, footerY + 12);

    if (colored && bottomImgBase64) {
  const imgHeight = 30;
pdf.addImage(bottomImgBase64, "JPEG", 0, 297 - imgHeight, 210, imgHeight);

}

  }

  drawFooter();

  const suffix = colored ? "COLORED" : "NORMAL";
  pdf.save(`${data["Patient Name"]}_CBC_${suffix}.pdf`);
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
  const [low, high] = range.split("-").map(Number);
  if (val < low) return { flag: "L", abnormal: true };
  if (val > high) return { flag: "H", abnormal: true };
  return { flag: "", abnormal: false };
}
