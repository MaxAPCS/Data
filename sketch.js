let billionaires;

async function setup() {
  billionaires = (await fetch("billionaires.csv").then(r => r.text())).slice(1, -2).split('"\n"').map(row => row.split('","')).map((record, i, fulllist) => Object.fromEntries(fulllist[0].map((label , i) => [label, record[i]]))).slice(1);
  createCanvas(800, 400);
  noLoop()
}

function draw() {
  if (!billionaires) return redraw();
  translate(100, height-100);
  scale(1, -1)
  background(0);
  noStroke()
  for (let record of billionaires) {
	let x = parseInt(record["demographics.age"])
	if (x <= 0) continue;
	let y = parseFloat(record["wealth.worth in billions"]);
	if (record["demographics.gender"] !== "male") {fill(0, 150, 0)} else {fill(0xfff)}
  	circle((x-10) * 7, y * 3, 5);
  }
  noFill()
  stroke(0xfff);
  line(-10, -10, width, -10)
  line(-10, -10, -10, 300)
  scale(1, -1)

  textSize(18)
  textAlign(CENTER, TOP)
  for (let x = 20; x <= 100; x += 20) {
    noFill()
    stroke(0xfff);
    line((x-10) * 7, 15, (x-10) * 7, 5);
    fill(0xfff);
    noStroke()
    text(x, (x-10) * 7, 18)
  }
  textSize(30)
  text("Age", width/2-50, 40)

  textSize(18)
  textAlign(RIGHT, CENTER)
  for (let y = 10; y <= 90; y += 10) {
    noFill()
    stroke(0xfff);
    line(-5, -y*3, -15, -y*3);
    fill(0xfff);
    noStroke()
    text(y, -18, -y*3)
  }
  textSize(30)
  textAlign(CENTER, BOTTOM)
  push()
  translate(-40, -height/2+50)
  rotate(3*PI/2)
  text("Net Worth (B)", 0, 0)
  pop()
}