import { Pipe, PipeTransform } from '@angular/core';
import {PluginBaseComponent} from "../plugin-base.component";

/**
 * Converts any object to a nice string to be displayed in html
 */
@Pipe({
  name: 'beautifier',
  pure:true
})
export class BeautifierPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return PluginBaseComponent.toBeautifyString(value, args[0] as number);
  }

}
