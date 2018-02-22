const octokit = require('@octokit/rest')()

class Gh {
  constructor (token) {
    octokit.authenticate({ type: 'oauth', token: token })
  }

  userOrgs () {
    return new Promise((resolve, reject) => {
      octokit.users.getOrgs({ }, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }

  addUserOrg (org, user) {
    return new Promise((resolve, reject) => {
      octokit.orgs.addOrgMembership({ org: org, username: user }, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }

  createRepo (org, name, desc, repoType, idUser) {
    return new Promise((resolve, reject) => {
      octokit.repos.createForOrg({ org: org, name: name, description: desc, private: false, has_issues: true, has_projects: true }, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }

  addCollaborator (ownerLogin, nameRepo, user) {
    return new Promise((resolve, reject) => {
      octokit.repos.addCollaborator({ owner: ownerLogin, repo: nameRepo, username: user, permission: 'admin' }, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }

  createTeam (orgLogin, nameTeam) {
    return new Promise((resolve, reject) => {
      octokit.orgs.createTeam({ org: orgLogin, name: nameTeam }, (error, result) => {
        if (error) console.log(error)

        resolve(result)
      })
    })
  }
}

module.exports = {
  Gh
}
