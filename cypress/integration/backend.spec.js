/// <reference types="cypress" />

describe('Should test at API level', () => {

    before(() => {

    })

    beforeEach(() => {

    })

    it('Should create an account', () => {
        cy.request({
            method:'POST',
            url: 'https://barrigarest.wcaquino.me/signin',
            body: {
                email: 'a@a',
                senha: 'a',
                redirecionar: false
            }
        }).its('body.token')
        .should('not.be.empty')
        .then(token => console.log(token))
        // .then(res => console.log(res))
    })

})