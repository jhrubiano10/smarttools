$(function()
{
    $('.summernote').summernote({
        height: 200,
        tabsize: 2
    });

    //Validar datos del formulario...
    $('#uploadForm').submit(function()
    {
        var fecha_inicia = new Date($("#fecha_inicial").val()), 
            fecha_final  = new Date($("#fecha_final").val()),
            date     	 = new Date(),  
            mes          = date.getMonth() + 1 <= 9 ? "0" + Number(date.getMonth() + 1) : date.getMonth() + 1;
            dia          = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
            fecha_actual = new Date(date.getFullYear() + "-" + mes + "-" + dia), 
            procesa      = true;
        /*
        console.log(fecha_actual);
        console.log(+fecha_inicia);
        console.log(+fecha_actual);
        */
        if(+fecha_inicia !== +fecha_actual)
        {
            if(+fecha_inicia < +fecha_actual)
            {
                sweetAlert("Fecha Inicial", "La fecha inicial no puede ser menor que la actual", "error");
                procesa = false;
            }
        }
        if(procesa)
        {
            if(+fecha_inicia !== +fecha_final)
            {
                if(+fecha_final < +fecha_inicia)
                {
                    sweetAlert("Fecha Final", "La fecha final no puede ser menor que la fecha inicial", "error");
                    procesa = false;
                }
            }
        }
        return procesa;
    });

    $("#nombre_concurso").keyup(function()
    {
        var parteNombre = $(this).val().split(" "), 
            nomUrl      = "";
        for(var i = 0; i < parteNombre.length; i++)
        {
            if(nomUrl !== "")
            {
                nomUrl += "_";
            }
            nomUrl += parteNombre[i];
        }
        $("#url_concurso").val(nomUrl.toLowerCase());
    });
});
  