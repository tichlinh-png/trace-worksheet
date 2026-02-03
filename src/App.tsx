import { useState, useRef } from 'react';
import { Plus, Trash2, Printer } from 'lucide-react';

export default function TracingWorksheetGenerator() {
  const [words, setWords] = useState([
    { id: 1, text: 'Cats', emoji: '🐱' },
    { id: 2, text: 'Ducks', emoji: '🦆' },
    { id: 3, text: 'Birds', emoji: '🐦' },
    { id: 4, text: 'Cows', emoji: '🐄' }
  ]);
  const wordsPerPage = 2;
  const repeatCount = 12;
  const lineCount = 4;
  const fileInputRefs = useRef({});

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
      margin: 15mm;
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
      padding: 15mm;
      display: flex;
      flex-direction: column;
      background: white;
      position: relative;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: auto;
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
      min-height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .worksheet-image {
      max-width: 95%;
      max-height: 110px;
      object-fit: contain;
      filter: grayscale(100%) contrast(1.2) brightness(1.05);
      border: 1px solid #000;
      padding: 2px;
      background: white;
    }

    .emoji-placeholder {
      font-size: 100px;
      line-height: 1;
      color: #000;
      -webkit-text-stroke: 2px #000;
      text-stroke: 2px #000;
      paint-order: stroke fill;
    }

    .tracing-lines {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 8px;
      padding: 0 8px;
      flex: 1;
    }

    .trace-line {
      font-size: 26pt;
      font-weight: 700;
      font-family: 'Arial', sans-serif;
      letter-spacing: 1px;
      line-height: 1.6;
      color: #ddd;
      border-bottom: 1px solid #ddd;
      word-spacing: 0.35em;
      padding-bottom: 2px;
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

      .page {
        page-break-after: always;
        page-break-inside: avoid;
        margin: 0;
        padding: 15mm;
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
      }
    }
  </style>
</head>
<body>

`;

    pages.forEach((pageWords) => {
      html += `<div class="page">`;

      pageWords.forEach((word) => {
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
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Tracing Worksheet Generator</h1>
            <p className="text-sm text-gray-600">
              {totalPages} pages - {validWords.length} words
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {words.map((word) => (
              <div key={word.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={word.text}
                    onChange={(e) => updateWord(word.id, 'text', e.target.value)}
                    placeholder="Enter word"
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={word.emoji}
                    onChange={(e) => updateWord(word.id, 'emoji', e.target.value)}
                    placeholder="Emoji"
                    className="w-16 px-2 py-2 border rounded-lg text-center text-xl"
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
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                    title="Upload image"
                  >
                    Image
                  </button>
                  <button
                    onClick={() => deleteWord(word.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete word"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {word.image && (
                  <div className="mt-2 relative inline-block">
                    <img src={word.image} alt="" className="h-16 rounded border" />
                    <button
                      onClick={() => updateWord(word.id, 'image', null)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={addWord}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              <Plus className="w-5 h-5" /> Add Word
            </button>
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <Printer className="w-5 h-5" /> Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
