import EmberRouter from '@ember/routing/router';
import config from 'sokown-client/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('home', { path: '/' });
  this.route('ships', function () {
    this.route('list', { path: '/' });
    this.route('get', { path: '/:id' });
  });
  this.route('locations', function () {
    this.route('list', { path: '/' });
    this.route('get', { path: '/:id' });
  });
  this.route('about');

  this.route('user', function () {
    this.route('signup');
    this.route('login');
    this.route('profile');
  });
});
