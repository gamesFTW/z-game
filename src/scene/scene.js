modules.define(
    "Scene", ['EventDispatcher'], function(provide, EventDispatcher) {

    function Scene() {

    }

    Scene.prototype = Object.create(EventDispatcher.prototype);
    Scene.prototype.constructor = Scene;

    Scene.prototype.init = function() {

    };

    Scene.prototype.active = function() {

    };

    Scene.prototype.disactive = function() {

    };


    provide(Scene);
});
