import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Download, Settings, Eye, Printer, Search, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Built-in image library: common English words with Pexels photo URLs
const BUILTIN_IMAGES: Record<string, { url: string; label: string; category: string }> = {
  // --- FRUITS ---
  apple: { url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Apple', category: 'Fruits' },
  banana: { url: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Banana', category: 'Fruits' },
  orange: { url: 'https://images.pexels.com/photos/327098/pexels-photo-327098.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Orange', category: 'Fruits' },
  mango: { url: 'https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mango', category: 'Fruits' },
  grape: { url: 'https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Grape', category: 'Fruits' },
  grapes: { url: 'https://images.pexels.com/photos/760281/pexels-photo-760281.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Grapes', category: 'Fruits' },
  strawberry: { url: 'https://images.pexels.com/photos/70746/strawberries-red-fruit-royalty-free-70746.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Strawberry', category: 'Fruits' },
  watermelon: { url: 'https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Watermelon', category: 'Fruits' },
  pineapple: { url: 'https://images.pexels.com/photos/947879/pexels-photo-947879.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pineapple', category: 'Fruits' },
  lemon: { url: 'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lemon', category: 'Fruits' },
  cherry: { url: 'https://images.pexels.com/photos/109274/pexels-photo-109274.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cherry', category: 'Fruits' },
  cherries: { url: 'https://images.pexels.com/photos/109274/pexels-photo-109274.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cherries', category: 'Fruits' },
  peach: { url: 'https://images.pexels.com/photos/1294955/pexels-photo-1294955.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Peach', category: 'Fruits' },
  pear: { url: 'https://images.pexels.com/photos/568471/pexels-photo-568471.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pear', category: 'Fruits' },
  kiwi: { url: 'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Kiwi', category: 'Fruits' },
  coconut: { url: 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Coconut', category: 'Fruits' },
  avocado: { url: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Avocado', category: 'Fruits' },

  // --- VEGETABLES ---
  carrot: { url: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Carrot', category: 'Vegetables' },
  corn: { url: 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Corn', category: 'Vegetables' },
  tomato: { url: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tomato', category: 'Vegetables' },
  potato: { url: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Potato', category: 'Vegetables' },
  onion: { url: 'https://images.pexels.com/photos/162673/onion-vegetables-harvest-sliced-162673.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Onion', category: 'Vegetables' },
  broccoli: { url: 'https://images.pexels.com/photos/47347/broccoli-vegetable-food-eat-47347.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Broccoli', category: 'Vegetables' },
  cabbage: { url: 'https://images.pexels.com/photos/1739765/pexels-photo-1739765.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cabbage', category: 'Vegetables' },
  cucumber: { url: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cucumber', category: 'Vegetables' },
  pumpkin: { url: 'https://images.pexels.com/photos/39517/pumpkin-vegetable-autumn-nature-39517.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pumpkin', category: 'Vegetables' },
  mushroom: { url: 'https://images.pexels.com/photos/97824/pexels-photo-97824.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mushroom', category: 'Vegetables' },
  garlic: { url: 'https://images.pexels.com/photos/1460870/pexels-photo-1460870.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Garlic', category: 'Vegetables' },

  // --- ANIMALS (farm) ---
  cat: { url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cat', category: 'Animals' },
  cats: { url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cats', category: 'Animals' },
  dog: { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dog', category: 'Animals' },
  dogs: { url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dogs', category: 'Animals' },
  cow: { url: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cow', category: 'Animals' },
  cows: { url: 'https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cows', category: 'Animals' },
  horse: { url: 'https://images.pexels.com/photos/52500/horse-herd-fog-nature-52500.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Horse', category: 'Animals' },
  pig: { url: 'https://images.pexels.com/photos/1300361/pexels-photo-1300361.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pig', category: 'Animals' },
  rabbit: { url: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rabbit', category: 'Animals' },
  sheep: { url: 'https://images.pexels.com/photos/288621/pexels-photo-288621.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sheep', category: 'Animals' },
  goat: { url: 'https://images.pexels.com/photos/1144687/pexels-photo-1144687.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Goat', category: 'Animals' },
  chicken: { url: 'https://images.pexels.com/photos/1769279/pexels-photo-1769279.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Chicken', category: 'Animals' },
  duck: { url: 'https://images.pexels.com/photos/162140/duckling-duck-bird-yellow-162140.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Duck', category: 'Animals' },
  ducks: { url: 'https://images.pexels.com/photos/162140/duckling-duck-bird-yellow-162140.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ducks', category: 'Animals' },

  // --- ANIMALS (wild) ---
  bird: { url: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bird', category: 'Wild Animals' },
  birds: { url: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Birds', category: 'Wild Animals' },
  fish: { url: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Fish', category: 'Wild Animals' },
  elephant: { url: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Elephant', category: 'Wild Animals' },
  tiger: { url: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tiger', category: 'Wild Animals' },
  lion: { url: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lion', category: 'Wild Animals' },
  monkey: { url: 'https://images.pexels.com/photos/54203/pexels-photo-54203.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Monkey', category: 'Wild Animals' },
  bear: { url: 'https://images.pexels.com/photos/158109/kodiak-brown-bear-adult-portrait-wildlife-158109.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bear', category: 'Wild Animals' },
  frog: { url: 'https://images.pexels.com/photos/70083/frog-macro-amphibian-green-70083.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Frog', category: 'Wild Animals' },
  turtle: { url: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Turtle', category: 'Wild Animals' },
  snake: { url: 'https://images.pexels.com/photos/45246/green-tree-python-python-tree-python-green-45246.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Snake', category: 'Wild Animals' },
  crocodile: { url: 'https://images.pexels.com/photos/60090/crocodile-pexels-reptile-wild-60090.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Crocodile', category: 'Wild Animals' },
  giraffe: { url: 'https://images.pexels.com/photos/797643/pexels-photo-797643.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Giraffe', category: 'Wild Animals' },
  zebra: { url: 'https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Zebra', category: 'Wild Animals' },
  penguin: { url: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Penguin', category: 'Wild Animals' },
  butterfly: { url: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Butterfly', category: 'Wild Animals' },
  bee: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bee', category: 'Wild Animals' },
  spider: { url: 'https://images.pexels.com/photos/276205/pexels-photo-276205.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Spider', category: 'Wild Animals' },
  shark: { url: 'https://images.pexels.com/photos/3308682/pexels-photo-3308682.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Shark', category: 'Wild Animals' },
  whale: { url: 'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Whale', category: 'Wild Animals' },
  dolphin: { url: 'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dolphin', category: 'Wild Animals' },
  owl: { url: 'https://images.pexels.com/photos/36762/scarlet-macaw-bird-tropical-parrots.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Owl', category: 'Wild Animals' },
  parrot: { url: 'https://images.pexels.com/photos/36762/scarlet-macaw-bird-tropical-parrots.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Parrot', category: 'Wild Animals' },
  deer: { url: 'https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Deer', category: 'Wild Animals' },
  fox: { url: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Fox', category: 'Wild Animals' },
  wolf: { url: 'https://images.pexels.com/photos/730881/pexels-photo-730881.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Wolf', category: 'Wild Animals' },
  penguin2: { url: 'https://images.pexels.com/photos/1152491/pexels-photo-1152491.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Penguin', category: 'Wild Animals' },

  // --- NATURE ---
  flower: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Flower', category: 'Nature' },
  flowers: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Flowers', category: 'Nature' },
  tree: { url: 'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tree', category: 'Nature' },
  trees: { url: 'https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Trees', category: 'Nature' },
  leaf: { url: 'https://images.pexels.com/photos/807598/pexels-photo-807598.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Leaf', category: 'Nature' },
  grass: { url: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Grass', category: 'Nature' },
  rose: { url: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rose', category: 'Nature' },
  mountain: { url: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mountain', category: 'Nature' },
  river: { url: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'River', category: 'Nature' },
  lake: { url: 'https://images.pexels.com/photos/247600/pexels-photo-247600.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lake', category: 'Nature' },
  ocean: { url: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ocean', category: 'Nature' },
  sea: { url: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sea', category: 'Nature' },
  beach: { url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Beach', category: 'Nature' },
  forest: { url: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Forest', category: 'Nature' },
  desert: { url: 'https://images.pexels.com/photos/847402/pexels-photo-847402.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Desert', category: 'Nature' },
  rock: { url: 'https://images.pexels.com/photos/235621/pexels-photo-235621.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rock', category: 'Nature' },
  sand: { url: 'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sand', category: 'Nature' },
  seed: { url: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Seed', category: 'Nature' },

  // --- WEATHER & SKY ---
  sun: { url: 'https://images.pexels.com/photos/301599/pexels-photo-301599.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sun', category: 'Weather' },
  moon: { url: 'https://images.pexels.com/photos/1114690/pexels-photo-1114690.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Moon', category: 'Weather' },
  star: { url: 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Star', category: 'Weather' },
  stars: { url: 'https://images.pexels.com/photos/1146134/pexels-photo-1146134.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Stars', category: 'Weather' },
  rain: { url: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rain', category: 'Weather' },
  snow: { url: 'https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Snow', category: 'Weather' },
  cloud: { url: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cloud', category: 'Weather' },
  clouds: { url: 'https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Clouds', category: 'Weather' },
  rainbow: { url: 'https://images.pexels.com/photos/61129/pexels-photo-61129.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rainbow', category: 'Weather' },
  wind: { url: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Wind', category: 'Weather' },
  fog: { url: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Fog', category: 'Weather' },
  lightning: { url: 'https://images.pexels.com/photos/414160/pexels-photo-414160.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lightning', category: 'Weather' },

  // --- TRANSPORT ---
  car: { url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Car', category: 'Transport' },
  bus: { url: 'https://images.pexels.com/photos/1426516/pexels-photo-1426516.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bus', category: 'Transport' },
  train: { url: 'https://images.pexels.com/photos/52984/pexels-photo-52984.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Train', category: 'Transport' },
  plane: { url: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Plane', category: 'Transport' },
  boat: { url: 'https://images.pexels.com/photos/273886/pexels-photo-273886.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Boat', category: 'Transport' },
  ship: { url: 'https://images.pexels.com/photos/1655329/pexels-photo-1655329.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ship', category: 'Transport' },
  truck: { url: 'https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Truck', category: 'Transport' },
  bicycle: { url: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bicycle', category: 'Transport' },
  bike: { url: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bike', category: 'Transport' },
  motorcycle: { url: 'https://images.pexels.com/photos/2549942/pexels-photo-2549942.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Motorcycle', category: 'Transport' },
  helicopter: { url: 'https://images.pexels.com/photos/1098515/pexels-photo-1098515.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Helicopter', category: 'Transport' },
  rocket: { url: 'https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Rocket', category: 'Transport' },
  submarine: { url: 'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Submarine', category: 'Transport' },
  taxi: { url: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Taxi', category: 'Transport' },

  // --- FOOD & DRINK ---
  bread: { url: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bread', category: 'Food' },
  cake: { url: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cake', category: 'Food' },
  egg: { url: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Egg', category: 'Food' },
  eggs: { url: 'https://images.pexels.com/photos/6294248/pexels-photo-6294248.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Eggs', category: 'Food' },
  milk: { url: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Milk', category: 'Food' },
  rice: { url: 'https://images.pexels.com/photos/33783/rice-grain-white-india.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Rice', category: 'Food' },
  pizza: { url: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pizza', category: 'Food' },
  burger: { url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Burger', category: 'Food' },
  noodle: { url: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Noodle', category: 'Food' },
  noodles: { url: 'https://images.pexels.com/photos/1907228/pexels-photo-1907228.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Noodles', category: 'Food' },
  soup: { url: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Soup', category: 'Food' },
  salad: { url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Salad', category: 'Food' },
  cookie: { url: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cookie', category: 'Food' },
  cookies: { url: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cookies', category: 'Food' },
  icecream: { url: 'https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ice Cream', category: 'Food' },
  juice: { url: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Juice', category: 'Food' },
  water: { url: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Water', category: 'Food' },
  coffee: { url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Coffee', category: 'Food' },
  tea: { url: 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tea', category: 'Food' },
  cheese: { url: 'https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cheese', category: 'Food' },
  butter: { url: 'https://images.pexels.com/photos/531334/pexels-photo-531334.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Butter', category: 'Food' },
  honey: { url: 'https://images.pexels.com/photos/1872921/pexels-photo-1872921.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Honey', category: 'Food' },

  // --- HOME & FURNITURE ---
  house: { url: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'House', category: 'Home' },
  chair: { url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Chair', category: 'Home' },
  table: { url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Table', category: 'Home' },
  bed: { url: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bed', category: 'Home' },
  door: { url: 'https://images.pexels.com/photos/277559/pexels-photo-277559.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Door', category: 'Home' },
  window: { url: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Window', category: 'Home' },
  lamp: { url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lamp', category: 'Home' },
  sofa: { url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Sofa', category: 'Home' },
  mirror: { url: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mirror', category: 'Home' },
  stairs: { url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Stairs', category: 'Home' },
  kitchen: { url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Kitchen', category: 'Home' },
  bathroom: { url: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bathroom', category: 'Home' },

  // --- SCHOOL & STATIONERY ---
  book: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Book', category: 'School' },
  books: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Books', category: 'School' },
  pencil: { url: 'https://images.pexels.com/photos/159731/pencil-art-creative-school-159731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pencil', category: 'School' },
  pen: { url: 'https://images.pexels.com/photos/159731/pencil-art-creative-school-159731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pen', category: 'School' },
  school: { url: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'School', category: 'School' },
  bag: { url: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bag', category: 'School' },
  ruler: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ruler', category: 'School' },
  scissors: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Scissors', category: 'School' },
  glue: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Glue', category: 'School' },
  eraser: { url: 'https://images.pexels.com/photos/159731/pencil-art-creative-school-159731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Eraser', category: 'School' },
  notebook: { url: 'https://images.pexels.com/photos/733857/pexels-photo-733857.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Notebook', category: 'School' },
  map: { url: 'https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Map', category: 'School' },
  globe: { url: 'https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Globe', category: 'School' },

  // --- SPORTS & PLAY ---
  ball: { url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ball', category: 'Sports' },
  football: { url: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Football', category: 'Sports' },
  basketball: { url: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Basketball', category: 'Sports' },
  tennis: { url: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Tennis', category: 'Sports' },
  swimming: { url: 'https://images.pexels.com/photos/260598/pexels-photo-260598.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Swimming', category: 'Sports' },
  running: { url: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Running', category: 'Sports' },
  jump: { url: 'https://images.pexels.com/photos/235648/pexels-photo-235648.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Jump', category: 'Sports' },
  kite: { url: 'https://images.pexels.com/photos/755684/pexels-photo-755684.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Kite', category: 'Sports' },
  toy: { url: 'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Toy', category: 'Sports' },
  doll: { url: 'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Doll', category: 'Sports' },

  // --- CLOTHES ---
  hat: { url: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Hat', category: 'Clothes' },
  shoe: { url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Shoe', category: 'Clothes' },
  shoes: { url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300', label: 'Shoes', category: 'Clothes' },
  shirt: { url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Shirt', category: 'Clothes' },
  dress: { url: 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Dress', category: 'Clothes' },
  pants: { url: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Pants', category: 'Clothes' },
  socks: { url: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Socks', category: 'Clothes' },
  jacket: { url: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Jacket', category: 'Clothes' },
  gloves: { url: 'https://images.pexels.com/photos/45981/pexels-photo-45981.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Gloves', category: 'Clothes' },
  scarf: { url: 'https://images.pexels.com/photos/45981/pexels-photo-45981.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Scarf', category: 'Clothes' },

  // --- BODY ---
  hand: { url: 'https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Hand', category: 'Body' },
  eye: { url: 'https://images.pexels.com/photos/46254/pexels-photo-46254.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Eye', category: 'Body' },
  eyes: { url: 'https://images.pexels.com/photos/46254/pexels-photo-46254.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Eyes', category: 'Body' },
  nose: { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Nose', category: 'Body' },
  mouth: { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Mouth', category: 'Body' },
  ear: { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Ear', category: 'Body' },
  foot: { url: 'https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Foot', category: 'Body' },
  feet: { url: 'https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Feet', category: 'Body' },
  hair: { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Hair', category: 'Body' },
  face: { url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Face', category: 'Body' },

  // --- PLACES ---
  park: { url: 'https://images.pexels.com/photos/56832/pexels-photo-56832.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Park', category: 'Places' },
  zoo: { url: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Zoo', category: 'Places' },
  farm: { url: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Farm', category: 'Places' },
  hospital: { url: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Hospital', category: 'Places' },
  market: { url: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Market', category: 'Places' },
  library: { url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Library', category: 'Places' },
  city: { url: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'City', category: 'Places' },
  village: { url: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Village', category: 'Places' },

  // --- OBJECTS ---
  clock: { url: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Clock', category: 'Objects' },
  phone: { url: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Phone', category: 'Objects' },
  camera: { url: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Camera', category: 'Objects' },
  computer: { url: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Computer', category: 'Objects' },
  umbrella: { url: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Umbrella', category: 'Objects' },
  key: { url: 'https://images.pexels.com/photos/46242/lock-key-door-old-46242.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Key', category: 'Objects' },
  lock: { url: 'https://images.pexels.com/photos/46242/lock-key-door-old-46242.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Lock', category: 'Objects' },
  box: { url: 'https://images.pexels.com/photos/730130/pexels-photo-730130.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Box', category: 'Objects' },
  cup: { url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Cup', category: 'Objects' },
  bowl: { url: 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Bowl', category: 'Objects' },
  spoon: { url: 'https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Spoon', category: 'Objects' },
  fork: { url: 'https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Fork', category: 'Objects' },
  knife: { url: 'https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Knife', category: 'Objects' },
  torch: { url: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Torch', category: 'Objects' },
  candle: { url: 'https://images.pexels.com/photos/266685/pexels-photo-266685.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Candle', category: 'Objects' },
  balloon: { url: 'https://images.pexels.com/photos/796606/pexels-photo-796606.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Balloon', category: 'Objects' },
  gift: { url: 'https://images.pexels.com/photos/1303085/pexels-photo-1303085.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Gift', category: 'Objects' },
  flag: { url: 'https://images.pexels.com/photos/1550337/pexels-photo-1550337.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Flag', category: 'Objects' },
  coin: { url: 'https://images.pexels.com/photos/730130/pexels-photo-730130.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Coin', category: 'Objects' },
  money: { url: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?auto=compress&cs=tinysrgb&w=300', label: 'Money', category: 'Objects' },
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
  const [builtinCategory, setBuiltinCategory] = useState('All');

  const BUILTIN_CATEGORIES = ['All', ...Array.from(new Set(Object.values(BUILTIN_IMAGES).map(v => v.category)))];
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
        color: #000;
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
                    <div className="flex gap-1 flex-wrap mb-2">
                      {BUILTIN_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setBuiltinCategory(cat)}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium transition ${builtinCategory === cat ? 'bg-emerald-600 text-white' : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-100'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                      {Object.entries(BUILTIN_IMAGES)
                        .filter(([key, val]) => {
                          const matchCat = builtinCategory === 'All' || val.category === builtinCategory;
                          const matchSearch = !builtinSearch || key.includes(builtinSearch.toLowerCase()) || val.label.toLowerCase().includes(builtinSearch.toLowerCase());
                          return matchCat && matchSearch;
                        })
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
                    {Object.entries(BUILTIN_IMAGES).filter(([key, val]) => {
                      const matchCat = builtinCategory === 'All' || val.category === builtinCategory;
                      const matchSearch = !builtinSearch || key.includes(builtinSearch.toLowerCase()) || val.label.toLowerCase().includes(builtinSearch.toLowerCase());
                      return matchCat && matchSearch;
                    }).length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">Không tìm thấy ảnh phù hợp</p>
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
