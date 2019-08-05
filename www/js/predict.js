const CLASSES = {0:'zero', 1:'one', 2:'two', 3:'three', 4:'four',5:'five', 6:'six', 7:'seven', 8:'eight', 9:'nine'}

//-----------------------
// start button event
//-----------------------

$("#start-button").click(function(){
	loadModel() ;
  //alert("XXX");
	startWebcam();
});

//-----------------------
// load model
//-----------------------

let model;
async function loadModel() {
	console.log("model loading..");
	$("#console").html(`<li>model loading...</li>`);
	model=await tf.loadModel(`./model/model.json`);
	console.log("model loaded.");
	$("#console").html(`<li>VGG16 pre trained model loaded.</li>`);
};

//-----------------------
// start webcam 
//-----------------------

var video;
function startWebcam() {
	console.log("video streaming start.");
	$("#console").html(`<li>video streaming start.</li>`);
	video = $('#main-stream-video').get(0);
	vendorUrl = window.URL || window.webkitURL;

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
    console.log(navigator.camera);
  }

//  var option = {
//    saveToPhotoAlbum: true //撮影後端末に保存
//  };

  //カメラを起動
//  navigator.camera.getPicture(onSuccess, onError, option);
  navigator.camera.getPicture(onSuccess, onFail, { quality: 25, destinationType: Camera.DestinationType.DATA_URL });

  function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
  }

  //成功時に呼び出されるコールバック関数
  //function onSuccess(imageURI){
  //  document.querySelector("#photo").src = imageURI;
  //}
        
  //失敗時に呼び出されるコールバック関数
  function onFail(message){
      alert("Error:" + message);
  }

	navigator.getMedia = navigator.getUserMedia ||
						 navigator.webkitGetUserMedia ||
						 navigator.mozGetUserMedia ||
						 navigator.msGetUserMedia;

	navigator.getMedia({
		video: true,
		audio: false
	}, function(stream) {
		localStream = stream;
		video.srcObject = stream;
		video.play();
	}, function(error) {
		alert("Something wrong with webcam!");
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
// predict tensor
//-----------------------

async function predict(){
	let tensor = captureWebcam();

	let prediction = await model.predict(tensor).data();
	let results = Array.from(prediction)
				.map(function(p,i){
	return {
		probability: p,
		className: CLASSES[i]
	};
	}).sort(function(a,b){
		return b.probability-a.probability;
	}).slice(0,5);

	$("#console").empty();

	results.forEach(function(p){
		$("#console").append(`<li>${p.className} : ${p.probability.toFixed(6)}</li>`);
		console.log(p.className,p.probability.toFixed(6))
	});

};

//------------------------------
// capture streaming video 
// to a canvas object
//------------------------------

function captureWebcam() {
	var canvas    = document.createElement("canvas");
	var context   = canvas.getContext('2d');
	canvas.width  = video.width;
	canvas.height = video.height;

	context.drawImage(video, 0, 0, video.width, video.height);
	tensor_image = preprocessImage(canvas);

	return tensor_image;
}

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
        quality : 50,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 100,
        targetHeight: 100
    });
}
