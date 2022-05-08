const http = require("http");
const https = require("https");

let highlight, prismHighlight;

function getCode(url) {
    const client = url.startsWith("https") ? https : http;
    const options = {
        headers: {
            "User-Agent": "Hexo",
        },
    };
    return new Promise((resolve, reject) => {
        const req = client.request(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
                reject(
                    new Error(
                        `Fetching ${url} returned status code ${res.statusCode} ${res.statusMessage}.`
                    )
                );
            }
            const chunks = [];
            res.on("error", (e) => reject(e));
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => {
                const allChunks = Buffer.concat(chunks).toString();
                resolve(allChunks);
            });
        });

        req.end();
    });
}

function getTypeInfo(icwtype, icwtypes) {
    for (const iterator of icwtypes) {
        if (iterator.name === icwtype) {
            return iterator;
        }
    }
}

const rSlashBk = /\/+$/g;

function getUrl(typeinfo, urlMid) {
    return `${typeinfo.website.replace(rSlashBk, "")}/${typeinfo.prefix ? typeinfo.prefix.join("/") + "/" : ""
        }${urlMid}${typeinfo.suffix ? "/" + typeinfo.suffix.join("/") : ""}`;
}

const rLang = /\s*lang:(\w+)/i;
const rFrom = /\s*from:(\d+)/i;
const rTo = /\s*to:(\d+)/i;

hexo.extend.tag.register(
    "icodeweb",
    function (args) {
        if (!args[0]) return;
        const icwTypeInfo = getTypeInfo(args[0], hexo.config.icodeweb.types);

        let arg = args.join(' ').replace(args[0], '');

        let lang = '';
        arg = arg.replace(rLang, (match, _lang) => {
            lang = _lang;
            return '';
        });
        let from = 0;
        arg = arg.replace(rFrom, (match, _from) => {
            from = _from - 1;
            return '';
        });
        let to = Number.MAX_VALUE;
        arg = arg.replace(rTo, (match, _to) => {
            to = _to;
            return '';
        });

        lang = lang || 'text';
        arg = arg.trim();
        const url = getUrl(icwTypeInfo, arg);

        const argSplit = arg.split('/')
        const title = argSplit[argSplit.length - 1] || 'Code'
        const caption = `<span>${title}</span><a href="${url}">view raw</a>`;

        const hljsCfg = hexo.config.highlight || {};
        const prismjsCfg = hexo.config.prismjs || {};

        return getCode(url).then(code => {
            if (!code) return;

            const lines = code.split('\n');
            code = (icwTypeInfo.codehead || "") + lines.slice(from, to).join('\n').trim();

            if (prismjsCfg.enable) {
                const line_threshold = prismjsCfg.line_threshold
                    ? prismjsCfg.line_threshold : 0;

                const prismjsOptions = {
                    lang,
                    caption,
                    lineNumber: prismjsCfg.line_number && lines.length > line_threshold,
                    tab: prismjsCfg.tab_replace,
                    isPreprocess: prismjsCfg.preprocess
                };

                if (!prismHighlight) prismHighlight = require('hexo-util').prismHighlight;

                return prismHighlight(code, prismjsOptions);
            } else if (hljsCfg.enable) {
                const line_threshold = hljsCfg.line_threshold
                    ? hljsCfg.line_threshold : 0;

                const hljsOptions = {
                    lang,
                    caption,
                    gutter: hljsCfg.line_number && lines.length > line_threshold,
                    hljs: hljsCfg.hljs,
                    tab: hljsCfg.tab_replace
                };

                if (!highlight) highlight = require('hexo-util').highlight;

                return highlight(code, hljsOptions);
            }

            return `<pre><code>${code}</code></pre>`;
        });
    },
    { async: true }
);