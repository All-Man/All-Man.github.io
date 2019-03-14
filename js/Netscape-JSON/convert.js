var openFile = function(event) {
  var input = event.target;
  reader = new FileReader();

  file_obj = input.files[0];
  filename = file_obj.name;
  new_filename = filename.replace(/\.[^\.]+$/g, "") + '.json';

  filename = document.getElementById('output-filename');
  filename.value = new_filename;

  reader.readAsText(file_obj);
};

var convert = document.getElementById('convert');
convert.onclick = function(e) {
  var cookie_string = reader.result;

  res = extractCookies(cookie_string);
  res_json = JSON.stringify(res, null, 4);

  download(res_json, filename.value, 'text/plain');
}

function extractCookies(text) {

  var cookies = [];
  var lines = text.split("\n");

  // iterate over lines
  lines.forEach(function(line, index) {

    var tokens = line.split("\t");

    // we only care for valid cookie def lines
    if (tokens.length == 7) {

      // trim the tokens
      tokens = tokens.map(function(e) {
        return e.trim();
      });

      var cookie = {};

      cookie.name = tokens[5];
      cookie.value = tokens[6];
      cookie.domain = tokens[0];
      cookie.hostOnly = false;
      cookie.path = tokens[2];
      cookie.secure = tokens[3] === 'TRUE';
      cookie.httpOnly = false;
      cookie.session = false;
      cookie.storeId = "firefox-default";

      // Extract the data

      //cookie.flag = tokens[1] === 'TRUE';



      // Convert date to a readable format

      var timestamp = tokens[4];
      if (timestamp.length == 17) {
        timestamp = Math.floor(timestamp / 1000000 - 11644473600);
      }

      cookie.expirationDate = parseInt(timestamp);




      // Record the cookie.
      cookies.push(cookie);
    }
  });

  return cookies;
}

function download(text, name, type) {
  var a = document.createElement("a");
  var file = new Blob([text], {
    type: type
  });
  a.href = URL.createObjectURL(file);
  a.download = name;
  a.click();
}
