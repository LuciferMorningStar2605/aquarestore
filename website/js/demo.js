/* =========================================================
   AquaRestore — Demo Page Controller
   File upload, API call, comparison slider
   ========================================================= */

(function () {
  'use strict';

  const API_URL = window.AQUARESTORE_API || 'http://localhost:8000';

  // DOM
  const dropZone    = document.getElementById('drop-zone');
  const fileInput   = document.getElementById('file-input');
  const fileInfo    = document.getElementById('file-info');
  const fileName    = document.getElementById('file-name');
  const fileClear   = document.getElementById('file-clear');
  const errorMsg    = document.getElementById('error-msg');
  const restoreBtn  = document.getElementById('restore-btn');
  const placeholder = document.getElementById('placeholder-state');
  const resultState = document.getElementById('result-state');
  const imgRestored = document.getElementById('img-restored');
  const imgOriginal = document.getElementById('img-original');
  const imgOverlay  = document.getElementById('img-overlay');
  const sliderLine  = document.getElementById('slider-line');
  const sliderHandle= document.getElementById('slider-handle');
  const resultMeta  = document.getElementById('result-meta');
  const downloadBtn = document.getElementById('download-btn');
  const copyBtn     = document.getElementById('copy-btn');
  const slider      = document.getElementById('comparison-slider');

  let currentFile = null;
  let previewURL  = null;

  // ── File handling ──
  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      showError('File exceeds 10 MB limit.');
      return;
    }
    currentFile = file;
    previewURL = URL.createObjectURL(file);
    hideError();

    // Show preview in drop zone
    dropZone.classList.add('has-image');
    dropZone.innerHTML = '<img src="' + previewURL + '" alt="Preview" />';

    // Show file info
    fileInfo.style.display = 'flex';
    fileName.textContent = file.name + ' · ' + (file.size / 1024).toFixed(0) + ' KB';

    // Enable button
    restoreBtn.disabled = false;
  }

  function clearFile() {
    currentFile = null;
    if (previewURL) URL.revokeObjectURL(previewURL);
    previewURL = null;

    dropZone.classList.remove('has-image');
    dropZone.innerHTML = [
      '<svg class="drop-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
      '<rect x="8" y="12" width="32" height="24" rx="3"/><circle cx="18" cy="24" r="4"/>',
      '<path d="M8 32l10-8 6 4 8-6 8 6"/><path d="M24 4v8M20 8l4-4 4 4"/>',
      '</svg>',
      '<p style="font-weight:500;color:var(--text-deep);">Drop image here or click to browse</p>',
      '<p style="font-size:13px;color:var(--text-muted);margin-top:4px;">PNG, JPG up to 10 MB</p>',
    ].join('');

    fileInfo.style.display = 'none';
    restoreBtn.disabled = true;
    hideError();
  }

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }

  function hideError() {
    errorMsg.style.display = 'none';
  }

  // ── Events: drop zone ──
  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    handleFile(e.dataTransfer.files[0]);
  });

  fileInput.addEventListener('change', () => {
    handleFile(fileInput.files[0]);
    fileInput.value = '';
  });

  fileClear.addEventListener('click', clearFile);

  // ── Restore button ──
  restoreBtn.addEventListener('click', async () => {
    if (!currentFile) return;

    restoreBtn.disabled = true;
    restoreBtn.innerHTML = '<span class="spinner"></span> Processing...';
    hideError();

    const startTime = Date.now();

    try {
      const form = new FormData();
      form.append('file', currentFile);

      const res = await fetch(API_URL + '/restore', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        let errStr = 'Server error ' + res.status;
        try {
          const errData = await res.json();
          errStr = errData.detail || errStr;
        } catch (_) {}
        throw new Error(errStr);
      }

      const data = await res.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      // Show result
      showResult(data.restored, elapsed);
    } catch (err) {
      showError(err.message || 'Restoration failed. Check that the backend is running.');
    } finally {
      restoreBtn.disabled = false;
      restoreBtn.innerHTML = 'Restore Image →';
    }
  });

  // ── Show result ──
  function showResult(restoredBase64, elapsed) {
    const restoredSrc = restoredBase64.startsWith('data:')
      ? restoredBase64
      : 'data:image/jpeg;base64,' + restoredBase64;

    imgRestored.src = restoredSrc;
    imgOriginal.src = previewURL;

    placeholder.style.display = 'none';
    resultState.style.display = 'block';

    // Wait for images to load, then set slider to 50%
    imgRestored.onload = () => {
      setSlider(0.5);
      resultMeta.textContent = 'Processed in ' + elapsed + 's · Model: AquaRestore v1';
    };

    // Download link
    downloadBtn.href = restoredSrc;

    // Copy URL
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(restoredSrc).then(() => {
        copyBtn.textContent = 'Copied ✓';
        setTimeout(() => { copyBtn.textContent = 'Copy URL'; }, 2000);
      });
    };
  }

  // ── Comparison slider ──
  function setSlider(ratio) {
    const w = slider.offsetWidth;
    const pos = ratio * w;
    imgOverlay.style.width = pos + 'px';
    sliderLine.style.left = pos + 'px';
    sliderHandle.style.left = pos + 'px';
  }

  let isDragging = false;

  function startDrag(e) {
    isDragging = true;
    e.preventDefault();
  }

  function onDrag(e) {
    if (!isDragging) return;
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0.02, Math.min(0.98, ratio));
    setSlider(ratio);
  }

  function endDrag() {
    isDragging = false;
  }

  sliderHandle.addEventListener('mousedown', startDrag);
  sliderHandle.addEventListener('touchstart', startDrag, { passive: false });
  window.addEventListener('mousemove', onDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  // Also allow clicking anywhere on slider to set position
  slider.addEventListener('click', (e) => {
    const rect = slider.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    ratio = Math.max(0.02, Math.min(0.98, ratio));
    setSlider(ratio);
  });
})();
