"use strict";
const db   	        = 	require('./database'), 
      filessystem 	= 	require('fs'), 
	  utils			=	require('./utils'), 
      maximoPagina  =   5;

//Para saber si un enlace ya existe...
/*
let existenlace   = (enlace) => 
{

};
*/

let totalRegistrosConcurso = (idadministrador, callback) => 
{
    let sql = `select count(*) as numero from concursos 
               where idadministrador = '${idadministrador}' and 
                     estado = 1`;
    db.queryMysql(sql, (err, data) => 
    {
        console.log("REGISTROS");
        console.log(data[0].numero);
        if (err) throw err;
        let total     = data[0].numero, 
            numPagina = Math.ceil(total / maximoPagina);
        callback(err, {total, maximoPagina, numPagina});
    });
};

//Para listar los concursos...
let listarConcursos = (req, callback) =>
{
    //console.log("Page: ", req.params.page);
    //console.log("numPagina: ", numPagina);
    //console.log(req);
    let numPagina = maximoPagina * (req.params.page - 1); 
    let sql = `select idconcurso, token_concurso, terminado, 
                      publicado, duracion_video, nombre_concurso, url_concurso, 
                      fecha_inicial, fecha_final 
                      from concursos 
                      where idadministrador = '${req.user.idadministrador}' and 
                            estado = 1 limit ${numPagina}, ${maximoPagina}`; 
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;        
        callback(err, data);
    });
};

/*
    El id puede ser el token del concurso o la url única del mismo...
*/
let getConcurso = (type, param, callback) => 
{
    let sql = `select a.*, b.nombre_empresa 
               from concursos a, 
                    administrador_empresa b 
                    where a.${type === 1 ? "token_concurso" : "url_concurso"} = '${param}' and 
                          a.estado = 1 and 
                          b.idadministrador = a.idadministrador and 
                          b.estado = 1`;
    db.queryMysql(sql, (err, data) => 
    {
        if (err) throw err;        
        callback(err, data[0]);
    });
}

let crearConcurso = (req, callback) => 
{
    let data = req.body;
    if (!req.files)
    {
        callback(true, 400);
        //res.status(400).send('No files were uploaded.');
        //return;
    }
    let directorio   = `./uploadedfiles/${req.user.idadministrador}`,
        banner	     = `${directorio}/banner`, 
        sampleFile   = req.files.sampleFile, 
        extension    = sampleFile.mimetype.split("/"),
        nombreBanner = `${utils.guid()}.${extension[1]}`,
        uploadPath   = `${banner}/${nombreBanner}`;
        //Directorio del administrador...
        if (!filessystem.existsSync(directorio))
        {
            filessystem.mkdirSync(directorio);
        }
        //Directorio del concurso...
        if (!filessystem.existsSync(banner))
        {
            filessystem.mkdirSync(banner);
        }
        sampleFile.mv(uploadPath, function(err)
        {
            if (err)
            {
                //res.status(500).send(err);
                callback(true, 500);
            }
            else
            {
                //Guardar el registro...
                //Actualizar el valor del banner...
                let sql = `INSERT INTO concursos 
                            (idadministrador, token_concurso, estado, 
                            publicado, duracion_video, 
                            nombre_concurso, descripcion, 
                            banner, url_concurso, 
                            fecha_inicial, fecha_final) 
                            VALUES ('${req.user.idadministrador}', '${utils.guid()}', '1', 
                                    '1', '${data.duracion_video}', 
                                    '${data.nombre_concurso}', '${data.descripcion}', 
                                    '${nombreBanner}', '${data.url_concurso}', 
                                    '${data.fecha_inicial}', '${data.fecha_final}')`;
                db.queryMysql(sql, (err, response) => 
                {
                    callback(true, response);
                    //res.send('File uploaded to ' + uploadPath);
                });
            }
        });
};
module.exports.crearConcurso = crearConcurso;
module.exports.totalRegistrosConcurso = totalRegistrosConcurso;
module.exports.getConcurso = getConcurso;
module.exports.listarConcursos = listarConcursos;


