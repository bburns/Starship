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


// public class JavaLander 
//   extends Applet 
//   implements KeyListener, Runnable {
  
//   Thread thisThread

//   timeStep = 0.1f // [seconds]
  
//   // sleep delay during each timestep - 
//   // keeps things from going too fast and flickering (well)
//   int delay = 100 // [milliseconds] 
  
//   World world = new World()
  
//   // Keyboard flags
//   float rdelta = 0.0f
//   float rdeltaamount = 0.2f
//   int throttle = 0
//   int throttleamount = 10
  
//   // Initialize the applet
//   init() {
  
//     // Initialize world and all the sprites it contains
//     world.init(getSize().width, getSize().height)

//     setBackground(Color.white)
//     setForeground(Color.black)

//     this.addKeyListener(this)
    
//     thisThread = new Thread(this)
//     thisThread.start()
//   }
  
//   public void keyPressed(KeyEvent e) {
//     switch (e.getKeyCode()) {
//       // debug:
//       // case KeyEvent.VK_A:
//         // world.bStop = true
//         // break
//       case KeyEvent.VK_LEFT:
//         rdelta = -rdeltaamount
//         break      
//       case KeyEvent.VK_RIGHT:
//         rdelta = rdeltaamount
//         break      
//       case KeyEvent.VK_UP:
//         throttle = throttleamount
//         break
//       case KeyEvent.VK_DOWN:
//         throttle = -throttleamount
//         break
//     }    
//   }
  
//   public void keyReleased(KeyEvent e) {
//     switch (e.getKeyCode()) {
//       case KeyEvent.VK_LEFT:
//       case KeyEvent.VK_RIGHT:
//         rdelta = 0.0f
//         break      
//       case KeyEvent.VK_UP:
//       case KeyEvent.VK_DOWN:
//         throttle = 0
//         break
//     }    
//   }
  
//   public void keyTyped(KeyEvent e) {
//   }

//   // Run thread
//   // This gets called by the applet framework when you get to do something. 
//   // In this case, advance all objects by one timestep and redraw. 
//   public void run() {
//     while (true) {
      
//       // Adjust ship rotation and throttle 
//       world.ship.rotate(rdelta)
//       world.ship.setThrottle(throttle)
      
//       // Advance sprites
//       world.step(timeStep)
      
//       // Pause for a bit, to keep things from going too fast. 
//       try {
//         thisThread.sleep(delay)
//       }
//       catch(InterruptedException ex) {}
      
//       // Repaint display
//       repaint()
//     }
//   }

//   // Draw the world and everything in it
//   public void paint(Graphics g) {
//     world.draw(g)
//   }
// }



//-----------------------------------------------------------------------------
// * World
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
// * Moon
//-----------------------------------------------------------------------------

// A simple circle that doesn't interact with other sprites


// class Moon 
//   extends Sprite {
    
//   int diam = 40 // moon diameter
  
//   public void init(World w) {
//     world = w
//     // Define moon's shape, in model coords (world units)
//     shapeModel.addPoint(0, 0)
//     setPos(550.0f, 50.0f)
//   }
  
//   public void draw(Graphics g, View view) {
//     // use superclass to get shapeDraw
//     super.draw(g, view)
//     g.setColor(Color.lightGray)
//     g.drawOval(shapeDraw.xPoints[0], shapeDraw.yPoints[0], diam, diam)    
//     g.setColor(Color.black)
//   }
// }


//-----------------------------------------------------------------------------
// * Stars
//-----------------------------------------------------------------------------

// class Stars 
//   extends Sprite {
// }


//-----------------------------------------------------------------------------
// * Clouds
//-----------------------------------------------------------------------------

// class Clouds 
//   extends Sprite {
// }






//-----------------------------------------------------------------------------
// * Sprite library
//-----------------------------------------------------------------------------

//. to be put in separate package

//-----------------------------------------------------------------------------
// Sprite
//-----------------------------------------------------------------------------

// A sprite is an object that exists within the world
// Defines a shape in model coordinates.
// This gets transformed into world coordinates, then view coordinates, before
// being drawn. 
class Sprite {

  constructor() {
    
    this.mass = null // [kg]
    this.x = 0 // [m] position in world coordinates
    this.y = 0
    this.vx = 0 // [m/s] velocity in world units
    this.vy = 0
    this.ax = 0 // [m/s/s] acceleration in world units
    this.ay = 0
    this.rotation = 0.0 // [radians] current amount of rotation
    this.angularVelocity = 0.0 // [radians/sec]
    this.momentOfInertia = 0 // [kg] about center of mass
    this.scale = 1.0 // [unitless] zoom factor
    this.present = true // is this sprite actually here? 
    
    this.world = null // the world this sprite belongs to
    this.tModelToWorld = new Transform() // transformation from model coordinates to world coordinates
    this.shapeModel = new ShapeX() // model shape in model coordinates
    this.shapeDraw = new ShapeX() // model that will be transformed to view coordinates
    this.children = new Vector() // vector of child sprites
  }

  // Initialize the sprite
  init(world) {
    this.world = world
  }
  
  // Set the position of the sprite, in world coordinates
  setPos(xWorld, yWorld) {
    this.x = xWorld
    this.y = yWorld
    // Update the transformation matrix
    this.tModelToWorld.setTranslation(xWorld, yWorld)
  }

  // Set the velocity for the sprite, in world units
  setVelocity(vxWorld, vyWorld) {
    this.vx = vxWorld
    this.vy = vyWorld
  }

  // Advance the sprite by one timestep
  step(timeStep) {
    
    // Add acceleration due to gravity
    //, um, rather hardcoded
    this.ay += this.world.g
    
    // Integrate
    //. too primitive - fix this
    this.vx += this.ax * timeStep
    this.vy += this.ay * timeStep
    this.x += this.vx * timeStep
    this.y += this.vy * timeStep

    // Rotate
    this.rotation += this.angularVelocity * timeStep
    
    // Keep sprite in the world
    if (this.x > this.world.width)
      this.x -= this.world.width
    if (this.x < 0.0)
      this.x += this.world.width
    
    // Update the transformation matrix
    this.tModelToWorld.setTranslation(this.x, this.y)

    // Update any child sprites also
    for (const sprite of this.children) {
      sprite.step(timeStep)
    }   
  }
  
  // Set the zoom scale and update the drawing polygon.
  // Better to do this once here than with each draw call!
  setScale(scale) {
    // Save the new scale
    this.scale = scale
    this.tModelToWorld.setScale(scale, scale)
  }

  // Set the rotation amount for the ship in radians and update the 
  // drawing polygon.
  setRotation(rotation) {
    this.rotation = rotation
    this.tModelToWorld.setRotation(rotation)
  }
  
  // Rotate the ship by the specified amount (in radians) and update 
  // the drawing polygon.
  rotate(rdelta) {
    this.rotation += rdelta
    this.tModelToWorld.setRotation(this.rotation)
  }
  
  // Check for a collision between this sprite and the specified sprite. 
  // returns boolean
  checkCollision(other, pointIntersect, graphics) {
    // return shapeDraw.intersectsShape(s.shapeDraw, pointIntersect, g)
    if (this.shapeDraw.intersectsShape(other.shapeDraw, pointIntersect, graphics)) {
      return true
    }
    for (const child of this.children) {
      if (child.shapeDraw.intersectsShape(other.shapeDraw, pointIntersect, graphics)) {
        return true
      }
    }    
    return false
  }

  // Make the sprite explode!
  explode() {
    //, default behavior will scatter the linesegments that make up 
    // the sprite, add flames, etc.
    
    const s = new Sprite()
    s.init(this.world)
    s.setPos(this.x, this.y)
    s.setVelocity(this.vx, this.vy - 15.0)
    s.shapeModel.addPoint(0, -25) // 0
    s.shapeModel.addPoint(10, 10) // 1
    s.shapeModel.addPoint(0,0) // 2
    s.shapeModel.addLineTo(0)
    s.shapeModel.addLineTo(1)
    s.shapeModel.addLineTo(2)
    s.shapeModel.addLineTo(0)
    this.children.addElement(s)

    // clear the old line segments
    //shapeModel = new ShapeX()
    this.present = false
  }
  
  // Draw the sprite on the screen using the given view transformation
  draw(graphics, view)  {
    
    // We have the model coordinates, need to convert to world coordinates 
    // using the sprite transformation, then convert to view coordinates 
    // using the view transformation.
    // Can combine these into one transform for speed.
    const shapeDraw = new ShapeX()
    shapeDraw.copyFrom(this.shapeModel)
    shapeDraw.transform(this.tModelToWorld)
    shapeDraw.transform(view.tWorldToView)
    shapeDraw.drawShape(graphics)
    
    // Now draw any child sprites
    for (const child of this.children) {
      child.draw(graphics, view)
    }    
  }  
}



//-----------------------------------------------------------------------------
// ShapeX
//-----------------------------------------------------------------------------

// why the X ?

// Defines a shape, which is a series of line segments between points.
// First define the points needed, with calls to addPoint(x,y).
// Then define the line segments between the points, with calls to 
// addLineTo(point). 
// To start a new line segment, call addLineTo(-1). 
//! move all this into a package, to avoid name conflict?
//, might be able to implement Shape interface eventually?
//, store bounding rectangle as two points - translate them along with other points
class ShapeX {

  constructor() {
    
    //, max number of points, for now. 
    this.max = 50

    // Array of points
    this.nPoints = 0
    this.xPoints = []
    this.yPoints = []
    
    // Array of line segments
    // index is the point number, -1 means start a new line segment
    this.nLines = 0
    this.nLine = []

    // Bounding rectangle
    this.x1 = 0
    this.y1 = 0
    this.x2 = 0
    this.y2 = 0
  }

  // Add a point to the shape
  addPoint(x, y) {
    this.xPoints[nPoints] = x
    this.yPoints[nPoints] = y
    this.nPoints++
    // Update bounding rectangle
    if (x < this.x1) this.x1 = x
    if (x > this.x2) this.x2 = x
    if (y < this.y1) this.y1 = y
    if (y > this.y2) this.y2 = y
  }
  
  // Add a line segment to the given point.
  // Pass -1 to start a new line segment. 
  addLineTo(nPoint) {
    this.nLine[this.nLines] = nPoint
    this.nLines++
  }
  
  // Copy another shape into this one
  // copyFrom(ShapeX p) {
  copyFrom(other) {
    for (let i = 0; i < other.nPoints; i++) {
      addPoint(other.xPoints[i], other.yPoints[i])
    }
    for (let i = 0; i < other.nLines; i++) {
      addLineTo(other.nLine[i])
    }
    this.x1 = other.x1
    this.x2 = other.x2
    this.y1 = other.y1
    this.y2 = other.y2
  }
  
  // Transform this shape by the given 2d transform.
  // Includes scale, rotate, and translate.
  // Just need to transform the points and the bounding box.
  // transform(Transform t) {
  transform(transform) {
    for (let i = 0; i < this.nPoints; i++) {
      const x = this.xPoints[i]
      const y = this.yPoints[i]
      this.xPoints[i] = (transform.a * x + transform.b * y + transform.c)
      this.yPoints[i] = (transform.d * x + transform.e * y + transform.f)
    }
    // Transform the bounding rectangle also!
    let x = this.x1
    let y = this.y1
    this.x1 = (transform.a * x + transform.b * y + transform.c)
    this.y1 = (transform.d * x + transform.e * y + transform.f)
    x = this.x2
    y = this.y2
    this.x2 = (transform.a * x + transform.b * y + transform.c)
    this.y2 = (transform.d * x + transform.e * y + transform.f)
  }    
  
  // See if this shape intersects anywhere with the given shape
  // If they do, returns true and fills pointIntersect with the point where they touch.
  // intersectsShape(ShapeX shape2, Point2D pointIntersect, Graphics g) {
  intersectsShape(shape2, pointIntersect, graphics) {
    
    // Line segment objects
    const seg1 = new Segment()
    const seg2 = new Segment()

    // Walk through s's line segments and see if they intersect with our line segments.
    // Check if the point is within the bounding box of this sprite - 
    // (x - bounds, y - bounds) to (x + bounds, y + bounds).
    for (let i = 0; i < shape2.nLines - 1; i++) {
      // Get line segment
      if (shape2.getLineSegment(seg2, i)) {
        // debug:
        // seg2.drawSegment(g, Color.orange)
        for (let j = 0; j < nLines - 1; j++) {
          if (getLineSegment(seg1, j)) {
            // debug:
            // seg1.drawSegment(g, Color.blue)
            // pause here for key strike - if "a" then break here
            // if (w.getKeyPress() == KeyEvent.VK_A) {
              // int p = 0 // put breakpoint here
            // }
            if (seg1.getIntersection(seg2, pointIntersect)) {
              // debug:
              // g.setColor(Color.blue)
              // seg1.drawSegment(g)  
              // g.setColor(Color.green)
              // seg2.drawSegment(g)  
              return true
            }
          }
        }      
      }
    }
    return false
  }

  // Fill the specified Segment object with the endpoints of the 
  // specified line segment, as stored in this shape's arrays.
  // If the specified line segment is not a segment (ie it's a 
  // terminator), then return false.
  // public boolean getLineSegment(Segment seg, int iLine) {
  getLineSegment(segment, iLine) {
    const nPoint = this.nLine[iLine]
    const nPoint2 = this.nLine[iLine+1]
    // First make sure we have a segment
    if ((nPoint != -1) && (nPoint2 != -1)) {
      segment.x1 = this.xPoints[nPoint]
      segment.y1 = this.yPoints[nPoint]
      segment.x2 = this.xPoints[nPoint2]
      segment.y2 = this.yPoints[nPoint2]
      return true
    }  
    return false
  }
  
  // Draw this shape on the given graphics output
  // drawShape(Graphics g) {
  drawShape(graphics) {
    let xOld = 0
    let yOld = 0
    let start = true
    for (let i = 0; i < this.nLines; i++) {
      const nPoint = this.nLine[i]
      // Check for start of a new line segment
      if (nPoint == -1)
        start = true
      else {
        // Draw a line to the next point
        const xNew = xPoints[nPoint]
        const yNew = yPoints[nPoint]
        if (start === false)
          graphics.drawLine(xOld, yOld, xNew, yNew)
        // good for debugging
//        graphics.drawString("L" + i, xOld, yOld)
        xOld = xNew
        yOld = yNew
        start = false
      }
    }
  }
}



//-----------------------------------------------------------------------------
// Transform
//-----------------------------------------------------------------------------

// Class for a 2d Affine transform, which can translate, rotate, and scale points.
// Represented by a 2x3 matrix:
//   | a d |
//   | b e |
//   | c f |
// Defaults to the identity transform (a and d = 1, all others 0)
class Transform {
  
  constructor(a, b, c, d, e, f) {
    this.a = 1.0 // default
    this.b = null
    this.c = null
    this.d = null
    this.e = 1.0 // default
    this.f = null
  }

  // Set the translation (x and y shift) for this transform
  setTranslation(x, y) {
    this.c = x
    this.f = y
  }
  
  // Set the scale for this transform
  setScale(xscale, yscale) {
    this.a = xscale
    this.e = yscale
  }
  
  // Set the rotation for this transform
  setRotation(r) {
    this.a = Math.cos(r)
    this.b = -Math.sin(r)
    this.d = Math.sin(r)
    this.e = Math.cos(r)
  }

  // Multiply this transform by another.
  // Allows for compositing transforms together. 
  // multiply(Transform t) {
  multiply(transform) {
    //. raise exception - not yet implemented
  }  
}


//-----------------------------------------------------------------------------
// Segment
//-----------------------------------------------------------------------------

// Represents a line segment (x1, y1) to (x2, y2).
// The line segment lies along the line (ax + by = c), the terms of which 
// can be obtained by a call to getLineParameters().
class Segment {

  constructor(x1, y1, x2, y2) {
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.a = null
    this.b = null
    this.c = null
  }
  
  // See if this line segment intersects the given line segment.
  // Returns true if segments intersect, and fills in point p with the intersect point.
  // getIntersection(Segment s, Point2D p) {
  getIntersection(segment, point2d) {
    
    // Get equations describing lines (ax + bx = c),
    // then solve for a point - if no solution, no intersection.
    getLineParameters()
    segment.getLineParameters()
    const denom = b * segment.a - segment.b * a
    // If denominator is zero, no solution, so no intersection (ie lines are parallel)
    // You can see that the slopes are the same because if a/b == a'/b' then denom=0
    if (denom === 0)
      return false
    // Now check if intersecting point is actually within both line segments
    const x = (b * segment.c - segment.b * c) / denom
    const y = (c * segment.a - segment.c * a) / denom
    //.. don't know relative positions of p1 and p2, so must account for that also!
//    if ((x < x1) || (x > x2) || (y < y1) || (y > y2)) return false // not on this line segment
//    if ((x < s.x1) || (x > s.x2) || (y < s.y1) || (y > s.y2)) return false // not on line segment s either
    if (pointInBounds(x, y) == false) return false
    if (segment.pointInBounds(x, y) == false) return false
    // Must be on both line segments so set point and return true!
    point2d.x = x
    point2d.y = y
    return true
  }

  // Check if the given point is within the bounds of the box 
  // described by this linesegment.
  pointInBounds(x, y) {
    if (this.x1 < this.x2) {
      if ((x < this.x1) || (x > this.x2)) return false
    }
    else {
      if ((x < this.x2) || (x > this.x1)) return false
    }
    if (this.y1 < this.y2) {
      if ((y < this.y1) || (y > this.y2)) return false
    }
    else {
      if ((y < this.y2) || (y > this.y1)) return false
    }
    return true
  }
  
  // Get parameters for the line on which this line segment lies (ax + by = c).
  // bug: didn't convert integers to floats before doing math!!
  // bug: nasty - reversed equations for slope - resulted in sporadic errors. hard to find.
  getLineParameters() {
    if (this.x1 != this.x2) {
      this.a = ((this.y2 - this.y1)) / ((this.x1 - this.x2))
      this.b = 1.0
      this.c = this.a * this.x1 + this.b * this.y1
    }
    else {
      this.a = 1.0
      this.b = ((this.x1 - this.x2)) / ((this.y2 - this.y1))
      this.c = a * this.x1 + this.b * this.y1
    }
  }

  // Draw this linesegment
  // drawSegment(Graphics g) {
  drawSegment(graphics) {
    graphics.drawLine(this.x1, this.y1, this.x2, this.y2)
  }
  
  // Draw this linesegment with the given color
  //! use optional color param??
  // drawSegment(Graphics g, Color c) {
  drawSegment(graphics, color) {
    graphics.setColor(color)
    graphics.drawLine(this.x1, this.y1, this.x2, this.y2)
  }
}


//-----------------------------------------------------------------------------
// Point2d
//-----------------------------------------------------------------------------

// Represents a 2D point
class Point2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
