import { useState, useRef } from 'react';
import { Plus, Trash2, Download, Settings, Eye, Printer } from 'lucide-react';

export default function TracingWorksheetGenerator() {
  const [words, setWords] = useState([
    { id: 1, text: 'Cats', emoji: '🐱' },
    { id: 2, text: 'Ducks', emoji: '🦆' },
    { id: 3, text: 'Birds', emoji: '🐦' },
    { id: 4, text: 'Cows', emoji: '🐄' }
  ]);
  const [schoolName, setSchoolName] = useState('');
  const [schoolLogo, setSchoolLogo] = useState(null);
  const wordsPerPage = 2;
  const [repeatCount, setRepeatCount] = useState(12);
  const [lineCount, setLineCount] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRefs = useRef({});
  const logoInputRef = useRef(null);

  const addWord = () => {
    const newId = Math.max(...words.map(w => w.id), 0) + 1;
    setWords([...words, { id: newId, text: '', emoji: '📝' }]);
  };

  const updateWord = (id, field, value) => {
    setWords(words.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const deleteWord = (id) => {
    setWords(words.filter(w => w.id !== id));
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateWord(id, 'image', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (id, e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          updateWord(id, 'image', event.target.result);
        };
        reader.readAsDataURL(blob);
        e.preventDefault();
        break;
      }
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSchoolLogo(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateHTML = () => {
    const validWords = words.filter(w => w.text.trim());
    const pages = [];

    for (let i = 0; i < validWords.length; i += wordsPerPage) {
      pages.push(validWords.slice(i, i + wordsPerPage));
    }

    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tracing Worksheets</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      width: 100%;
      height: 100%;
    }

    body {
      font-family: 'Arial', sans-serif;
      background: white;
      color: #000;
    }

    .page {
      page-break-after: always;
      page-break-inside: avoid;
      width: 210mm;
      height: 297mm;
      padding: 12mm 15mm;
      display: flex;
      flex-direction: column;
      background: white;
      position: relative;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .page-header {
      display: grid;
      grid-template-columns: 70px 1fr;
      gap: 12px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 2px solid #000;
    }

    .logo-section {
      text-align: center;
      border: 2px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 70px;
      font-size: 9pt;
      color: #000;
      background: #fff;
    }

    .logo-section img {
      max-width: 100%;
      max-height: 70px;
      object-fit: contain;
    }

    .header-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      font-size: 11pt;
      font-weight: 600;
    }

    .school-name {
      grid-column: 1 / -1;
      font-size: 14pt;
      font-weight: 700;
      text-align: center;
      margin-bottom: 6px;
    }

    .header-item {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .header-label {
      font-weight: 700;
      min-width: 50px;
    }

    .header-line {
      flex: 1;
      border-bottom: 1px solid #000;
      min-height: 16px;
    }

    .word-block {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 1px solid #000;
      padding: 0;
      margin-bottom: 0;
    }

    .word-block:first-of-type {
      padding-top: 4px;
    }

    .word-block:last-child {
      border-bottom: none;
      padding-bottom: 4px;
    }

    .image-container {
      text-align: center;
      margin-bottom: 4px;
      min-height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .worksheet-image {
      max-width: 95%;
      max-height: 90px;
      object-fit: contain;
      filter: grayscale(100%) contrast(1.2) brightness(1.05);
      border: 1px solid #000;
      padding: 2px;
      background: white;
    }

    .emoji-placeholder {
      font-size: 85px;
      line-height: 1;
      color: #000;
      -webkit-text-stroke: 1.5px #000;
      text-stroke: 1.5px #000;
      paint-order: stroke fill;
    }

    .tracing-lines {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 3px;
      padding: 0 4px;
      flex: 1;
    }

    .trace-line {
      font-size: 24pt;
      font-weight: 700;
      font-family: 'Arial', sans-serif;
      letter-spacing: 0.5px;
      line-height: 1.5;
      color: #ddd;
      border-bottom: 1px solid #ddd;
      word-spacing: 0.3em;
      padding-bottom: 0;
      flex: 1;
      display: flex;
      align-items: center;
    }


    @media print {
      html {
        margin: 0;
        padding: 0;
        background: white;
      }

      body {
        margin: 0;
        padding: 0;
        background: white;
      }

      .print-button {
        display: none;
      }

      .page {
        page-break-after: always;
        page-break-inside: avoid;
        margin: 0;
        padding: 12mm 15mm;
        width: 210mm;
        height: 297mm;
        box-sizing: border-box;
        background: white;
        box-shadow: none;
      }

      .page:last-child {
        page-break-after: auto;
      }

      @page {
        size: A4 portrait;
        margin: 0;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        margin: 0;
        padding: 0;
      }
    }
  </style>
</head>
<body>

`;

    pages.forEach((pageWords, pageIdx) => {
      html += `<div class="page">`;

      if (pageIdx === 0) {
        html += `  <div class="page-header">
    <div class="logo-section">`;
        if (schoolLogo) {
          html += `<img src="${schoolLogo}" alt="Logo">`;
        } else {
          html += `Logo`;
        }
        html += `</div>
    <div>
      ${schoolName ? `<div class="school-name">${schoolName}</div>` : ''}
      <div class="header-info">
        <div class="header-item"><span class="header-label">Name:</span><span class="header-line"></span></div>
        <div class="header-item"><span class="header-label">Class:</span><span class="header-line"></span></div>
        <div class="header-item"><span class="header-label">Date:</span><span class="header-line"></span></div>
        <div class="header-item"><span class="header-label">Teacher:</span><span class="header-line"></span></div>
      </div>
    </div>
  </div>`;
      }

      pageWords.forEach((word, wordIdx) => {
        html += `  <div class="word-block">
    <div class="image-container">`;

        if (word.image) {
          html += `<img src="${word.image}" alt="${word.text}" class="worksheet-image">`;
        } else {
          html += `<div class="emoji-placeholder">${word.emoji}</div>`;
        }

        html += `</div>

    <div class="tracing-lines">`;

        for (let i = 0; i < lineCount; i++) {
          html += '<div class="trace-line">';
          const words_array = Array.from({length: repeatCount}).map(() => word.text);
          html += words_array.join(' ');
          html += '</div>';
        }

        html += `</div>
  </div>
`;
      });

      html += `</div>
`;
    });

    html += `
</body>
</html>`;

    return html;
  };

  const handleOpenInNewTab = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handlePrintPDF = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };


  const validWords = words.filter(w => w.text.trim());
  const totalPages = Math.ceil(validWords.length / wordsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Tracing Worksheet Generator</h1>
              <p className="text-sm text-gray-600 mt-1">
                📄 {totalPages} trang ({validWords.length} từ × {wordsPerPage} từ/trang) = {Math.ceil(totalPages/2)} mặt giấy
              </p>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900">Thông tin trường</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tên trường/Trung tâm</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="VD: Trường Tiểu học ABC"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Logo trường</label>
                <div className="flex gap-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    📷 Upload Logo
                  </button>
                  {schoolLogo && (
                    <button
                      onClick={() => setSchoolLogo(null)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      Xoá
                    </button>
                  )}
                </div>
                {schoolLogo && (
                  <img src={schoolLogo} alt="Logo preview" className="mt-2 h-12 object-contain" />
                )}
              </div>
            </div>
          </div>

          {showSettings && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-3">Cài đặt In</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Từ/dòng: {repeatCount}</label>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Số dòng: {lineCount}</label>
                  <input
                    type="range"
                    min="3"
                    max="6"
                    value={lineCount}
                    onChange={(e) => setLineCount(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {words.map((word) => (
              <div key={word.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-3 items-center mb-3">
                  <input
                    type="text"
                    value={word.text}
                    onChange={(e) => updateWord(word.id, 'text', e.target.value)}
                    placeholder="Nhập từ"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={word.emoji}
                    onChange={(e) => updateWord(word.id, 'emoji', e.target.value)}
                    placeholder="Emoji"
                    className="w-20 px-3 py-2 border rounded-lg text-center text-2xl"
                  />
                  <input
                    ref={el => fileInputRefs.current[word.id] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(word.id, e)}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current[word.id]?.click()}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    📷 Ảnh
                  </button>
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div
                  contentEditable
                  onPaste={(e) => handlePaste(word.id, e)}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center text-gray-500 cursor-text hover:border-blue-400 transition"
                  suppressContentEditableWarning
                >
                  {word.image ? (
                    <div className="relative inline-block">
                      <img src={word.image} alt="" className="max-h-24 rounded" />
                      <button
                        onClick={() => updateWord(word.id, 'image', null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span>📋 Ctrl+V để dán ảnh</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={addWord}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <Plus className="w-5 h-5" /> Thêm
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              <Eye className="w-5 h-5" /> {showPreview ? 'Ẩn' : 'Xem'}
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
            >
              <Printer className="w-5 h-5" /> IN PDF
            </button>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
            <div className="font-bold text-green-800 mb-1">✅ Hoàn thiện:</div>
            <div className="text-green-700">
              • 🎨 <strong>Emoji Coloring Page</strong> - Trắng bên trong, viền đen ngoài để tô màu
              <br/>• 📏 <strong>Full chiều ngang</strong> - {repeatCount} từ/dòng × {lineCount} dòng = {repeatCount * lineCount} lần trace
              <br/>• 👤 Header: Name, Class, Date, Teacher
              <br/>• 💾 {totalPages} trang = {Math.ceil(totalPages/2)} mặt giấy (in 2 mặt)
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="bg-white rounded-lg shadow-lg p-0 overflow-hidden">
            <h2 className="text-xl font-bold mb-4 p-6 pb-2">Xem trước (2 từ/trang)</h2>
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageWords = validWords.slice(pageIdx * wordsPerPage, (pageIdx + 1) * wordsPerPage);
              return (
                <div key={pageIdx} className="border border-gray-300 m-6 mt-2 bg-white" style={{width: '210mm', height: '297mm', padding: '12mm 15mm', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
                  {pageIdx === 0 && (
                    <div style={{display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '2px solid #000'}}>
                      <div style={{textAlign: 'center', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70px', fontSize: '9pt', color: '#000', background: '#fff'}}>
                        {schoolLogo ? (
                          <img src={schoolLogo} alt="Logo" style={{maxWidth: '100%', maxHeight: '70px', objectFit: 'contain'}} />
                        ) : (
                          'Logo'
                        )}
                      </div>
                      <div>
                        {schoolName && <div style={{fontSize: '14pt', fontWeight: 700, textAlign: 'center', marginBottom: '6px'}}>{schoolName}</div>}
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '11pt', fontWeight: 600}}>
                          <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                            <span style={{fontWeight: 700, minWidth: '50px'}}>Name:</span>
                            <span style={{flex: 1, borderBottom: '1px solid #000', minHeight: '16px'}}></span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                            <span style={{fontWeight: 700, minWidth: '50px'}}>Class:</span>
                            <span style={{flex: 1, borderBottom: '1px solid #000', minHeight: '16px'}}></span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                            <span style={{fontWeight: 700, minWidth: '50px'}}>Date:</span>
                            <span style={{flex: 1, borderBottom: '1px solid #000', minHeight: '16px'}}></span>
                          </div>
                          <div style={{display: 'flex', alignItems: 'baseline', gap: '6px'}}>
                            <span style={{fontWeight: 700, minWidth: '50px'}}>Teacher:</span>
                            <span style={{flex: 1, borderBottom: '1px solid #000', minHeight: '16px'}}></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {pageWords.map((word, idx) => (
                    <div key={word.id} style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottom: idx < pageWords.length - 1 ? '2px solid #000' : 'none', padding: 0}}>
                      <div style={{textAlign: 'center', marginBottom: '8px', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {word.image ? (
                          <img
                            src={word.image}
                            alt=""
                            style={{maxWidth: '95%', maxHeight: '120px', objectFit: 'contain', filter: 'grayscale(100%)', border: '2px solid #000', padding: '4px', background: 'white'}}
                          />
                        ) : (
                          <div
                            style={{
                              fontSize: '110px',
                              lineHeight: 1,
                              color: '#000',
                              WebkitTextStroke: '2px #000',
                              textStroke: '2px #000',
                              paintOrder: 'stroke fill'
                            }}
                          >
                            {word.emoji}
                          </div>
                        )}
                      </div>

                      <div style={{display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px', padding: '0 6px', flex: 1}}>
                        {Array.from({length: lineCount}).map((_, lineIdx) => (
                          <div
                            key={lineIdx}
                            style={{
                              fontSize: '22pt',
                              fontWeight: 700,
                              fontFamily: 'Arial, sans-serif',
                              letterSpacing: '1px',
                              lineHeight: 1.6,
                              color: '#ddd',
                              borderBottom: '1px solid #ddd',
                              wordSpacing: '0.35em',
                              paddingBottom: '1px',
                              flex: 1,
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {Array.from({length: repeatCount}).map((_, i) => word.text).join(' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
