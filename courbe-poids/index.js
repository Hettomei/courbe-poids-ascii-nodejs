const https = require("https");

const url = process.argv.slice(-1)[0]

function drawGraph(data) {
  const max = Math.max(...data);
  const min = Math.min(...data);

  const verticalArray = data.map(val => "+".padStart(val + 1));

  let graphic = [];
  graphic.push('┌' + ''.padStart(data.length + 6, '─') + '┐');

  for (let i = Math.round(max) + 2; i > Math.round(min) - 5; i--) {
    let bb = '';

    bb += i + '  ';
    verticalArray.forEach(d => {
      bb += d[i] || ' ';
    })
    bb += '  ' + i;

    graphic.push(bb);
  }

  graphic.push('└' + ''.padStart(data.length + 6, '─') + '┘');

  console.log(graphic.join('\n'));

  console.log("max :", max);
  console.log("min :", min);
}

function play(obj) {
  const basicArray = obj.lines
    .filter(l => !l.deleted_at)
    .map(l => ({
      date: new Date(l.date),
      poids: +l.price,
    }))
    .sort((a,b) => a.date - b.date);

  console.log();
  drawGraph(basicArray.map(c => c.poids));
}

https.get(url, res => {
  res.setEncoding("utf8");

  let body = "";

  res.on("data", data => {
    body += data;
  });

  res.on("end", () => {
    play(JSON.parse(body));
  });

});
