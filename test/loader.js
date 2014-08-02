// dynamically load Par (blocking)
switch (top.location.search) {
  case '?build':
    console.log(location.href.slice(location.href.lastIndexOf('/')+1)+': Loading regular build code');
    document.write('<script src="../build/zp.js"><\/script>');
    break;
  case '?streaming':
    console.log(location.href.slice(location.href.lastIndexOf('/')+1)+': Loading streamer code');
    document.write('<script src="../build/zps.js"><\/script>');
    break;
  default:
    console.log(location.href.slice(location.href.lastIndexOf('/')+1)+': Loading dev code');
    document.write('<script src="../src/uni.js"><\/script><script src="../src/tok.js"><\/script><script src="../src/par.js"><\/script>');
}
