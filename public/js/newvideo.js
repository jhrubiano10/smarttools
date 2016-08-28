$(function()
{
    $('.summernote').summernote({
        height: 200,
        tabsize: 2
    });

    $("#upvideo").click(function()
    {
        $("#upload").trigger("click");
    });

    $('#upload').change(function ()
	{
		var val = $(this).val().toLowerCase();
        //.avi, .wmv, .flv, .mov, .mp4
		var regex = new RegExp("(.*?)\.(avi|wmv|flv|mov|mp4)$");
		if(!(regex.test(val)))
		{
			$(this).val('');
			sweetAlert("Formato de vídeo", "El formato de vídeo no es válido", "error");
            $("#nombreVideo").html("Selecciona el vídeo");
		}
		else
		{
            var parteVal = $(this).val().split("\\"), 
                nombreVideo = parteVal[parteVal.length - 1]; 
            $("#nombreVideo").html(nombreVideo);
		}
	});
});
  