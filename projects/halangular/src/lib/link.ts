export class Link {

    public static readonly REL_SELF = 'self';
    public static readonly REL_FIRST = 'first';
    public static readonly REL_PREVIOUS = 'prev';
    public static readonly REL_NEXT = 'next';
    public static readonly REL_LAST = 'last';


    /**
     * Name of this relation. This is not really part of the link but more a reference of the links relation
     */
    private rel: string;


    /**
     * The "href" property is REQUIRED.
     *
     * Its value is either a URI [RFC3986] or a URI Template [RFC6570].
     *
     * If the value is a URI Template then the Link Object SHOULD have a
     * "templated" attribute whose value is true.
     */
    private href: string = null;

    /**
     * The "templated" property is OPTIONAL.
     *
     * Its value is boolean and SHOULD be true when the Link Object's "href"
     * property is a URI Template.
     *
     * Its value SHOULD be considered false if it is undefined or any other
     * value than true.
     */
    private templated: boolean;

    /**
     * The "type" property is OPTIONAL.
     *
     * expected when dereferencing the target resource.
     * Its value is a string used as a hint to indicate the media type
     */
    private type?: string = null;

    /**
     * The "deprecation" property is OPTIONAL.
     *
     * Its presence indicates that the link is to be deprecated (i.e.
     * further information about the deprecation.
     * removed) at a future date.  Its value is a URL that SHOULD provide
     *
     * A client SHOULD provide some notification (for example, by logging a
     * warning message) whenever it traverses over a link that has this
     * property.  The notification SHOULD include the deprecation property's
     * value so that a client manitainer can easily find information about
     * the deprecation.
     */
    private deprecation?: string = null;

    /**
     * The "name" property is OPTIONAL.
     *
     * Its value MAY be used as a secondary key for selecting Link Objects
     * which share the same relation type.
     */
    private name?: string = null;

    /**
     * The "profile" property is OPTIONAL.
     *
     * Its value is a string which is a URI that hints about the profile (as
     * defined by [I-D.wilde-profile-link]) of the target resource.
     */
    private profile?: string = null;

    /**
     * The "title" property is OPTIONAL.
     *
     * Its value is a string and is intended for labelling the link with a
     * human-readable identifier (as defined by [RFC5988]).
     */
    private title?: string = null;

    /**
     * The "hreflang" property is OPTIONAL.
     *
     * Its value is a string and is intended for indicating the language of
     * the target resource (as defined by [RFC5988]).
     */
    private hreflang?: string = null;


    constructor(rel: string, href: string, templated?: boolean, type?: string,
                deprecation?: string, name?: string, profile?: string, title?: string, hreflang?: string) {
        this.rel = rel;
        this.href = href;
        this.templated = templated;
        if (!templated) {
            this.templated = false;
        }
        this.type = type;
        this.deprecation = deprecation;
        this.name = name;
        this.profile = profile;
        this.title = title;
        this.hreflang = hreflang;
    }

    public static deserialize(rel: string, instanceData: Link): Link {

        const href = instanceData.href;
        let templated = instanceData.templated;
        if (!templated) {
            templated = false;
        }
        const type = instanceData.type;
        const deprecation = instanceData.deprecation;
        const name = instanceData.name;
        const profile = instanceData.profile;
        const title = instanceData.title;
        const hreflang = instanceData.hreflang;

        return new Link(rel, href, templated, type, deprecation, name, profile, title, hreflang);
    }

    /**
     * Return whether the current link has the given relation
     * @param rel must not be null
     */
    public hasRel(rel: string): boolean {
        return this.rel === rel;
    }

    public getHref(): string {
        return this.href;
    }

    public isTemplated(): boolean {
        return this.templated;
    }

    public getType(): string {
        return this.type;
    }

    public getDeprecation(): string {
        return this.deprecation;
    }

    public getName(): string {
        return this.name;
    }

    public getProfile(): string {
        return this.profile;
    }

    public getTitle(): string {
        return this.profile;
    }

    public getHreflang(): string {
        return this.hreflang;
    }
}
