"use strict";
const db     = require('./modules/database'),
      fs     = require('fs'), 
      ffmpeg = require('fluent-ffmpeg'), 
      moment = require('moment');
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
                      c.estado = 1 order by a.fecha_publica limit 0, 3`;
db.queryMysql(sql, (err, data) => 
{
    for(let i = 0; i < data.length; i++)
    {
        //Verificar si el archivo existe...
        let baseUbicaVideo = `${__dirname}/uploadedfiles/${data[i].idadministrador}/videos`, 
            videoOriginal  = `${baseUbicaVideo}/org/${data[i].token_archivo}.${data[i].extension}`;
        fs.exists(videoOriginal, function(exists)
        {
            if(exists)
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
            else
            {
                actualizaEstadoVideo({
                                        video           : data[i], 
                                        estado          : 3, 
                                        errorConvierte  : 1
                                    },
                                    (err) => 
                                    {
                                        console.log("No procesa, archivo no existe");
                                    });
            }
        });
    }
});

let actualizaEstadoVideo = (opc, callback) => 
{
    let sqlAdciona = "";
    if(opc.estado === 3)
    {
        let fecha  = {
                        fecha_convierte   : moment().format(),
                        fecha_convierte_string : moment().format("DD/MM/YYYY"),
                        fecha_convierte_timestamp   : moment().unix()
                    };
        for(let obj in fecha)
        {
            if(sqlAdciona !== "")
            {
                sqlAdciona += ", ";
            }
            sqlAdciona += `${obj} = '${fecha[obj]}'`;
        }
        sqlAdciona = `, ${sqlAdciona}`;
    }
    let sql = `UPDATE concursos_videos SET 
               estado_video = '${opc.estado}', error_conversion = '${opc.errorConvierte}' ${sqlAdciona} 
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

//Revisar la forma de terminar el proceso de conversión...