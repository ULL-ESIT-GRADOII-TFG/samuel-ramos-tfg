const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')

function createSubmodule (assign, org, user) {
  User.findOne({ 'login': user }, (err, user) => {
    if (err) console.log(err)

    const ghUser = new Github(user.token)

    ghUser.getOrgRepos(org)
    .then(result => {
      console.log(result)
    })
    .catch(error => {
      console.log(error)
    })
  })
}

module.exports = createSubmodule
