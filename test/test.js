const assert = require("chai").assert;
const Github = require('../app/helpers/githubHelper').Gh
const request = require('supertest');
const app = require('../app');

const org = 'tfg-test'
const user = 'Losnen'
const name = 'test-repo'
const desc = 'Test'
const repoType = true;
const permisos = 'admin'
const ownerLogin = 'prueba-classroom-tfg'
const nameTeam = 'tfg-team'
const members = []

require('dotenv').config()

describe('Github API testing', () => {

    it('Should get all the user orgs', () => {
      const ghUser = new Github(process.env.TOKENFORTEST)
      result = ghUser.userOrgs()
      assert.equal(typeof result, 'object');
    })

    it('Should add user to a org', () => {
      const ghUser = new Github(process.env.TOKENFORTEST)
      result = ghUser.addUserOrg(org, user)
      assert.equal(typeof result, 'object');
    })

    it('Should create org repo', () => {
      const ghUser = new Github(process.env.TOKENFORTEST)
      result = ghUser.createRepo (org, name, desc, repoType)
      assert.equal(typeof result, 'object');
    })

    it('Should add collaborators to repo', () => {
      const ghUser = new Github(process.env.TOKENFORTEST)
      result = ghUser.addCollaborator(ownerLogin, name, user, permisos)
      assert.equal(typeof result, 'object');
    })

    it('Should create team', () => {
      const ghUser = new Github(process.env.TOKENFORTEST)
      result = ghUser.createTeam(org, nameTeam, members) 
      assert.equal(typeof result, 'object');
    })
})
