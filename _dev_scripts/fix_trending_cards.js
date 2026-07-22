const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const mappings = [
  { alt: 'Kashmir Escape', src: 'assets/images/kashmir-escape.jpg', link: 'kashmir-escape.html' },
  { alt: 'Himachal Explorer', src: 'assets/images/himachal-explorer.jpg', link: 'himachal-explorer.html' },
  { alt: 'Kerala Retreat', src: 'assets/images/kerala-retreat.jpg', link: 'kerala-retreat.html' },
  { alt: 'Rajasthan Royal Circuit', src: 'assets/images/rajasthan-royal-circuit.jpg', link: 'rajasthan-royal-circuit.html' },
  { alt: 'Meghalaya Discovery', src: 'assets/images/meghalaya-discovery.jpg', link: 'meghalaya-discovery.html' }
];

mappings.forEach(m => {
  const target = `<div class="glass-panel rounded-3xl overflow-hidden flex flex-col bg-surface-muted/50 hover:shadow-xl transition-all duration-300">
<div class="h-64 overflow-hidden">
<img alt="${m.alt}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${m.src}">`;

  const replacement = `<div class="glass-panel rounded-3xl overflow-hidden flex flex-col bg-surface-muted/50 hover:shadow-xl transition-all duration-300 cursor-pointer" onclick="window.location.href='${m.link}'">
<div class="h-64 overflow-hidden">
<img alt="${m.alt}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src="${m.src}">`;

  html = html.replace(target, replacement);

  // Replace "View Itinerary" button for this specific link
  const targetBtn1 = `<button class="w-full border border-primary text-primary py-3 rounded-full font-label-md hover:bg-primary/5 transition-colors">View Itinerary</button>`;
  const replaceBtn1 = `<button class="w-full border border-primary text-primary py-3 rounded-full font-label-md hover:bg-primary/5 transition-colors" onclick="event.stopPropagation(); window.location.href='${m.link}'">View Itinerary</button>`;
  
  // Actually, we can just replace ALL buttons in one go because they are identical across cards, 
  // but since we want the link to match the card, we have to do it block by block. 
  // However, `html.replace` only replaces the FIRST occurrence! Since we iterate over mappings, 
  // replacing the first occurrence of the button will match the FIRST card we process, which matches the order they appear!
  html = html.replace(targetBtn1, replaceBtn1);
});

const targetBtn2 = `<button class="w-full bg-on-tertiary-container text-white py-3 rounded-full font-label-md hover:opacity-90 transition-opacity shadow-md">Get Personalized Quote</button>`;
const replaceBtn2 = `<button class="w-full bg-on-tertiary-container text-white py-3 rounded-full font-label-md hover:opacity-90 transition-opacity shadow-md" onclick="event.stopPropagation();">Get Personalized Quote</button>`;
html = html.split(targetBtn2).join(replaceBtn2); // replace all

const targetWhatsapp = `<a class="w-full bg-success-green`;
const replaceWhatsapp = `<a onclick="event.stopPropagation();" class="w-full bg-success-green`;
html = html.split(targetWhatsapp).join(replaceWhatsapp); // replace all

fs.writeFileSync('index.html', html);
console.log('Fixed cards in index.html');
