
var RgbPlasma = (function() {
  var canvas,ctx,w,h,imgData,
    points={},
    ringsize=5,prevDate,
    shouldStop=false, _onAfterStop;

  function init() {
    canvas = document.querySelector('canvas'),
    window.ctx = ctx = canvas.getContext('2d');

    w = canvas.width = Math.floor(innerWidth/Settings.quality);
    h = canvas.height = Math.floor(innerHeight/Settings.quality);
    imgData = ctx.createImageData(canvas.width, canvas.height);
    
    points = {
      all : [],
      red : [],
      green: [],
      blue: []
    };
    $status.empty();

    function createPoints(color) {
      for (var i=0 ; i<Settings[color]; i++) {
        var p = new Point(color, w,h, $("<div>").appendTo($status).addClass(color));
        points[color].push(p);
        points.all.push(p);
      }
    }

    createPoints("red");
    createPoints("green");
    createPoints("blue");


    positionDashboard();
  }

  function update(dt) {
    for (var i=0 ; i<points.all.length ; i++)
      points.all[i].update(dt);
  }

  function xor(points, x2,y2){
    var ringCount = 0 ;
    for (var i = 0; i < points.length; i++) {
      var pos = points[i].getPos();
      var dx = pos.x - x2; 
      var dy = pos.y - y2;
      var d = Math.sqrt(dx*dx + dy*dy);

      // ring number counted from the center
      var r = Math.floor(d / Settings.ringSize);

      ringCount +=r;
    };

    return 255 * (ringCount % 2);
  }

  function max(points, x2,y2) {
    var result = 0;

    for (var i = 0; i < points.length; i++) {
      var pos  = points[i].getPos();

      var dx = pos.x - x2; 
      var dy = pos.y - y2;
      d = Math.sqrt(dx*dx + dy*dy);

      var r = Math.floor(d / Settings.ringSize);
      var rd = r * Settings.ringSize;

      if (Settings.ringsEnabled)
        value =  r % 2 == 0 ? 255 - 1/Settings.ring1 * rd: 255 - 1/Settings.ring2 * rd;
      else
        value = 255- 1/Settings.ring1*rd;

      result = Math.max(result, value);
    };

    return result;

  }

  function render() {
    
    for (var x=0 ; x < w ; x++)
    for (var y=0 ; y < h ; y++)
    {
      var p = (y*w+x) * 4;
      imgData.data[p] = methods[Settings.method](points.red,x,y);
      imgData.data[p+1] = methods[Settings.method](points.green,x,y);
      imgData.data[p+2] = methods[Settings.method](points.blue,x,y);
      imgData.data[p+3] = 255;
    }

    ctx.putImageData(imgData,0,0);

    if (showOverlay)
      overlay();
  }

  function overlay() {
    for (var i=0 ; i<points.length ; i++)
      points[i].overlay();
  }

  function loop() {
    if (shouldStop)
    {
      if (_onAfterStop) _onAfterStop();
      shouldStop = false;
      return;
    }

    requestAnimFrame(loop);
    
    var newDate = new Date();
    if (prevDate) {
      update((newDate - prevDate) / 1000);
      
      render();
      
      if (debug)
        stats.update();
    }
    prevDate = newDate
  }

  function run() {
    init();
    shouldStop = false;
    loop();
  }

  function stop(callback) {
    shouldStop = true;
    _onAfterStop = callback;
  }

  function reset() {
    stop(run);
  }

  var methods = {
   xor : xor,
   max : max
  };

  return {
    run : run,
    stop : stop,
    reset : reset
  }
})();