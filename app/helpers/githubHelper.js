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

  addUserOrg (org, user) {
    console.log(org)
    console.log(user)
    return new Promise((resolve, reject) => {
      octokit.orgs.addOrgMembership({org: org, username: user, role: 'admin'}, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }
}

module.exports = {
  Gh
}
