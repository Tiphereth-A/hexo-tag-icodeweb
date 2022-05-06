"use strict";
async function getCode(url) {
  const response = await require('node-fetch')(url);
  if (response.ok) {
    return await response.text();
  } else {
    return Promise.reject(`${response.status} ${response.statusText}`);
  }
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

    let url = getUrl(args[0], hexo.config.icodeweb.types, args[urlIndex]);

    return require('hexo-util').highlight(getCode(url), { lang: lang });
  },
  { async: true }
);
