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

function getTypeInfo(icwtype, icwtypes) {
  for (const iterator of icwtypes) {
    if (iterator.name === icwtype) {
      return iterator
    }
  }
}

function getUrl(typeinfo, urlMid) {
  return `${typeinfo.website.replace(/\/+$/g, "")}/${typeinfo.prefix ? typeinfo.prefix.join("/") + "/" : ""}${urlMid}${typeinfo.suffix ? "/" + typeinfo.suffix.join("/") : ""}`;
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

    const icwTypeInfo = getTypeInfo(args[0], hexo.config.icodeweb.types)

    return getCode(getUrl(icwTypeInfo, args[urlIndex])).then(
      (code) => {
        const finalCode = (icwTypeInfo.codehead || "") + code
        if (hexo.config.highlight.enable) return highlight(finalCode, { lang: lang });
        return hexo.render.render({ text: finalCode, engine: "markdown" });
      }
    );
  },
  { async: true }
);
