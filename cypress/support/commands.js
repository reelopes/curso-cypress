// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loc from './locators.js'

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click()
    cy.on('window:alert', msg => {
        expect(msg).to.be.equal(message)
    })
})

Cypress.Commands.add('login', (user, passwd) => {
    cy.visit('https://barrigareact.wcaquino.me/')
    cy.get(loc.LOGIN.USER).type('ree.lopes@hotmail.com')
    cy.get(loc.LOGIN.PASSWORD).type('mudar@123')
    cy.get(loc.LOGIN.BTN_LOGIN).click()
    cy.get(loc.MESSAGE).should('contain', 'Bem vindo')
})

Cypress.Commands.add('resetApp', () => {
    cy.get(loc.MENU.SETTINGS).click()
    cy.get(loc.MENU.RESET).click()
})

Cypress.Commands.add('getToken', (user, passwd) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: passwd
        }
    }).its('body.token').should('not.be.empty')
        .then(token => {
            Cypress.env('token', token)
            return token
        })
})

Cypress.Commands.add('resetRest', () => {
    //cy.getToken('r@r', 'r').then(token => {
    cy.request({
        method: 'GET',
        url: '/reset',
        headers: {
            // Authorization: `JWT ${token}`
        }
    }).its('status').should('be.equal', 200)
    //})
})

Cypress.Commands.add('getContaByName', (name) => {
    cy.request({
        method: 'GET',
        url: '/contas',
        headers: {
            // Authorization: `JWT ${token} `
        },
        qs: { nome: name }
    }).then(res => {
        return res.body[0].id
    })
})

Cypress.Commands.add('getSaldo', (nomeConta) => {
    cy.request({
        method: 'GET',
        url: '/saldo',
        headers: {
            // Authorization: `JWT ${token}`
        }
    }).then(res => {
        let saldoConta = null
        res.body.forEach(c => {
            if (c.conta === nomeConta) saldoConta = c.saldo
        })
        return saldoConta
    })
})

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if (options.length == 1) {
        if (Cypress.env('token')) {
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        }
    }

    return originalFn(...options)
})