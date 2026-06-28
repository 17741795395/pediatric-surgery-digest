// 一键更新网页版：把最新 digests/*.json 嵌入到 web/index.html
// 用法：node update_web.js
const fs = require('fs');
const path = require('path');

const DIGEST_DIR = path.join(__dirname, '..', 'digests');
const HTML_PATH = path.join(__dirname, 'index.html');
const JSON_PATH = path.join(__dirname, 'digest.json');

const files = fs.readdirSync(DIGEST_DIR).filter(f => f.endsWith('.json')).sort();
if (files.length === 0) { console.error('No digest found'); process.exit(1); }
const latest = files[files.length - 1];
console.log('Latest digest:', latest);

const data = JSON.parse(fs.readFileSync(path.join(DIGEST_DIR, latest), 'utf8'));
fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('Updated digest.json');

let html = fs.readFileSync(HTML_PATH, 'utf8');
const jsLiteral = JSON.stringify(data, null, 2);
const embedScript = `<script>const EMBEDDED_DIGEST = ${jsLiteral};</script>\n</body>`;
html = html.replace(/\n<\/body>/, '\n' + embedScript);
fs.writeFileSync(HTML_PATH, html, 'utf8');
console.log('Updated index.html with embedded data');
console.log('Ready to deploy: drag the web/ folder to https://app.netlify.com/drop');
