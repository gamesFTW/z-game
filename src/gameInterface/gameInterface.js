function GameInterface(game){
    // TODO переписать на ивенты
    game.activeScene.onPlayerHpChanged = function(newHp){
        $(".player-hp").text(newHp);
    };

//    $(".player-hp").text(game.player.hp);
};
