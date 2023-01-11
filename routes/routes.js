module.exports = function(req, res) {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html><title>Node app</title></html>');
    res.write('<body><h1>Hello!</h1>');
    res.write('<div><form action="/create-user" method="POST"><input type="text" name="user" placeholder="Enter user name"/><button>Create user</button></form></div>')
    res.write('</body>');
    return res.end();
  }

  if (url === '/users') {
    res.write('<html><title>Node app</title></html>');
    res.write('<body><h1>Users:</h1><ul><li>User 1</li><li>User 2</li><li>User 3</li></ul></body>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    const body = [];
    req.on('data', (dataChunk) => {
      body.push(dataChunk);
    });
    req.on('end', () => {
      const parsedData = Buffer.concat(body).toString();
      const user = parsedData.split('=')[1];
      console.log('User from input: ', user);
      res.statusCode = 302;
      res.setHeader('Location', '/users');
      return res.end();
    })
  }
}