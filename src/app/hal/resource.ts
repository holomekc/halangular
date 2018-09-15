import {Link} from './link';
import {isArray} from 'util';

export abstract class Resource {

  private _links?: Map<string, Link | Link[]> = new Map<string, Link | Link[]>();

  private _embedded?: Map<string, Resource | Resource[]> = new Map<string, Resource | Resource[]>();

  public deserialize<T extends Resource>(instanceData: T): void {

    this._links = this.deserializeLink(instanceData['_links'] as Map<string, Link | Link[]>);
    this._embedded = this.deserializeResource(instanceData['_embedded'] as Map<string, Resource | Resource[]>);
  }

  public abstract getEmbeddedTypes(): Map<string, { new(): Resource }>;

  private deserializeLink(instance: Map<string, Link | Link[]>) {
    const result: Map<string, Link | Link[]> = new Map<string, Link | Link[]>();

    if (!instance) {
      return result;
    }


    const keys = Object.keys(instance);

    for (const key of keys) {
      if (instance.hasOwnProperty(key)) {
        const value = instance[key];

        if (isArray(value)) {
          const linkArray: Link[] = [];
          (value as Link[]).forEach((link: Link) => {
            linkArray.push(Link.deserialize(key, link));
            result.set(key, linkArray);
          });
        } else {
          result.set(key, Link.deserialize(key, (value as Link)));
        }
      }
    }
    return result;
  }

  private deserializeResource(instance: Map<string, Resource | Resource[]>) {
    const result: Map<string, Resource | Resource[]> = new Map<string, Resource | Resource[]>();

    if (!instance) {
      return result;
    }

    const keys = Object.keys(instance);

    for (const key of keys) {
      if (instance.hasOwnProperty(key)) {
        const value = instance[key];
        const type = this.getEmbeddedTypes().get(key);

        if (type) {
          if (isArray(value)) {
            const resourceArray: Resource[] = [];
            (value as Resource[]).forEach((resource: Resource) => {
              const newType = new type();
              newType.deserialize(resource);
              resourceArray.push(newType);
              result.set(key, resourceArray);
            });
          } else {
            const newType = new type();
            newType.deserialize(value);
            result.set(key, newType);
          }
        } else {
          // could not deserialize
          console.warn('Could not deserialize embedded content correctly. Make sure that embedded type definition is correct');
          result.set(key, value);
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
