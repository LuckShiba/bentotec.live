import express from 'express'
import dotenv from 'dotenv'
import sqlite3 from 'sqlite3'
import CPF from 'gerador-validador-cpf'
import fetch from 'node-fetch'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
const { Database,  OPEN_READWRITE, OPEN_CREATE } = sqlite3

dotenv.config()

const recaptchaEnabled = process.env.RECAPTCHA_ENABLED === '1'

const app = express()

const __dirname = dirname(fileURLToPath(import.meta.url))

const db = new Database(join(__dirname, 'votes.db'),  OPEN_READWRITE | OPEN_CREATE, (err) => {
    if (err) {
        return console.error('Erro abrindo database:', err)
    }
    console.log('Conectado ao database.')
})

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS votos (
            cpf CHARACTER(11) PRIMARY KEY,
            project_id UNSIGNED INTEGER
        );
    `)
})

const data = JSON.parse(readFileSync(join(__dirname, 'data.json')))

app.use(express.static(join(__dirname, 'static')))
app.use(express.urlencoded({
    extended: true
}))

app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index', {
        data,
        recaptchaEnabled,
        recaptchaSitekey: process.env.RECAPTCHA_SITEKEY
    })
})

app.get('/votar/:id', (req, res) => {
    const project = data.find(x => x.id == req.params.id)

    if (!project) {
        return res.status(404).render('message', {
            error: true,
            message: 'Esse projeto não existe.'
        })
    }

    res.render('vote', {
        id: req.params.id,
        project,
        recaptchaEnabled,
        recaptchaSitekey: process.env.RECAPTCHA_SITEKEY
    })
})

app.post('/votar', async (req, res) => {
    let cpf = req.body.cpf;

    if (typeof cpf !== 'string') {
        return res.status(400).send({
            error: 'CPF não presente.'
        })
    }

    if (recaptchaEnabled && !req.body.token) {
        return res.status(400).send({
            error: 'Erro de validação no captcha.'
        })
    }

    cpf = cpf.replace(/\D+/g, '')
    if (!CPF.validate(cpf)) {
        return res.status(400).send({
            error: 'CPF inválido.'
        })
    }

    const id = req.body.id;
    const project = data.find(x => x.id == id)

    if (recaptchaEnabled) {        
        const params = new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET,
            response: req.body.token
        })

        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?${params}`, {
            method: 'POST'
        })

        const { success } = await response.json()

        if (!success) {
            return res.status(400).json({
                error: 'Erro de validação do captcha.'
            })
        }
    }

    if (!project) {
        return res.status(404).send({
            error: 'Esse projeto não existe.'
        })
    }


    db.get('SELECT cpf FROM votos WHERE cpf = ?', [cpf], (err, row) => {
        if (err) {
            console.error(`[${cpf}] Erro buscando voto para ${id}: ${err}`)
            return res.status(500).send({
                error: 'Erro do servidor. O voto não foi computado.'
            })
        }

        if (row) {
            return res.status(409).send({
                error: 'Você já votou anteriormente.'
            })
        }

        db.run('INSERT INTO votos (cpf, project_id) VALUES (?, ?)', [cpf, id], (_, err) => {
            if (err) {
                console.error(`[${cpf}] Erro votando para ${id}: ${err}`)
                return res.status(500).send({
                    error: 'Erro do servidor. O voto não foi computado.'
                })
            }

            res.sendStatus(201)
        })
    })
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`)
})
