var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FontFaceObserver from 'fontfaceobserver';
export const FONT_OBSERVER_TIMEOUT = 30000;
export function addStylesheetURL(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}
export function loadFonts(fonts) {
    return __awaiter(this, void 0, void 0, function* () {
        const localFonts = fonts.filter(x => !('google' in x));
        const googleFonts = fonts.filter(x => 'google' in x && x.google);
        yield Promise.all([
            loadLocalFonts(localFonts),
            loadGoogleFonts(googleFonts),
        ]);
        // await wait(160)
    });
}
export function loadLocalFonts(fonts) {
    return __awaiter(this, void 0, void 0, function* () {
        const promiseList = [];
        for (const font of fonts) {
            const promise = makeFontFaceObserver(font);
            promiseList.push(promise);
        }
        const result = yield Promise.all(promiseList);
        // TODO: maybe send an error back if one failed.
    });
}
export function loadGoogleFonts(fonts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield loadGoogleFontCss(fonts))) {
            // already loaded
            return Promise.resolve();
        }
        const promiseList = [];
        for (const font of fonts) {
            const promise = makeFontFaceObserver(font);
            promiseList.push(promise);
        }
        const result = yield Promise.all(promiseList);
        // TODO: maybe send an error back if one failed.
    });
}
function makeFontFaceObserver(font) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
            let attempt = 0;
            while (true) {
                try {
                    const observer = new FontFaceObserver(font.family);
                    yield observer.load(font.string, FONT_OBSERVER_TIMEOUT);
                    return res({
                        form: 'rise',
                        font,
                    });
                }
                catch (e) {
                    console.error(e);
                    if (attempt === 2) {
                        return res({
                            form: 'kink',
                            kink: e,
                            font,
                        });
                    }
                }
                attempt++;
            }
        }));
    });
}
const loadGoogleFontStyle = (url) => {
    // addStylesheetURL(url)
    return new Promise(res => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let css = xhr.responseText;
                css = css.replace(/}/g, 'font-display: swap; }');
                const head = document.getElementsByTagName('head')[0];
                const style = document.createElement('style');
                style.appendChild(document.createTextNode(css));
                head.appendChild(style);
                res();
            }
        };
        xhr.send();
    });
};
export function loadGoogleFontCss(fonts) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = [];
        for (const dec of fonts) {
            const italics = dec.styles.filter(x => x.italic);
            const regulars = dec.styles.filter(x => !x.italic);
            const text = [];
            text.push(`family=${dec.family.replace(/\s+/g, '+')}:`);
            const types = [];
            if (italics.length) {
                types.push(`ital`);
            }
            if (regulars.length) {
                types.push(`wght`);
            }
            text.push(`${types.join(',')}@`);
            const weights = [];
            regulars.forEach(x => {
                const key = `${dec.family}:regular:${x.weight}`;
                // if (!LOADED_FONTS[key]) {
                weights.push(`${italics.length ? '0,' : ''}${x.weight}`);
                //   LOADED_FONTS[key] = true
                // }
            });
            italics.forEach(x => {
                const key = `${dec.family}:italic:${x.weight}`;
                // if (!LOADED_FONTS[key]) {
                weights.push(`${regulars.length ? '1,' : ''}${x.weight}`);
                //   LOADED_FONTS[key] = true
                // }
            });
            if (weights.length) {
                text.push(weights.join(';'));
                list.push(text.join(''));
            }
        }
        if (list.length) {
            const link = `https://fonts.googleapis.com/css2?${list.join('&')}&display=swap`;
            // addStylesheetURL(link)
            yield loadGoogleFontStyle(link);
            return true;
        }
        return false;
    });
}
//# sourceMappingURL=font.js.map