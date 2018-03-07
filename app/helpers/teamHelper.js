const Team = require('../models/team')

// Function to get the teams for a user.
function team (userTeams, user) {
  Team.find({ members: { $in: [user] } }, (err, teams) => {
    if (err) console.log(err)

    return teams
  })
}

module.exports = team
