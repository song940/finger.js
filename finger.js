
/**
 * [Finger description]
 * @param {[type]} el [description]
 */
function Finger(el){
  if(!(this instanceof Finger))
    return new Finger(el);

  if(typeof el == 'string')
    el = document.querySelector(el);

  this.events  = {};
  this.element = el;
  this.element.addEventListener('touchstart' , this.start .bind(this));
  this.element.addEventListener('touchmove'  , this.move  .bind(this));
  this.element.addEventListener('touchend'   , this.end   .bind(this));
  this.element.addEventListener('touchcancel', this.cancel.bind(this));

};
/**
 * [start description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Finger.prototype.start = function(e){
  this.a = e.touches;
  this.trigger('start', e);
};
/**
 * [move description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Finger.prototype.move = function(e){
  e.preventDefault();
  this.b = e.touches;
  this.trigger('move', e);
  if(this.b.length == 2){
    var x1 = this.b[0].pageX;
    var y1 = this.b[0].pageY;
    var x2 = this.b[1].pageX;
    var y2 = this.b[1].pageY;
    // calc 'a' and 'b'
    var dist = Math.sqrt((x1-x2) * (x1-x2) + (y1-y2) * (y1-y2));
    this.trigger('pinch', { scale: dist });

    var rotation = Math.arctan2(y1 - y2, x1 - x2) * 180 / Math.PI;
    this.trigger('rotate', { angle: rotation });
  }

};

/**
 * [end description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Finger.prototype.end = function(e){
  this.c = e.changedTouches;
  this.trigger('end', e);
  if(this.c.length == 1){
    var x1 = this.a[0].pageX;
    var y1 = this.a[0].pageY;
    var x2 = this.c[0].pageX;
    var y2 = this.c[0].pageY;
    var x3 = Math.abs(x1 - x2);
    var y3 = Math.abs(y1 - y2);
    // if 'a' eq 'c' then tap
    // else if swipe
    if(Math.abs(x3 - y3) < 10){
      this.trigger('tap')
      if((+new Date - this.timestamp) < 250) // fast
        this.trigger('tap2');
      this.timestamp = +new Date;
    }else{
      var direction = x3 >= y3
        ? (x1 - x2 > 0 ? 'left' : 'right') 
        : (y1 - y2 > 0 ? 'up'   : 'down' );
      this.trigger('swipe', { direction: direction });
    }
  }
};

/**
 * [cancel description]
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Finger.prototype.cancel = function(e){};

/**
 * [on description]
 * @param  {[type]}   type [description]
 * @param  {Function} fn   [description]
 * @return {[type]}        [description]
 */
Finger.prototype.on = function(type, fn){
  ;(this.events[ type ] = this.events[ type ] || []).push(fn);
};

/**
 * [trigger description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
Finger.prototype.trigger = function(type){
  var args = [].slice.call(arguments, 1);
  var handlers = this.events[ type ];
  if(handlers){
    for(var i in handlers){
      handlers[ i ].apply(this, args);
    }
  }
};