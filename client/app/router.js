import EmberRouter from '@ember/routing/router';
import config from 'sokown/config/environment';

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
  this.route('about');
});
