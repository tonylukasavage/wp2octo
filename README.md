# wp2octo

Convert Wordpress XML export file to Octopress posts. This is a simple post content extraction script. If you are looking for a robust solution for converting your WordPress blog to Octopress, search google for other options. My WordPress installation got hosed and all I could extract is the XML export file, so no easy path exists for me to migrate. If you happen to be stuck in the same situation, then maybe it's worth trying this out.

# install

```bash
$ npm install -g wp2octo
```

## usage

```bash
$ wp2octo /path/to/export.xml /path/to/octopress
```
