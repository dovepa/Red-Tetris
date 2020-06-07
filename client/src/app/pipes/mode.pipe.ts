import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mode'
})
export class ModePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if (value === 0) {
      return 'Solo';
    }
    else {
      return 'Multiplayer';
    }
  }

}
