const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

//------------------------------------------------
// Classification 
//------------------------------------------------
const CLASSES = {0:'RX-178', 1:'MSZ-006', 2:'RX-93', 3:'MS-06'}

//------------------------------------------------
// Select Photo Event
//------------------------------------------------
$("#select-button").click(function(){
    loadModel();
    selectPhoto();
});

//------------------------------------------------
// Take Photo Event
//------------------------------------------------
$("#take-button").click(function(){
    loadModel() ;
    takePhoto();
});

//------------------------------------------------
// Load Depp Learning Model
//------------------------------------------------
let model;
async function loadModel() {
    console.log("AI model loading..");
    $("#console").html(`<x2>AI model loading...</x2>`);
    model=await tf.loadLayersModel('https://www.scpepper.tokyo/models/model.json');
    //console.log(model)
    //console.log(model.summary());
    console.log("AI Trained model loaded.");
    $("#console").html(`<x2>AI Trained model loaded.</x2>`);
};

//------------------------------------------------
// Select Photo from Library
//------------------------------------------------
function selectPhoto() {
    console.log("Selecting a photo start.");
    $("#console").html(`<x2>Now selecting a photo.</x2>`);

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.camera);
    }
    //Get a picture from library();
    getPicFile();
}

//------------------------------------------------
// Take Photo Now
//------------------------------------------------
function takePhoto() {
    console.log("Taking a photo start.");
    $("#console").html(`<x2>Now taking a photo.</x2>`);

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(navigator.camera);
    }
    //Get a picture from camera();
    getPicCamera();
}

//------------------------------------------------
// TensorFlow.js Predict
//------------------------------------------------
async function predict(){

    //Get the picture image data
    var image = document.getElementById('myImage');
    //Transform to tensor data
    tensor_image = preprocessImage(image);
    console.log(tensor_image);
    prediction = await model.predict(tensor_image).data();
    console.log(prediction);
    let results = Array.from(prediction)
                .map(function(p,i){
        return {  
            probability: Math.round(p*1000)/10,
            className: CLASSES[i]
        };
    }).sort(function(a,b){
        return b.probability-a.probability;
    }).slice(0,1);

    (async () => {
        //$("#console").empty();
        $("#console").html(`<x2>Now Predicting.</x2>`);
        await sleep(1000);
        $("#console").html(`<x2>Now Predicting..</x2>`);
        await sleep(1000);
        $("#console").html(`<x2>Now Predicting...</x2>`);
        await sleep(1000);
        $("#console").html(`<x2>Now Predicting....</x2>`);
        await sleep(1000);
        $("#console").html(`<x2>Now Predicting....</x2>`);

        //$("#console").empty();
        $("#console").html(`<x2>Prediction Completed !</x2>`);
        $("#imgText").empty();

        //Display the result of top 3
        results.forEach(function(p){
            $("#imgText").html(`<x1>${p.className} (${p.probability.toFixed(1)} %) </x1>`);
            console.log(p.className,p.probability.toFixed(3))
        });
    })();
}

//------------------------------------------------
// predict button event
//------------------------------------------------
$("#predict-button").click(function(){
    predict();
});

//------------------------------------------------
// TensorFlow.js method image to tensor
//------------------------------------------------
function preprocessImage(image){
    let tensor = tf.browser.fromPixels(image).resizeNearestNeighbor([64,64]).toFloat();    
    let offset = tf.scalar(1);
    return tensor.div(offset).expandDims();
}

//------------------------------------------------
// Camera Launch Options
//------------------------------------------------
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
    options.targetHeight = 320;
    options.targetWidth = 320;
    options.destinationType = Camera.DestinationType.DATA_URL;
    navigator.camera.getPicture(onSuccess, onFail, options);

    //Callback Function on Success
    function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log("Selected Successfully.");
        $("#console").html(`<x2>Selected Successfully.</x2>`);
        $("#imgText").empty();
    }
    //Callback Function on Faild
    function onFail(message){
        //alert("Error: No photo has selected." + message);
    }
}

function getPicCamera(){
    var srcType = Camera.PictureSourceType.CAMERA;
    var options = setOptions(srcType);
    options.targetHeight = 320;
    options.targetWidth = 320;
    options.destinationType = Camera.DestinationType.DATA_URL;
    navigator.camera.getPicture(onSuccess, onFail, options);

    //Callback Function on Success
    function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
        console.log("Selected Successfully.");
        $("#console").html(`<x2>Selected Successfully.</x2>`);
        $("#imgText").empty();
    }
    //Callback Function on Faild
    function onFail(message){
        //alert("Error:" + message);
    }
}