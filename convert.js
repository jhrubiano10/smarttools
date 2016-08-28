"use strict";
const db     = require('./modules/database'),
      ffmpeg = require('fluent-ffmpeg');
      db.conectaDatabase();

let sql = `select a.idvideo, a.idadministrador, a.token_archivo, a.extension 
           from concursos_videos a, 
                concursos b, 
                administrador_empresa c
                where a.estado_video = 1 and 
                      a.estado = 1 and 
                      b.idconcurso = a.idconcurso and 
                      b.estado = 1 and 
                      c.idadministrador = b.idadministrador and  
                      c.estado = 1 limit 0, 2`;
db.queryMysql(sql, (err, data) => 
{
    for(var i = 0; i < data.length; i++)
    {
            actualizaEstadoVideo
                                ({
                                    video           : data[i], 
                                    estado          : 2, 
                                    errorConvierte  : 0
                                 },
                                 (err, opc) => 
                                 {
                                    convierteVideo(opc, (err, idvideo) => 
                                    {
                                        actualizaEstadoVideo
                                        ({
                                            video           : {idvideo}, 
                                            estado          : 3, 
                                            errorConvierte  : err ? 1 : 0
                                        },
                                        (err) => 
                                        {
                                            console.log("Termina de procesar");
                                        });
                                    });
                                 });
    }
});

let actualizaEstadoVideo = (opc, callback) => 
{
    let sql = `UPDATE concursos_videos SET 
               estado_video = '${opc.estado}',
               error_conversion = '${opc.errorConvierte}' 
               WHERE idvideo = ${opc.video.idvideo}`;
    db.queryMysql(sql, (err, data) => 
    {
        callback(true, opc.video);
    });
};

let convierteVideo = (datosVideo, callback) => 
{
    let baseUbicaVideo = `${__dirname}/uploadedfiles/${datosVideo.idadministrador}/videos`, 
        videoOriginal  = `${baseUbicaVideo}/org/${datosVideo.token_archivo}.${datosVideo.extension}`;

    let command = ffmpeg(videoOriginal)
                  .on('filenames', (filenames) => 
                  {
                        console.log('Generar imágenes: ' + filenames.join(', '))
                  })
                  .screenshots({
                                    filename: `${datosVideo.token_archivo}.png`,
                                    count: 1,
                                    folder: `${baseUbicaVideo}/thumbnail`
                 });
        command.clone()
                        .save(`${baseUbicaVideo}/convert/${datosVideo.token_archivo}.mp4`)
                        .on('end', function()
                        {
                            callback(false, datosVideo.idvideo);
                        })
                        .on('error', function(err)
                        {
                            callback(true, datosVideo.idvideo);
                        });
};