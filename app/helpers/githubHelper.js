import octokit from '@octokit/rest'
const rest = octokit()

// Class to manage the github API
export default class Github {
  constructor (token) {
    rest.authenticate({ type: 'oauth', token: token })
  }

  userOrgs () {
    return new Promise((resolve, reject) => {
      rest.users.getOrgs({ }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addUserOrg (org, user) {
    return new Promise((resolve, reject) => {
      rest.orgs.addOrgMembership({ org: org, username: user, role: 'member' }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  createRepo (org, name, desc, repoType) {
    return new Promise((resolve, reject) => {
      rest.repos.createForOrg({ org: org, name: name, description: desc, private: false, has_issues: true, has_projects: true }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addCollaborator (ownerLogin, nameRepo, user, permisos) {
    return new Promise((resolve, reject) => {
      rest.repos.addCollaborator({ owner: ownerLogin, repo: nameRepo, username: user, permission: 'admin' }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  createTeam (orgLogin, nameTeam, members) {
    return new Promise((resolve, reject) => {
      rest.orgs.createTeam({ org: orgLogin, name: nameTeam, maintainers: members }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addTeam (idTeam, orgLogin, nameRepo) {
    return new Promise((resolve, reject) => {
      rest.orgs.addTeamRepo({ id: idTeam, org: orgLogin, repo: nameRepo, permission: 'admin' }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  checkMember (idTeam, user) {
    return new Promise((resolve, reject) => {
      rest.orgs.getTeamMembership({ id: idTeam, username: user }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  addMember (idTeam, user) {
    return new Promise((resolve, reject) => {
      rest.orgs.addTeamMembership({ id: idTeam, username: user }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }

  getOrgRepos (orgName) {
    return new Promise((resolve, reject) => {
      rest.repos.getForOrg({ org: orgName }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }
  createFile (org, evalRepo, file, text, encoded) {
    return new Promise((resolve, reject) => {
      rest.repos.createFile({ owner: org, repo: evalRepo, path: file, message: text, content: encoded }, (error, result) => {
        if (error) reject(error)

        resolve(result)
      })
    })
  }
}
