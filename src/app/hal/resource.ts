import {Link} from './link';
import {isArray} from 'util';

export abstract class Resource {

  private _links?: Map<string, Link | Link[]> = new Map<string, Link | Link[]>();

  private _embedded?: Map<string, Resource | Resource[]> = new Map<string, Resource | Resource[]>();

  public deserialize<T extends Resource>(instanceData: T): void {

    this['_links'] = this.deserializeLink(instanceData['_links'] as Map<string, Link | Link[]>);
    // TODO: embedded
    this['_embedded'] = instanceData['_embedded'];
  }

  private deserializeLink(instance: Map<string, Link | Link[]>) {
    const keys = Object.keys(instance);

    const result: Map<string, Link | Link[]> = new Map<string, Link | Link[]>();

    for (const key of keys) {
      if (instance.hasOwnProperty(key)) {
        const value = instance[key];

        if (isArray(value)) {
          const linkArray: Link[] = [];
          (value as Link[]).forEach((link: Link) => {
            const newLink = new Link();
            newLink.deserialize(key, link);
            linkArray.push(newLink);
            result.set(key, linkArray);
          });
        } else {
          const newLink = new Link();
          newLink.deserialize(key, (value as Link));
          result.set(key, newLink);
        }
      }
    }
    return result;
  }

  public getLink(rel: string): Link | Link[] {
    return this._links.get(rel);
  }

  public getSingleLink(rel: string, index?: number): Link {
    if (isArray(this._links)) {
      if (index) {
        return (this.getLink(rel) as Link[])[index];
      } else {
        return (this.getLink(rel) as Link[])[0];
      }
    } else {
      return this.getLink(rel) as Link;
    }
  }

  public getArrayLink(rel: string): Link[] {
    if (isArray(this._links)) {
      return this.getLink(rel) as Link[];
    } else {
      const result: Link[] = [];
      result.push(this.getLink(rel) as Link);
      return result;
    }
  }

  public hasLink(rel: string): boolean {
    return this._links.has(rel);
  }

}
