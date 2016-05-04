module.exports = {

    'secret': 'some-cool-app-secret',
  //  'database': 'mongodb://admin:1234;127.0.0.1:27017/test',
    'dbConnection': 'mongodb://localhost/test',
    'auth': {
      'instagram': {
        'clientID'      : '5f28b93eb3be4f609390bee41e778443', // your App ID
        'clientSecret'  : 'ace5603d433f452f9a4af3d6e6fd37ec', // your App Secret
        'callbackURL'   : 'http://localhost:5000/auth/instagram/callback'
      }
    }
};
