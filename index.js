const pkgName = 'hexo-tag-icodeweb'
const http = require("http");
const https = require("https");

let highlight, prismHighlight;
let log = hexo.log;

function getCode(url) {
    const client = url.startsWith("https") ? https : http;
    const options = {
        headers: {
            "User-Agent": pkgName,
        },
    };
    return new Promise((resolve, reject) => {
        const req = client.request(url, options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 400) {
                const errMsg = `Fetching ${url} returned status code ${res.statusCode} ${res.statusMessage}.`
                log.error(`${pkgName}: ` + errMsg);
                reject(new Error(errMsg));
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
    const errMsg = `unknown type name: ${icwtype}`
    log.error(`${pkgName}: ` + errMsg)
    throw errMsg
}

const rSlashBk = /\/+$/g;

function getUrl(typeinfo, urlMid) {
    return `${typeinfo.website.replace(rSlashBk, "")}/${typeinfo.prefix ? typeinfo.prefix.join("/") + "/" : ""
        }${urlMid}${typeinfo.suffix ? "/" + typeinfo.suffix.join("/") : ""}`;
}

const rTitle = /\s*title:([\w\-]+)/i;
const rLang = /\s*lang:(\w+)/i;
const rFrom = /\s*from:(\d+)/i;
const rTo = /\s*to:(\d+)/i;
const rSlashLast = /\/([^\/]+?)$/i

hexo.extend.tag.register(
    "icodeweb",
    function (args) {
        let icwtype = args[0]
        if (!icwtype) {
            log.warn(`${pkgName}: no type detected with {${args}}`)
            return;
        }
        const icwCfg = hexo.config.icodeweb.types || {};
        const icwTypeInfo = getTypeInfo(icwtype, icwCfg);

        let arg = args.join(' ').replace(icwtype, '');

        let title = '';
        arg = arg.replace(rTitle, (match, _title) => {
            title = _title;
            return '';
        });
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

        arg = arg.trim();
        const url = getUrl(icwTypeInfo, arg);

        lang = lang || icwTypeInfo.lang_default || hexo.config.icodeweb.lang_default || 'plaintext';
        title = title || arg.match(rSlashLast)[1] || 'Code'

        const caption = `<span>${title}</span><a href="${url}">view raw</a>`;

        const hljsCfg = hexo.config.highlight || {};
        const prismjsCfg = hexo.config.prismjs || {};

        log.debug(`${pkgName}: ready to get code from ${url} at {${icwtype}:${arg}}`)
        return getCode(url).then(code => {
            if (!code) {
                log.warn(`${pkgName}: no code found in ${url}`)
                return;
            }

            const lines = code.split('\n');
            code = (icwTypeInfo.codehead || "") + lines.slice(from, to).join('\n').trim();

            log.debug(`${pkgName}: ready to render {${icwtype}:${arg}} with title:${title}, lang:${lang}, from:${from}, to:${to}`)

            if (prismjsCfg.enable) {
                const line_threshold = prismjsCfg.line_threshold ? prismjsCfg.line_threshold : 0;

                const prismjsOptions = {
                    lang,
                    caption,
                    lineNumber: prismjsCfg.line_number && lines.length > line_threshold,
                    tab: prismjsCfg.tab_replace,
                    isPreprocess: prismjsCfg.preprocess
                };

                if (!prismHighlight) {
                    log.info(`${pkgName}: use prism as renderer`);
                    prismHighlight = require('hexo-util').prismHighlight;
                }
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

                if (!highlight) {
                    log.info(`${pkgName}: use highlight as renderer`);
                    highlight = require('hexo-util').highlight;
                }
                return highlight(code, hljsOptions);
            }

            return `<pre><code>${code}</code></pre>`;
        });
    },
    { async: true }
);