import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') pilotName;
}
