let form = document.getElementById('exampleForm');
var jsonString;
var obj1;
let obj;
var arr = new Array();

function func(url) {
  return fetch(url) // return fetch promise via url variable
    .then(function (res) {
      return res.json(); //parses json into object
    });
}

func('https://api.jsonbin.io/v3/b/' + apiKey).then(function (json) {
  //testing
  //console.log('json: ', json.record);
  obj1 = json.record;

  //adding keys to form obj values
  keys = Object.keys(obj1);
  for (var j = 0, n = keys.length; j < n; j++) {
    var key = keys[j];
    arr[key] = obj1[key];
  }

  //looping through array for undefined or empty objects
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item == undefined || isEmpty(item) == true) {
      //console.log('i: ', i);
      delete arr[i];
    }
  }
  //testing
  console.log('arr: ', arr);
});

//function checks for empty objects
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

//creating new form object
form.onsubmit = async (e) => {
  //prevent form from being re-submitted
  e.preventDefault();

  //target button submit
  const articleFormData = new FormData(e.target);

  let articleObj = {};
  //add form data enties into an object
  articleFormData.forEach((value, key) => (articleObj[key] = value));

  //testing
  //console.log('articleObj: ', articleObj);

  //add new object to the begining of the array as an iteration
  arr.unshift(articleObj);
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item == undefined || isEmpty(item) == true) {
      console.log('i: ', i);
      delete arr[i];
    }
  }
  //testing
  //console.log('arrWArticleObj: ', arr);

  //checking for empty iterations again
  for (var i = 0; i < arr.length; i++) {
    for (var key in articleObj) {
      if (articleObj[key] === '') {
        console.log(key + ' deleting null input');
        delete articleObj[key];
      }
    }
  }

  //converting to json object for jsonbin put response
  jsonString = JSON.stringify(Object.assign({}, arr));

  //testing
  //console.log('jsonString: ', jsonString);

  //reset form after submission
  form.reset();
  return false;
};

//submitting form entry to jsonbin.io
function toJsonBin() {
  var newJsonString = jsonString;

  //testing
  //console.log('newJsonString: ', newJsonString);

  //jsonbin api instructions
  let req = new XMLHttpRequest();

  req.onreadystatechange = () => {
    console.log(req.responseText);
    if (req.readyState == XMLHttpRequest.DONE) {
      console.log(req.responseText);
    }
  };
  req.open('PUT', 'https://api.jsonbin.io/v3/b/' + apiKey, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('X-Bin-Versioning', 'false');
  req.setRequestHeader('X-Master-Key', 'X_Master_Key_number');
  req.send(newJsonString);
}
