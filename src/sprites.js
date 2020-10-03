//-----------------------------------------------------------------------------
// Sprite library
//-----------------------------------------------------------------------------

// A sprite is an object that exists within the world.
// Defines a shape in model coordinates.
// This gets transformed into world coordinates, then view coordinates, 
// before being drawn. 
export class Sprite {

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
    // this.children = new Vector() // vector of child sprites
    this.children = [] // vector of child sprites
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
export class ShapeX {

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
    this.xPoints[this.nPoints] = x
    this.yPoints[this.nPoints] = y
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
      this.addPoint(other.xPoints[i], other.yPoints[i])
    }
    for (let i = 0; i < other.nLines; i++) {
      this.addLineTo(other.nLine[i])
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
        for (let j = 0; j < this.nLines - 1; j++) {
          if (this.getLineSegment(seg1, j)) {
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
        const xNew = this.xPoints[nPoint]
        const yNew = this.yPoints[nPoint]
        if (start === false)
          graphics.drawLine(xOld, yOld, xNew, yNew)
        // good for debugging
        // graphics.drawString("L" + i, xOld, yOld)
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
export class Transform {
  
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
export class Segment {

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
    this.getLineParameters()
    segment.getLineParameters()
    const denom = this.b * segment.a - segment.b * this.a
    // If denominator is zero, no solution, so no intersection (ie lines are parallel)
    // You can see that the slopes are the same because if a/b == a'/b' then denom=0
    if (denom === 0)
      return false
    // Now check if intersecting point is actually within both line segments
    const x = (this.b * segment.c - segment.b * this.c) / denom
    const y = (this.c * segment.a - segment.c * this.a) / denom
    //.. don't know relative positions of p1 and p2, so must account for that also!
//    if ((x < x1) || (x > x2) || (y < y1) || (y > y2)) return false // not on this line segment
//    if ((x < s.x1) || (x > s.x2) || (y < s.y1) || (y > s.y2)) return false // not on line segment s either
    if (this.pointInBounds(x, y) == false) return false
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
      this.c = this.a * this.x1 + this.b * this.y1
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
export class Point2D {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
