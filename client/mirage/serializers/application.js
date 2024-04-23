import { JSONAPISerializer } from 'miragejs';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attributeKey) {
    return attributeKey;
  }
}
