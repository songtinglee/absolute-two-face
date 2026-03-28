const fs = require('fs');

// 读取一个小测试图片
const testImage = fs.readFileSync('/home/ubuntu/.openclaw/media/inbound/file_11---ab7fa228-c116-4b35-a96a-f8466923b265.jpg');
const base64 = testImage.toString('base64');
const dataUri = `data:image/jpeg;base64,${base64}`;

console.log('Data URI length:', dataUri.length);
console.log('First 100 chars:', dataUri.substring(0, 100));
