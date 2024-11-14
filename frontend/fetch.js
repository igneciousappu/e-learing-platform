fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: 'user@example.com', password: 'password' })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  



  axios.post('/api/user/login', {
    email: 'user@example.com',
    password: 'password'
  })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));
  

  // In your Express app, make sure you're using POST, not GET
app.post('/api/user/login', loginController);
