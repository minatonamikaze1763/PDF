// ========= Global ==========
const workspace = document.querySelector('.workspace');

// ========= Tool Templates ==========
const tools = {
  merge: `
<div class="container">
  <h1><i class="fa-solid fa-code-merge"></i> Merge PDF Files</h1>
  <label class="dropZone" id="mergeDropZone" for="mergePdfFiles">
    Drag & Drop or Click to Upload PDF Files
  </label>
  <input type="file" id="mergePdfFiles" multiple accept=".pdf" />
  <button id="mergeGenerateBtn">Generate Merged PDF</button>
  <div id="mergeStatus"></div>
  <div id="mergeFileList"></div>
</div>
  `,
  
  split: `
    <div class="container">
      <h1><i class="fa-solid fa-arrows-split-up-and-left"></i>  Split PDF File</h1>
      <label class="dropZone" for="splitPdf">Select or Drop a PDF File</label>
      <input type="file" id="splitPdf" accept=".pdf" />
      <div class="split-options">
        <label>Page Range (e.g., 1-3 or 5):</label>
        <input type="text" id="pageRange" placeholder="Enter pages to split..." />
      </div>
      <button id="splitBtn">Split PDF</button>
      <div id="status"></div>
    </div>
  `,
  
  pdfToWord: `
    <div class="container">
      <h1><i class="fa-solid fa-file-word"></i> PDF ➜ Word Converter</h1>
      <label class="dropZone" for="pdfFiles">Select or Drop PDF File</label>
      <input type="file" id="pdfFiles" accept=".pdf" />
      <button id="convertBtn">Convert to Word</button>
      <div id="status"></div>
    </div>
  `,
  
  wordToPdf: `
    <div class="container">
      <h1><i class="fa-solid fa-file-word"></i> Word ➜ PDF Converter</h1>
      <label class="dropZone" for="docFiles">Select or Drop Word Files</label>
      <input type="file" id="docFiles" multiple accept=".doc,.docx" />
      <button id="convertBtn">Convert to PDF</button>
      <div id="status"></div>
    </div>
  `,
  
  pdfToExcel: `
    <div class="container">
      <h1><i class="fa-solid fa-file-excel"></i> PDF ➜ Excel Converter</h1>
      <label class="dropZone" for="pdfToExcelFiles">Select or Drop PDF File</label>
      <input type="file" id="pdfToExcelFiles" accept=".pdf" />
      <button id="convertBtn">Convert to Excel</button>
      <div id="status"></div>
    </div>
  `,
  
  excelToPdf: `
    <div class="container">
      <h1><i class="fa-solid fa-file-excel"></i> Excel ➜ PDF Converter</h1>
      <label class="dropZone" for="excelFiles">Select Excel Files</label>
      <input type="file" id="excelFiles" multiple accept=".xls,.xlsx" />
      <button id="convertBtn">Convert to PDF</button>
      <div id="status"></div>
    </div>
  `,
  
  jpgToPdf: `
    <div class="container">
      <h1><i class="fa-solid fa-file-image"></i>  JPG ➜ PDF Converter</h1>
      <label class="dropZone" for="jpgFiles">Select Image Files</label>
      <input type="file" id="jpgFiles" multiple accept=".jpg,.jpeg,.png" />
      <button id="convertBtn">Convert to PDF</button>
      <div id="status"></div>
    </div>
  `,
  pdfToJpg: `
  <div class="container">
    <h1><i class="fa-solid fa-file-image"></i>  PDF ➜ JPG Converter</h1>
    <label class="dropZone" for="pdfToJpgInput">Select PDF File</label>
    <input type="file" id="pdfToJpgInput" accept=".pdf" />
    <button id="convertToJpgBtn">Convert to JPG</button>
    <div id="status"></div>
    <div id="outputImages" class="output-images"></div>
  </div>
`,
  pdfEditor: `
    <div class="container">
      <h1><i class="fa-solid fa-pen-to-square"></i>  PDF Text Editor</h1>
      <p>Upload a PDF to preview and edit text.</p>
      <input type="file" id="pdfEditorFile" accept=".pdf" />
      <canvas id="pdfCanvas" style="border:1px solid #ccc; width:100%; margin-top:1rem;"></canvas>
      <button id="saveEditedPdf">Save Edited PDF</button>
    </div>
  `,
  
  organizer: `
    <div class="container">
      <h1>PDF Organizer</h1>
      <p>Add, Delete, Rotate, or Reorder Pages</p>
      <input type="file" id="pdfOrgFile" accept=".pdf" />
      <div id="organizeTools">
        <button id="addPage">Add Page</button>
        <button id="deletePage">Delete Page</button>
        <button id="rotatePage">Rotate</button>
        <button id="reorderPage">Reorder</button>
      </div>
    </div>
  `
};

// ========= Initialization ==========
function loadTool(toolName) {
  workspace.innerHTML = tools[toolName] || `<div class="container"><h1>Tool Coming Soon!</h1></div>`;
  initTool(toolName);
}

// ========= Default Load ==========
loadTool('merge');

// ========= Sidebar Navigation ==========
document.querySelectorAll('.tool-section li').forEach((item) => {
  item.addEventListener('click', () => {
    const text = item.textContent.trim().toLowerCase();
        
    if (text.includes('merge')) loadTool('merge');
    else if (text.includes('split')) loadTool('split');
    else if (text.includes('pdf to word')) loadTool('pdfToWord');
    else if (text.includes('word to pdf')) loadTool('wordToPdf');
    else if (text.includes('pdf to excel')) loadTool('pdfToExcel');
    else if (text.includes('excel to pdf')) loadTool('excelToPdf');
    else if (text.includes('jpg to pdf')) loadTool('jpgToPdf');
    else if (text.includes('pdf to jpg')) loadTool('pdfToJpg');
    else if (text.includes('edit')) loadTool('pdfEditor');
    else if (text.includes('organize') || text.includes('delete') || text.includes('rotate')) loadTool('organizer');
    else loadTool('merge');
  });
});
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    e.target.classList.add('active');
  });
});
// ========= Tool Initializers ==========
function initTool(name) {
  switch (name) {
    case 'merge':
      initMerge();
      break;
    case 'split':
      initSplit();
      break;
    case 'pdfToWord':
      initPdfToWord();
      break;
    case 'wordToPdf':
      initWordToPdf();
      break;
    case 'pdfToExcel':
      initPdfToExcel();
      break;
    case 'excelToPdf':
      initExcelToPdf();
      break;
    case 'jpgToPdf':
      initJpgToPdf();
      break;
    case 'pdfToJpg':
      initPdfToJpg();
      break;
    case 'pdfEditor':
      initPdfEditor();
      break;
    case 'organizer':
      initOrganizer();
      break;
  }
}

// ========= Empty Tool Handlers (for now) ==========
function initMerge() {
  const dropZone = document.getElementById('mergeDropZone');
  const pdfInput = document.getElementById('mergePdfFiles');
  const fileListDiv = document.getElementById('mergeFileList');
  const generateBtn = document.getElementById('mergeGenerateBtn');
  const statusDiv = document.getElementById('mergeStatus');
  
  let mergeFiles = [];
  let sortAsc = true;
  
  // 📁 Manual file selection
  pdfInput.addEventListener('change', (e) => handleMergeFiles(e.target.files, true));
  
  // 📂 Drag & drop behavior
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    handleMergeFiles(e.dataTransfer.files, false);
  });
  
  // ✅ Handle file logic
  function handleMergeFiles(files, replace = false) {
    const validFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    
    mergeFiles = replace ? validFiles : [...mergeFiles, ...validFiles];
    
    // Remove duplicates by file name
    mergeFiles = mergeFiles.filter(
      (file, index, self) => index === self.findIndex(f => f.name === file.name)
    );
    
    pdfInput.value = ''; // clear file input
    renderFileList();
  }
  
  // 🧾 Display selected files
  function renderFileList() {
    if (mergeFiles.length === 0) {
      fileListDiv.innerHTML = "<p>No PDF files selected.</p>";
      return;
    }
    
    fileListDiv.innerHTML = `
      <div class="file-list">
        <span class="indicator">📄 ${mergeFiles.length} file(s) selected</span>
        <button id="mergeSortBtn" type="button">
          ${sortAsc ? "Sort ↓ (Z-A)" : "Sort ↑ (A-Z)"}
        </button>
        <ul>
          ${mergeFiles.map((f, i) => `
            <li>
              <span class="file-name">${i + 1}. ${f.name}</span>
              <button class="remove-btn" data-index="${i}" type="button" aria-label="Remove file">✖</button>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    
    // Sorting logic
    const sortBtn = document.getElementById('mergeSortBtn');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        sortAsc = !sortAsc;
        mergeFiles.sort((a, b) => sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        renderFileList();
      });
    }
    
    // Remove file buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.dataset.index);
        if (!Number.isFinite(idx) || idx < 0 || idx >= mergeFiles.length) return;
        mergeFiles.splice(idx, 1);
        renderFileList();
      });
    });
  }
  
  // 🧩 Merge action
  generateBtn.addEventListener('click', async () => {
    if (mergeFiles.length === 0) {
      alert('Please select at least one PDF file!');
      return;
    }
    
    statusDiv.textContent = 'Merging PDFs... Please wait.';
    
    try {
      const mergedPdf = await PDFLib.PDFDocument.create();
      
      for (const file of mergeFiles) {
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
}
function initPdfEditor(param) {}

function initSplit() {
  const btn = document.getElementById('splitBtn');
  btn.addEventListener('click', () => alert("Split function not implemented yet."));
}

function initPdfToWord() {
  const btn = document.getElementById('convertBtn');
  btn.addEventListener('click', () => alert("PDF ➜ Word function not implemented yet."));
}

function initWordToPdf() {
  const btn = document.getElementById('convertBtn');
  btn.addEventListener('click', () => alert("Word ➜ PDF function not implemented yet."));
}

function initPdfToExcel() {
  const btn = document.getElementById('convertBtn');
  btn.addEventListener('click', () => alert("PDF ➜ Excel function not implemented yet."));
}

function initExcelToPdf() {
  const btn = document.getElementById('convertBtn');
  btn.addEventListener('click', () => alert("Excel ➜ PDF function not implemented yet."));
}

function initJpgToPdf() {
  const btn = document.getElementById('convertBtn');
  btn.addEventListener('click', () => alert("JPG ➜ PDF function not implemented yet."));
}

async function initPdfToJpg() {
  const fileInput = document.getElementById("pdfToJpgInput");
  const status = document.getElementById("status");
  const outputContainer = document.getElementById("outputImages");
  
  if (!fileInput.files.length) {
    status.textContent = "⚠️ Please select a PDF first!";
    return;
  }
  
  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  outputContainer.innerHTML = "";
  status.textContent = "Converting... Please wait.";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({ canvasContext: context, viewport }).promise;
    
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const img = document.createElement("img");
    img.src = imgData;
    img.classList.add("converted-image");
    
    const link = document.createElement("a");
    link.href = imgData;
    link.download = `page-${i}.jpg`;
    link.textContent = `Download Page ${i}`;
    link.classList.add("download-link");
    
    const block = document.createElement("div");
    block.classList.add("image-block");
    block.append(img, link);
    outputContainer.append(block);
  }
  
  status.textContent = `✅ Converted ${pdf.numPages} page(s) successfully!`;
}

function initPdfEditor() {
  const saveBtn = document.getElementById('saveEditedPdf');
  saveBtn.addEventListener('click', () => alert("PDF Editor save not implemented yet."));
}

function initOrganizer() {
  document.getElementById('addPage').addEventListener('click', () => alert("Add Page feature not implemented yet."));
  document.getElementById('deletePage').addEventListener('click', () => alert("Delete Page feature not implemented yet."));
  document.getElementById('rotatePage').addEventListener('click', () => alert("Rotate feature not implemented yet."));
  document.getElementById('reorderPage').addEventListener('click', () => alert("Reorder feature not implemented yet."));
}