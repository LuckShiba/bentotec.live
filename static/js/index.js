import { Modal } from './modal.js'
import { Vote } from './vote.js'
import { configureCards } from './card.js'

const voteButton = document.getElementById('vote-button')

const modal = new Modal()
const vote = new Vote(modal)

modal.vote = vote

configureCards(vote)

window.captchaLoad = () => {
    voteButton.disabled = true
}

window.captchaVote = (token) => {
    vote.vote(token)
}