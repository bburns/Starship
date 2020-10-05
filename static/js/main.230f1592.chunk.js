/*! For license information please see main.230f1592.chunk.js.LICENSE.txt */
(this.webpackJsonpstarship=this.webpackJsonpstarship||[]).push([[0],{13:function(t,i,s){t.exports=s(20)},18:function(t,i,s){},19:function(t,i,s){},20:function(t,i,s){"use strict";s.r(i);var e=s(2),h=s.n(e),a=s(12),o=s.n(a),n=(s(18),s(19),s(3)),r=s(10),l=s(4),d=s(5),c=s(0),u=s(1),y=s(9),w=s(8),p=function(){function t(){Object(c.a)(this,t),this.mass=null,this.x=0,this.y=0,this.vx=0,this.vy=0,this.ax=0,this.ay=0,this.rotation=0,this.angularVelocity=0,this.momentOfInertia=0,this.scale=1,this.present=!0,this.world=null,this.tModelToWorld=new v,this.shapeModel=new f,this.shapeDraw=new f,this.children=[]}return Object(u.a)(t,[{key:"init",value:function(t){this.world=t}},{key:"setPos",value:function(t,i){this.x=t,this.y=i,this.tModelToWorld.setTranslation(t,i)}},{key:"setVelocity",value:function(t,i){this.vx=t,this.vy=i}},{key:"step",value:function(t){this.vx+=this.ax*t,this.vy+=this.ay*t,this.x+=this.vx*t,this.y+=this.vy*t,this.rotation+=this.angularVelocity*t,this.x>this.world.width&&(this.x-=this.world.width),this.x<0&&(this.x+=this.world.width),this.tModelToWorld.setTranslation(this.x,this.y);var i,s=Object(w.a)(this.children);try{for(s.s();!(i=s.n()).done;){i.value.step(t)}}catch(e){s.e(e)}finally{s.f()}}},{key:"setScale",value:function(t){this.scale=t,this.tModelToWorld.setScale(t,t)}},{key:"setRotation",value:function(t){this.rotation=t,this.tModelToWorld.setRotation(t)}},{key:"rotate",value:function(t){this.rotation+=t,this.tModelToWorld.setRotation(this.rotation)}},{key:"checkCollision",value:function(t,i){var s=this.shapeDraw.intersectsShape(t.shapeDraw,i);if(s)return s;var e,h=Object(w.a)(this.children);try{for(h.s();!(e=h.n()).done;){var a=e.value.shapeDraw.intersectsShape(t.shapeDraw,i);if(a)return a}}catch(o){h.e(o)}finally{h.f()}return null}},{key:"explode",value:function(){var i=new t;i.init(this.world),i.setPos(this.x,this.y),i.setVelocity(this.vx,this.vy-15),i.shapeModel.addPoint(0,-25),i.shapeModel.addPoint(10,10),i.shapeModel.addPoint(0,0),i.shapeModel.addLineTo(0),i.shapeModel.addLineTo(1),i.shapeModel.addLineTo(2),i.shapeModel.addLineTo(0),this.children.addElement(i),this.present=!1}},{key:"draw",value:function(t,i){this.shapeDraw.copyFrom(this.shapeModel),this.shapeDraw.transform(this.tModelToWorld),this.shapeDraw.transform(i.tWorldToView),this.shapeDraw.drawShape(t);var s,e=Object(w.a)(this.children);try{for(e.s();!(s=e.n()).done;){s.value.draw(t,i)}}catch(h){e.e(h)}finally{e.f()}}}]),t}(),f=function(){function t(){Object(c.a)(this,t),this.max=50,this.nPoints=0,this.xPoints=[],this.yPoints=[],this.nLines=0,this.nLine=[],this.x1=0,this.y1=0,this.x2=0,this.y2=0}return Object(u.a)(t,[{key:"addPoint",value:function(t,i){this.xPoints[this.nPoints]=t,this.yPoints[this.nPoints]=i,this.nPoints++,t<this.x1&&(this.x1=t),t>this.x2&&(this.x2=t),i<this.y1&&(this.y1=i),i>this.y2&&(this.y2=i)}},{key:"addLineTo",value:function(t){this.nLine[this.nLines]=t,this.nLines++}},{key:"copyFrom",value:function(t){this.nPoints=t.nPoints,this.nLines=t.nLines,this.xPoints=Object(y.a)(t.xPoints),this.yPoints=Object(y.a)(t.yPoints),this.nLine=Object(y.a)(t.nLine),this.x1=t.x1,this.x2=t.x2,this.y1=t.y1,this.y2=t.y2}},{key:"transform",value:function(t){for(var i=0;i<this.nPoints;i++){var s=this.xPoints[i],e=this.yPoints[i];this.xPoints[i]=t.a*s+t.b*e+t.c,this.yPoints[i]=t.d*s+t.e*e+t.f}var h=this.x1,a=this.y1;this.x1=t.a*h+t.b*a+t.c,this.y1=t.d*h+t.e*a+t.f,h=this.x2,a=this.y2,this.x2=t.a*h+t.b*a+t.c,this.y2=t.d*h+t.e*a+t.f}},{key:"intersectsShape",value:function(t,i){for(var s=0;s<t.nLines-1;s++){var e=t.getLineSegment(s);if(e)for(var h=0;h<this.nLines-1;h++){var a=this.getLineSegment(h);if(a){var o=a.getIntersection(e);if(o)return o}}}return null}},{key:"getLineSegment",value:function(t){var i=this.nLine[t],s=this.nLine[t+1];if(-1!==i&&-1!==s){var e=new x;return e.x1=this.xPoints[i],e.y1=this.yPoints[i],e.x2=this.xPoints[s],e.y2=this.yPoints[s],e}return null}},{key:"drawShape",value:function(t){for(var i=0,s=0,e=!0,h=0;h<this.nLines;h++){var a=this.nLine[h];if(-1===a)e=!0;else{var o=this.xPoints[a],n=this.yPoints[a];!1===e&&t.drawLine(i,s,o,n),i=o,s=n,e=!1}}}}]),t}(),v=function(){function t(i,s,e,h,a,o){Object(c.a)(this,t),this.a=1,this.b=0,this.c=0,this.d=0,this.e=1,this.f=0}return Object(u.a)(t,[{key:"setTranslation",value:function(t,i){this.c=t,this.f=i}},{key:"setScale",value:function(t,i){this.a=t,this.e=i}},{key:"setRotation",value:function(t){this.a=Math.cos(t),this.b=-Math.sin(t),this.d=Math.sin(t),this.e=Math.cos(t)}},{key:"multiply",value:function(t){}}]),t}(),x=function(){function t(i,s,e,h){Object(c.a)(this,t),this.x1=i,this.y1=s,this.x2=e,this.y2=h,this.a=null,this.b=null,this.c=null}return Object(u.a)(t,[{key:"getIntersection",value:function(t){this.getLineParameters(),t.getLineParameters();var i=this.b*t.a-t.b*this.a;if(0===i)return null;var s=(this.b*t.c-t.b*this.c)/i,e=(this.c*t.a-t.c*this.a)/i;return this.pointInBounds(s,e)&&t.pointInBounds(s,e)?new M(s,e):null}},{key:"pointInBounds",value:function(t,i){if(this.x1<this.x2){if(t<this.x1||t>this.x2)return!1}else if(t<this.x2||t>this.x1)return!1;if(this.y1<this.y2){if(i<this.y1||i>this.y2)return!1}else if(i<this.y2||i>this.y1)return!1;return!0}},{key:"getLineParameters",value:function(){this.x1!==this.x2?(this.a=(this.y2-this.y1)/(this.x1-this.x2),this.b=1,this.c=this.a*this.x1+this.b*this.y1):(this.a=1,this.b=(this.x1-this.x2)/(this.y2-this.y1),this.c=this.a*this.x1+this.b*this.y1)}},{key:"drawSegment",value:function(t,i){i&&t.setForeground(i),t.drawLine(this.x1,this.y1,this.x2,this.y2)}},{key:"drawBoundingBox",value:function(t,i){i&&t.setForeground(i),t.drawBox(this.x1,this.y1,this.x2,this.y2)}}]),t}(),M=function t(i,s){Object(c.a)(this,t),this.x=i,this.y=s},k=function(){function t(){Object(c.a)(this,t),this.timeStep=.1,this.rdelta=0,this.rdeltaamount=.2,this.throttle=0,this.throttleamount=10,this.world=new m,this.background="#333",this.foreground="#eee"}return Object(u.a)(t,[{key:"run",value:function(t){this.context=t,this.graphics=new j(t),this.world.init(t.canvas.width,t.canvas.height),setInterval(this.step.bind(this),1e3*this.timeStep)}},{key:"onKeyDown",value:function(t){switch(t.key){case"a":this.world.bStop=!0;break;case"ArrowLeft":this.rdelta=-this.rdeltaamount;break;case"ArrowRight":this.rdelta=this.rdeltaamount;break;case"ArrowUp":this.throttle=this.throttleamount;break;case"ArrowDown":this.throttle=-this.throttleamount}}},{key:"onKeyUp",value:function(t){switch(t.key){case"ArrowLeft":case"ArrowRight":this.rdelta=0;break;case"ArrowUp":case"ArrowDown":this.throttle=0}}},{key:"step",value:function(){this.world.ship.rotate(this.rdelta),this.world.ship.setThrottle(this.throttle),this.world.step(this.timeStep),this.world.draw(this.graphics),this.world.checkCollisions(this.graphics)}}]),t}(),m=function(){function t(){Object(c.a)(this,t),this.width=0,this.height=0,this.radiansPerDegree=2*Math.pi/360,this.g=5,this.viewMain=new b,this.ship=new P,this.land=new T,this.moon=new L,this.base=new O}return Object(u.a)(t,[{key:"init",value:function(t,i){this.width=1e3,this.height=250,this.viewMain.init(this,t,i,500),this.viewMain.setScale(1),this.ship.init(this),this.land.init(this),this.moon.init(this),this.base.init(this),this.ship.setPos(this.width/2,this.height/2)}},{key:"step",value:function(t){this.ship.step(t),this.viewMain.centerOn(this.ship)}},{key:"draw",value:function(t){t.clear(),t.setColor("#000"),this.moon.draw(t,this.viewMain),this.land.draw(t,this.viewMain),this.base.draw(t,this.viewMain),this.ship.draw(t,this.viewMain)}},{key:"checkCollisions",value:function(t){var i=this.ship.checkCollision(this.base,t);if(i){var s=10;return t.setColor("green"),t.drawCircle(i.x,i.y,s),this.ship.vy*this.ship.vy+this.ship.vx*this.ship.vx>25&&(s=20,t.setColor("orange"),t.drawCircle(i.x,i.y,s),console.log("explode ship"),this.ship.explode()),this.ship.vx=0,void(this.ship.vy=0)}if(i=this.ship.checkCollision(this.land,t)){t.setColor("red"),t.drawCircle(i.x,i.y,5),this.ship.vy=-15}}}]),t}(),b=function(){function t(){Object(c.a)(this,t),this.world=null,this.trackSprite=null,this.tWorldToView=new v,this.xWorld=0,this.yWorld=0,this.widthWorld=0,this.heightWorld=0,this.widthPixels=0,this.heightPixels=0,this.xscale=0,this.yscale=0,this.scaleFactor=0}return Object(u.a)(t,[{key:"init",value:function(t,i,s,e){this.world=t,this.widthPixels=i,this.heightPixels=s,this.scaleFactor=1,this.xscale=this.widthPixels/e,this.yscale=this.xscale,this.widthWorld=e,this.heightWorld=this.heightPixels/this.yscale,this.tWorldToView.setScale(this.xscale*this.scaleFactor,this.yscale*this.scaleFactor),this.tWorldToView.setRotation(0),this.setPos(this.xWorld,this.yWorld)}},{key:"trackSprite",value:function(t){this.trackSprite=t}},{key:"setScale",value:function(t){this.scaleFactor=t,this.tWorldToView.setScale(this.xscale*this.scaleFactor,this.yscale*this.scaleFactor),this.setPos(this.xWorld,this.yWorld)}},{key:"centerOn",value:function(t){this.x=t.x-this.widthWorld/2/this.scaleFactor,this.y=t.y-this.heightWorld/2/this.scaleFactor,this.y+this.heightWorld/this.scaleFactor>this.world.height&&(this.y=this.world.height-this.heightWorld/this.scaleFactor),this.y<0&&(this.y=0),this.setPos(this.x,this.y)}},{key:"setPos",value:function(t,i){this.xWorld=t,this.yWorld=i,this.tWorldToView.setTranslation(-this.xscale*this.scaleFactor*this.xWorld,-this.yscale*this.scaleFactor*i)}},{key:"drawBorder",value:function(t){t.drawRect(0,0,this.widthPixels-1,this.heightPixels-1)}}]),t}(),P=function(t){Object(d.a)(s,t);var i=Object(l.a)(s);function s(){var t;return Object(c.a)(this,s),(t=i.call(this)).massShip=0,t.massFuel=0,t.rotationUnit=0,t.burnRate=0,t.exhaustVelocity=0,t.thrustUnit=0,t.throttle=0,t.shipSize=30,t.outOfFuel=!1,t.flame=new g,t}return Object(u.a)(s,[{key:"init",value:function(t){this.world=t,this.flame.init(t),this.flame.ship=this,this.massShip=1e3,this.massFuel=5e3,this.mass=this.massShip+this.massFuel,this.rotation=0,this.rotationUnit=1*t.radiansPerDegree,this.exhaustVelocity=250,this.momentOfInertia=2*this.massShip*40*(1-1/Math.sqrt(2)),this.burnRate=(t.g*this.massShip+this.massFuel/2)/(5*this.exhaustVelocity),this.burnRate*=6,this.thrustUnit=this.burnRate*this.exhaustVelocity,this.shapeModel.addPoint(0,-25),this.shapeModel.addPoint(-10,10),this.shapeModel.addPoint(-7,1),this.shapeModel.addPoint(-21,15),this.shapeModel.addPoint(10,10),this.shapeModel.addPoint(21,15),this.shapeModel.addPoint(7,1),this.shapeModel.addLineTo(0),this.shapeModel.addLineTo(1),this.shapeModel.addLineTo(2),this.shapeModel.addLineTo(3),this.shapeModel.addLineTo(1),this.shapeModel.addLineTo(4),this.shapeModel.addLineTo(5),this.shapeModel.addLineTo(6),this.shapeModel.addLineTo(4),this.shapeModel.addLineTo(0),this.setScale(1),this.setRotation(this.rotation)}},{key:"setThrottle",value:function(t){this.outOfFuel?this.throttle=0:this.throttle=t}},{key:"step",value:function(t){var i=this.massShip+this.massFuel,e=this.throttle*this.burnRate*t,h=this.throttle*this.thrustUnit/i;this.ax=h*Math.sin(this.rotation),this.ay=-h*Math.cos(this.rotation)+this.world.g,this.massFuel-=e,this.massFuel<0&&(this.massFuel=0,this.outOfFuel=!0),Object(r.a)(Object(n.a)(s.prototype),"step",this).call(this,t)}},{key:"explode",value:function(){}},{key:"drawStats",value:function(t){var i;i="Velocity (m/s): ("+Math.floor(10*this.vx)/10+", "+Math.floor(10*this.vy)/10+")",t.drawString(i,4,22),i="Fuel (kg): ("+this.massFuel+")",this.massFuel<500&&t.setColor("red"),t.drawString(i,4,33)}},{key:"draw",value:function(t,i){Object(r.a)(Object(n.a)(s.prototype),"draw",this).call(this,t,i),this.throttle>0&&this.flame.draw(t,i)}}]),s}(p),g=function(t){Object(d.a)(s,t);var i=Object(l.a)(s);function s(){var t;return Object(c.a)(this,s),(t=i.call(this)).ship=null,t}return Object(u.a)(s,[{key:"init",value:function(t){this.world=t,this.shapeModel.addPoint(-5,11),this.shapeModel.addPoint(0,60),this.shapeModel.addPoint(5,11),this.shapeModel.addLineTo(0),this.shapeModel.addLineTo(1),this.shapeModel.addLineTo(2)}},{key:"draw",value:function(t,i){Math.random()>.5?t.setColor("yellow"):t.setColor("orange"),this.shapeDraw.copyFrom(this.shapeModel),this.shapeDraw.transform(this.ship.tModelToWorld),this.shapeDraw.transform(i.tWorldToView),this.shapeDraw.drawShape(t)}}]),s}(p),T=function(t){Object(d.a)(s,t);var i=Object(l.a)(s);function s(){return Object(c.a)(this,s),i.apply(this,arguments)}return Object(u.a)(s,[{key:"init",value:function(t){this.world=t,this.width=t.width,this.height=t.height;for(var i=this.height/5,s=0;s<40;s++){var e=this.width*s/39,h=this.height-Math.random()*i;this.shapeModel.addPoint(e,h),this.shapeModel.addLineTo(s)}this.nBase=Math.floor(40*Math.random()),this.shapeModel.yPoints[this.nBase]=this.shapeModel.yPoints[this.nBase+1]=this.shapeModel.yPoints[this.nBase+2],this.shapeModel.yPoints[39]=this.shapeModel.yPoints[0],this.setScale(1)}},{key:"draw",value:function(t,i){if(this.shapeDraw.copyFrom(this.shapeModel),this.shapeDraw.transform(this.tModelToWorld),this.shapeDraw.transform(i.tWorldToView),this.shapeDraw.drawShape(t),i.xWorld>this.world.width-i.widthWorld){var s=new f;s.copyFrom(this.shapeModel),s.transform(this.tModelToWorld);var e=new v;e.setTranslation(i.world.width,0),s.transform(e),s.transform(i.tWorldToView),s.drawShape(t)}if(i.xWorld<i.widthWorld){var h=new f;h.copyFrom(this.shapeModel),h.transform(this.tModelToWorld);var a=new v;a.setTranslation(-i.world.width,0),h.transform(a),h.transform(i.tWorldToView),h.drawShape(t)}}}]),s}(p),O=function(t){Object(d.a)(s,t);var i=Object(l.a)(s);function s(){return Object(c.a)(this,s),i.apply(this,arguments)}return Object(u.a)(s,[{key:"init",value:function(t){this.world=t,this.width=t.width,this.height=t.height,this.hillHeight=this.height/5;var i=t.land.nBase;this.x=t.land.shapeModel.xPoints[i],this.xw=this.width/20,this.y=t.land.shapeModel.yPoints[i],this.yw=this.height/40,this.shapeModel.addPoint(this.x,this.y),this.shapeModel.addPoint(this.x+this.xw,this.y),this.shapeModel.addPoint(this.x+this.xw,this.y-this.yw),this.shapeModel.addPoint(this.x,this.y-this.yw),this.shapeModel.addLineTo(0),this.shapeModel.addLineTo(1),this.shapeModel.addLineTo(2),this.shapeModel.addLineTo(3),this.shapeModel.addLineTo(0),this.setScale(1)}},{key:"draw",value:function(t,i){this.shapeDraw.copyFrom(this.shapeModel),this.shapeDraw.transform(this.tModelToWorld),this.shapeDraw.transform(i.tWorldToView),this.shapeDraw.drawShape(t)}}]),s}(p),L=function(t){Object(d.a)(s,t);var i=Object(l.a)(s);function s(){var t;return Object(c.a)(this,s),(t=i.call(this)).radius=20,t}return Object(u.a)(s,[{key:"init",value:function(t){this.world=t,this.shapeModel.addPoint(0,0),this.setPos(550,50)}},{key:"draw",value:function(t,i){t.setColor("#eee"),t.drawCircle(this.shapeDraw.xPoints[0],this.shapeDraw.yPoints[0],this.radius)}}]),s}(p),j=function(){function t(i){Object(c.a)(this,t),this.context=i}return Object(u.a)(t,[{key:"setBackground",value:function(t){}},{key:"setForeground",value:function(t){this.context.strokeStyle=t}},{key:"setColor",value:function(t){this.context.strokeStyle=t}},{key:"clear",value:function(){this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height)}},{key:"drawCircle",value:function(t,i,s){this.context.beginPath(),this.context.arc(t,i,s,0,2*Math.PI),this.context.stroke()}},{key:"drawLine",value:function(t,i,s,e){this.context.beginPath(),this.context.moveTo(t,i),this.context.lineTo(s,e),this.context.stroke()}},{key:"drawBox",value:function(t,i,s,e){this.context.beginPath(),this.context.rect(t,i,s-t,e-i),this.context.stroke()}}]),t}(),W=new k;var S=function(){return h.a.useEffect((function(){var t=document.querySelector("canvas"),i=t.getContext("2d");W.run(i),t.onkeydown=function(t){return W.onKeyDown(t)},t.onkeyup=function(t){return W.onKeyUp(t)},t.focus()}),[]),h.a.createElement("div",{className:"App"},h.a.createElement("canvas",{width:"800",height:"400",tabIndex:"1"}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(h.a.createElement(h.a.StrictMode,null,h.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[13,1,2]]]);
//# sourceMappingURL=main.230f1592.chunk.js.map