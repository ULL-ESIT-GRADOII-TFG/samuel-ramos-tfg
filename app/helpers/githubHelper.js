const octokit = require('@octokit/rest')()

class Gh {
  constructor (Token) {
    octokit.authenticate({
      type: 'oauth',
      token: Token
    })
  }

  userOrgs () {
    return new Promise((resolve, reject) => {
      octokit.users.getOrgs({}, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }
}

module.exports = {
  Gh
}
