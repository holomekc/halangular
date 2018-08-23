export class Link {

  public static readonly REL_SELF: 'self';
  public static readonly REL_FIRST: 'first';
  public static readonly REL_PREVIOUS: 'prev';
  public static readonly REL_NEXT: 'next';
  public static readonly REL_LAST: 'last';


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
  private templated?: boolean = false;

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


  public deserialize(rel: string, instanceData: Link): void {
    this.rel = rel;
    const keys = Object.keys(this);
    for (const key of keys) {
      if (instanceData.hasOwnProperty(key)) {
        this[key] = instanceData[key];
      }
    }
  }

  /**
   * Return whether the current link has the given relation
   * @param rel must not be null
   */
  public hasRel(rel: string): boolean {
    return this.rel === rel;
  }
}
