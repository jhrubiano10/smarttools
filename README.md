# Proyecto Maestría SmartTools

Proyecto que tiene como fin aplicar los conceptos de la asiagntura Cloud.

# Instalación

```
npm install
```

# Requerimientos hasta el momento.

* Creación de un perfil de administrador.
* Autenticación.
* Listado de concursos.
* Creación de concursos.
* Vista de un concurso.
* Subir vídeo a un concurso.
* Realizar conversión de vídeo.

# Requerimientos que hacen falta

* Listar vídeos de un concurso.
* Mostrar un vídeo de un concurso.
* Enviar e-mail de confirmación de conversión de vídeo.
* Editar/Eliminar un concurso.

# Servicios por consumir.

Se ha creado el servicio que lista los vídeos de un concuros.

```
http://localhost:3000/getvideos/token_video/pagina
```

Se puede consultar los servicios creados en el archivo [rutas.js]

# Servicio para conversión de vídeos.

Para el funcionamiento de este, previamente se debe instar ffmpeg.

```
node convert.js
```

Se creará una serie de directorios dentro de la carpeta `uploadedfiles`

* Directorio con el id del concurso.
	* banner -> Contiene las imágenes que se suben al concurso.
	* video
		* org -> Guarda el vídeo original.
		* convert -> Guarda los vídeos convertidos.
		* thumbnail -> Guarda la imagen que representa al vídeo.

### Autores

* Camilo Medina
* Jorge Rubaino

License
----
MIT

[rutas.js]:https://github.com/jhrubiano10/smarttools/blob/master/modules/rutas.js
