"use strict";
const express 			= 	require("express"),
	  app				= 	express(),
	  cons 				=	require("consolidate"),
	  puerto 			= 	process.env.PORT || 3000,
	  bodyParser 		= 	require('body-parser'),
	  passport 			= 	require('passport'),
	  LocalStrategy 	= 	require('passport-local').Strategy,
	  cookieParser 		= 	require('cookie-parser'),
	  session 			= 	require('express-session'),
	  bcrypt 			= 	require('bcrypt-nodejs'),
	  db   				= 	require('./modules/database'),
	  rutas				=	require('./modules/rutas'), 
	  fileUpload 		= 	require('express-fileupload'); 
	
	//db.conectaDatabase();
	//Para el manejo de autenticación...
	passport.use(new LocalStrategy((username, password, done) => 
	{
		let sql = `select password, identificacion from administrador_empresa where email = '${username}'`;
		db.queryMysql(sql, (err, response) => 
		{
			if (err || response.length === 0 || !bcrypt.compareSync(password, response[0].password))
			{
				return done(null, false, {message: 'Usuario o contraseña no válido', username : username});
			}			
			return done(null, response);
		});
	}));

	passport.serializeUser(function(data, done)
	{
		//console.log("TERCERO");
		//console.log(data);
	    done(null, data[0].identificacion);
	});

	passport.deserializeUser(function(identificacion, done)
	{
		//console.log("CUARTO");
		var sql = `select identificacion, idadministrador, nombres, apellidos, nombre_empresa 
				   from administrador_empresa where identificacion = '${identificacion}'`;
		//console.log(sql);
		db.queryMysql(sql, (err, response) => 
		{
			if(response)
			{
				done(null, response[0]);
			}			
		});
	});
	//console.log(passport);
	//Fin del manejo de passport

	//db.conectaDatabase();
	//consolidate integra swig con express...
	app.engine("html", cons.swig); //Template engine...
	app.set("view engine", "html");
	app.set("views", __dirname + "/views");
	app.use(express.static('public'));
	app.use("/static", express.static(__dirname + "/uploadedfiles"));
	//Para indicar que se envía y recibe información por medio de Json...
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	//Para subir archivo...
	app.use(fileUpload());

	//Para el manejo de las Cookies...
	app.use(cookieParser());
	app.use(session({
						secret: '$2a$10$GsvafBLCODG.gUNlB987fORJjTiwjiKs42MjAIqTMB3lour44n39K',
						cookie: { maxAge: 6000000 },
						resave: true,
						saveUninitialized: true
					}));
	//app.use(session({secret: '$2a$10$GsvafBLCODG.gUNlB987fORJjTiwjiKs42MjAIqTMB3lour44n39K'}));
	app.use(passport.initialize());
	app.use(passport.session());
	
	//Rutas/Servicios REST
	app.get("/", rutas.index);
	app.get("/admin", rutas.admin);
	//Para el Login...
	app.get("/login", rutas.login);
	app.get("/logout", rutas.logout);
	//Para la página de registro...
	app.get("/register", rutas.register);
	//Para regitrar un nuevo usuario...
	app.post("/register", rutas.registerPost);
	//Para la acción del login...
	app.post('/login', rutas.loginPost);
	//Para la ruta de crear un nuevo concurso...
	app.get('/newconcurso/:id', rutas.newConcurso);
	//Para crear un nuevo concurso...
	app.post('/newconcurso', rutas.newConcursoPost);
	//Para editar un concurso...
	app.put('/newconcurso', rutas.newConcursoPost);
	//Para traer la cantidad de concursos de un administrador...
	app.get('/numconcursos', rutas.numConcurso);
	//Para llevar todos los concursos...
	app.get('/listarconcursos/:page', rutas.listarConcursos);
	//Para eliminar un concurso...
	app.delete('/eliminaconcurso/:token', rutas.eliminaConcurso);
	//Para mostrar el concurso...
	//app.get('/concurso/:url/:video', rutas.listarConcursos);
	app.get('/:url', rutas.showConcurso);
	//Para ver si se pueden recibir dos variables...
	app.get('/:url/:accion', rutas.vistaConcursoVideo);
	//Para las reglas de juego...
	//app.get('/:url/:rules', rutas.rulesConcurso);
	//Para cualquier url que no cumpla la condición...
	//Para crear/subir, ver detalle un nuevo vídeo...
	app.post('/newvideo', rutas.newVideoPost);
	//Para listar los vídeos de un concurso...
	app.get('/getvideos/:token/:page', rutas.listadoVideos);
	//Para saber el total de vídeos que existe en un concurso..
	app.get('/numvideos/:token/:page', rutas.numeroVideos);
	app.get("*", rutas.notFound404);
	//Fin de ver...
	//Iniciar el Servidor...
	var server = app.listen(puerto, (err) => {
	   if(err) throw err;
	   var message = 'Servidor corriendo en @ http://localhost:' + server.address().port;
	   console.log(message);	   
	});