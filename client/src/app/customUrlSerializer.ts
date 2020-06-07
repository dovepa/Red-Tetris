import { UrlSerializer, UrlTree, DefaultUrlSerializer } from '@angular/router';
import * as utils from './utils';
export const hashKey = 's5d4f6a5s4g6e5r46g5er4yh5e4erga8sf7asd65g7wer8g79wg/';

export class CustomUrlSerializer implements UrlSerializer {
    parse(url: any): UrlTree {
        const dus = new DefaultUrlSerializer();
        let urlString: string = url;
        if (urlString.startsWith('#')) {
            urlString = urlString.replace('#', hashKey);
        }
        return dus.parse(urlString);
    }

    serialize(tree: UrlTree): any {
        const dus = new DefaultUrlSerializer();
        let path = dus.serialize(tree);
        path = path.replace(/%5B/g, '[');
        path = path.replace(/%5D/g, ']');
        path = path.replace(hashKey, '#');
        return path;
    }
}
