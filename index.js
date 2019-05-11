const https = require('https');
const fs = require('fs');

const { log } = console;

const url = process.argv.slice(-1)[0];

function drawGraph(data) {
  const VISUAL_POINT = '+';
  const EMPTY_POINT = ' ';

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);

  const visualMax = Math.round(maxValue) + 2;
  const visualMin = Math.round(minValue) - 5;

  const graphic = [];

  graphic.push(`┌${''.padStart(data.length + 6, '─')}┐`);

  for (let i = visualMax; i > visualMin; i -= 1) {
    let line = '';

    line += `${i}  `;
    data.forEach((d) => {
      line += i === Math.floor(d) ? VISUAL_POINT : EMPTY_POINT;
    });
    line += `  ${i}`;

    graphic.push(line);
  }

  graphic.push(`└${''.padStart(data.length + 6, '─')}┘`);

  log(graphic.join('\n'));

  log('max :', maxValue);
  log('min :', minValue);
}


async function createGnuFile(obj) {
  const objj = obj
    .map(({ date: d, poids: p }) => `${d.getTime() / 3600000} ${p}`)
    .join('\n');
  fs.writeFileSync('poids.data', objj, 'utf8');
}

function toArray(obj) {
  return obj.lines
    .filter(l => !l.deleted_at)
    .map(l => ({
      date: new Date(l.date),
      poids: +l.price,
    }))
    .sort((a, b) => a.date - b.date);
}

https.get(url, (res) => {
  res.setEncoding('utf8');

  let body = '';

  res.on('data', (data) => {
    body += data;
  });

  res.on('end', () => {
    const result = toArray(JSON.parse(body));
    drawGraph(result.map(c => c.poids));
    createGnuFile(result);
  });
});
