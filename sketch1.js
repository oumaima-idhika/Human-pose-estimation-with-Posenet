let brain;

function setup() {
  createCanvas(640, 480);
  let options = {
    inputs: 22,
    outputs: 9,
    task: 'classification',
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  brain.loadData('clrudoabt.json', dataReady);
}

function dataReady() {
  brain.normalizeData();
  brain.train({epochs: 50}, finished); 
}

function finished() {
  console.log('model trained');
  brain.save();
}