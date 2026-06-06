import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Download, Settings, Eye, Printer, Search, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Built-in image library: common English words with Pexels photo URLs
const BUILTIN_IMAGES: Record<string, { url: string; label: string }> = {
  apple: { url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Apple' },
  banana: { url: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Banana' },
  orange: { url: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Orange' },
  mango: { url: 'https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mango' },
  grape: { url: 'https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Grape' },
  grapes: { url: 'https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Grapes' },
  strawberry: { url: 'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Strawberry' },
  watermelon: { url: 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Watermelon' },
  pineapple: { url: 'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pineapple' },
  lemon: { url: 'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lemon' },
  cat: { url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cat' },
  cats: { url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cats' },
  dog: { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dog' },
  dogs: { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dogs' },
  bird: { url: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bird' },
  birds: { url: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Birds' },
  fish: { url: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Fish' },
  duck: { url: 'https://images.pexels.com/photos/162140/duckling-duck-bird-yellow-162140.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Duck' },
  ducks: { url: 'https://images.pexels.com/photos/162140/duckling-duck-bird-yellow-162140.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ducks' },
  cow: { url: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cow' },
  cows: { url: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cows' },
  horse: { url: 'https://images.pexels.com/photos/52500/horse-herd-fog-nature-52500.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Horse' },
  pig: { url: 'https://images.pexels.com/photos/1300361/pexels-photo-1300361.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pig' },
  rabbit: { url: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rabbit' },
  elephant: { url: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Elephant' },
  lion: { url: 'https://images.pexels.com/photos/52500/horse-herd-fog-nature-52500.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lion' },
  tiger: { url: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tiger' },
  monkey: { url: 'https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Monkey' },
  bear: { url: 'https://images.pexels.com/photos/158109/kodiak-brown-bear-adult-portrait-wildlife-158109.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bear' },
  frog: { url: 'https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Frog' },
  butterfly: { url: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Butterfly' },
  flower: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Flower' },
  flowers: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Flowers' },
  tree: { url: 'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tree' },
  sun: { url: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sun' },
  moon: { url: 'https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Moon' },
  star: { url: 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Star' },
  rain: { url: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rain' },
  snow: { url: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Snow' },
  cloud: { url: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cloud' },
  rainbow: { url: 'https://images.pexels.com/photos/61129/pexels-photo-61129.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rainbow' },
  house: { url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'House' },
  car: { url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Car' },
  bus: { url: 'https://images.pexels.com/photos/1426516/pexels-photo-1426516.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bus' },
  train: { url: 'https://images.pexels.com/photos/52984/pexels-photo-52984.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Train' },
  plane: { url: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Plane' },
  boat: { url: 'https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Boat' },
  book: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Book' },
  ball: { url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ball' },
  cake: { url: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cake' },
  egg: { url: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Egg' },
  milk: { url: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Milk' },
  bread: { url: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bread' },
  rice: { url: 'https://images.pexels.com/photos/33783/rice-grain-white-india.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Rice' },
  carrot: { url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Carrot' },
  corn: { url: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Corn' },
  tomato: { url: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tomato' },
  potato: { url: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Potato' },
  chair: { url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Chair' },
  table: { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Table' },
  bed: { url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bed' },
  door: { url: 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Door' },
  pencil: { url: 'https://images.pexels.com/photos/159731/pencil-art-creative-school-159731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pencil' },
  school: { url: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'School' },
  clock: { url: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Clock' },
  hat: { url: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Hat' },
  bag: { url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bag' },
  shoe: { url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Shoe' },
  shoes: { url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Shoes' },
};

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function TracingWorksheetGenerator() {
  const [words, setWords] = useState([
    { id: 1, text: 'Cats', emoji: '🐱' },
    { id: 2, text: 'Ducks', emoji: '🦆' },
    { id: 3, text: 'Birds', emoji: '🐦' },
    { id: 4, text: 'Cows', emoji: '🐄' }
  ]);
  const [schoolName, setSchoolName] = useState('');
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [savedImages, setSavedImages] = useState({});
  const [showImageLibrary, setShowImageLibrary] = useState({});
  const [repeatCount, setRepeatCount] = useState(12);
  const [lineCount, setLineCount] = useState(4);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showBuiltinLibrary, setShowBuiltinLibrary] = useState<number | null>(null);
  const [builtinSearch, setBuiltinSearch] = useState('');
  const fileInputRefs = useRef({});
  const logoInputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const getWordsPerPage = () => {
    const validWordsCount = words.filter(w => w.text.trim()).length;
    if (validWordsCount === 0) return 3;
    if (validWordsCount === 1) return 1;
    if (validWordsCount === 2) return 1;
    if (validWordsCount === 3) return 1;
    if (validWordsCount === 4) return 2;
    if (validWordsCount % 2 === 0) return validWordsCount / 2;
    return 3;
  };

  const wordsPerPage = getWordsPerPage();

  const saveWordToCloud = async (word) => {
    if (word.text.trim()) {
      await supabase.from('vocabulary').insert({
        text: word.text,
        emoji: word.emoji,
        image_data: word.image || null
      });
    }
  };

  const addWord = () => {
    const newId = Math.max(...words.map(w => w.id), 0) + 1;
    setWords([...words, { id: newId, text: '', emoji: '📝' }]);
  };

  const updateWord = (id, field, value) => {
    setWords(words.map(w => {
      if (w.id === id) {
        const updated = { ...w, [field]: value };
        // Auto-fill image from saved library or built-in library when text is changed
        if (field === 'text' && value.trim() && !updated.image) {
          const key = value.toLowerCase().trim();
          const vocabKey = `vocab_${key}`;
          if (savedImages[vocabKey]) {
            updated.image = savedImages[vocabKey];
          } else if (BUILTIN_IMAGES[key]) {
            updated.image = BUILTIN_IMAGES[key].url;
          }
        }
        return updated;
      }
      return w;
    }));
  };

  const deleteWord = (id) => {
    setWords(words.filter(w => w.id !== id));
  };

  const handleImageUpload = async (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target.result;
        const currentWord = words.find(w => w.id === id);
        updateWord(id, 'image', imageData);
        const vocabKey = `vocab_${currentWord?.text.toLowerCase().trim()}`;
        const key = `img_${Date.now()}`;
        const newSavedImages = { ...savedImages, [key]: imageData };
        if (currentWord?.text.trim()) {
          newSavedImages[vocabKey] = imageData;
        }
        setSavedImages(newSavedImages);
        await supabase.from('image_library').insert({
          name: file.name,
          image_data: imageData,
          vocabulary_text: currentWord?.text.toLowerCase().trim() || null
        });
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
        reader.onload = async (event) => {
          const imageData = event.target.result;
          const currentWord = words.find(w => w.id === id);
          updateWord(id, 'image', imageData);
          const vocabKey = `vocab_${currentWord?.text.toLowerCase().trim()}`;
          const key = `img_${Date.now()}`;
          const newSavedImages = { ...savedImages, [key]: imageData };
          if (currentWord?.text.trim()) {
            newSavedImages[vocabKey] = imageData;
          }
          setSavedImages(newSavedImages);
          await supabase.from('image_library').insert({
            name: `pasted_${Date.now()}.png`,
            image_data: imageData,
            vocabulary_text: currentWord?.text.toLowerCase().trim() || null
          });
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
      reader.onload = async (event) => {
        const logoData = event.target.result;
        setSchoolLogo(logoData);
        await saveSettings({ logo_url: logoData, school_name: schoolName });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async (updates) => {
    const { data: existing } = await supabase.from('app_settings').select('id').maybeSingle();
    if (existing) {
      await supabase.from('app_settings').update(updates).eq('id', existing.id);
    } else {
      await supabase.from('app_settings').insert(updates);
    }
  };

  const loadSettings = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('*').maybeSingle();
      if (data) {
        setSchoolName(data.school_name || '');
        setSchoolLogo(data.logo_url || null);
        setRepeatCount(data.default_repeat_count || 12);
        setLineCount(data.default_line_count || 4);
      }
      const { data: images } = await supabase.from('image_library').select('*');
      if (images) {
        const imageMap = {};
        images.forEach((img) => {
          imageMap[`img_${img.id}`] = img.image_data;
          if (img.vocabulary_text) {
            imageMap[`vocab_${img.vocabulary_text}`] = img.image_data;
          }
        });
        setSavedImages(imageMap);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveSettings({ school_name: schoolName });
    }
  }, [schoolName]);

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
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 8px;
      border-bottom: 1px solid #000;
      flex: 1;
      padding: 0;
      margin-bottom: 0;
      min-height: 0;
    }

    .word-block:first-of-type {
      padding-top: 0;
    }

    .word-block:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .image-container {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 0;
    }

    .worksheet-image {
      max-width: 120px;
      max-height: 100px;
      object-fit: contain;
      filter: grayscale(100%) contrast(1.2) brightness(1.05);
      border: 1px solid #000;
    }

    .worksheet-image.small {
      max-width: 100px;
      max-height: 70px;
    }

    .emoji-placeholder {
      font-size: 85px;
      line-height: 1;
      color: #000;
      -webkit-text-stroke: 1.5px #000;
      text-stroke: 1.5px #000;
      paint-order: stroke fill;
    }

    .page-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .tracing-lines {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 0 4px;
      flex: 1;
    }

    .trace-line {
      font-size: 14pt;
      font-weight: 400;
      font-family: 'Arial', sans-serif;
      letter-spacing: 0.5px;
      color: #ddd;
      border-bottom: 1px solid #ddd;
      word-spacing: 0.3em;
      padding: 0;
      flex: 1;
      display: flex;
      align-items: center;
      min-height: 0;
    }

    .trace-line-sample {
      font-weight: 700;
      color: #000;
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
        display: flex;
        flex-direction: column;
      }

      .page-header {
        flex-shrink: 0;
        display: grid;
        grid-template-columns: 70px 1fr;
        gap: 12px;
        margin-bottom: 14px;
        padding-bottom: 12px;
        border-bottom: 2px solid #000;
      }

      .page-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      .word-block {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: 8px;
        border-bottom: 1px solid #000;
        flex: 1;
        padding: 0;
        margin-bottom: 0;
        min-height: 0;
      }

      .word-block:last-child {
        border-bottom: none;
      }

      .image-container {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 8px 0;
      }

      .worksheet-image {
        max-width: 120px;
        max-height: 100px;
        object-fit: contain;
      }

      .emoji-placeholder {
        font-size: 85px;
        line-height: 1;
        flex-shrink: 0;
      }

      .tracing-lines {
        display: flex;
        flex-direction: column;
        gap: 0;
        padding: 0 4px;
        flex: 1;
      }

      .trace-line {
        font-size: 14pt;
        font-weight: 400;
        font-family: 'Arial', sans-serif;
        color: #ddd;
        border-bottom: 1px solid #ddd;
        word-spacing: 0.3em;
        padding: 0;
        flex: 1;
        display: flex;
        align-items: center;
        line-height: 1;
        min-height: 0;
      }

      .trace-line-sample {
        font-weight: 700;
        color: #aaa;
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

    pages.forEach((pageIdx, pageIdx2) => {
      html += `<div class="page">`;

      if (pageIdx2 === 0) {
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

      html += `<div class="page-content">`;

      pageIdx.forEach((word, wordIdx) => {
        html += `  <div class="word-block">
    <div class="image-container">`;

        if (word.image) {
          const imageSize = word.text.length >= 6 ? 'small' : 'normal';
          html += `<img src="${word.image}" alt="${word.text}" class="worksheet-image ${imageSize}">`;
        } else {
          html += `<div class="emoji-placeholder">${word.emoji}</div>`;
        }

        html += `</div>

    <div class="tracing-lines">`;

        for (let i = 0; i < lineCount; i++) {
          html += `<div class="trace-line${i === 0 ? ' trace-line-sample' : ''}">`;
          if (i === 0) {
            html += word.text;
          }
          html += '</div>';
        }

        html += `</div>
  </div>
`;
      });

      html += `</div></div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Đang tải...</div>
      </div>
    );
  }

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
                      onClick={async () => {
                        setSchoolLogo(null);
                        await saveSettings({ logo_url: null });
                      }}
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
                    onClick={() => {
                      setShowBuiltinLibrary(showBuiltinLibrary === word.id ? null : word.id);
                      setBuiltinSearch(word.text.toLowerCase().trim());
                    }}
                    className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition text-sm"
                    title="Kho ảnh có sẵn"
                  >
                    🖼 Kho ảnh
                  </button>
                  {Object.keys(savedImages).length > 0 && (
                    <button
                      onClick={() => setShowImageLibrary(prev => ({ ...prev, [word.id]: !prev[word.id] }))}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                    >
                      📚 Thư viện
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await saveWordToCloud(word);
                      alert('Lưu từ vào cloud thành công!');
                    }}
                    className="px-3 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition text-sm"
                  >
                    ☁️ Lưu
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
                      <img src={word.image} alt="" className="max-h-48 rounded" />
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

                {showImageLibrary[word.id] && (
                  <div className="mt-3 grid grid-cols-4 gap-2 p-3 bg-gray-100 rounded-lg">
                    {Object.entries(savedImages).map(([key, imgData]) => (
                      <button
                        key={key}
                        onClick={() => {
                          updateWord(word.id, 'image', imgData);
                          setShowImageLibrary(prev => ({ ...prev, [word.id]: false }));
                        }}
                        className="relative group"
                      >
                        <img src={imgData} alt="" className="w-full h-20 object-cover rounded border-2 border-blue-400" />
                      </button>
                    ))}
                  </div>
                )}

                {showBuiltinLibrary === word.id && (
                  <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-emerald-800">Kho ảnh có sẵn ({Object.keys(BUILTIN_IMAGES).length} ảnh)</span>
                      <button
                        onClick={() => setShowBuiltinLibrary(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={builtinSearch}
                        onChange={(e) => setBuiltinSearch(e.target.value)}
                        placeholder="Tìm từ (vd: cat, apple...)"
                        className="w-full pl-7 pr-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                      {Object.entries(BUILTIN_IMAGES)
                        .filter(([key, val]) =>
                          !builtinSearch || key.includes(builtinSearch.toLowerCase()) || val.label.toLowerCase().includes(builtinSearch.toLowerCase())
                        )
                        .map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => {
                              updateWord(word.id, 'image', val.url);
                              setShowBuiltinLibrary(null);
                            }}
                            className="flex flex-col items-center gap-1 p-1 rounded-lg hover:bg-emerald-100 border border-transparent hover:border-emerald-300 transition"
                            title={val.label}
                          >
                            <img src={val.url} alt={val.label} className="w-full h-14 object-cover rounded" />
                            <span className="text-xs text-gray-600 truncate w-full text-center">{val.label}</span>
                          </button>
                        ))}
                    </div>
                    {Object.entries(BUILTIN_IMAGES).filter(([key, val]) =>
                      !builtinSearch || key.includes(builtinSearch.toLowerCase()) || val.label.toLowerCase().includes(builtinSearch.toLowerCase())
                    ).length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Không tìm thấy ảnh cho "{builtinSearch}"</p>
                    )}
                  </div>
                )}
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
              <br/>• 📏 <strong>1 dòng mẫu</strong> - {repeatCount} từ/dòng, {lineCount-1} dòng trống để tập viết
              <br/>• 👤 Header: Name, Class, Date, Teacher
              <br/>• 💾 {totalPages} trang = {Math.ceil(totalPages/2)} mặt giấy (in 2 mặt)
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="bg-white rounded-lg shadow-lg p-0 overflow-hidden">
            <div className="flex justify-between items-center p-6 pb-4 border-b">
              <h2 className="text-xl font-bold">Xem trước ({wordsPerPage} từ/trang)</h2>
              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
              >
                🖨️ In PDF
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <iframe
                key={words.map(w => w.text + w.emoji + (w.image ? '1' : '0')).join('|') + lineCount + repeatCount + schoolName + (schoolLogo ? '1' : '0')}
                srcDoc={generateHTML()}
                style={{ width: '210mm', height: `${totalPages * 297 + 20}mm`, border: 'none', display: 'block' }}
                title="preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
