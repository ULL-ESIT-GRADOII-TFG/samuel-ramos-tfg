import octokit from '@octokit/rest'
const rest = octokit()

// Class to manage the github API
export default class Github {
  constructor (token) {
    rest.authenticate({ type: 'oauth', token: token })
  }

  async userOrgs () {
    try {
      let result = await rest.users.getOrgs({ })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async addUserOrg (org, user) {
    try {
      let result = await rest.orgs.addOrgMembership({ org: org, username: user, role: 'member' })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async createRepo (org, name, desc, repoType) {
    try {
      let result = await rest.repos.createForOrg({ org: org, name: name, description: desc, private: false, has_issues: true, has_projects: true })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async addCollaborator (ownerLogin, nameRepo, user, permisos) {
    try {
      let result = await rest.repos.addCollaborator({ owner: ownerLogin, repo: nameRepo, username: user, permission: 'admin' })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async createTeam (orgLogin, nameTeam, members) {
    try {
      let result = await rest.orgs.createTeam({ org: orgLogin, name: nameTeam, maintainers: members })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async addTeam (idTeam, orgLogin, nameRepo) {
    try {
      let result = await rest.orgs.addTeamRepo({ id: idTeam, org: orgLogin, repo: nameRepo, permission: 'admin' })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async checkMember (idTeam, user) {
    try {
      let result = await rest.orgs.getTeamMembership({ id: idTeam, username: user })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async addMember (idTeam, user) {
    try {
      let result = await rest.orgs.addTeamMembership({ id: idTeam, username: user })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  async getOrgRepos (orgName) {
    try {
      let result = await rest.repos.getForOrg({ org: orgName })

      return result
    } catch (error) {
      console.log(error)
    }
  }
  async createFile (org, evalRepo, file, text, encoded) {
    try {
      let result = await rest.repos.createFile({ owner: org, repo: evalRepo, path: file, message: text, content: encoded })

      return result
    } catch (error) {
      console.log(error)
    }
  }
}
