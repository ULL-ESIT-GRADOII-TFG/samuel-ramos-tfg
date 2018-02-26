const octokit = require('@octokit/rest')()

class Gh {
  constructor (token) {
    octokit.authenticate({ type: 'oauth', token: token })
  }

  userOrgs () {
    return new Promise((resolve, reject) => {
      octokit.users.getOrgs({ }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addUserOrg (org, user) {
    return new Promise((resolve, reject) => {
      octokit.orgs.addOrgMembership({ org: org, username: user }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  createRepo (org, name, desc, repoType) {
    return new Promise((resolve, reject) => {
      octokit.repos.createForOrg({ org: org, name: name, description: desc, private: false, has_issues: true, has_projects: true }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addCollaborator (ownerLogin, nameRepo, user, permisos) {
    return new Promise((resolve, reject) => {
      octokit.repos.addCollaborator({ owner: ownerLogin, repo: nameRepo, username: user, permission: permisos }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  createTeam (orgLogin, nameTeam, members) {
    return new Promise((resolve, reject) => {
      octokit.orgs.createTeam({ org: orgLogin, name: nameTeam, maintainers: members }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addTeam (idTeam, orgLogin, nameRepo) {
    return new Promise((resolve, reject) => {
      octokit.orgs.addTeamRepo({ id: idTeam, org: orgLogin, repo: nameRepo }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  checkMember (idTeam, user) {
    return new Promise((resolve, reject) => {
      octokit.orgs.getTeamMembership({ id: idTeam, username: user }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addMember (idTeam, user) {
    return new Promise((resolve, reject) => {
      octokit.orgs.addTeamMembership({ id: idTeam, username: user }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }
}

module.exports = {
  Gh
}
