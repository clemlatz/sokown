import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ShipsController extends Controller {
  @action
  refreshList() {
    this.send('refreshModel');
  }
}
