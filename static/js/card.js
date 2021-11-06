export function configureCards(vote) {
    [...document.getElementsByClassName('vote-button')].forEach(button => {
        button.addEventListener('click', () => {
            vote.open(button.dataset.id, button.dataset.name)
        })
    })
}
