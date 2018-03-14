const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')

function createSubmodule (org, assign, user) {
  let bashFile = '#!/bin/bash\n'
  let submodule = '\ngit submodule add https://github.com/'

  const nameFormat = new RegExp(assign, 'g')
  User.findOne({ 'login': user }, (err, usr) => {
    if (err) console.log(err)

    const ghUser = new Github(usr.token)
    ghUser.getOrgRepos(org)
    .then(result => {
      for (let i = 0; i < result.data.length - 1; i++) {
        if (result.data[i].name.match(nameFormat)) {
          submodule = submodule + result.data[i].full_name
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  })
}

module.exports = createSubmodule
