# TFG 17-18: CodeLab

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![Build Status](https://travis-ci.org/ULL-ESIT-GRADOII-TFG/samuel-ramos-tfg.svg?branch=master)](https://travis-ci.org/ULL-ESIT-GRADOII-TFG/samuel-ramos-tfg)

> Autor: Samuel Ramos Barroso (alu01008165146@ull.edu.es)

> Tutor: Casiano Rodríguez León (crguezl@ull.edu.es)

## Instalación

En primer lugar clonamos el repositorio

```shell
$ git clone git@github.com:ULL-ESIT-GRADOII-TFG/samuel-ramos-tfg.git
```

Se debe crear una [`OAuth app de Github`](https://github.com/settings/applications/new), rellenando con el nombre, dirección de nuestra app y con el callbackURL que será `http://localhost:8081/login/github/return` La `OAuth app de Github` nos dará dos tokens, el `clientID` y el `clientSecret`.

Al ejecutar el siguiente comando, instalará todas las dependencias necesarias y creará un fichero `.env` con que debemos rellenar con el `clientID` `clientSecret` y el `callbackURL` de nuestra  `OAuth app de Github`.

```shell
$ npm run setup
```

En una terminal aparte ejecuta este comando (Asegurate tener mongo instalado y bien configurado)

```shell
$ mongod
```

Con el siguiente comando se pone en marcha el servidor.

```shell
$ npm start
```

## Despliegue en Heroku

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Enlaces

* Accede la app en local desde este [enlace](http://localhost:8081/)
* Accede la app en Heroku desde este [enlace](https://codelab-tfg1718.herokuapp.com/)
 
 