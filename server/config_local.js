module.exports = {

    'secret': 'some-cool-app-secret',
    'auth': {
      'instagram': {
        'clientID'      : '5f28b93eb3be4f609390bee41e778443', // your App ID
        'clientSecret'  : 'ace5603d433f452f9a4af3d6e6fd37ec', // your App Secret
        'callbackURL'   : 'https://localhost:5000/auth/instagram/callback'
      }
    },
    'mysql': {
      'host': '127.0.0.1',
      'user': 'root',
      'password': 'admin',
      'database': 'instafriends'
    }
};
