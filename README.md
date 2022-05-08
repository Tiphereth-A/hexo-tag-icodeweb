# hexo-tag-icodeweb

![npm](https://img.shields.io/npm/v/hexo-tag-icodeweb)
![npms.io (final)](https://img.shields.io/npms-io/final-score/hexo-tag-icodeweb)
![npm](https://img.shields.io/npm/dy/hexo-tag-icodeweb)

![GitHub](https://img.shields.io/github/license/Tiphereth-A/hexo-tag-icodeweb)

Including code from any website in your Hexo posts, modified from <https://github.com/hexojs/hexo/blob/master/lib/plugins/tag/include_code.js> and <https://github.com/zbicin/hexo-github-include>

## Installation

`npm install --save hexo-tag-icodeweb`

## Usage

`{% icodeweb type [lang:language] [from:line] [to:line] path/to/file %}`

Usage of `lang`, `from` and `to` is same as [include_code Tag in Hexo](https://hexo.io/docs/tag-plugins.html#Include-Code)

## Config

Config like this:

```yaml Hexo config file
icodeweb:
  types:
    - name: # type name
      website: # website
      prefix:
      suffix:
      codehead:
```
