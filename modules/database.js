"use strict";
const mysql = require('mysql');
let conexion = 0;

exports.conectaDatabase = () =>
{
    //Realizar la conexión a la base de datos Mysql...
    conexion = mysql.createConnection({
      host     	: 'localhost',
      user     	: '',
      password 	: '',
      database 	: 'smarttools'
    });
    conexion.connect();
};

//Realiza la consulta...
exports.queryMysql = (sql, callback) =>
{
	conexion.query(sql, (err, rows, fields) =>
	{
		if (err) throw err;
		callback(err, rows);
	});
};
