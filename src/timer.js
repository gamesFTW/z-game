function GlobalTimer() {
    if (!GlobalTimer.__instance)
        GlobalTimer.__instance = this;
    else
        return GlobalTimer.__instance;
}

GlobalTimer.prototype.constructor = GlobalTimer;

GlobalTimer.prototype.init = function() {
    this._delays = [];
    window.delay = _.bind(this.delay, this);
    return this;
};

GlobalTimer.prototype.tick = function() {
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

GlobalTimer.prototype.pause = function() {
    var now = new Date().getTime();
    for(var index in this._delays) {
        this._delays[index].pauseBuffer = now;
    }
};

GlobalTimer.prototype.unPause = function() {
    var now = new Date().getTime();
    for(var index in this._delays) {
        var item = this._delays[index];
        item.pause += now-item.pauseBuffer;
    }
};

GlobalTimer.prototype.delay = function(func, delay, repeat) {
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

GlobalTimer.prototype.removeAllDelaysWithFunction = function(func) {
    for (var i = this._delays.length - 1; i >= 0; i--) {
        if (this._delays[i].func == func)
            this._delays.splice(i, 1);
    }
};

