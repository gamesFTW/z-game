function GameInterface(game){
    game.onPlayerHpChanged = function(newHp){
        $(".player-hp").text(newHp);
    };

//    $(".player-hp").text(game.player.hp);
};