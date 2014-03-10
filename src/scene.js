modules.define(
    "Scene", ['EventDispatcher'], function() {

    function Scene(provide, EventDispatcher) {

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
