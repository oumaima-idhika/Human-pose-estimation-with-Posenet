
let capture;
let poseNet;
let pose;
let skeleton;

let brain;

function setup() {
    createCanvas(640, 480);
    capture = createCapture(VIDEO);
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', gotPoses);
    capture.hide();

  let options = {
    inputs: 22,
    outputs: 9,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'models/model.json',
    metadata: 'models/model_meta.json',
    weights: 'models/model.weights.bin',
  };
  console.log(3);
  brain.load(modelInfo, brainLoaded);
  console.log(4);
}

function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length - 6; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    console.log(1);
    brain.classify(inputs, gotResult);
    console.log(2);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  
  console.log(results[0].label);
  console.log(results[0].confidence);
  classifyPose();
  
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}


function modelLoaded() {
  console.log('poseNet ready');
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
