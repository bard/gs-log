# gs-log

Blockchain event logger for [Allo (v1)](https://github.com/gitcoinco/grants-stack-allo-contracts-v1) contracts. Built for Gitcoin's December 2023 hackathon ([presentation](https://github.com/bard/gitcoin-hackathon-2023-presentation)). Companion to [gs-index](https://github.com/bard/gs-index).

## Features

- outputs events as JSON lines to stdout for easy composition: save to file, send to network, pipe into [gs-index](https://github.com/bard/gs-index), etc.
- one-shot or continuous operation
- watch multiple chains with independent ranges
- resumable: just feed it a past log to pick up from where it stopped

## Installation

```sh
$ npm i -g https://github.com/bard/gs-log
```

## Examples

Log events on PGN testnet from origin to current block:

```sh
$ gs-log --chains 58008:origin..last
```

Same, but keep watching for new events after reaching current block:

```sh
$ gs-log --chains 58008:origin..ongoing
```

Same, but for Ethereum and Optimism at the same time:

```sh
$ gs-log --chains 1:origin..ongoing,10:origin..ongoing
```

Log events from origin, manually interrupt, and pick up from it left, while keeping a log:

```sh
$ gs-log --chains 58008:origin..ongoing | tee event_log.ndjson
# ...
^C
# ...later...
$ cat event_log.ndjson | gs-log --resume | tee -a event_log.ndjson
```

Log events, process them with [gs-index](https://github.com/bard/gs-index), and save them to Postgres:

```sh
$ gs-log --chains 58008:origin..ongoing | gs-index | psql mydb
```
