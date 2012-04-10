var Point = function(c, width,height, $status) {
  var color = c ,x,y,tx,ty,vx=0,vy=0,w=width,h=height,ax,ay;

  function randomize() {
    x = Math.floor(Math.random() * w);
    y = Math.floor(Math.random() * h);

    vx = -3 + Math.random() * 6;
    vy = -3 + Math.random() * 6;
  }

  function retarget() {
    tx = Math.floor(Math.random() * w);
    ty = Math.floor(Math.random() * h);
  }

  function getPos() { return { x: x, y:y }; }

  function getSpeed() { return { x: vx, y: vy }; }

  function getAcc() { return { x: ax, y: ay }; }

  function getTarget() { return { x: tx, y: ty }; }

  function follow(dt, target) {
    var pos = target.getPos();
    var d = distanceTo(pos.x, pos.y);
    var dx = pos.x - x;
    var dy = pos.y - y;
    
    var angle = Math.atan2(dy, dx);

    ax = Math.cos(angle) * 2000 / Math.max(1, d*d);
    ay = Math.sin(angle) * 2000 / Math.max(1, d*d);

    vx += dt * ax;
    vy += dt * ay;

    x += dt * vx;
    y += dt * vy;

    if (d < 100)
    {
      retarget();
    }

    if (debug)
      $status.html(log("pos",x,y) + log("vel",vx,vy) + log("acc",ax,ay) + log("tgt",tx,ty));
  }

  function update(dt) {
    var d = distanceTo(tx, ty);
    var dx = tx - x;
    var dy = ty - y;
    
    var angle = Math.atan2(dy, dx);

    ax = Math.cos(angle) * Math.sqrt(d);
    ay = Math.sin(angle) * Math.sqrt(d);

    vx += dt * ax;
    vy += dt * ay;

    x += dt * vx;
    y += dt * vy;

    if (Math.random() < 0.005)
    {
      retarget();
    }
    
    if (debug)
      $status.html(log("pos",x,y) + log("vel",vx,vy) + log("acc",ax,ay) + log("tgt",tx,ty));
  }

  function log() {
    var args =  Array.prototype.slice.apply(arguments, [1]);
    return arguments[0] + ": " + args.map(function(arg) { return arg.toFixed(2); }) .join(", ") + "<br>";
  }

  function distanceTo(x2,y2) {
    var dx = x - x2; 
    var dy = y - y2;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function ring(x2,y2) {
    var dx = x - x2; 
    var dy = y - y2;
    d = Math.sqrt(dx*dx + dy*dy);

    var r = Math.floor(d / Settings.ringSize);
    var rd = r * Settings.ringSize;
    if (Settings.ringsEnabled)
      return  r % 2 == 0 ? 255 - 1/Settings.ring1 * rd: 255 - 1/Settings.ring2 * rd;
    else
      return 255- 1/Settings.ring1*rd;
  }

  function overlay() {
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 1;
    drawVector(x,y, { x: tx-x, y: ty-y });

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    drawVector(x,y, { x: ax, y: ay });
  }

  randomize();
  retarget();

  return {
    getPos : getPos,
    getSpeed : getSpeed,
    getAcc : getAcc,
    randomize : randomize,
    distanceTo: distanceTo,
    ring: ring,
    update: update,
    retarget: retarget,
    getTarget : getTarget,
    overlay: overlay,
    color: color
  };
}