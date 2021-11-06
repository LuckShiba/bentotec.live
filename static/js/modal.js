const modal = document.getElementById('modal')
const close = document.getElementById('modal-close')
const error = document.getElementById('modal-error')
const message = document.getElementById('modal-message')

export class Modal {
    constructor() {
        close.addEventListener('click', () => {
            this.close()
        })
    }

    open(title, msg) {
        error.innerText = title
        message.innerText = msg
        modal.classList.add('active')
    }

    close() {
        this.vote.close()
        modal.classList.remove('active')
    }
}
