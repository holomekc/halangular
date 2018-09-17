import {Resource} from 'halangular';

export class EntryPoint extends Resource{
    getEmbeddedTypes(): Map<string, { new(): Resource }> {
        // no embedded content
        return new Map<string, {new(): Resource}>();
    }
}