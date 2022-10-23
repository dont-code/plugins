import {PossibleTemplateList, TemplateList} from "./template-list";
import {FormGroup} from "@angular/forms";
import {DynamicEventSource, DynamicEventType} from "./dynamic-event";


/**
 * An Angular component that can be dynamically loaded and instantiated by the Dont-code Framework.
 * It provides UI through TemplateRefs for viewing inline, viewing fully or editing a value.
 * For read-only, setValue / getValue are used.
 * For editing, a form is created and setName, setForm are called. Then setValue / getValue is used to communicate the value edited. The component must hydrate this value to the FormGroup, including for any subFields it manages
 */
export interface DynamicComponent {

  /**
   * Sets the value to be managed by the component. For edit mode, the component must spread it to Angular's form
   * @param val
   */
  setValue (val:any):void;

  /**
   * The value managed by the component and its children is returned here, in a format that can be stored. This value will be attached to the parent component and stored
   */
  getValue (): any;

  /**
   * Sets the position of the parent component in the data model
   * @param position
   */
  setParentPosition (position:string): void;

  /**
   * Returns true or false depending what kind of display type it supports (ViewInline, ViewFull or Edit).
   * Same as providesTemplates however it is called sooner in the lifecycle, including before the component is inited (and TemplateRefs are not created yet)
   * @param key
   */
  canProvide (key?:string): PossibleTemplateList;
  /**
   * Returns the list of templates the component is providing
   * Optionally it can provides a different list depending on the provided key.
   */
  providesTemplates (key?:string): TemplateList;

  /**
   * The name of the component when used in a Form for editing
   * @param name
   */
  setName  (name:string): void;

  /**
   * Sets the formgroup to use in case of edition
   * @param form
   */
  setForm (form: FormGroup): void;

  /**
   * The form used
   */
  getForm (): FormGroup;

  /**
   * List the events that the component can send
   */
  listEventSources (): Array<DynamicEventSource>;

  /**
   * Finds and returns a single event source corresponding to this type and optionally name
   * @param type
   * @param name
   */
  selectEventSourceFor (type:DynamicEventType, name?:string): DynamicEventSource|null;
}
