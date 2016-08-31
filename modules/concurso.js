"use strict";
const db   	        = require('./database'), 
      filessystem 	= require('fs'), 
	  utils			= require('./utils'), 
      moment        = require('moment'), 
      striptags     = require('striptags'),
      maximoPagina  = 5;

let fecha_actual = moment().format(), 
    fecha_string = moment().format("DD/MM/YYYY"), 
    hora_string  = moment().format("hh:mm:ss a");

//Para saber si un enlace ya existe...
let existeEnlace = (enlace, token, callback) => 
{
    let sql = `select count(*) as numero 
               from concursos 
               where url_concurso = '${enlace}' and 
                     estado = '1' and 
                     token_concurso <> '${token}'`;
    db.queryMysql(sql, (err, data) => 
    {        
        if (err) throw err;        
        callback(err, data[0].numero === 0);
    });    
};

let totalRegistrosConcurso = (idadministrador, callback) => 
{
    let sql = `select count(*) as numero from concursos 
               where idadministrador = '${idadministrador}' and 
                     estado = 1`;
    db.queryMysql(sql, (err, data) => 
    {
        //console.log("REGISTROS");
        //console.log(data[0].numero);
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
                      publicado, nombre_concurso, url_concurso, 
                      fecha_inicial_string as fecha_inicial, fecha_final_string  as fecha_final, 
                      fecha_creacion_string as fecha_creacion, hora_creacion_string as hora
                      from concursos 
                      where idadministrador = '${req.user.idadministrador}' and 
                            estado = 1 order by fecha_creacion limit ${numPagina}, ${maximoPagina}`; 
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
        callback(err, data);
    });
};

//Parea guardar/editar los datos de un concurso...
let guardaEditaConcurso = (existeArchivo, editar, token_concurso, registros, callback) => 
{
    let sql = "";
    for(let obj in registros)
    {
        let ejecuta = !existeArchivo && obj === "banner" ? false: true;
        if(ejecuta)
        {
            if(sql != "")
            {
                sql += ", ";
            }
            sql += `${obj} = '${registros[obj]}'`;
        }
    }
    if(!editar)
    {
        sql += `, token_concurso = '${utils.guid()}'`;
    }
    //console.log(sql);
    let sqlGuarda = (!editar ? "INSERT INTO" : "UPDATE") + ` concursos SET ${sql}`;
    if(editar)
    {
        sqlGuarda += ` where token_concurso = '${token_concurso}'`;
    }
    //console.log(sqlGuarda);
    //Guardar el registro...                            
    db.queryMysql(sqlGuarda, (err, response) => 
    {
        callback(err, response);
    });
};

let crearConcurso = (req, callback) => 
{
    let data = req.body, 
        token_concurso = data.token_concurso === "" ? "0" : data.token_concurso, 
        editar = token_concurso === "0" ? false : true, 
        existeArchivo = true;
    //console.log("Valor del token es: " + token_concurso);
    //console.log(req.files);
    //Sabe si existe un archivo...    
    if (!req.files)
    {        
        callback(true, "No existe archivo para subir");        
    }
    else
    {
        //Saber si llega un archivo...        
        if(editar)
        {
            if(req.files.sampleFile.name === "")
            {
                existeArchivo = false;
            }
        }
    }    
    let directorio      = `./uploadedfiles/${req.user.idadministrador}`,
        banner	        = `${directorio}/banner`, 
        sampleFile      = existeArchivo ? req.files.sampleFile : "", 
        extension       = existeArchivo ? sampleFile.mimetype.split("/") : "",
        nombreBanner    = existeArchivo ? `${utils.guid()}.${extension[1]}` : "",
        uploadPath      = `${banner}/${nombreBanner}`, 
        nombre_concurso = striptags(data.nombre_concurso), 
        url_concurso    = striptags(data.url_concurso).toLowerCase(), 
        fecha_inicial   = striptags(data.fecha_inicial), 
        fecha_final     = striptags(data.fecha_final);
        //Primero validar que los datos enviados sean válidos...
        if(!moment(fecha_inicial, "YYYY/MM/DD").isValid() || !moment(fecha_final, "YYYY/MM/DD").isValid())
        {
            callback(true, "La fechas no son válidas");
        }
        if(existeArchivo)
        {
            if(extension[0].toLowerCase() !== "image")
            {
                callback(true, "No es una imagen válida");
            }
        }
        //Saber si la url es única...
        existeEnlace(url_concurso, token_concurso, (err, NoExiste) => 
        {
            if (err) throw err;            
            if(NoExiste)
            {
                let registros = {
                                    idadministrador : req.user.idadministrador,                                                         
                                    estado :  1,
                                    publicado : 1,
                                    nombre_concurso : nombre_concurso,
                                    descripcion : data.descripcion,
                                    banner : nombreBanner,
                                    url_concurso : url_concurso,
                                    fecha_inicial : moment(fecha_inicial, "YYYY/MM/DD").format(), 
                                    fecha_inicial_string : fecha_inicial,
                                    fecha_inicial_timestamp : moment(fecha_inicial, "YYYY/MM/DD").format("x"), 
                                    fecha_final : moment(fecha_final, "YYYY/MM/DD").format(), 
                                    fecha_final_string : fecha_final,  
                                    fecha_final_timestamp : moment(fecha_final, "YYYY/MM/DD").format("x"), 
                                    fecha_creacion : fecha_actual, 
                                    fecha_creacion_string : fecha_string,
                                    hora_creacion_string : hora_string
                                };
                //Crear los directorios...
                if(!editar)
                {
                    //Directorio del administrador...
                    utils.crearDirectorio(directorio);
                    //Directorio del concurso...
                    utils.crearDirectorio(banner);
                }
                if(existeArchivo)
                {
                    sampleFile.mv(uploadPath, (err) => 
                    {
                        if (err)
                        {                        
                            callback(true, "Error al subir la imagen");
                        }
                        else
                        {                            
                            guardaEditaConcurso(                                                    
                                                    existeArchivo, 
                                                    editar, 
                                                    token_concurso,
                                                    registros,                                                     
                                                    (err, response) => 
                                                    {
                                                        callback(false, "Registro realizado");
                                                    }
                                                );
                        }
                    });
                }
                else
                {
                    if(editar)
                    {
                        guardaEditaConcurso(                                                
                                                existeArchivo,
                                                editar, 
                                                token_concurso, 
                                                registros, 
                                                (err, response) => 
                                                {
                                                    callback(false, "Registro realizado");
                                                }
                                            );
                    }
                }
            }
            else
            {
                callback(true, `La url ${url_concurso} ya está asociada a otro concurso`);
            }
        });        
};

//Para eliminar un concurso...
let eliminaConcurso = (token_concurso, callback) => 
{
    let sql = `UPDATE concursos SET estado = '2' where token_concurso = '${token_concurso}'`;
    console.log(sql);
    db.queryMysql(sql, (err, response) => 
    {
        callback(err, response);
    });
};

module.exports.crearConcurso = crearConcurso;
module.exports.totalRegistrosConcurso = totalRegistrosConcurso;
module.exports.getConcurso = getConcurso;
module.exports.listarConcursos = listarConcursos;
module.exports.eliminaConcurso = eliminaConcurso;