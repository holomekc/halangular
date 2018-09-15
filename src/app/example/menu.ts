import {Resource} from '../hal/resource';
import {Order} from './order';

export class Menu extends Resource {

  constructor() {
    super();
  }

  getEmbeddedTypes(): Map<string, { new(): Resource }> {
    const result = new Map<string, { new(): Resource }>();
    result.set('ea:order', Order);
    return result;
  }
}
