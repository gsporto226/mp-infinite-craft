import Main from './pages/Main.svelte'
import type { Nullable, RecursiveNonNullable } from './utils/types.ts'

const maybeLayoutElement = document.querySelector<HTMLDivElement>('div#__layout')
const maybeBodyElement = document.querySelector<HTMLBodyElement>('body')
const maybeParticleCanvasElement = document.querySelector<HTMLCanvasElement>('canvas.particles')

const elements = [maybeLayoutElement, maybeBodyElement, maybeParticleCanvasElement] as const

if (elements.some(element => !element)) {
    console.error('[Multiplayer-infinite-craft] >> Layout or body element not found, has the website changed? If you see this message, feel free to create an issue at: <link>')
} else {
    const [layoutElement, bodyElement, particleCanvasElement] = elements as RecursiveNonNullable<typeof elements>
    main({ layoutElement, bodyElement, particleCanvasElement })
}

function main(params: { layoutElement: HTMLDivElement, bodyElement: HTMLBodyElement, particleCanvasElement: HTMLCanvasElement }) {
    const mainState = {
        initialLayoutDisplay: params.layoutElement.style.display,
        initialBodyStyle: {
            overflow: params.bodyElement.style.overflow,
        },
        mainComponent: null as Nullable<Main>,
        targetElement: null as Nullable<HTMLDivElement>,
        particleCanvasPlaceholder: null as Nullable<HTMLDivElement>
    }

    function createOrReuseElements() {
        if (!mainState.targetElement) {
            mainState.targetElement = document.createElement('div')
            mainState.targetElement.style.display = 'none'
            mainState.targetElement.id = 'multiplayer-infinite-craft'
            params.bodyElement.appendChild(mainState.targetElement)
        }
        if (!mainState.particleCanvasPlaceholder) {
            mainState.particleCanvasPlaceholder = document.createElement('div')
            mainState.particleCanvasPlaceholder.style.display = 'none'
            mainState.targetElement.appendChild(mainState.particleCanvasPlaceholder)
        }
        if (!mainState.mainComponent) {
            mainState.mainComponent = new Main({ target: mainState.targetElement })
        }
        return { mainComponent: mainState.mainComponent, targetElement: mainState.targetElement, particleCanvasPlaceholder: mainState.particleCanvasPlaceholder }
    }

    function changeSingleplayerVisibility(state: 'visible' | 'not-visible') {
        const { particleCanvasPlaceholder, targetElement } = createOrReuseElements()
        particleCanvasPlaceholder.replaceWith(params.particleCanvasElement)
        switch (state) {
            case 'visible':
                params.layoutElement.style.display = mainState.initialLayoutDisplay
                params.bodyElement.style.overflow = mainState.initialBodyStyle.overflow
                targetElement.style.display = 'none'
                break
            case 'not-visible':
                params.layoutElement.style.display = 'none'
                params.bodyElement.style.overflow = 'hidden'
                targetElement.style.display = 'block'
                break
        }
    }


    function onClickMultiplayerButton(event: Event) {
        event.preventDefault()
        event.stopPropagation()
        changeSingleplayerVisibility('not-visible')
    }

    function injectMultiplayerButton() {
        const container = document.createElement('div')
        container.style.display = 'flex'
        container.style.flexDirection = 'column'
        container.style.position = 'fixed'
        container.style.top = '13px'
        container.style.left = '13px'
        container.style.gap = '0.5rem'

        const goToMultiplayerButton = document.createElement('button')
        goToMultiplayerButton.innerText = 'Go to Multiplayer'
        goToMultiplayerButton.onclick = onClickMultiplayerButton

        const siteTitleImg = document.querySelector<HTMLImageElement>('.site-title')
        if (!siteTitleImg) {
            return
        }
        siteTitleImg.className = ''
        siteTitleImg.replaceWith(container)
        container.appendChild(siteTitleImg)
        container.appendChild(goToMultiplayerButton)
    }

    injectMultiplayerButton()
    changeSingleplayerVisibility('not-visible')
}
