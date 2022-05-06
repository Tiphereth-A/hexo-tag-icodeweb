"use strict";

const icodeweb = require("./lib/icodeweb");
let config = require("./lib/config");

hexo.extend.tag.register(
    "icodeweb",
    function (args) { return icodeweb(args, config(hexo)); },
    { async: true, }
);
