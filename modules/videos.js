"use strict";
const db   	        = require('./database'), 
      filessystem 	= require('fs'), 
	  utils			= require('./utils'), 
      moment        = require('moment'),
      striptags     = require('striptags'),
      maximoPagina  = 5, 
      fecha_actual  = moment().format(), 
      fecha_string  = moment().format("DD/MM/YYYY"), 
      hora_string   = moment().format("hh:mm:ss a"), 
      timestamp     = moment().unix();

let newVideo = (req, callback) => 
{
    let data = req.body;
    if (!req.files)
    {
        callback(true, "No existe archivos para subir");
    }
    let directorio      = `./uploadedfiles/${data.idadministrador}`,
        folderVideos    = `${directorio}/videos`, 
        extensionValida = ["avi", "wmv", "flv", "mov", "mp4", "webm"], 
        videoUbicacion  = {
                                original    : `${folderVideos}/org`,
                                convertido  : `${folderVideos}/convert`,
                                thumbnail   : `${folderVideos}/thumbnail`
                            },
        sampleFile      =  req.files.sampleFile, 
        nombre_archivo  =  sampleFile.name, 
        parteNombre     =  nombre_archivo.split("."),
        extension       =  parteNombre[parteNombre.length - 1].toLowerCase(), 
        token_archivo   =  utils.guid(),
        token_video     =  utils.guid(), 
        nombreArchivo   =  `${token_archivo}.${extension}`,
        uploadPath      = `${videoUbicacion.original}/${nombreArchivo}`, 
        titulo_video    =  striptags(data.titulo_video), 
        nombre_usuario  =  striptags(data.nombre_usuario), 
        email           =  striptags(data.email);
        //Primero saber que los campos estén correctos.
        if(titulo_video === "" || nombre_usuario === "" || email === "")
        {
            callback(true, "No se han completado los campos");
        }
        else
        {
            //Saber si el email es válido...
            if(!utils.validateEmail(email))
            {
                callback(true, "El email no es válido");
            }
        }
        //Saber si el archivo que se ha subido es válido o no...
        //video/x-flv
        console.log(sampleFile.mimetype);
        if(sampleFile.mimetype.split("/")[0].toLowerCase() !== "video")
        {
            //console.log("INGRESA ACÁ");
            callback(true, "No es un archivo de vídeo");
        }
        else
        {
            //Saber si la extensión está entrega
            //console.log("PASA ACÁ ACÁ");
            let extensionBien = false;
            for(let compara of extensionValida)
            {
                //console.log(`${compara} === ${extension}`);
                if(compara === extension)
                {
                    extensionBien = true;
                    break;
                }
            }
            if(!extensionBien)
            {
                callback(true, "La extensión del vídeo no es válida");
            }
        }
        //console.log(sampleFile.mimetype);
        //Crear el directorio principal, sí es que no existe...
        utils.crearDirectorio(directorio);
        //Crear la carpeta de vídeos...
        utils.crearDirectorio(folderVideos);
        //Para crear los demás folders que se manejarán...
        let keyUbica = Object.keys(videoUbicacion); 
        for(let i = 0; i < keyUbica.length; i++)
        {
            utils.crearDirectorio(videoUbicacion[keyUbica[i]]);
        }
        //Para subir el archivo...
        sampleFile.mv(uploadPath, function(err)
        {
            if (err)
            {
                callback(true, "No ha sido posible subir el vídeo");
            }
            else
            {
                //Guardar el registro...
                //Actualizar el valor del banner...
                let sql = `INSERT INTO concursos_videos 
                            (
                                estado, token_video, idadministrador, 
                                idconcurso, estado_video, 
                                nombre_archivo, token_archivo, 
                                extension, titulo_video,
                                nombre_usuario, email, 
                                mensaje, 
                                fecha_publica, 
                                fecha_publica_string, 
                                hora_publica, 
                                fecha_publica_timestamp
                            ) 
                            VALUES (
                                        1, 
                                        '${token_video}',
                                        '${data.idadministrador}',
                                        '${data.idconcurso}',
                                        '1',
                                        '${striptags(nombre_archivo)}',
                                        '${token_archivo}',
                                        '${striptags(extension)}',
                                        '${titulo_video}',
                                        '${nombre_usuario}',
                                        '${email}',
                                        '${data.descripcion}',
                                        '${fecha_actual}',
                                        '${fecha_string}',
                                        '${hora_string}',
                                        '${timestamp}'
                                    )`;
                //console.log(sql);
                db.queryMysql(sql, (err, response) => 
                {
                    callback(false, response);
                });
            }
        });
};

let totalRegistrosVideos = (token_concurso, callback) => 
{
    let sql = `select count(*) as numero 
               from concursos a,  
                    concursos_videos b
               where a.token_concurso = '${token_concurso}' and 
                     a.estado = 1 and 
                     b.idconcurso = a.idconcurso and 
                     estado_video = 3  and 
                     error_conversion = 0`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        let total     = data[0].numero, 
            numPagina = Math.ceil(total / maximoPagina);
        callback(err, {total, maximoPagina, numPagina});
    });
};

// videos por parte del administrador

let totalRegistrosVideosAdmin = (id_admin, callback) => 
{
    
    let sql = `select count(*) as numero 
               from concursos a,  
                    concursos_videos b 
               where a.idadministrador = '${id_admin}' and 
                     b.idconcurso = a.idconcurso`;
    
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        let total     = data[0].numero, 
            numPagina = Math.ceil(total / maximoPagina);
        callback("", {total, maximoPagina, numPagina});
    });
};


//LLevar el listado de vídeos...
let listadoVideos = (req, callback) => 
{
    let numPagina       = maximoPagina * (req.params.page - 1), 
        token_concurso  = req.params.token;
    let sql = `select a.idconcurso, a.idadministrador, 
                      b.token_video, b.token_archivo, 
                      b.titulo_video, b.nombre_usuario, b.email, 
                      b.fecha_publica, b.fecha_publica_string, b.hora_publica
                      from concursos a, 
                           concursos_videos b 
                           where a.token_concurso = '${token_concurso}' and 
                                 a.estado = 1 and 
                                 b.idconcurso = a.idconcurso and 
                                 b.estado = 1 and 
                                 b.estado_video = 3 and 
                                 b.error_conversion = 0 order by b.fecha_publica desc limit ${numPagina}, ${maximoPagina}`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        callback(err, data);
    });
};

//LLevar el listado de todos los vídeos de los concursos de una empresa

let listadoVideosAdmin = (req, callback) => 
{
    let numPagina       = maximoPagina * (req.params.page - 1),
        id_admin  = req.params.idAdmin;
    let sql = `select a.idconcurso, a.nombre_concurso, c.idadministrador, c.nombre_empresa, b.idvideo,
                      b.token_video, b.token_archivo, 
                      b.titulo_video, b.nombre_usuario, b.email, 
                      b.fecha_publica, b.fecha_publica_string, b.hora_publica, a.url_concurso
                      from concursos a, concursos_videos b, administrador_empresa c  
                        where c.idadministrador = a.idadministrador and b.idadministrador = a.idadministrador and 
                        a.idadministrador = ${id_admin} and b.idconcurso = a.idconcurso order by b.fecha_publica desc limit ${numPagina}, ${maximoPagina}`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        callback(err, data);
    });
};

//Para eliminar un video...
let eliminarvideo = (id_video, callback) => 
{
    let sql = `DELETE from concursos_videos where idvideo = '${id_video}'`;
    console.log(sql);
    db.queryMysql(sql, (err, response) => 
    {
        callback(err, response);
    });
};

let getVideo = (token_video, callback) => 
{
    let sql = `select * from concursos_videos 
               where token_video = '${token_video}' and 
                     estado = 1 and 
                     error_conversion = 0 and 
                     estado_video = 3`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        callback(err, data[0]);
    });
};

module.exports.newVideo = newVideo;
module.exports.totalRegistrosVideos = totalRegistrosVideos;
module.exports.totalRegistrosVideosAdmin = totalRegistrosVideosAdmin;
module.exports.listadoVideos = listadoVideos;
module.exports.listadoVideosAdmin = listadoVideosAdmin;
module.exports.getVideo = getVideo;
module.exports.eliminarvideo = eliminarvideo;
