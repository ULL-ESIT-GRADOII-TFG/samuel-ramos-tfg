const request = require('supertest')
const app = require('../app.js')

describe("Controladores", () => {
  it("Should get the homepage", (done) => {
    request(app).get('/').expect(200,done)
  })

  it("Should get the homepage", (done) => {
    request(app).get('/profile').expect(302,done)
  })
})
