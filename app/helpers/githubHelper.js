const octokit = require('@octokit/rest')()

class Gh {
  constructor (Token) {
    octokit.authenticate({
      type: 'oauth',
      token: Token
    })
  }

  userOrgs () {
    octokit.users.getOrgs({}, (error, result) => {
      if (error) console.log(error)
      else console.log(result)
    })
  }
}

module.exports = {
  Gh
}
