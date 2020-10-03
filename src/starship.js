//-----------------------------------------------------------------------------
// starship.js
// A moon lander applet
// Note: all units are kg, meters, m/s, m/s/s, radians, newtons, etc.  
//
// Author: Brian Burns
// License: GPL
// History:
//   version 0.1  2001-05  no base, bounces on surface
//   version 0.2  2012-05  adding base, realistic collisions
//   version 0.3  2015-12  converting to javascript
//-----------------------------------------------------------------------------


class App {
  
  constructor() {
    this.timeStep = 0.1 // [seconds]
  
    // sleep delay during each timestep - 
    // keeps things from going too fast and flickering (well)
    this.delay = 100 // [milliseconds] 
    
    this.world = new World()
    
    this.rdelta = 0.0
    this.rdeltaamount = 0.2
    this.throttle = 0
    this.throttleamount = 10
  }
  
  // Initialize the applet
  init() {
  
    // Initialize world and all the sprites it contains
    this.world.init(this.getSize().width, this.getSize().height)

    this.setBackground(Color.white)
    this.setForeground(Color.black)

    // this.addKeyListener(this)
    
    // this.thisThread = new Thread(this)
    // this.thisThread.start()
  }
  
  keyPressed(e) {
    switch (e.getKeyCode()) {
      // debug:
      // case KeyEvent.VK_A:
        // world.bStop = true
        // break
      case KeyEvent.VK_LEFT:
        this.rdelta = -this.rdeltaamount
        break      
      case KeyEvent.VK_RIGHT:
        this.rdelta = this.rdeltaamount
        break      
      case KeyEvent.VK_UP:
        this.throttle = this.throttleamount
        break
      case KeyEvent.VK_DOWN:
        this.throttle = -this.throttleamount
        break
    }    
  }
  
  keyReleased(e) {
    switch (e.getKeyCode()) {
      case KeyEvent.VK_LEFT:
      case KeyEvent.VK_RIGHT:
        this.rdelta = 0.0
        break
      case KeyEvent.VK_UP:
      case KeyEvent.VK_DOWN:
        this.throttle = 0
        break
    }    
  }
  
  keyTyped(e) {
  }

  // Run thread
  // This gets called by the applet framework when you get to do something. 
  // In this case, advance all objects by one timestep and redraw. 
  run() {
    while (true) {
      
      // Adjust ship rotation and throttle 
      this.world.ship.rotate(this.rdelta)
      this.world.ship.setThrottle(this.throttle)
      
      // Advance sprites
      this.world.step(this.timeStep)
      
      // Pause for a bit, to keep things from going too fast. 
      try {
        this.thisThread.sleep(delay)
      }
      catch(ex) {}
      
      // Repaint display
      this.repaint()
    }
  }

  // Draw the world and everything in it
  paint(graphics) {
    this.world.draw(graphics)
  }
}



//-----------------------------------------------------------------------------
// World
//-----------------------------------------------------------------------------

// The world object contains all the sprites - the ship, land, stars, moon, 
// clouds, etc.
// Each sprite can be fixed or movable.
// Also contains a view which it uses in rendering itself and its sprites.
class World {

  constructor() {
    // Attributes: 
    this.width // Width and height of world, in world units (meters)
    this.height
    this.radiansPerDegree = 2.0 * Math.pi / 360.0 // conversion factor
    this.g = 4.0 // gravity (m/s/s), ~half earth

    // views should probably belong to the applet, since that's the main window
    // will want a view for the stats also, which could be its own class?
    this.viewMain = new View()
    // this.viewShip = new View()
    
    // Sprite objects in this world
    this.ship = new Ship()
    this.land = new Land()
    this.moon = new Moon()
    this.base = new Base()
    // this.stars = new Stars()
    // this.clouds = new Clouds()

    this.pointIntersect = new Point2D() // intersection point used in collision testing
  }

  // Initialize the world
  // width and height in pixels
  init(appletWidth, appletHeight) {
    
    const widthWindow = 500.0 // the view window looks on this many meters of the world horizontally
    this.width = widthWindow * 2 // let's make the world two view width's wide
    this.height = widthWindow / 2.0
    
    // Initialize view
    this.viewMain.init(this, this.appletWidth, this.appletHeight, widthWindow)

    // Set the zoom scale
    this.viewMain.setScale(1.0)
    
    // Initialize all the sprites
    this.ship.init(this)
    this.land.init(this)
    this.moon.init(this)
    this.base.init(this)
    // this.stars.init(this)
    // this.clouds.init(this)
    
    // Put ship in middle of world
    this.ship.setPos(this.width / 2.0, this.height / 2.0)

    //, Tell view to track the ship sprite
    // this.view.trackSprite(this.ship)
  }
  
  // Advance the world and all objects in it by one timestep. 
  step(timeStep) {
    // Move ship and any other moving sprites
    this.ship.step(timeStep)
      
    // Center the view on the ship
    this.viewMain.centerOn(this.ship)
  }
  
  // Draw the world and all the sprites it contains
  //... move collision to another fn
  draw(graphics) {
    
    // Draw sprites
    moon.draw(graphics, viewMain)
    land.draw(graphics, viewMain)
    base.draw(graphics, viewMain)
    ship.draw(graphics, viewMain)
    // stars.draw(graphics, viewMain)
    // clouds.draw(graphics, viewMain)

    // Draw stats and border
//    viewMain.drawBorder(graphics) // flickers
//    ship.drawStats(graphics) // flickers

    // Check for collisions
    // Must do after drawing.
    
    // Check for ship-base collision = bad or good depending on speed
    if (this.ship.checkCollision(this.base, pointIntersect, graphics)) {
      
      // Draw a spark at the point of intersection (a small green circle)
      let w = 5
      graphics.setColor(Color.green)
      graphics.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)
      
      // Ship should explode if above a certain velocity
      if ((this.ship.vy*this.ship.vy + this.ship.vx*this.ship.vx) > 25) {
        w = 40
        graphics.setColor(Color.orange)
        graphics.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)
        console.log("explode ship")
        this.ship.explode()
      }
      
      // always stop the ship?
      this.ship.vx = 0 
      this.ship.vy = 0 
      
    }
    
    // Check for collisions between the ship and land.
    else if (this.ship.checkCollision(this.land, pointIntersect, graphics)) {
      
      // Draw a spark at the point of intersection (a small red circle)
      let w = 5
      graphics.setColor(Color.red)
      graphics.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)

      // Impart momentum to the ship
      //. a certain amount of energy will go into deforming soil and ship
      // ship.angularVelocity += 0.2f
      this.ship.vy = -15.0 // bounce up!
      
      //. Ship should explode if above a certain velocity
      // this.ship.explode()
    }
  }
}



//-----------------------------------------------------------------------------
// View
//-----------------------------------------------------------------------------

// A view is a window on the world.
// Has a certain position in the world, and converts to/from pixel units.
// Can be set to track a certain sprite, to keep it in the center of the view. 
class View {

  constructor() {

    // Attributes
    this.world = null // reference to world that this view is looking at
    this.trackSprite = null // reference to sprite that we want to track
    this.tWorldToView = new Transform() // transform from world coordinates to view coordinates
    
    // Position and size of view, in world coordinates
    this.xWorld = 0
    this.yWorld = 0
    this.widthWorld = 0
    this.heightWorld = 0

    // Size of view, in pixels
    this.widthPixels = 0
    this.heightPixels = 0
    
    // Scale
    // private float aspectRatio = 1.2f
    this.xscale = 0 // pixels per world unit
    this.yscale = 0
    this.scaleFactor = 0 // unitless zoom factor (eg 2.0 means zoom in by factor of 2, 0.5 is zoom out)

  }

  // Initialize the view
  init(world, viewWidthPixels, viewHeightPixels, viewWidthWorldUnits) {

    this.world = world
    this.widthPixels = viewWidthPixels
    this.heightPixels = viewHeightPixels
    this.scaleFactor = 1.0 // initialize zoom factor (unitless)

    // Get conversion factor between pixels and world units
    this.xscale = this.widthPixels / viewWidthWorldUnits // pixels per world unit
    this.yscale = this.xscale // for now
    
    // Save width and height of view in world units
    this.widthWorld = viewWidthWorldUnits
    this.heightWorld = this.heightPixels / this.yscale

    // Initialize the view transform, which converts from world coordinates to view coordinates (pixels)
    this.tWorldToView.setScale(this.xscale * this.scaleFactor, this.yscale * this.scaleFactor)
    this.tWorldToView.setRotation(0.0)
    // this.tWorldToView.setTranslation(- this.xscale * this.xWorld, - this.yscale * this.yWorld)
    this.setPos(this.xWorld, this.yWorld) // sets translate vector
  }
  
  // Track the specified sprite to keep it centered in the view if possible
  trackSprite(sprite) {
    this.trackSprite = sprite
  }
  
  setScale(scale) {
    this.scaleFactor = scale
    // this.tWorldToView.setScale(scale, scale)
    // this.tWorldToView.setTranslation(- this.xscale * this.xWorld, - this.yscale * this.yWorld)
    this.tWorldToView.setScale(this.xscale * this.scaleFactor, this.yscale * this.scaleFactor)
    this.setPos(this.xWorld, this.yWorld) // upates translate vector
  }
    
  // Center view on the specified sprite
  //. also include approx size of sprite
  centerOn(sprite) {
    
    // Set position of view in world coords so sprite will be centered in the view
    this.x = sprite.x - this.widthWorld / 2 / this.scaleFactor
    this.y = sprite.y - this.heightWorld / 2 / this.scaleFactor
    
    // Keep view in world vertically
    if ((this.y + this.heightWorld / this.scaleFactor) > this.world.height)
    this.y = this.world.height - this.heightWorld / this.scaleFactor
    if (this.y < 0)
    this.y = 0
    
    // Wraparound view horizontally
    // if (this.x > this.world.width)
    //   this.x -= this.world.width
    // if (this.x < 0)
    //   this.x += this.world.width

    // Set the position for the view and update the transform matrix
    this.setPos(this.x, this.y)
  }

  // Set the position of the view within the world
  setPos(xWorld, yWorld) {
    this.xWorld = xWorld
    this.yWorld = yWorld
    // Update transform
    // this.tWorldToView.setTranslation(- this.xscale * this.xWorld, - this.yscale * this.yWorld)
    this.tWorldToView.setTranslation(- this.xscale * this.scaleFactor * this.xWorld, - this.yscale * this.scaleFactor * yWorld)
  }
    
  // Draw a border around view
  //... this flickers, badly
  drawBorder(graphics) {
    graphics.drawRect(0, 0, this.widthPixels - 1, this.heightPixels - 1)
  }
}



//-----------------------------------------------------------------------------
// Ship
//-----------------------------------------------------------------------------

// A sprite to represent the ship
// Also contains a flame sprite, to represent the flame. 
//. extends Sprite
class Ship {

  constructor() {
    // Attributes
    this.massShip = 0 // [kg]
    this.massFuel = 0 // [kg]
    this.rotationUnit = 0 // [radians]
    this.burnRate = 0 // [kg/s]
    this.exhaustVelocity = 0 // [m/s] 
    this.thrustUnit = 0 // [N]
    this.throttle = 0 // 0 to 10. thrust = throttle * thrustunit
    this.shipSize = 30.0 // rough size of ship
    this.outOfFuel = false // flag

    this.flame = new Flame() // sprite representing flame
  }

  // Initialize the ship
  init(world) {
    
    this.world = world
  
    // x = world.width / 5
    
    this.flame.init(world)
    this.flame.ship = this
  
    this.massShip = 1000 // kg
    this.massFuel = 5000 // kg
    this.mass = this.massShip + this.massFuel
    this.rotation = 0.0 // radians
    this.rotationUnit = 1.0 * world.radiansPerDegree // degrees converted to radians
    this.exhaustVelocity = 250.0 // m/s (approximately mach 1)
    this.momentOfInertia = this.massShip * 2 * (25+15) * (1 - 1 / Math.sqrt(2)) // kg (about center of mass)

    // Parallel axis theorem - For Mass Moments of Inertia 
    // M : is the mass of the body. 
    // d : is the perpendicuar distance between the centroidal axis and the parallel axis.  
    // Ic is moment of inertia about center of mass
    // Ip = Ic + M*d*d
    
    // Calculate a burnRate that will balance out gravity at 
    // throttle 5 and fuel tank half empty.
    // this.burnRate = 1.0 // kg/s
    this.burnRate = (world.g * this.massShip + (this.massFuel / 2.0)) / (5.0 * this.exhaustVelocity) // 2.8 kg/s for g=1m/s/s 
    this.burnRate *= 6.0 //?
    this.thrustUnit = this.burnRate * this.exhaustVelocity // kgm/s/s = newtons  
    
    // Define ship's vertices, in world units (meters)
    this.shapeModel.addPoint(  0, -25) // 0
    this.shapeModel.addPoint(-10,  10) // 1
    this.shapeModel.addPoint( -7,   1) // 2
    this.shapeModel.addPoint(-21,  15) // 3
    this.shapeModel.addPoint( 10,  10) // 4
    this.shapeModel.addPoint( 21,  15) // 5
    this.shapeModel.addPoint(  7,   1) // 6
    
    // Define ship's shape with line segments
    this.shapeModel.addLineTo(0)
    this.shapeModel.addLineTo(1)
    this.shapeModel.addLineTo(2)
    this.shapeModel.addLineTo(3)
    this.shapeModel.addLineTo(1)
    this.shapeModel.addLineTo(4)
    this.shapeModel.addLineTo(5)
    this.shapeModel.addLineTo(6)
    this.shapeModel.addLineTo(4)
    this.shapeModel.addLineTo(0)
    
    this.setScale(1.0)
    this.setRotation(this.rotation)
  }

  // Set the throttle level
  setThrottle(throttle) {
    if (this.outOfFuel)
      this.throttle = 0
    else
      this.throttle = throttle
  }
  
  // Move the ship according to its velocity, gravity, thrust, etc,
  // and update the drawing shape.
  step(timeStep) {
    
    // Get amount of fuel burned
    const mass = this.massShip + this.massFuel
    const fuelBurned = this.throttle * this.burnRate * timeStep
    const thrust = this.throttle * this.thrustUnit
    const thrustAccel = thrust / mass
    
    // Move ship according to gravity, thrust, etc.
    this.ax = thrustAccel * Math.sin(this.rotation)
    // this.ay = - thrustAccel * Math.cos(this.rotation) + this.world.g
    this.ay = - thrustAccel * Math.cos(this.rotation)

    // Update fuel remaining
    this.massFuel -= fuelBurned
    if (this.massFuel < 0) {
      this.massFuel = 0
      this.outOfFuel = true  
    }

    // Call base class
    super.step(timeStep)
  }
  
  //. Make the ship explode!
  explode() {    
    // draw orange and yellow circles filled for fire.
    // create a bunch of sub-sprites for pieces of ship,
    // give them all rnd velocities (plus ships velocity).
    // on draw just draw these instead of the ship.
    // on step move these instead of ship.
    // ie make a ShipRemains object with a bunch of subobjects with different velocities?
    // have them all stop at some depth under the horizon.
    
    // call super with a parameter for velocities etc
    // replace existing sprite with child sprites.
    // ie remove all line segments from this sprite. right?    
    // super.explode()    
  }  

  // Draw ship stats
  //. this flickers too much - don't call it
  drawStats(graphics) {
    //! format
    // what is all this - where's printf?
    // NumberFormat numberFormatter
    // numberFormatter = NumberFormat.getNumberInstance(currentLocale)
    // numberFormatter.format(amount)
    let s
    // s = "Position (m): (" + x + ", " + y + ")"
    // g.drawString(s, 4, 22)
    s = "Velocity (m/s): (" + Math.floor(this.vx*10)/10 + ", " + Math.floor(this.vy*10)/10 + ")"
    graphics.drawString(s, 4, 22)
    // s = "Acceleration (m/s/s): (" + ax + ", " + ay + ")"
    // graphics.drawString(s, 4, 44)
    // s = "Rotation: (" + rotation + ")"
    // graphics.drawString(s, 4, 55)
    // s = "Throttle: (" + throttle + ")"
    // graphics.drawString(s, 4, 66)
    s = "Fuel (kg): (" + this.massFuel + ")"
    if (this.massFuel < 500)
      graphics.setColor(Color.red)
    graphics.drawString(s, 4, 33)
    graphics.setColor(Color.black)
    // s = "view pos: (" + polyDraw.xpoints[0] + ", " + polyDraw.ypoints[0] + ")"
    // graphics.drawString(s, 4, 80)
  }
  
  // Draw ship according to the specified view transformations
  draw(graphics, view) {
    
    // Call base class to draw model
    super.draw(graphics, view)
    
    // Draw flame
    // how do we handle this? step could turn this subsprite on and off, ie set a flag in it
    // sprite.draw could check for subsprites and transform them the same as the
    // parent sprite, if the lock flag was set, otherwise would use their own transform
    // this would make it easier to have things detach, like rocket boosters, and let
    // them fall away - they would get same vel as ship, but only gravity would work on them.
    // also each sprite could have different colors, or each segment could?
    // might need to override draw for flame to get it to flicker correctly but that's okay
    if (this.throttle > 0)
      this.flame.draw(graphics, view)  
  }
}


//-----------------------------------------------------------------------------
// * Flame
//-----------------------------------------------------------------------------

// A sprite to represent the flickering flame from the ship


// class Flame 
//   extends Sprite {
    
//   Ship ship // the shipe this sprite belongs to
  
//   // Initialize the flame
//   public void init(World w) {
    
//     world = w
  
//     // Define flame's shape, in world units (meters)
//     shapeModel.addPoint(-5, 11) // 0
//     shapeModel.addPoint( 0, 60) // 1
//     shapeModel.addPoint( 5, 11) // 2

//     shapeModel.addLineTo(0)
//     shapeModel.addLineTo(1)
//     shapeModel.addLineTo(2)    
//   }

//   // Draw the flickering flame
//   //, Note: will eventually just use base class to draw this sprite -
//   // it has a parent which is where draw will get tModelToWorld from
//   public void draw(Graphics g, View view) {
    
//     // Set color for flames
//     if (Math.random() > 0.5)
//       g.setColor(Color.yellow) //. do white or yelloworange. red is too red. redorange? 
//     else
//       g.setColor(Color.orange)

//     // Draw shape using base class
// //    super.draw(g, view)    
//     shapeDraw = new ShapeX()
//     shapeDraw.copyFrom(shapeModel)
//     shapeDraw.transform(ship.tModelToWorld)
//     shapeDraw.transform(view.tWorldToView)
//     shapeDraw.drawShape(g)
    
//     //, set color back
//     g.setColor(Color.black)
//   }
// }



//-----------------------------------------------------------------------------
// Land
//-----------------------------------------------------------------------------

// A sprite to represent the hills.
// Land will wrap around when reaches the edges. 
class Land extends Sprite {

  // Initialize the land sprite, by making up random hills.
  init(world) {
    
    this.world = world    
    this.width = world.width
    this.height = world.height
    const hillHeight = this.height / 5 //. 20% of world height
    
    // Create random horizon line
    const nPoints = 40
    for (let i = 0; i < nPoints; i++) {
      const x = this.width * i / (nPoints - 1)
      const y = this.height - (Math.random() * hillHeight)
      this.shapeModel.addPoint(x, y)
      this.shapeModel.addLineTo(i)
    }

    // Make space for a base
    this.shapeModel.yPoints[29] = this.shapeModel.yPoints[30] = this.shapeModel.yPoints[31]
    
    // Make the last point the same as the first point so it will wrap around properly
    this.shapeModel.yPoints[nPoints-1] = this.shapeModel.yPoints[0]
    
    // Set scale
    this.setScale(1.0)
  }

  // Draw the land
  draw(graphics, view) {
    
    const shapeDraw = new ShapeX()
    shapeDraw.copyFrom(this.shapeModel)
    shapeDraw.transform(this.tModelToWorld)
    shapeDraw.transform(view.tWorldToView)
    shapeDraw.drawShape(graphics)
    
    // Repeat land off to the right
    if (view.xWorld > (this.world.width - view.widthWorld)) {
      const shape2 = new ShapeX()
      shape2.copyFrom(shapeModel)
      shape2.transform(tModelToWorld)
      Transform t = new Transform()
      t.setTranslation(world.width, 0)
      shape2.transform(t)
      shape2.transform(view.tWorldToView)
      shape2.drawShape(g)
    }
    // Repeat land off to the left
    if (view.xWorld < view.widthWorld) {
      ShapeX shape2 = new ShapeX()
      shape2.copyFrom(shapeModel)
      shape2.transform(tModelToWorld)
      Transform t = new Transform()
      t.setTranslation(-world.width, 0)
      shape2.transform(t)
      shape2.transform(view.tWorldToView)
      shape2.drawShape(g)
    }
  }  
}


//-----------------------------------------------------------------------------
// Base
//-----------------------------------------------------------------------------

// A sprite to represent the moonbase.
class Base extends Sprite {

  init(world) {
    
    this.world = world
    this.width = world.width
    this.height = world.height
    this.hillHeight = height / 5 //. 20% of world height

    this.x = world.land.shapeModel.xPoints[29]
    this.xw = this.width / 20
    
    this.y = world.land.shapeModel.yPoints[29]
    this.yw = this.height / 40
    
    this.shapeModel.addPoint(this.x, this.y)
    this.shapeModel.addPoint(this.x+this.xw, this.y)
    this.shapeModel.addPoint(this.x+this.xw, this.y-this.yw)
    this.shapeModel.addPoint(this.x, this.y-this.yw)
    this.shapeModel.addLineTo(0)
    this.shapeModel.addLineTo(1)
    this.shapeModel.addLineTo(2)
    this.shapeModel.addLineTo(3)
    this.shapeModel.addLineTo(0)
    
    // Set scale
    this.setScale(1.0)
  }

  // Draw the base
  draw(graphics, view) {
    const shapeDraw = new ShapeX()
    shapeDraw.copyFrom(this.shapeModel)
    shapeDraw.transform(this.tModelToWorld)
    shapeDraw.transform(view.tWorldToView)
    shapeDraw.drawShape(graphics)
  }  
}


//-----------------------------------------------------------------------------
// Moon
//-----------------------------------------------------------------------------

// A simple circle that doesn't interact with other sprites
//. extend sprite
class Moon {

  constructor() {
    this.diam = 40 // [m]
  }
  
  init(world) {
    this.world = world
    // Define moon's shape, in model coords (world units)
    this.shapeModel.addPoint(0, 0)
    this.setPos(550.0, 50.0)
  }
  
  draw(graphics, view) {
    // use superclass to get shapeDraw
    // super.draw(graphics, view)
    graphics.setColor(Color.lightGray)
    graphics.drawOval(this.shapeDraw.xPoints[0], this.shapeDraw.yPoints[0], this.diam, this.diam)    
    graphics.setColor(Color.black)
  }
}


//-----------------------------------------------------------------------------
// Stars
//-----------------------------------------------------------------------------

// sprites
class Stars {
}


//-----------------------------------------------------------------------------
// Clouds
//-----------------------------------------------------------------------------

// sprites
class Clouds {
}
