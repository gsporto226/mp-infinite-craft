/**
 * MIT License
 *
 * Copyright (c) 2019 kwdowik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface State {
    minScale: number
    maxScale: number
    element: HTMLElement
    scaleSensitivity: number
    transformation: {
        originX: number
        originY: number
        translateX: number
        translateY: number
        scale: number
    }
}

export const renderer = (params: { minScale: number, maxScale: number, element: HTMLElement, scaleSensitivity?: number }) => {
    const state: State = {
        scaleSensitivity: 10,
        ...params,
        transformation: {
            originX: 0,
            originY: 0,
            translateX: 0,
            translateY: 0,
            scale: 1
        },
    };
    return Object.assign({ state }, canZoom(state), canPan(state));
};

const pan = (params: { state: State, originX: number, originY: number }) => {
    const { state, originX, originY } = params
    state.transformation.translateX += originX;
    state.transformation.translateY += originY;
    state.element.style.transform =
        getMatrix({ scale: state.transformation.scale, translateX: state.transformation.translateX, translateY: state.transformation.translateY });
};

const canPan = (state: State) => ({
    panBy: ({ originX, originY }: { originX: number, originY: number }) => pan({ state, originX, originY }),
    panTo: ({ originX, originY, scale }: { originX: number, originY: number, scale: number }) => {
        state.transformation.scale = scale;
        pan({ state, originX: originX - state.transformation.translateX, originY: originY - state.transformation.translateY });
    },
});

const getMatrix = (params: { scale: number, translateX: number, translateY: number }) => {
    const { scale, translateX, translateY } = params
    return `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;
}

const canZoom = (state: State) => ({
    zoom: ({ x, y, deltaScale }: { x: number, y: number, deltaScale: number }) => {
        const { left, top } = state.element.getBoundingClientRect();
        const { minScale, maxScale, scaleSensitivity } = state;
        const [scale, newScale] = getScale({ scale: state.transformation.scale, deltaScale, minScale, maxScale, scaleSensitivity });
        const originX = x - left;
        const originY = y - top;
        const newOriginX = originX / scale;
        const newOriginY = originY / scale;
        const translate = getTranslate({ scale, minScale, maxScale });
        const translateX = translate({ pos: originX, prevPos: state.transformation.originX, translate: state.transformation.translateX });
        const translateY = translate({ pos: originY, prevPos: state.transformation.originY, translate: state.transformation.translateY });

        state.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
        state.element.style.transform = getMatrix({ scale: newScale, translateX, translateY });
        state.transformation = { originX: newOriginX, originY: newOriginY, translateX, translateY, scale: newScale };
    }
});


const getScale = ({ scale, minScale, maxScale, scaleSensitivity, deltaScale }: { scale: number, minScale: number, maxScale: number, scaleSensitivity: number, deltaScale: number }) => {
    let newScale = scale + (deltaScale / (scaleSensitivity / scale));
    newScale = Math.max(minScale, Math.min(newScale, maxScale));
    return [scale, newScale];
};

const hasPositionChanged = ({ pos, prevPos }: { pos: number, prevPos: number }) => pos !== prevPos;

const valueInRange = ({ minScale, maxScale, scale }: { minScale: number, maxScale: number, scale: number }) => scale <= maxScale && scale >= minScale;

const getTranslate = ({ minScale, maxScale, scale }: { minScale: number, maxScale: number, scale: number }) => ({ pos, prevPos, translate }: { pos: number, prevPos: number, translate: number }) =>
    valueInRange({ minScale, maxScale, scale }) && hasPositionChanged({ pos, prevPos })
        ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
        : translate;
