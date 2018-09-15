import {Resource} from '../hal/resource';

export class Order extends Resource {

  getEmbeddedTypes(): Map<string, { new(): Resource }> {
    return new Map<string, { new(): Resource }>();
  }

}
