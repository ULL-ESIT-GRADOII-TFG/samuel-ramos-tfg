const Team = require('../models/team')

function team (userTeams, user) {
  Team.find({ members: { $in: [user] } }, (err, userTeam) => {
    if (err) console.log(err)

    console.log(userTeam)
  })
}

module.exports = team
