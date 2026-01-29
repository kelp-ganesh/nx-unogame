import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '@unogame/shared-lib';

@Pipe({
  name: 'colorClass',
  standalone: true,
})
export class ColorClassPipe implements PipeTransform {
  transform(color: Color | string | undefined): string {
    switch (color) {
      case Color.RED:
        return 'bg-red-600';
      case Color.BLUE:
        return 'bg-blue-600';
      case Color.GREEN:
        return 'bg-green-600';
      case Color.YELLOW:
        return 'bg-yellow-500';
      case Color.WILD:
        return 'bg-slate-800 border-2 border-white';
      default:
        return 'bg-gray-400';
    }
  }
}
