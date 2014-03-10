$(function(){
    modules.require(
        ['Game'],
        function(Game) {
            window.game = new Game();
            window.game.init();
        });
});
