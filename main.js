hexo.extend.tag.register(
    "icodeweb",
    require("./src/icodeweb")(hexo),
    { async: true, }
);
