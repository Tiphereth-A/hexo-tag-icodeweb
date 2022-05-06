declare interface ICWTypes {
    website: string;
    prefix: string[];
    suffix: string[];
}

module.exports = function (hexo: any): ICWTypes {
    return hexo.config.icodeweb;
};
