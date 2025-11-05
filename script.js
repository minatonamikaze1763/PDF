const dropZone = document.getElementById('dropZone');
const pdfInput = document.getElementById('pdfFiles');
const fileNameDiv = document.getElementById('fileName');
const generateBtn = document.getElementById('generateBtn');
const statusDiv = document.getElementById('status');

let pdfFiles = [];
let sortAsc = true;

// 📁 Handle manual selection
pdfInput.addEventListener('change', (e) => handleFiles(e.target.files, true));

// 📂 Handle drag & drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragging');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragging');
  handleFiles(e.dataTransfer.files, false);
});

// ✅ Handle file selection logic
function handleFiles(files, replace = false) {
  const validFiles = Array.from(files).filter(f => f.type === 'application/pdf');
  
  // If user opened file dialog → replace old list
  // If drag-and-drop → append to existing
  pdfFiles = replace ? validFiles : [...pdfFiles, ...validFiles];
  
  // Remove duplicates by filename
  pdfFiles = pdfFiles.filter(
    (file, index, self) => index === self.findIndex(f => f.name === file.name)
  );
  
  pdfInput.value = ''; // clear input after use
  displayFiles();
}

// 🧾 Display list with sort & remove buttons
function displayFiles() {
  if (pdfFiles.length === 0) {
    fileNameDiv.innerHTML = "<p>No PDF files selected.</p>";
    return;
  }
  
  // render list (numbered via CSS list-style or you can add numbers manually)
  fileNameDiv.innerHTML = `
    <div class="file-list">
<span class="indicator">Total PDF Files loaded: ${pdfFiles.length}</span>     
<button id="sortBtn" type="button">${sortAsc ? "Sort ↓ (Z-A)" : "Sort ↑ (A-Z)"}</button>
      <ul>
        ${pdfFiles.map((f, i) => `
          <li>
            <span class="file-name">${i+1 + "."} ${f.name}</span>
            <button class="remove-btn" data-index="${i}" type="button" aria-label="Remove file">✖</button>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
  
  // attach sort listener (re-render after toggling)
  const sortBtn = document.getElementById('sortBtn');
  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      sortAsc = !sortAsc;
      pdfFiles.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      displayFiles();
    });
  }
  
  // attach remove listeners AFTER rendering the buttons
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      // Safety: if index invalid, do nothing
      if (!Number.isFinite(idx) || idx < 0 || idx >= pdfFiles.length) return;
      
      // remove the file and re-render
      pdfFiles.splice(idx, 1);
      displayFiles();
    });
  });
}

// 🧩 Merge PDFs
generateBtn.addEventListener('click', async () => {
  if (pdfFiles.length === 0) {
    alert('Please select at least one PDF file!');
    return;
  }
  
  statusDiv.textContent = 'Merging PDFs... Please wait.';
  
  try {
    const mergedPdf = await PDFLib.PDFDocument.create();
    
    for (const file of pdfFiles) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(bytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(p => mergedPdf.addPage(p));
    }
    
    const mergedBytes = await mergedPdf.save();
    const blob = new Blob([mergedBytes], { type: 'application/pdf' });
    saveAs(blob, `merged_${Date.now()}.pdf`);
    statusDiv.textContent = '✅ Merged PDF downloaded successfully!';
  } catch (err) {
    console.error(err);
    statusDiv.textContent = '❌ Error merging PDFs.';
  }
});