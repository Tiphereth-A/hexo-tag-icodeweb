import http = require("http");
import https = require("https");
import hexoUtil = require("hexo-util");

// const log = require("hexo-log")({
//     name: "hexo-tag-icodeweb",
//     debug: false,
// });

class ICodeWeb {
    type: string;
    lang: string = "text";
    URL: string;

    constructor(args: string[], config: ICWTypes) {
        this.type = args[0];
        let startIndex = 1;
        if (args[1].startsWith("lang:")) {
            this.lang = args[1].substring(5);
            startIndex = 2;
        }
        this.URL = config.website + "/";
        this.URL += config.prefix.join("/") + "/";
        for (let index = startIndex; index < args.length; index++) {
            this.URL += args[index] + "/";
        }
        this.URL += config.suffix.join("/");
    }

    private getCode(): Promise<string> {
        const options = {
            headers: {
                "User-Agent": "Hexo",
            },
        };
        const resolver = this.URL.startsWith("https://") ? https : http;
        return new Promise((resolve, reject) => {
            const req = resolver.request(this.URL, options, (res) => {
                if (
                    (res.statusCode || 0) < 200 ||
                    (res.statusCode || 0) >= 400
                ) {
                    reject(
                        new Error(
                            `Fetching ${this.URL} returned status code ${res.statusCode} ${res.statusMessage}.`
                        )
                    );
                }
                const chunks: any[] | Uint8Array[] = [];
                res.on("error", (e: any) => reject(e));
                res.on("data", (c: any) => chunks.push(c));
                res.on("end", () => {
                    const allChunks = Buffer.concat(chunks).toString();
                    resolve(allChunks);
                });
            });

            req.end();
        });
    }

    public async generate(): Promise<string> {
        return hexoUtil.highlight(await this.getCode(), { lang: this.lang });
    }
}

module.exports = function (args: string[], config: ICWTypes) {
    return new ICodeWeb(args, config).generate();
};
