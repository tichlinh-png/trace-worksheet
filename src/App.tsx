import { useState, useRef } from 'react';
import { Plus, Trash2, Download, Settings, Eye } from 'lucide-react';

export default function TracingWorksheetGenerator() {
  const [words, setWords] = useState([
    { id: 1, text: 'Cats', emoji: '🐱' },
    { id: 2, text: 'Ducks', emoji: '🦆' },
    { id: 3, text: 'Birds', emoji: '🐦' },
    { id: 4, text: 'Cows', emoji: '🐄' }
  ]);
  const [schoolName, setSchoolName] = useState('');
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [wordsPerPage, setWordsPerPage] = useState(2);
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
      margin: 10mm;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: white;
    }

    .page {
      page-break-after: always;
      page-break-inside: avoid;
      width: 100%;
      min-height: 277mm;
      padding: 5mm 0;
      display: flex;
      flex-direction: column;
    }

    .page:last-child {
      page-break-after: auto;
    }

    .page-header {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 15px;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 2px solid #000;
    }

    .logo-section {
      text-align: center;
      border: 2px dashed #999;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80px;
      font-size: 10pt;
      color: #999;
    }

    .logo-section img {
      max-width: 100%;
      max-height: 80px;
      object-fit: contain;
    }

    .header-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 20px;
      font-size: 10pt;
      font-weight: 500;
    }

    .school-name {
      grid-column: 1 / -1;
      font-size: 12pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 5px;
    }

    .word-block {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-bottom: 2px solid #000;
      padding: 8px 0;
    }

    .word-block:last-child {
      border-bottom: none;
    }

    .image-container {
      text-align: center;
      margin-bottom: 8px;
    }

    .worksheet-image {
      max-width: 90%;
      height: ${wordsPerPage === 2 ? '130px' : '100px'};
      object-fit: contain;
      filter: grayscale(100%) contrast(1.15) brightness(1.05);
      border: 2px solid #000;
      padding: 6px;
      background: white;
    }

    .emoji-placeholder {
      font-size: ${wordsPerPage === 2 ? '120px' : '100px'};
      line-height: 1;
      color: white;
      -webkit-text-stroke: 3px #000;
      text-stroke: 3px #000;
      paint-order: stroke fill;
      filter: drop-shadow(0 0 1px #000);
    }

    .tracing-lines {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 6px;
      padding: 0 5px;
    }

    .trace-line {
      font-size: ${wordsPerPage === 2 ? '16pt' : '14pt'};
      font-weight: bold;
      letter-spacing: 1px;
      line-height: 1.7;
      color: #e5e5e5;
      text-shadow:
        -1px -1px 0 #d5d5d5,
        1px -1px 0 #d5d5d5,
        -1px 1px 0 #d5d5d5,
        1px 1px 0 #d5d5d5;
      word-spacing: 0.3em;
    }

    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 1000;
    }

    .print-button:hover {
      background: #2563eb;
    }

    @media print {
      .print-button {
        display: none;
      }

      body {
        margin: 0;
      }

      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ In / Lưu PDF</button>

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
        <div>Name: ___________________</div>
        <div>Class: ___________________</div>
        <div>Date: ___________________</div>
        <div>Teacher: ___________________</div>
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

  const handleDownload = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tracing-worksheets.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Từ/trang: {wordsPerPage}</label>
                  <input
                    type="range"
                    min="2"
                    max="3"
                    value={wordsPerPage}
                    onChange={(e) => setWordsPerPage(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">2 = Rộng đẹp, 3 = Compact</span>
                </div>
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

          <div className="flex gap-3">
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
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              <Download className="w-5 h-5" /> MỞ ĐỂ IN
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              💾 Tải HTML
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Xem trước ({wordsPerPage} từ/trang)</h2>
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              const pageWords = validWords.slice(pageIdx * wordsPerPage, (pageIdx + 1) * wordsPerPage);
              return (
                <div key={pageIdx} className="border-2 border-gray-400 p-6 mb-4 bg-white">
                  {pageIdx === 0 && (
                    <div className="grid grid-cols-6 gap-3 mb-4 pb-4 border-b-2 border-gray-400">
                      <div className="col-span-1 border-2 border-dashed border-gray-400 flex items-center justify-center h-20 text-xs text-gray-400">
                        {schoolLogo ? (
                          <img src={schoolLogo} alt="Logo" className="max-h-full max-w-full object-contain" />
                        ) : (
                          'Logo'
                        )}
                      </div>
                      <div className="col-span-5">
                        {schoolName && <div className="text-sm font-bold text-center mb-2">{schoolName}</div>}
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs font-medium">
                          <div>Name: ___________________</div>
                          <div>Class: ___________________</div>
                          <div>Date: ___________________</div>
                          <div>Teacher: ___________________</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {pageWords.map((word, idx) => (
                    <div key={word.id} className={`${idx < pageWords.length - 1 ? 'border-b-2 border-gray-400 pb-4 mb-4' : ''}`}>
                      <div className="text-center mb-2">
                        {word.image ? (
                          <img
                            src={word.image}
                            alt=""
                            className="inline-block object-contain border-2 border-black p-1"
                            style={{
                              height: wordsPerPage === 2 ? '130px' : '100px',
                              filter: 'grayscale(100%)'
                            }}
                          />
                        ) : (
                          <div
                            className="inline-block"
                            style={{
                              fontSize: wordsPerPage === 2 ? '120px' : '100px',
                              color: 'white',
                              WebkitTextStroke: '3px #000',
                              textStroke: '3px #000',
                              paintOrder: 'stroke fill',
                              filter: 'drop-shadow(0 0 1px #000)'
                            }}
                          >
                            {word.emoji}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 px-2">
                        {Array.from({length: lineCount}).map((_, lineIdx) => (
                          <div
                            key={lineIdx}
                            className="font-bold text-gray-300"
                            style={{
                              fontSize: wordsPerPage === 2 ? '16pt' : '14pt',
                              textAlign: 'justify',
                              textAlignLast: 'justify',
                              letterSpacing: '1px',
                              wordSpacing: '0.3em'
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
