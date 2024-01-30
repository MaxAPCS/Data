function setup() {
  createCanvas(400, 400);
  background(0)
  noStroke()
}

let h = 0, t = 0;
let animprog = 0;
function draw() {
  fill(0)
  rect(0, 0, width, 100)
  fill(0xfff)
  textAlign(LEFT,TOP)
  textSize(20)
  text(`Heads: ${h} (${100 * h / (h+t)}%)`, 0, 0)
  translate(width/2, height/2);
  if (animprog > 0) {
    fill(0)
    rect(-50, -50, 100, 100);
    fill(150, 130, 0)
    ellipse(0, 0, 50, animprog%100-50)
    if (animprog === 1) {
      let heads = Math.random() < 0.5;
      fill(0)
      textAlign(CENTER,CENTER)
      textSize(40)
      text(heads ? "H" : "T", 0, 0)
      if (heads) h++; else t++;
    }
    animprog--
  }
}

function keyPressed() {
  animprog = (animprog > 1) ? 1 : 150;
}