import Github from '../helpers/githubHelper'
import User from '../models/user'
import base64 from 'base-64'
import utf8 from 'utf8'

/**
* Funcion: createSubmodule(org, assign, user)
*
* Parámetros: org: organizacion, assign: tarea, user: usuario
*
* Descripción: Crea el fichero para inicializar los submódulos
*/
async function createSubmodule (org, assign, user) {
  try {
    const nameFormat = new RegExp(assign, 'g')

    let bashFile = '#!/bin/bash\n'
    let submodule = ''
    // Buscamos el usuario
    let usr = await User.findOne({ 'login': user })

    // Inicializamos la API
    const ghUser = new Github(usr.token)
    // Buscamos los repositorios de la organizacion
    let result = await ghUser.getOrgRepos(org)

    // Creamos el fichero de corrección
    for (let i = 0; i < result.data.length; i++) {
      if (result.data[i].name.match(nameFormat)) {
        submodule = submodule + '\ngit submodule add https://github.com/' + result.data[i].full_name
      }
    }
    // Lo pasamos a base64 para subirlo a github
    let file = await base64.encode(utf8.encode(bashFile + submodule))
    return file
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: createEvalRepo(aula, evalRepo, usr, result, readme, res)
*
* Parámetros: aula, evalRepo, usr, result, readme, res
*
* Descripción: Crea el repo de evaluación
*/
async function createEvalRepo (aula, evalRepo, usr, result, readme, res) {
  try {
    const ghUser = new Github(usr.token)

    // Creamos el repositorio Eval
    await ghUser.createRepo(aula, evalRepo, 'Repo created by CodeLab', 1)
    await createEvalFile(aula, evalRepo, result, readme, ghUser)

    res.redirect('https://github.com/' + aula + '/' + evalRepo)
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: createEvalFile(org, assign, user)
*
* Parámetros: aula, evalRepo, usr, result, readme, ghUser
*
* Descripción: Crea el fichero para inicializar los submódulos en github
*/
async function createEvalFile (aula, evalRepo, result, readme, ghUser) {
  try {
    // Creamos el fichero eval.sh para crear los submodulos
    await ghUser.createFile(aula, evalRepo, 'eval.sh', 'adding eval.sh :bookmark:', result)
    await createReadmeFile(aula, evalRepo, readme, ghUser)
  } catch (error) {
    console.log(error)
  }
}

/**
* Funcion: createSubmodule(org, assign, user)
*
* Parámetros: aula, evalRepo, readme, ghUser
*
* Descripción: Crea el fichero readme con instrucciones
*/
async function createReadmeFile (aula, evalRepo, readme, ghUser) {
  try {
    // Creamos el fichero Readme con las instrucciones
    await ghUser.createFile(aula, evalRepo, 'README.md', 'adding README :information_source:', base64.encode(utf8.encode(readme)))
  } catch (error) {
    console.log(error)
  }
}

export {
  createSubmodule,
  createEvalRepo
}
