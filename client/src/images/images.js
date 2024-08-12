// src/imageLoader.js
export function importAll(r) {
    return r.keys().map(r);
}

export const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));
