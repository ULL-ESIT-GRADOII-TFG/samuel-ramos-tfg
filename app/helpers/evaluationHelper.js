const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const base64 = require('base-64')
const utf8 = require('utf8')

function createSubmodule (org, assign, user) {
  return new Promise((resolve, reject) => {
    let bashFile = '#!/bin/bash\n'
    let submodule = ''

    const nameFormat = new RegExp(assign, 'g')
    User.findOne({ 'login': user }, (err, usr) => {
      if (err) reject(err)

      const ghUser = new Github(usr.token)
      ghUser.getOrgRepos(org)
      .then(result => {
        for (let i = 0; i < result.data.length - 1; i++) {
          if (result.data[i].name.match(nameFormat)) {
            submodule = submodule + '\ngit submodule add https://github.com/' + result.data[i].full_name
          }
        }
        resolve(base64.encode(utf8.encode(bashFile + submodule)))
      })
      .catch(err => {
        reject(err)
      })
    })
  })
}

module.exports = createSubmodule
