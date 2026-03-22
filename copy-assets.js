import fs from 'fs';
import path from 'path';

const src1 = "d:\\zash-winter\\8b0bd805-0928-4c03-9e03-a2ea66e1b8f1-removebg-preview.png";
const src2 = "d:\\zash-winter\\abd9d772-1406-4891-8dc4-8463194cda85-removebg-preview.png";
const srcSnd = "d:\\zash-winter\\sound-effects\\tanweraman-ice-freezing-445024.mp3";

const dest1 = "d:\\zash-winter\\lab-001\\public\\images\\character1.png";
const dest2 = "d:\\zash-winter\\lab-001\\public\\images\\character2.png";
const destSnd = "d:\\zash-winter\\lab-001\\public\\sounds\\intro-sound.mp3";

fs.mkdirSync(path.dirname(dest1), { recursive: true });
fs.mkdirSync(path.dirname(destSnd), { recursive: true });

fs.copyFileSync(src1, dest1);
fs.copyFileSync(src2, dest2);
fs.copyFileSync(srcSnd, destSnd);

console.log("Files copied successfully");
