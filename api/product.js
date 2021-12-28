const express = require("express");
const router = express.Router();
var net = require('net');
/**
 * GET product list.
 *
 * @return product list | empty.
 */
 router.get("/index", async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
<head>
  <script>
  if (!!window.EventSource) {
    var source = new EventSource('/api/product/countdown')
    source.addEventListener('message', function(e) {
      document.getElementById('data').innerHTML = e.data
    }, false)
    source.addEventListener('open', function(e) {
      document.getElementById('state').innerHTML = "Connected"
    }, false)
    source.addEventListener('error', function(e) {
      const id_state = document.getElementById('state')
      if (e.eventPhase == EventSource.CLOSED)
        source.close()
      if (e.target.readyState == EventSource.CLOSED) {
        id_state.innerHTML = "Disconnected"
      }
      else if (e.target.readyState == EventSource.CONNECTING) {
        id_state.innerHTML = "Connecting..."
      }
    }, false)
  } else {
    console.log("Your browser doesn't support SSE")
  }
  </script>
</head>
<body>
  <h1>SSE: <span id="state"></span></h1>
  <h3>Data: <span id="data"></span></h3>
</body>
</html>
  `
  );
});

router.get("/countdown", async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
	  try {
  var client = new net.Socket();
  client.connect(80, "muthienlong.pro", function () {
                    // the socks response must be made after the remote connection has been
                    // established
					console.log('connect');
					client.write('GET / HTTP/1.0\r\n' +
             'Host: muthienlong.pro\r\n' +
              '\r\n');
   });
  client.on('data', function (data) {
                          try {
							  //console.log(data.toString());
							  //var y =data.toString();
							  var x = data.toString('base64');
							  console.log(x);
                            res.write(`data: ${JSON.stringify(x)}\n\n`);
                          }catch (e) {

                          }

                        });      

client.on("end", function (err) {
                    console.log("end");
					//global[sessionid]['error']=true;
                    console.log(err);
                });

                client.on("close", function (err) {
                    console.log("close");
                    res.end();
                    console.log(err);
                });

                client.on("error", function (err) {
                    //global[sessionid]['error']=true;
                    console.log("error");
					res.end();
                    console.log(err);
                });						
                            
                          }catch (e) {
                            res.write("data: " + e + "\n\n");
                            res.end();
                          }
  
  
  
  //countdown(res, 2);
});
 




module.exports = router;
