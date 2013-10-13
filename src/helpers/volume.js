$(function() {
    $("#volumeController").change(function(event) j{
        var volume = Number($("#volumeController option:selected").attr("value")) / 10;
        createjs.Sound.setVolume(volume);

        localStorage.setItem("gameMasterVolume", volume);
    });

    var volume = localStorage.getItem("gameMasterVolume");
    if (volume == null)
        volume = 1;

    createjs.Sound.setVolume(volume);
    $("#volumeController option").eq(volume * 10).attr("selected", "selected");
});


