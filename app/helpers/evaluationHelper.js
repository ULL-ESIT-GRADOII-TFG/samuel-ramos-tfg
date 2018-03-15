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
        for (let i = 0; i < result.data.length; i++) {
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

function createEvalRepo (aula, evalRepo, usr, result, readme, res) {
  const ghUser = new Github(usr.token)
  ghUser.createRepo(aula, evalRepo, 'Repo created by CodeLab', 1)
  .then(response => {
    createEvalFile(aula, evalRepo, result, readme, ghUser)
  }).catch(err => {
    res.redirect('https://github.com/' + aula + '/' + evalRepo)
    console.log(err)
  })
}

function createEvalFile (aula, evalRepo, result, readme, ghUser) {
  ghUser.createFile(aula, evalRepo, 'eval.sh', 'adding eval.sh :bookmark:', result)
  .then(resp => {
    createReadmeFile(aula, evalRepo, readme, ghUser)
  }).catch(err => {
    console.log(err)
  })
}

function createReadmeFile (aula, evalRepo, readme, ghUser) {
  ghUser.createFile(aula, evalRepo, 'README.md', 'adding README :information_source:', base64.encode(utf8.encode(readme)))
  .then(resp => {
    console.log(resp.meta.status)
  }).catch(err => {
    console.log(err)
  })
}

module.exports = {
  createSubmodule,
  createEvalRepo
}
