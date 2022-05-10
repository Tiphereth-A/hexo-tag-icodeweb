# hexo-tag-icodeweb

![npm](https://img.shields.io/npm/v/hexo-tag-icodeweb)
![npm](https://img.shields.io/npm/dy/hexo-tag-icodeweb)

![GitHub](https://img.shields.io/github/license/Tiphereth-A/hexo-tag-icodeweb)

Including code from any website in your Hexo posts, modified from <https://github.com/hexojs/hexo/blob/master/lib/plugins/tag/include_code.js> and <https://github.com/zbicin/hexo-github-include>

## Installation

`npm install --save hexo-tag-icodeweb`

## Usage

`{% icodeweb type [title:title] [lang:language] [from:line] [to:line] path/to/file %}`

Usage of `lang`, `from` and `to` is same as [include_code Tag in Hexo](https://hexo.io/docs/tag-plugins.html#Include-Code)

## Config

Config like this:

```yaml Hexo config file
icodeweb:
  lang_default:
  types:
    - name: # type name
      lang_default:
      website: # website
      prefix:
      suffix:
      codehead:
```

For example:

```yaml Hexo config file
icodeweb:
  lang_default: plaintext
  types:
    - name: icwexample
      lang_default: cpp
      website: https://raw.githubusercontent.com
      prefix:
        - Tiphereth-A
        - Tiphereth-A.github.io
        - gh-pages
        - code
      suffix:
        - .cpp
      codehead: "// example"
```

Then you can write

```plaintext
{% icodeweb icwexample about/init %}
```

to include <https://raw.githubusercontent.com/Tiphereth-A/Tiphereth-A.github.io/gh-pages/code/about/init.cpp> into your posts
