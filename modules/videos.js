"use strict";
const db   	        = 	require('./database'), 
      filessystem 	= 	require('fs'), 
	  utils			=	require('./utils'), 
      maximoPagina  =   2;

let newVideo = (req, callback) => 
{
    let data = req.body;
    if (!req.files)
    {
        callback(true, 400);
        //res.status(400).send('No files were uploaded.');
        //return;
    }
    let directorio        = `./uploadedfiles/${data.idadministrador}`,
        folderVideos      = `${directorio}/videos`,
        videoUbicacion    = {
                                original    : `${folderVideos}/org`,
                                convertido  : `${folderVideos}/convert`,
                                thumbnail   : `${folderVideos}/thumbnail`
                            },
        sampleFile        =  req.files.sampleFile, 
        nombre_archivo    =  sampleFile.name, 
        parteNombre       =  nombre_archivo.split("."),
        extension         =  parteNombre[parteNombre.length - 1], 
        token_archivo     =  utils.guid(),
        token_video       =  utils.guid(), 
        nombreArchivo     =  `${token_archivo}.${extension}`,
        uploadPath        = `${videoUbicacion.original}/${nombreArchivo}`;
        //console.log(sampleFile.name);
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
                callback(true, 500);
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
                                mensaje
                            ) 
                            VALUES (
                                        1, 
                                        '${token_video}',
                                        '${data.idadministrador}',
                                        '${data.idconcurso}',
                                        '1',
                                        '${nombre_archivo}',
                                        '${token_archivo}',
                                        '${extension}',
                                        '${data.titulo_video}',
                                        '${data.nombre_usuario}',
                                        '${data.email}',
                                        '${data.descripcion}'
                                    )`;
                db.queryMysql(sql, (err, response) => 
                {
                    callback(true, response);
                    //res.send('File uploaded to ' + uploadPath);
                });
            }
        });
};

//LLevar el listado de vídeos...
let listadoVideos = (req, callback) => 
{
    let numPagina       = maximoPagina * (req.params.page - 1), 
        token_concurso  = req.params.token;
    //SE DEBE ORDENAR POR FECHA...
    let sql = `select a.idconcurso, a.idadministrador, 
                      b.token_video, b.token_archivo, 
                      b.titulo_video, b.nombre_usuario, b.email 
                      from concursos a, 
                           concursos_videos b 
                           where a.token_concurso = '${token_concurso}' and 
                                 a.estado = 1 and 
                                 b.idconcurso = a.idconcurso and 
                                 b.estado = 1 and 
                                 b.estado_video = 3 and 
                                 b.error_conversion = 0 limit ${numPagina}, ${maximoPagina}`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;
        callback(err, data);
    });
};

module.exports.newVideo = newVideo;
module.exports.listadoVideos = listadoVideos;