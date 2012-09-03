// simple test script for my profiler

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
  new Par(txt).run();
});
