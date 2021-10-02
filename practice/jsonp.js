// frontend
const jsonp = (url, callback) => {
  const script = document.createElement("script");
  script.src = url + "?callback=" + callback.name;

  document.body.appendChild(script);
}

function foo(msg) {
  console.log(msg);
}

jsonp("http://example.com", foo)


// backend
app.use((req, res) => {
  if (req.param.callback) {
    res.send(`${req.param.callback}("hello")`)
  }
})
