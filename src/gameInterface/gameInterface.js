function GameInterface(game) {
    modules.require(['LiveObject'], function(LiveObject) {
        game.activeScene.player.addEventListener(LiveObject.HP_CHANGED, function(event){
        });
    });
}
