# rock-paper-scissors-lizard-spock-stream

Streaming rock, paper, scissors, lizard, spock game extended from

```
npm install -g rock-paper-scissors-lizard-spock-stream
```

## Usage

rock-paper-scissors-lizard-spock-stream allows you to play rock, paper, scissors, lizard, spock with a friend over any transport.

Using [dupsh](https://github.com/substack/dupsh) and [airpaste](https://github.com/mafintosh/airpaste) this looks like

``` sh
machine-1> dupsh 'rock-paper-scissors-lizard-spock-stream rock' airpaste
```

and on another machine

``` sh
machine-2> dupsh 'rock-paper-scissors-lizard-spock-stream scissors' airpaste
```

This produces the following output

``` sh
machine-1> dupsh 'rock-paper-scissors-lizard-spock-stream rock' airpaste
You won! rock beats scissors
```

``` sh
machine-2> dupsh 'rock-paper-scissors-lizard-spock-stream scissors' airpaste
You lost! rock beats scissors
```

## Programmatic usage

You can also use this as a module

``` js
var rps = require('rock-paper-scissors-lizard-spock-stream')

var stream = rps('rock') // pass in your choice

stream.on('win', function (you, opponent) {
  console.log('you won (%s vs %s)', you, opponent)
})

stream.on('lose', function (you, opponent) {
  console.log('you lost (%s vs %s)', you, opponent)
})

stream.on('tie', function (you, opponent) {
  console.log('you tied (%s vs %s)', you, opponent)
})

someTransport.pipe(stream).pipe(someTransport)
```

## How it works

It works by creating an sha256 hmac with a random nounce as the key an your
weapon choice as the data argument.

You then exchange this hmac with a friend and when both of you have received eachothers
hmacs you expose your weapon and nounce allowing both parties to verify that you picked
your weapon before knowing what your opponent choose.

## License

MIT
