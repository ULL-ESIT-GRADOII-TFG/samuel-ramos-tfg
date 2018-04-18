const Github = require('../helpers/githubHelper').Gh
const User = require('../models/user')
const base64 = require('base-64')
const utf8 = require('utf8')

async function createSubmodule (org, assign, user) {
  try {
    const nameFormat = new RegExp(assign, 'g')

    let bashFile = '#!/bin/bash\n'
    let submodule = ''
    let usr = await User.findOne({ 'login': user })

    const ghUser = new Github(usr.token)
    let result = await ghUser.getOrgRepos(org)

    for (let i = 0; i < result.data.length; i++) {
      if (result.data[i].name.match(nameFormat)) {
        submodule = submodule + '\ngit submodule add https://github.com/' + result.data[i].full_name
      }
    }
    let file = await base64.encode(utf8.encode(bashFile + submodule))
    return file
  } catch (error) {
    console.log(error)
  }
}

async function createEvalRepo (aula, evalRepo, usr, result, readme, res) {
  try {
    const ghUser = new Github(usr.token)

    await ghUser.createRepo(aula, evalRepo, 'Repo created by CodeLab', 1)
    await createEvalFile(aula, evalRepo, result, readme, ghUser)

    res.redirect('https://github.com/' + aula + '/' + evalRepo)
  } catch (error) {
    console.log(error)
  }
}

async function createEvalFile (aula, evalRepo, result, readme, ghUser) {
  try {
    await ghUser.createFile(aula, evalRepo, 'eval.sh', 'adding eval.sh :bookmark:', result)
    await createReadmeFile(aula, evalRepo, readme, ghUser)
  } catch (error) {
    console.log(error)
  }
}

async function createReadmeFile (aula, evalRepo, readme, ghUser) {
  try {
    let resp = await ghUser.createFile(aula, evalRepo, 'README.md', 'adding README :information_source:', base64.encode(utf8.encode(readme)))
    console.log(resp.meta.status)
  } catch (error) {
    console.log(error)
  }
}

export {
  createSubmodule,
  createEvalRepo
}
