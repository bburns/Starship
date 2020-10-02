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
// class World {
  
//   // Attributes: 
//   public float width, height // Width and height of world, in world units (meters)
//   public float radiansPerDegree = 2.0f * (float) Math.PI / 360.0f // conversion factor
//   public float g = 4.0f // gravity (m/s/s), ~half earth

//   // views should probably belong to the applet, since that's the main window
//   // will want a view for the stats also, which could be its own class?
//   View viewMain = new View()
//   // View viewShip = new View()
  
//   // Sprite objects in this world
//   Ship ship = new Ship()
//   Land land = new Land()
//   Moon moon = new Moon()
//   Base base = new Base()
//   // Stars stars = new Stars()
//   // Clouds clouds = new Clouds()

//   Point2D pointIntersect = new Point2D() // intersection point used in collision testing                     

//   // Initialize the world
//   // width and height in pixels
//   public void init(int appletWidth, int appletHeight) {
    
//     float widthWindow = 500.0f // the view window looks on this many meters of the world horizontally
//     width = widthWindow * 2 // let's make the world two view width's wide
//     height = widthWindow / 2.0f
    
//     // Initialize view
//     viewMain.init(this, appletWidth, appletHeight, widthWindow)

//     // Set the zoom scale
//     viewMain.setScale(1.0f)
    
//     // Initialize all the sprites
//     ship.init(this)
//     land.init(this)
//     moon.init(this)
//     base.init(this)
//     // stars.init(this)
//     // clouds.init(this)
    
//     // Put ship in middle of world
//     ship.setPos(width / 2.0f, height / 2.0f)

//     //, Tell view to track the ship sprite
//     // view.trackSprite(ship)
//   }
  
//   // Advance the world and all objects in it by one timestep. 
//   public void step(float timeStep) {
//     // Move ship and any other moving sprites
//     ship.step(timeStep)
      
//     // Center the view on the ship
//     viewMain.centerOn(ship)      
//   }
  
//   // Draw the world and all the sprites it contains
//   //... move collision to another fn
//   public void draw(Graphics g) {
    
//     // Draw sprites
//     moon.draw(g, viewMain)
//     land.draw(g, viewMain)
//     base.draw(g, viewMain)
//     ship.draw(g, viewMain)
//     // stars.draw(g, viewMain)
//     // clouds.draw(g, viewMain)

//     // Draw stats and border
// //    viewMain.drawBorder(g) // flickers
// //    ship.drawStats(g) // flickers

//     // Check for collisions
//     // Must do after drawing.
    
//     // Check for ship-base collision = bad or good depending on speed
//     if (ship.checkCollision(base, pointIntersect, g)) {
      
//       // Draw a spark at the point of intersection (a small green circle)
//       int w = 5
//       g.setColor(Color.green)
//       g.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)
      
//       // Ship should explode if above a certain velocity
//       if ((ship.vy*ship.vy + ship.vx*ship.vx) > 25) {
//         w = 40
//         g.setColor(Color.orange)
//         g.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)
//         System.out.println("explode ship")
//         ship.explode()
//       }
      
//       // always stop the ship?
//       ship.vx = 0 
//       ship.vy = 0 
      
//     }
    
//     // Check for collisions between the ship and land.
//     else if (ship.checkCollision(land, pointIntersect, g)) {
      
//       // Draw a spark at the point of intersection (a small red circle)
//       int w = 5
//       g.setColor(Color.red)
//       g.drawOval(pointIntersect.x - w, pointIntersect.y - w, w, w)

//       // Impart momentum to the ship
//       //. a certain amount of energy will go into deforming soil and ship
//       // ship.angularVelocity += 0.2f
//       ship.vy = -15.0f // bounce up!
      
//       //. Ship should explode if above a certain velocity
//       // ship.explode()
//     }
//   }
// }



//-----------------------------------------------------------------------------
// * View
//-----------------------------------------------------------------------------

// A view is a window on the world.
// Has a certain position in the world, and converts to/from pixel units.
// Can be set to track a certain sprite, to keep it in the center of the view. 


// class View {

//   // Attributes
//   World world // reference to world that this view is looking at
//   Sprite trackSprite // reference to sprite that we want to track
//   Transform tWorldToView = new Transform() // transform from world coordinates to view coordinates
  
//   // Position and size of view, in world coordinates
//   public float xWorld, yWorld
//   public float widthWorld, heightWorld

//   // Size of view, in pixels
//   public int widthPixels, heightPixels
  
//   // Scale
//   // private float aspectRatio = 1.2f
//   public float xscale, yscale // pixels per world unit
//   public float scaleFactor // unitless zoom factor (eg 2.0 means zoom in by factor of 2, 0.5 is zoom out)

//   // Initialize the view
//   public void init(World w, int viewWidthPixels, int viewHeightPixels, float viewWidthWorldUnits) {

//     world = w
//     widthPixels = viewWidthPixels
//     heightPixels = viewHeightPixels
//     scaleFactor = 1.0f // initialize zoom factor (unitless)

//     // Get conversion factor between pixels and world units
//     xscale = widthPixels / viewWidthWorldUnits // pixels per world unit
//     yscale = xscale // for now
    
//     // Save width and height of view in world units
//     widthWorld = viewWidthWorldUnits
//     heightWorld = heightPixels / yscale

//     // Initialize the view transform, which converts from world coordinates to view coordinates (pixels)
//     tWorldToView.setScale(xscale * scaleFactor, yscale * scaleFactor)
//     tWorldToView.setRotation(0.0f)
// //    tWorldToView.setTranslation(- xscale * xWorld, - yscale * yWorld)
//     setPos(xWorld, yWorld) // sets translate vector
//   }
  
//   // Track the specified sprite to keep it centered in the view if possible
//   public void trackSprite(Sprite s) {
//     trackSprite = s
//   }
  
//   public void setScale(float s) {
//     scaleFactor = s
//     // tWorldToView.setScale(s, s)
//     // tWorldToView.setTranslation(- xscale * xWorld, - yscale * yWorld)
//     tWorldToView.setScale(xscale * scaleFactor, yscale * scaleFactor)
//     setPos(xWorld, yWorld) // upates translate vector
//   }
    
//   // Center view on the specified sprite
//   //. also include approx size of sprite
//   public void centerOn(Sprite sprite) {
    
//     // Set position of view in world coords so sprite will be centered in the view
//     float x = sprite.x - widthWorld / 2 / scaleFactor
//     float y = sprite.y - heightWorld / 2 / scaleFactor
    
//     // Keep view in world vertically
//     if ((y + heightWorld / scaleFactor) > world.height)
//       y = world.height - heightWorld / scaleFactor
//     if (y < 0)
//       y = 0
    
//     // Wraparound view horizontally
// //    if (x > world.width)
// //      x -= world.width
// //    if (x < 0)
// //      x += world.width

//     // Set the position for the view and update the transform matrix
//     setPos(x, y)
//   }

//   // Set the position of the view within the world
//   public void setPos(float xWorldp, float yWorldp) {
//     xWorld = xWorldp
//     yWorld = yWorldp
//     // Update transform
// //    tWorldToView.setTranslation(- xscale * xWorld, - yscale * yWorld)
//     tWorldToView.setTranslation(- xscale * scaleFactor * xWorld, - yscale * scaleFactor * yWorld)
//   }
    
//   // Draw a border around view
//   //... this flickers, badly
//   public void drawBorder(Graphics g) {
//     g.drawRect(0, 0, widthPixels - 1, heightPixels - 1)
//   }
// }



//-----------------------------------------------------------------------------
// * Ship
//-----------------------------------------------------------------------------

// A sprite to represent the ship
// Also contains a flame sprite, to represent the flame. 


// class Ship 
//   extends Sprite {

//   // Attributes
//   int massShip // [kg]
//   int massFuel // [kg]
//   float rotationUnit // [radians]
//   float burnRate // [kg/s]
//   float exhaustVelocity // [m/s] 
//   float thrustUnit // [N]
//   int throttle // 0 to 10. thrust = throttle * thrustunit
//   float shipSize = 30.0f // rough size of ship
//   boolean outOfFuel // flag

//   Flame flame = new Flame() // sprite representing flame
  
//   // Initialize the ship
//   public void init(World w) {
    
//     world = w
  
// //    x = world.width / 5
    
//     flame.init(w)
//     flame.ship = this
  
//     massShip = 1000 // kg
//     massFuel = 5000 // kg
//     mass = massShip + massFuel
//     rotation = 0.0f // radians
//     rotationUnit = 1.0f * world.radiansPerDegree // degrees converted to radians
//     exhaustVelocity = 250.0f // m/s (approximately mach 1)
//     momentOfInertia = massShip * 2 * (25+15) * (1 - 1 / (float) Math.sqrt(2)) // kg (about center of mass)

//     // Parallel axis theorem - For Mass Moments of Inertia 
//     // M : is the mass of the body. 
//     // d : is the perpendicuar distance between the centroidal axis and the parallel axis.  
//     // Ic is moment of inertia about center of mass
//     // Ip = Ic + M*d*d
    
//     // Calculate a burnRate that will balance out gravity at 
//     // throttle 5 and fuel tank half empty.
//     // burnRate = 1.0f // kg/s
//     burnRate = (world.g * massShip + (massFuel / 2.0f)) / (5.0f * exhaustVelocity) // 2.8 kg/s for g=1m/s/s 
//     burnRate *= 6.0f
//     thrustUnit = burnRate * exhaustVelocity // kgm/s/s = newtons  
    
//     // Define ship's vertices, in world units (meters)
//     shapeModel.addPoint(  0, -25) // 0
//     shapeModel.addPoint(-10,  10) // 1
//     shapeModel.addPoint( -7,   1) // 2
//     shapeModel.addPoint(-21,  15) // 3
//     shapeModel.addPoint( 10,  10) // 4
//     shapeModel.addPoint( 21,  15) // 5
//     shapeModel.addPoint(  7,   1) // 6
    
//     // Define ship's shape with line segments
//     shapeModel.addLineTo(0)
//     shapeModel.addLineTo(1)
//     shapeModel.addLineTo(2)
//     shapeModel.addLineTo(3)
//     shapeModel.addLineTo(1)
//     shapeModel.addLineTo(4)
//     shapeModel.addLineTo(5)
//     shapeModel.addLineTo(6)
//     shapeModel.addLineTo(4)
//     shapeModel.addLineTo(0)
    
//     setScale(1.0f)
//     setRotation(rotation)
//   }

//   // Set the throttle level
//   public void setThrottle(int t) {
//     if (outOfFuel)
//       throttle = 0
//     else
//       throttle = t
//   }
  
//   // Move the ship according to its velocity, gravity, thrust, etc,
//   // and update the drawing shape.
//   public void step(float timeStep) {
    
//     // Get amount of fuel burned
//     mass = massShip + massFuel
//     float fuelBurned = throttle * burnRate * timeStep
//     float thrust = throttle * thrustUnit
//     float thrustAccel = thrust / mass
    
//     // Move ship according to gravity, thrust, etc.
//     ax = thrustAccel * (float) Math.sin(rotation)
//     // ay = - thrustAccel * (float) Math.cos(rotation) + world.g
//     ay = - thrustAccel * (float) Math.cos(rotation)

//     // Update fuel remaining
//     massFuel -= fuelBurned
//     if (massFuel < 0) {
//       massFuel = 0
//       outOfFuel = true  
//     }

//     // Call base class
//     super.step(timeStep)
//   }
  
//   //. Make the ship explode!
//   public void explode() {    
//     // draw orange and yellow circles filled for fire.
//     // create a bunch of sub-sprites for pieces of ship,
//     // give them all rnd velocities (plus ships velocity).
//     // on draw just draw these instead of the ship.
//     // on step move these instead of ship.
//     // ie make a ShipRemains object with a bunch of subobjects with different velocities?
//     // have them all stop at some depth under the horizon.
    
//     // call super with a parameter for velocities etc

//     // replace existing sprite with child sprites.
//     // ie remove all line segments from this sprite. right? 
    
// //    super.explode()    
//   }  

//   // Draw ship stats
//   //. this flickers too much - don't call it
//   public void drawStats(Graphics g) {
//     //! format
//     // what is all this - where's printf?
//     // NumberFormat numberFormatter
//     // numberFormatter = NumberFormat.getNumberInstance(currentLocale)
//     // numberFormatter.format(amount)
//     String s
// //    s = "Position (m): (" + x + ", " + y + ")"
// //    g.drawString(s, 4, 22)
//     s = "Velocity (m/s): (" + Math.floor(vx*10)/10 + ", " + Math.floor(vy*10)/10 + ")"
//     g.drawString(s, 4, 22)
// //    s = "Acceleration (m/s/s): (" + ax + ", " + ay + ")"
// //    g.drawString(s, 4, 44)
// //    s = "Rotation: (" + rotation + ")"
// //    g.drawString(s, 4, 55)
// //    s = "Throttle: (" + throttle + ")"
// //    g.drawString(s, 4, 66)
//     s = "Fuel (kg): (" + massFuel + ")"
//     if (massFuel < 500)
//       g.setColor(Color.red)
//     g.drawString(s, 4, 33)
//     g.setColor(Color.black)
//     // s = "view pos: (" + polyDraw.xpoints[0] + ", " + polyDraw.ypoints[0] + ")"
//     // g.drawString(s, 4, 80)
//   }
  
//   // Draw ship according to the specified view transformations
//   public void draw(Graphics g, View view) {
    
//     // Call base class to draw model
//     super.draw(g, view)
    
//     // Draw flame
//     // how do we handle this? step could turn this subsprite on and off, ie set a flag in it
//     // sprite.draw could check for subsprites and transform them the same as the
//     // parent sprite, if the lock flag was set, otherwise would use their own transform
//     // this would make it easier to have things detach, like rocket boosters, and let
//     // them fall away - they would get same vel as ship, but only gravity would work on them.
//     // also each sprite could have different colors, or each segment could?
//     // might need to override draw for flame to get it to flicker correctly but that's okay
//     if (throttle > 0)
//       flame.draw(g, view)  
//   }
// }


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
// * Land
//-----------------------------------------------------------------------------

// A sprite to represent the hills.
// Land will wrap around when reaches the edges. 


// class Land extends Sprite {

//   // Initialize the land sprite, by making up random hills.
//   public void init(World w) {
    
//     world = w    
//     int width = (int) world.width
//     int height = (int) world.height
//     int hillHeight = height / 5 //. 20% of world height
    
//     // Create random horizon line
//     int nPoints = 40
//     for (int i = 0 i < nPoints i++) {
//       int x = width * i / (nPoints - 1)
//       int y = height - (int) (Math.random() * hillHeight)
//       shapeModel.addPoint(x, y)
//       shapeModel.addLineTo(i)
//     }

//     // Make space for a base
//     shapeModel.yPoints[29] = shapeModel.yPoints[30] = shapeModel.yPoints[31]
    
//     // Make the last point the same as the first point so it will wrap around properly
//     shapeModel.yPoints[nPoints-1] = shapeModel.yPoints[0]
    
//     // Set scale
//     setScale(1.0f)
//   }

//   // Draw the land
//   public void draw(Graphics g, View view) {
    
//     shapeDraw = new ShapeX()
//     shapeDraw.copyFrom(shapeModel)
//     shapeDraw.transform(tModelToWorld)
//     shapeDraw.transform(view.tWorldToView)
//     shapeDraw.drawShape(g)
    
//     // Repeat land off to the right
//     if (view.xWorld > (world.width - view.widthWorld)) {
//       ShapeX shape2 = new ShapeX()
//       shape2.copyFrom(shapeModel)
//       shape2.transform(tModelToWorld)
//       Transform t = new Transform()
//       t.setTranslation(world.width, 0)
//       shape2.transform(t)
//       shape2.transform(view.tWorldToView)
//       shape2.drawShape(g)
//     }
//     // Repeat land off to the left
//     if (view.xWorld < view.widthWorld) {
//       ShapeX shape2 = new ShapeX()
//       shape2.copyFrom(shapeModel)
//       shape2.transform(tModelToWorld)
//       Transform t = new Transform()
//       t.setTranslation(-world.width, 0)
//       shape2.transform(t)
//       shape2.transform(view.tWorldToView)
//       shape2.drawShape(g)
//     }
//   }  
// }


//-----------------------------------------------------------------------------
// * Base
//-----------------------------------------------------------------------------

// A sprite to represent the moonbase.


// class Base extends Sprite {

//   public void init(World w) {
    
//     world = w
//     int width = (int) world.width
//     int height = (int) world.height
//     int hillHeight = height / 5 //. 20% of world height

//     int x = (int) world.land.shapeModel.xPoints[29]
//     int xw = width / 20
    
//     int y = (int) world.land.shapeModel.yPoints[29]
//     int yw = height / 40
    
//     shapeModel.addPoint(x, y)
//     shapeModel.addPoint(x+xw, y)
//     shapeModel.addPoint(x+xw, y-yw)
//     shapeModel.addPoint(x, y-yw)
//     shapeModel.addLineTo(0)
//     shapeModel.addLineTo(1)
//     shapeModel.addLineTo(2)
//     shapeModel.addLineTo(3)
//     shapeModel.addLineTo(0)
    
//     // Set scale
//     setScale(1.0f)
//   }

//   // Draw the base
//   public void draw(Graphics g, View view) {
//     shapeDraw = new ShapeX()
//     shapeDraw.copyFrom(shapeModel)
//     shapeDraw.transform(tModelToWorld)
//     shapeDraw.transform(view.tWorldToView)
//     shapeDraw.drawShape(g)    
//   }  
// }


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
