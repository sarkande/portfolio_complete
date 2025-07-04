import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'icon'
})
export class IconPipe implements PipeTransform {

  private customMap: Record<string, string> = {
    'C#': 'c-sharp',
    'C++': 'CPlusPlus',
    'JS': 'javascript',
    'HTML': 'html5',
    'CSS': 'css3',
    'ReactJS': 'react',
    'NodeJS': 'nodejs',
    'UI/UX': 'uiux',
    'SHELL': 'terminal',
    'API Google': 'Google',
    'Qt': 'Qt-Framework',
    'WinForm': '.NET',
    'WPF': '.NET',
    'Accessibility': 'Aria',
  };

  transform(value: string): string {
    // D'abord utiliser la map personnalisée
    if (this.customMap[value]) {
      return this.customMap[value];
    }

    // Sinon fallback : normalisation automatique
    return value
      .replace(/\+/g, 'plus')
      .replace(/\#/g, 'sharp')
      .replace(/\s+/g, '-');
  }
}