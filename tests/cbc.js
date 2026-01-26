function generatePDF() {
  if (!window.jspdf) {
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

  createCBCPdf(data, false);
  createCBCPdf(data, true);
}

function createCBCPdf(data, colored = false) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  let y = 30;
  const pageBottom = 270;

  if (colored) {
    pdf.addImage("/assets/top.jpeg", "JPEG", 0, 0, 210, 30);
    y = 40;
  }

  pdf.setFont("Helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text(`Patient : ${data["Patient Name"]}`, 15, y);
  pdf.text(`Age/Sex : ${data.Age} / ${data.Sex}`, 140, y);

  y += 8;
  pdf.text(`Reff. By : ${data["Reff. By"]}`, 15, y);
  pdf.text(`Date : ${data.Date}`, 140, y);

  y += 8;
  pdf.text(`Sample : ${data.Sample}`, 15, y);
  pdf.text(`LRN : ${data.LRN}`, 140, y);

  y += 15;

  pdf.setFontSize(14);
  pdf.text("COMPLETE BLOOD COUNT (CBC)", 105, y, { align: "center" });
  y += 10;

  pdf.setFontSize(11);
  pdf.rect(10, y - 6, 190, 8);
  pdf.text("INVESTIGATION", 12, y);
  pdf.text("RESULT", 90, y);
  pdf.text("UNIT", 115, y);
  pdf.text("REFERENCE", 145, y);

  y += 10;

  function nextPageCheck() {
    if (y > pageBottom) {
      pdf.addPage();
      y = 20;
    }
  }

  function row(name, result, unit, ref, sex) {
    nextPageCheck();

    let { flag, abnormal } = checkFlag(result, ref, sex);

    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor(0);
    pdf.text(name, 12, y);

    if (abnormal) {
      pdf.setTextColor(255, 0, 0);
      pdf.setFont("Helvetica", "bold");
    }

    pdf.text(String(result), 90, y);
    if (flag) pdf.text(flag, 102, y);

    pdf.setTextColor(0);
    pdf.setFont("Helvetica", "normal");
    pdf.text(unit, 115, y);
    pdf.text(ref[0], 145, y);

    y += 7;
  }

  row("HAEMOGLOBIN", data.Haemoglobin, "g/dl", ["F:11-16", "M:14-18"], data.Sex);
  row("TOTAL LEUCOCYTE COUNT", data.TLC, "/cumm", ["4000-10000"], data.Sex);

  pdf.text("DIFF. LEUCOCYTE COUNT", 12, y);
  y += 6;

  row("NEUTROPHILS", data.Neutrophils, "%", ["40-75"], data.Sex);
  row("LYMPHOCYTES", data.Lymphocytes, "%", ["20-45"], data.Sex);
  row("EOSINOPHILS", data.Eosinophils, "%", ["1-6"], data.Sex);
  row("MONOCYTES", data.Monocytes, "%", ["2-10"], data.Sex);
  row("BASOPHILS", data.Basophils, "%", ["0-1"], data.Sex);

  row("RBC", data.RBC, "million/cumm", ["F:4.1-4.7", "M:4.7-5.4"], data.Sex);
  row("HCT", data.HCT, "%", ["F:37-47", "M:40-54"], data.Sex);
  row("MCV", data.MCV, "fl", ["76-96"], data.Sex);
  row("MCH", data.MCH, "pg", ["27-34"], data.Sex);
  row("MCHC", data.MCHC, "g/dl", ["31-36"], data.Sex);
  row("RDW-CV", data.RDW_CV, "%", ["10-15"], data.Sex);
  row("RDW-SD", data.RDW_SD, "fl", ["39-46"], data.Sex);
  row("PLATELET COUNT", data.Platelet, "/cumm", ["150000-450000"], data.Sex);
  row("MPV", data.MPV, "fl", ["6.5-11"], data.Sex);
  row("PCT", data.PCT, "%", ["0.100-0.280"], data.Sex);
  row("PDW", data.PDW, "%", ["9-17"], data.Sex);

  pdf.line(10, 270, 200, 270);
  pdf.setFontSize(9);
  pdf.text("P.NO : 1  *** ADVANCE BLOOD CLINICAL LABORATORY ***", 15, 276);
  pdf.text('"Thanks for Referral"', 160, 282);

  if (colored) {
    pdf.addImage("/assets/bottom.jpeg", "JPEG", 0, 287, 210, 30);
  }

  const suffix = colored ? "COLORED" : "NORMAL";
  pdf.save(`${data["Patient Name"]}_CBC_${suffix}.pdf`);
}

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
