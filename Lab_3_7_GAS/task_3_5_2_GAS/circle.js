// Circle Object
// Dynlayer addon object to move a layer in a circle
// 19990326

// Copyright (C) 1999 Dan Steinman
// Distributed under the terms of the GNU Library General Public License
// Available at http://www.dansteinman.com/dynapi/

function Circle(dynlayer,name) {
  this.dynlayer = dynlayer
  this.name = name
  this.play = CirclePlay
  this.slide = CircleSlide
  this.pause = CirclePause
  this.stop = CircleStop
}
function CirclePlay(radius,angleinc,angle,endangle,speed,fn) {
  if (this.active) return
  if (!this.paused) {
    this.radius = radius
    this.angleinc = angleinc
    this.angle = angle
    this.endangle = endangle
    this.speed = speed
    this.fn = fn
    this.centerX = eval(this.dynlayer+'.x') - this.radius*Math.cos(this.angle*Math.PI/180)
    this.centerY = eval(this.dynlayer+'.y') + this.radius*Math.sin(this.angle*Math.PI/180)
    if (this.endangle!=null) {
      this.angleinc = Math.abs(this.angleinc)
      if (this.endangle<this.angle) this.angleinc *= -1
    }
  }
  this.active = true
  this.paused = false
  eval(this.dynlayer+'.'+this.name+'.slide()')
}
function CircleSlide() {
  if (this.active && (this.endangle==null || Math.abs(this.angleinc)<Math.abs(this.endangle-this.angle))) {
    this.angle += this.angleinc
    var x = this.centerX + this.radius*Math.cos(this.angle*Math.PI/180)
    var y = this.centerY - this.radius*Math.sin(this.angle*Math.PI/180)
    eval(this.dynlayer+'.moveTo('+x+','+y+')')
    setTimeout(this.dynlayer+'.'+this.name+'.slide()',this.speed)
  }
  else {
    if (this.endangle!=null) {
      var x = Math.round(this.centerX + this.radius*Math.cos(this.endangle*Math.PI/180))
      var y = Math.round(this.centerY - this.radius*Math.sin(this.endangle*Math.PI/180))
      eval(this.dynlayer+'.moveTo('+x+','+y+')')
    }
    if (!this.paused) {
      this.active = false
      eval(this.fn)
    }
  }
}
function CirclePause() {
  if (this.active) {
    this.active = false
    this.paused = true
  }
}
function CircleStop() {
  this.active = false
  this.paused = false
}
