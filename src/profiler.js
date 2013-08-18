// simple test script for my profiler

// load the heatfiler (/heatfiler/src/) and enter these files in the right textarea:
// ../../zeparser2/src/uni.js
// ../../zeparser2/src/tok.js
// ../../zeparser2/src/par.js
// ../../zeparser2/src/profiler.js
// then press the "Run files locally" button and wait a bit while it parses the 8mb file
// after that's done you can see the heatmap for ZeParser :)
// You can do the same while running the test suite to get test coverage
// This file is just a bootstrap that kicks off the actual parsing.

function get(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4) {
      try { xhr.status; // status is a getter, this checks for exception
      } catch (e) {
        callback(new Error("Warning: Unknown error with server request (timeout?)."));
      }

      if (xhr.status == 200) callback(null, xhr.responseText);
      else callback(new Error("File request problem (code: "+xhr.status+")!"));
    }
  };
  xhr.open("GET", url+'?'+Math.random());
  xhr.send(null);
}

get('../../gonzales/data/sources/8mb-benchmark.js', function(err, txt){
  if (!err) Par.parse(txt);
});
