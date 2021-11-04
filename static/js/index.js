const cpf = document.getElementById('cpf')
const voteButton = document.getElementById('vote-button')
const invalid = document.getElementById('invalid')
const voteName = document.getElementById('vote-name')
const modal = document.getElementById('modal')

VMasker(cpf).maskPattern('999.999.999-99')

let error = false

function updateCpf() {
    voteButton.disabled = true

    if (error) {
        error = false
        invalid.classList.remove('cpf__invalid--active')
    }
    
    if (cpf.value.length === 14) {
        if (CPF.validate(cpf.value)) {
            voteButton.disabled = false
        } else {
            error = true
            invalid.classList.add('cpf__invalid--active')
        }
    }
}

cpf.addEventListener('input', updateCpf);

function toggleVote() {
    document.body.classList.toggle('vote')
}

let projectId

function voteCard(id, name) {
    projectId = id
    toggleVote()
    voteName.innerText = name
}

function openModal() {
    modal.classList.add('active')
    modal.classList.remove('transition')
}

function closeModal() {
    toggleVote()
    modal.classList.remove('active')
    modal.classList.add('transition')
}

function vote() {
    fetch('/votar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            cpf: cpf.value,
            id: projectId
        }).toString()
    }).then(res => {
        openModal()
        cpf.value = ''
        updateCpf()
    })
}