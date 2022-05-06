const hexoUtil = require("hexo-util");

declare interface ICWTypes {
    name: string;
    website: string;
    prefix: string[] | undefined;
    suffix: string[] | undefined;
}

function getCode(url: string) {
    return fetch(url).then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            return Promise.reject(`${response.status} ${response.statusText}`);
        }
    });
}

module.exports = (hexo: any) => {
    return function icodewebFn(args: string[]) {
        const { config } = hexo;

        const webtype = args[0];
        let urlIndex = 1;
        let lang = "text";

        if (args[1].startsWith("lang:")) {
            lang = args[1].substring(5);
            urlIndex = 2;
        }

        let URL = "";
        for (const iterator of config.icodeweb.types) {
            if (iterator.name == webtype) {
                URL += iterator.website + "/";
                URL += (iterator.prefix || []).join("/");
                URL += "/" + args[urlIndex] + "/";
                URL += (iterator.suffix || []).join("/");
                if (URL.endsWith("/")) URL.replace(/\/+$/, "");
                break;
            }
        }

        return hexoUtil.highlight(getCode(URL), { lang: lang });
    };
};
