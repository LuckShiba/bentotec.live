const cpf = document.getElementById('cpf')
const voteButton = document.getElementById('vote-button')
const invalid = document.getElementById('invalid')
const voteName = document.getElementById('vote-name')
const modal = document.getElementById('modal')
const modalError = document.getElementById('modal-error')
const modalMessage = document.getElementById('modal-message')

VMasker(cpf).maskPattern('999.999.999-99')

let error = false

function updateCpf() {
    voteButton.disabled = true
    console.log('updated', cpf.value)

    if (error) {
        error = false
        invalid.innerText = ''
    }
    
    const cpfVal = cpf.value.replace(/\D/g, '')

    if (cpfVal.length >= 11) {
        if (CPF.validate(cpfVal)) {
            voteButton.disabled = false
        } else {
            error = true
            invalid.innerText = 'CPF inválido.'
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

function captchaVote() {
    console.log('ward')
    if (window.grecaptcha) {
        grecaptcha.execute()
    } else {
        invalid.innerText = 'Captcha indisponível no momento.'
    }
}

function vote(token) {
    fetch('/votar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            cpf: cpf.value,
            id: projectId,
            token
        }).toString()
    }).then(res => {
        if (res.status === 201) {
            modalError.innerText = 'SUCESSO'
            modalMessage.innerText = 'Você votou com sucesso.'
        } else {
            modalError.innerText = 'ERRO'
            res
                .json()
                .then(({error}) => {
                    modalMessage.innerText = error || 'Erro desconhecido.'
                })
                .catch(() => {
                    modalMessage.innerText = 'Erro desconhecido.'
                })
        }
        openModal()
        

        cpf.value = ''
        updateCpf()
    }).catch(() => {
        modalError.innerText = 'ERRO'
        modalMessage.innerText = 'Erro desconhecido.'
    })
}