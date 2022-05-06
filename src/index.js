"use strict";

hexo.extend.tag.register(
    "icodeweb",
    require("./lib/icodeweb")(hexo),
    { async: true, }
);
