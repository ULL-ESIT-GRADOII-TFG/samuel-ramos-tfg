import Group from '../models/group'
import Team from '../models/team'

// Function to get the teams for a user.
async function team (userTeams, user) {
  let userGroups = []
  let teams = await Team.find({ members: { $in: [user] } })
  let groups = await Group.find({ team: { $in: userGroups } })

  for (let i = 0; i < teams.length; i++) {
    userGroups.push(teams[i].name)
  }

  return (groups)
}

export default team
