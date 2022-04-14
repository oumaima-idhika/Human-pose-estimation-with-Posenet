let capture;
let poseNet;
let pose;
let skeleton;
let brain;
let state = 'waiting';
let targetLabel;

function keyPressed(){
  if(key == 's'){
    brain.saveData();
  }else{
  targetLabel=key;
  console.log(targetLabel);
  setTimeout (function(){
    console.log('collecting');
    state = 'collecting';
    setTimeout(function(){
      console.log('not collecting');
      state = 'waiting';
    },15000)
  },10000);
}
}

function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
      if (state =='collecting'){
      let inputs = [];
      for (let i = 0; i < pose.keypoints.length - 6 ; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
    }
    let target = [targetLabel];
    brain.addData(inputs,target);
    }
  }
  }
  
  function modelLoaded() {
    console.log('poseNet ready');
  }

function setup() {
  createCanvas(640, 480);
  capture = createCapture(VIDEO);
  poseNet = ml5.poseNet(capture, modelLoaded);
  poseNet.on('pose', gotPoses);
  capture.hide();
   let options = {
    inputs : 34,
    outputs : 4 ,
    task : 'classification',
    debug : true 


   }
  brain = ml5.neuralNetwork(options);
  brain.loadData('ymca.json',dataReady);
}
function dataReady(){
  
  brain.train({epochs:50},finished)
}


function draw() {
  translate(capture.width,0);
  scale(-1,1);
  image(capture, 0, 0, capture.width, capture.height);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL =  pose.leftEye;
    let d = dist(eyeR.x,eyeR.y , eyeL.x, eyeL.y);

    for (let i = 0; i < pose.keypoints.length - 6 ; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255, 0, 0);
      ellipse(x, y, d/8, d/8);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}