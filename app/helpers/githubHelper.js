import octokit from '@octokit/rest'
const rest = octokit()

// Clase para manejar la Githug API
export default class Github {
  /**
  * Funcion: Constructor(token)
  *
  * Parámetros: token: token del usuario
  *
  * Descripción: Inicializa la Github API
  */
  constructor (token) {
    rest.authenticate({ type: 'oauth', token: token })
  }

  /**
  * Funcion: userOrgs()
  *
  * Parámetros: Ninguno
  *
  * Descripción: Devuelve las organizaciones del usuario
  */
  async userOrgs () {
    try {
      let result = await rest.users.getOrgs({ })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: addUserOrg(org, user)
  *
  * Parámetros: org, user
  *
  * Descripción: Añade a un usuario a la organizacion
  */
  async addUserOrg (org, user) {
    try {
      let result = await rest.orgs.addOrgMembership({ org: org, username: user, role: 'member' })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: createRepo(org, name, desc, repoType)
  *
  * Parámetros: org, name, desc, repoType
  *
  * Descripción: Crea el repositorio
  */
  async createRepo (org, name, desc, repoType) {
    try {
      let result = await rest.repos.createForOrg({ org: org, name: name, description: desc, private: repoType, has_issues: true, has_projects: true })

      return result
    } catch (error) {
      let result = await rest.repos.createForOrg({ org: org, name: name, description: desc, private: false, has_issues: true, has_projects: true })
      return result
    }
  }

  /**
  * Funcion: addCollaborator (ownerLogin, nameRepo, user, permisos)
  *
  * Parámetros: ownerLogin, nameRepo, user, permisos
  *
  * Descripción: Añade al alumno cono al reposiorio
  */
  async addCollaborator (ownerLogin, nameRepo, user, permisos) {
    try {
      let result = await rest.repos.addCollaborator({ owner: ownerLogin, repo: nameRepo, username: user, permission: permisos })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: createTeam(orgLogin, nameTeam, members)
  *
  * Parámetros: orgLogin, nameTeam, members
  *
  * Descripción: Crea un equipo
  */
  async createTeam (orgLogin, nameTeam, members) {
    try {
      let result = await rest.orgs.createTeam({ org: orgLogin, name: nameTeam, maintainers: members })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: addTeam(idTeam, orgLogin, nameRepo)
  *
  * Parámetros: idTeam, orgLogin, nameRepo
  *
  * Descripción: Añade un equipo al repositorio
  */
  async addTeam (idTeam, orgLogin, nameRepo) {
    try {
      let result = await rest.orgs.addTeamRepo({ id: idTeam, org: orgLogin, repo: nameRepo, permission: 'admin' })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: checkMember(idTeam, user)
  *
  * Parámetros: idTeam, user
  *
  * Descripción: Comprueba que un usuario es miembro de un equipo
  */
  async checkMember (idTeam, user) {
    try {
      let result = await rest.orgs.getTeamMembership({ id: idTeam, username: user })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: addMember(idTeam, user)
  *
  * Parámetros: idTeam, user
  *
  * Descripción: Añade un miembro al equipo
  */
  async addMember (idTeam, user) {
    try {
      let result = await rest.orgs.addTeamMembership({ id: idTeam, username: user })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: getOrgRepos(orgName)
  *
  * Parámetros: orgName
  *
  * Descripción: Obtiene los repositorios de una organizacion
  */
  async getOrgRepos (orgName) {
    try {
      let result = await rest.repos.getForOrg({ org: orgName })

      return result
    } catch (error) {
      console.log(error)
    }
  }

  /**
  * Funcion: createFile(org, evalRepo, file, text, encoded
  *
  * Parámetros: org, evalRepo, file, text, encoded
  *
  * Descripción: Crea un fichero en un repo
  */
  async createFile (org, evalRepo, file, text, encoded) {
    try {
      let result = await rest.repos.createFile({ owner: org, repo: evalRepo, path: file, message: text, content: encoded })

      return result
    } catch (error) {
      console.log(error)
    }
  }
}
