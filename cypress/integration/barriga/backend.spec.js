/// <reference types="cypress" />

describe('Should test at API level', () => {
    let token

    before(() => {
        cy.getToken('r@r', 'r').then(tkn => {
            token = tkn
        }).then(() => {
            cy.request({
                method: 'GET',
                url: 'https://barrigarest.wcaquino.me/reset',
                headers: {
                    Authorization: `JWT ${token}`
                }
            })
        })
    })

    beforeEach(() => {
    })

    it('Should create an account', () => {
        cy.request({
            method: 'POST',
            url: 'https://barrigarest.wcaquino.me/contas',
            headers: {
                Authorization: `JWT ${token} `
            },
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })

    })

    it('Should Update An Account', () => {
    })

    it('Should Not Create An Account With The Same Name', () => {
    })

    it('Should Create A Transaction', () => {
    })

    it('Should Get Balance', () => {
    })

    it('Should Remove a Transaction', () => {
    })

})