const Team = require('../models/team')
const Group = require('../models/group')

// Function to get the teams for a user.
function team (userTeams, user) {
  return new Promise((resolve, reject) => {
    let userGroups = []
    Team.find({ members: { $in: [user] } }, (err, teams) => {
      if (err) reject(err)

      for (let i = 0; i < teams.length; i++) {
        userGroups.push(teams[i].name)
      }

      Group.find({ team: { $in: userGroups } }, (err, groups) => {
        if (err) console.log(err)

        resolve(groups)
      })
    })
  })
}

module.exports = team
