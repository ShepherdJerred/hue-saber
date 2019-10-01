const USERNAME_KEY = 'hue.username';

function initialize(backend) {
  this.backend = backend;
}

function setUsername(username) {
  this.backend.set(USERNAME_KEY, username);
}

function getUsername() {
  return this.backend.get(USERNAME_KEY);
}


