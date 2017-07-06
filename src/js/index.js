'use strict'

class GalleryModal {
    constructor(options) {
        this.document = document
        this.options = options
        this.page = this.document.querySelector('.page')
        this.triggers = Array.from(this.document.querySelectorAll(this.options.trigger))

        this.mount()

        this.modal = this.document.querySelector('.modal')
        this.overlay = this.modal.querySelector('.modal__overlay')
        this.picture = this.modal.querySelector('.modal__picture')

        this.registerListeners()
    }

    mount() {
        this.page.insertAdjacentHTML('beforeEnd', `
            <div class="modal" tabindex="-1" role="dialog">
                <div class="modal__container">
                    <img class="modal__picture" src="">
                </div>
                <div class="modal__overlay"></div>
            </div>
        `)
    }

    registerListeners() {
        this.document.addEventListener('keyup', this.closeByEsc.bind(this))
        this.triggers.forEach((trigger) => {
            trigger.addEventListener('click', this.open.bind(this))
        })
        this.overlay.addEventListener('click', this.close.bind(this))
    }

    preventTouchMove(event) {
        event.preventDefault()
    }

    fixPageScroll() {
        this.page.classList.add('page_fixed')
        this.page.addEventListener('touchmove', this.preventTouchMove)
    }

    unfixPageScroll() {
        this.page.classList.remove('page_fixed')
        this.page.removeEventListener('touchmove', this.preventTouchMove)
    }

    open(event) {
        this.setModalPicture(event.target.src)
        this.fixPageScroll()
        this.modal.classList.add('modal_visible')
    }

    close() {
        this.unfixPageScroll()
        this.modal.classList.remove('modal_visible')
    }

    closeByEsc(event) {
        if (event.keyCode === 27) {
            this.close()
        }
    }

    setModalPicture(src) {
        this.picture.src = src
    }
}

/* eslint-disable no-unused-vars, no-undef */
const lazyLoader = new LazyLoad({
    callback_load(element) {}
})
/* eslint-disable no-unused-vars */
const galleryModal = new GalleryModal({
    trigger: '.gallery__item-picture'
})
