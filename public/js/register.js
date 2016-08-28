$(function()
{
    //$(".form-group:eq(0) > input").val()
    $("#form").submit(function(event)
    {
        event.preventDefault();
        event.stopPropagation();
        var procesa = true,    
            datos   = {};
        //Validar que el password sea el mismo...
        if($("#password").val() !== $("#repite_password").val())
        {
            procesa = false;
            sweetAlert("PASSWORD", "La confirmacion del password no es la misma", "error");
        }
        if(procesa)
        {            
            for(var i = 0; i < $(".form-group").size(); i++)
            {
                var campo = $(".form-group:eq("+i+") > input"), 
                            label = campo.attr("name");
                if(campo.val() !== "")
                { 
                    datos[label] = campo.val();
                }
                else
                {
                    procesa = false;
                    sweetAlert("Completar espacio", "Por favor escribe el valor correspondiente a " + label, "error");
                    break;
                }
            }
        }
        if(procesa)
        {
            //console.log(datos);
            $.ajax(
            {
                url 		: "/register",
                type 		: "POST",
                data 		: JSON.stringify(datos),
                dataType 	: "json",
                contentType: "application/json; charset=utf-8"
            }).done(function(data)
            {
                if(data.error)
                {
                    sweetAlert("Error", data.msg, "error");
                }
                else
                {
                    window.location = "/admin";
                }
            }).error(function(request, status, error)
            {
                console.log(request);
            });
        }
        return false;
    });
    /*
    var validaEmail = function(email)
	{
		var emailReg = /^([\da-zA-Z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        return emailReg.test(email);
	};
    */
});
