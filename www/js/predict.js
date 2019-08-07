//const CLASSES = {0:'zero', 1:'one', 2:'two', 3:'three', 4:'four',5:'five', 6:'six', 7:'seven', 8:'eight', 9:'nine'}
const CLASSES = {0:'RX-178', 1:'MSZ-006', 2:'RX-93', 3:'MS-06'}

//-----------------------
// start button event
//-----------------------

$("#select-button").click(function(){
	loadModel() ;
	selectPhoto();
});

$("#take-button").click(function(){
	loadModel() ;
	takePhoto();
});


//-----------------------
// load model
//-----------------------

let model;
async function loadModel() {
	console.log("AI model loading..");
	$("#console").html(`<h4>AI model loading...</h4>`);
//	model=await tf.loadModel(`./model/model.json`);
  model=await tf.loadLayersModel(`./model/model.json`);
	console.log("AI Trained model loaded.");
	$("#console").html(`<h4>AI Trained model loaded.</h4>`);
};

//-----------------------
// start webcam 
//-----------------------

function selectPhoto() {
	console.log("Selecting a photo start.");
	$("#console").html(`<h4>Now selecting a photo.</h4>`);

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    console.log(navigator.camera);
  }
  //Get a picture from library();
  getPicFile();
}

function takePhoto() {
	console.log("Taking a photo start.");
	$("#console").html(`<h4>Now taking a photo.</h4>`);

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    console.log(navigator.camera);
  }
  //Get a picture from camera();
  getPicCamera();
}

//-----------------------
// TensorFlow.js method
// predict tensor
//-----------------------
async function predict(){

  //Get the picture image data
  var image = document.getElementById('myImage');
  //Transform to tensor data
  tensor_image = preprocessImage(image);
  //console.log(tensor_image);
  prediction = await model.predict(tensor_image).data();
  //console.log(prediction);
	let results = Array.from(prediction)
				.map(function(p,i){
	return {  
		probability: Math.round(p*1000)/10,
		className: CLASSES[i]
	};
	}).sort(function(a,b){
		return b.probability-a.probability;
	}).slice(0,3);

	$("#console").empty();

  //Display the result of top 3
	results.forEach(function(p){
		$("#console").append(`<h4>You are ${p.className} (${p.probability.toFixed(1)} %) </h4>`);
		console.log(p.className,p.probability.toFixed(6))
	});

}

//-----------------------
// predict button event
//-----------------------

$("#predict-button").click(function(){
	setInterval(predict, 1000/10);
});



//-----------------------
// TensorFlow.js method
// image to tensor
//-----------------------
function preprocessImage(image){
	let tensor = tf.fromPixels(image).resizeNearestNeighbor([100,100]).toFloat();	
	let offset = tf.scalar(255);
    return tensor.div(offset).expandDims();
}

//-----------------------
// clear button event
//-----------------------

$("#clear-button").click(function clear() {
	location.reload();
});

//-----------------------
// add
//-----------------------
function show_pic() {
    alert("xxx");
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 100,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 300,
        targetHeight: 300
    });
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    return options;
}

function getPicFile() {

  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
  var options = setOptions(srcType);
  options.targetHeight = 400;
  options.targetWidth = 400;
  options.destinationType = Camera.DestinationType.DATA_URL;

  navigator.camera.getPicture(onSuccess, onFail, options);

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
    console.log("Selected Successfully.");
	  $("#console").html(`<h4>Selected Successfully.</h4>`);

  }

  //失敗時に呼び出されるコールバック関数
  function onFail(message){
    alert("Error: No photo has selected." + message);
  }

}

function getPicCamera(){
  //カメラを起動
  var srcType = Camera.PictureSourceType.CAMERA;
  var options = setOptions(srcType);
  options.targetHeight = 400;
  options.targetWidth = 400;
  options.destinationType = Camera.DestinationType.DATA_URL;

  navigator.camera.getPicture(onSuccess, onFail, options);

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
    console.log("Selected Successfully.");
	  $("#console").html(`<h4>Selected Successfully.</h4>`);
  }

  //成功時に呼び出されるコールバック関数
  //function onSuccess(imageURI){
  //  document.querySelector("#photo").src = imageURI;
  //}
        
  //失敗時に呼び出されるコールバック関数
  function onFail(message){
      alert("Error:" + message);
  }
}