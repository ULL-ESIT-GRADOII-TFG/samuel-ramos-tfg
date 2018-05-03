import Group from '../models/group'
import Team from '../models/team'

/**
* Funcion: team(userTeams, user)
*
* Parámetros: userTeams: equipos de usuario, user: usuario
*
* Descripción: Crea el fichero readme con instrucciones
*/
async function team (userTeams, user) {
  let userGroups = []
  try {
    // Se buscan los grupos del usuario
    let teams = await Team.find({ members: { $in: [user] } })
    // Se buscan las tareas del usuario
    let groups = await Group.find({ team: { $in: userGroups } })

    // Se fabrica el array de tareas del usuario
    for (let i = 0; i < teams.length; i++) {
      userGroups.push(teams[i].name)
    }

    return groups
  } catch (error) {
    console.log(error)
  }
}

export default team
