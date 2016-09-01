"use strict";
const db            = require('./modules/database'),
      fs            = require('fs'), 
      ffmpeg        = require('fluent-ffmpeg'), 
      moment        = require('moment'), 
      procesados    = [];
      db.conectaDatabase();
console.time('test');
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
    if(data.length !== 0)
    {
        console.log(`Video 0 de ${data.length}`);
        for(let i = 0; i < data.length; i++)
        {
            procesados.push({
                                token : data[i].token_archivo, 
                                terminado : false
            });
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
                                            (err, video) => 
                                            {
                                                convierteVideo(video, (err, video, duration) => 
                                                {
                                                    actualizaEstadoVideo
                                                    ({
                                                        video           : video, 
                                                        estado          : 3, 
                                                        errorConvierte  : err ? 1 : 0, 
                                                        duration        : duration
                                                    },
                                                    (err, video) => 
                                                    {
                                                        terminaDeProcesarVideos(video.token_archivo);
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
                                        (err, video) => 
                                        {
                                            terminaDeProcesarVideos(video.token_archivo);
                                        });
                }
            });
        }
    }
    else
    {
        db.closeConection();
    }
});

let terminaDeProcesarVideos = (token_archivo) => 
{
    let total = 0;
    for(let contador = 1; contador <= 2; contador++)
    {
        for(let i = 0; i < procesados.length; i++)
        {
            if(contador === 1)
            {
                if(procesados[i].token === token_archivo)
                {
                    procesados[i].terminado = true;
                    break; 
                }
            }
            else
            {
                if(procesados[i].terminado)
                {
                    total++;
                }
            }
        }
    }
    console.log(`Video ${total} de ${procesados.length}`);
    if(total === procesados.length)
    {
        console.timeEnd('test');
        db.closeConection();
    }
};

let actualizaEstadoVideo = (opc, callback) => 
{
    let sqlAdciona = "";
    if(opc.estado === 3)
    {
        let duracion = {
                            segundos : 0, 
                            text     : ""
                       };
        if(opc.errorConvierte === 0)
        {
            let parteDuracion = opc.duration.split(":");
            for(let i = 0, exp = 2; i < parteDuracion.length; i++, exp--)
            {
                duracion.segundos += Math.round(Math.pow(60, exp) * Number(parteDuracion[i]));
            }
            duracion.text = opc.duration;
        }
        sqlAdciona = `duracion = '${duracion.segundos}', duracion_string = '${duracion.text}'`;
        //Para agregar las fechas de conversión...
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
        videoOriginal  = `${baseUbicaVideo}/org/${datosVideo.token_archivo}.${datosVideo.extension}`, 
        duration       = 0;

    let command = ffmpeg(videoOriginal)
                  .screenshots({
                                    filename: `${datosVideo.token_archivo}.png`,
                                    count: 1,
                                    folder: `${baseUbicaVideo}/thumbnail`
                 });
        command.clone()
                        .save(`${baseUbicaVideo}/convert/${datosVideo.token_archivo}.mp4`)
                        .on('end', function()
                        {
                            callback(false, datosVideo, duration);
                        })
                        .on('error', function(err)
                        {
                            callback(true, datosVideo, duration);
                        })
                        .on('codecData', function(data)
                        {
                            duration = data.duration;
                        });
};