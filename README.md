# hexo-tag-icodeweb

Including code from any website

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
