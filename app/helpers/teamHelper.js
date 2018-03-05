const Team = require('../models/team')

function team (userTeams, user) {
  Team.find({ members: { $in: [user] } }, (err, teams) => {
    if (err) console.log(err)

    return teams
  })
}

module.exports = team
