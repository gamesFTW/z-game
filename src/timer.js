modules.define(
    'Timer', [], function(provide) {

    function Timer() {
    }

    Timer.prototype.constructor = Timer;

    Timer.prototype.init = function() {
        this._delays = [];
        return this;
    };

    Timer.prototype.tick = function() {
        var now = new Date().getTime();
        var index = this._delays.length;
        while (--index >= 0) {
            var item = this._delays[index];
            if(item.start + item.delay + item.pause < now) {
                if (item.enabled === true) {
                    item.func.call(this);
                    if (item.repeat > 0 ) {
                        // reschedule item
                        item.start = now;
                        item.pause = 0;
                        item.pauseBuffer = 0;
                        item.repeat--;
                    }
                }

                if (item.repeat <= 0) {
                    // remove item from array
                    this._delays.splice(index,1);
                }
            }
        }
    };

    Timer.prototype.pause = function() {
        var now = new Date().getTime();
        for(var index in this._delays) {
            this._delays[index].pauseBuffer = now;
        }
    };

    Timer.prototype.unPause = function() {
        var now = new Date().getTime();
        for(var index in this._delays) {
            var item = this._delays[index];
            item.pause += now-item.pauseBuffer;
        }
    };

    Timer.prototype.delay = function(func, delay, repeat) {
        this._delays.push({
            start : new Date().getTime(),
            func : func,
            delay : delay,
            repeat: ( repeat < 0 ? Infinity : repeat) || 0,
            pauseBuffer: 0,
            pause: 0,
            enabled: true
        });

        var delayObject = this._delays[this._delays.length - 1];
        var delayController = {
            remove: function() {
                delayObject.repeat = 0;
                delayObject.enabled = false;
            },
            enable: function() {
                delayObject.enabled = true;
            },
            disable: function() {
                delayObject.enabled = false;
            }
        };
        return delayController;
    };

    Timer.prototype.removeAllDelaysWithFunction = function(func) {
        for (var i = this._delays.length - 1; i >= 0; i--) {
            if (this._delays[i].func == func)
                this._delays.splice(i, 1);
        }
    };

    provide(Timer);
});
