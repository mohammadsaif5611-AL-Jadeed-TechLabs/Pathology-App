const app = document.getElementById("app");

/* ===============================
   LOAD TEST LIST
================================ */
async function loadTests() {
  const res = await fetch("tests.json");
  return await res.json();
}

/* ===============================
   FIRST SCREEN
================================ */
async function showTestSelector() {
  app.innerHTML = "<h2>Select Test</h2>";

  const tests = await loadTests();

  tests.forEach(test => {
    const btn = document.createElement("button");
    btn.innerText = test.name;
    btn.onclick = () => loadTest(test.file);
    app.appendChild(btn);
  });
}

/* ===============================
   LOAD TEST FILE
================================ */
function loadTest(file) {
  app.innerHTML = "Loading...";
  const script = document.createElement("script");
  script.src = file;
  script.onload = () => {
    if (typeof loadTestForm === "function") {
      loadTestForm();
    }
  };
  document.body.appendChild(script);
}

/* START APP */
showTestSelector();
