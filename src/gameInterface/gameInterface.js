function GameInterface(game) {
    game.activeScene.player.addEventListener(LiveObject.HP_CHANGED, function(event){
        $(".player-hp").text(event.target.hp);
    });
};
