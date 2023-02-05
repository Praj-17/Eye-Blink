// get the video element and its stream
var video = document.getElementById("video");
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      var counter = 0;
      var lastTime = Date.now();
      setInterval(function() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var brightness = getBrightness(imageData.data);
        if (brightness < 20) {
          counter++;
        } else {
          if (counter > 20 && (Date.now() - lastTime) > 200) {
            console.log("Blink detected!");
            lastTime = Date.now();
          }
          counter = 0;
        }
      }, 30);
    };
  })
  .catch(function(err) {
    console.log("An error occurred: " + err);
  });

// calculate the overall brightness of an image
function getBrightness(data) {
  var brightness = 0;
  for (var i = 0; i < data.length; i += 4) {
    brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  return brightness / (data.length / 4);
}
