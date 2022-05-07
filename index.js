const highlight = require("hexo-util").highlight;
const http = require('http');
const https = require('https');

function getCode(url) {
  const client = url.startsWith('https') ? https : http;
  const options = {
    headers: {
      'User-Agent': 'Hexo'
    }
  }
  return new Promise((resolve, reject) => {
    const req = client.request(url, options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error(`Fetching ${url} returned status code ${res.statusCode} ${res.statusMessage}.`));
      }
      const chunks = [];
      res.on('error', (e) => reject(e));
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const allChunks = Buffer.concat(chunks).toString();
        resolve(allChunks);
      });
    });

    req.end();
  })
}

function getUrl(icwtype, icwtypes, urlMid) {
  for (const iterator of icwtypes) {
    if (iterator.name === icwtype) {
      return `${iterator.website.replace(/\/+$/g, "")}/${iterator.prefix ? iterator.prefix.join("/") + "/" : ""}${urlMid}${iterator.suffix ? "/" + iterator.suffix.join("/") : ""}`;
    }
  }
}

hexo.extend.tag.register(
  "icodeweb",
  function (args) {
    if (!args[0]) { throw new Error("icodeweb needs types"); }
    let urlIndex = 1;
    let lang = "text";

    if (args[1].startsWith("lang:")) {
      lang = args[1].substring(5);
      urlIndex = 2;
    }

    return getCode(getUrl(args[0], hexo.config.icodeweb.types, args[urlIndex])).then((code) => highlight(code, { lang: lang }));
  },
  { async: true }
);
