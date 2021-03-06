var crypto = require('crypto')
var ndjson = require('ndjson')
var duplexify = require('duplexify')

var weapons = ['rock', 'paper', 'scissors', 'lizard', 'spock']

module.exports = function (choice) {
  choice = choice.toLowerCase()

  if (weapons.indexOf(choice) === -1) throw new Error('Invalid choice: ' + choice)

  var nounce = crypto.randomBytes(32)
  var proof = crypto.createHmac('sha256', nounce).update(choice).digest('hex')

  var serialize = ndjson.serialize()
  var parse = ndjson.parse()

  parse.once('data', function (remoteProof) {
    if (remoteProof === proof) return stream.destroy(new Error('Remote sent invalid proof'))
    serialize.end({choice: choice, nounce: nounce.toString('hex')})
    parse.once('data', function (data) {
      if (weapons.indexOf(data.choice) === -1) {
        return stream.destroy(new Error('Remote sent invalid choice: ' + data.choice))
      }
      if (crypto.createHmac('sha256', new Buffer(data.nounce, 'hex')).update(data.choice).digest('hex') !== remoteProof) {
        return stream.destroy(new Error('Remote sent invalid proof'))
      }

      if (data.choice === choice) return stream.emit('tie', choice, data.choice)

      switch (choice) {
        case 'rock': return won(data.choice === 'scissors' || data.choice === 'lizard')
        case 'paper': return won(data.choice === 'rock' || data.choice === 'spock')
        case 'scissors': return won(data.choice === 'paper' || data.choice === 'lizard')
        case 'lizard': return won(data.choice === 'paper' || data.choice === 'spock')
        case 'spock' : return won(data.choice === 'rock' || data.choice === 'scissors')
      }

      stream.emit('error', new Error('Unexpected error (' + data.choice + ' vs ' + choice + ')'))

      function won (yes) {
        stream.emit(yes ? 'win' : 'lose', choice, data.choice)
      }
    })
  })

  serialize.write(proof)

  var stream = duplexify(parse, serialize)
  return stream
}
