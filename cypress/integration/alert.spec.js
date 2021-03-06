/// <reference types="cypress" />

describe('Work with alert', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    //Executa antes da execução de cada um dos testes
    beforeEach(() => {
        cy.reload()
    })

    it('Alert', () => {
        cy.get('#alert').click()
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Alert Simples')
        })
    })
    
    it('Alert Com Command', () => {
        cy.clickAlert('#alert', 'Alert Simples')
    })

    it('Alert com Mock', () => {
        const stub = cy.stub().as('alerta')
        
        cy.on('window:alert', stub)
        cy.get('#alert').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Alert Simples')
        })
    })
    
    it('Confirm', () => {
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples')
        })
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Confirmado')
        })

        cy.get('#confirm').click()
    })
    
    it('Deny', () => {
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Confirm Simples')
            return false
        })
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal('Negado')
        })
        
        cy.get('#confirm').click()
    })

    it('Prompt', () => {
        cy.window().then(win => {
            cy.stub(win, 'prompt').returns(42)
        })
        cy.on('window:confirm', msg => {
            expect(msg).to.be.equal('Era 42?')
        })
        cy.on('window:alert', msg => {
            expect(msg).to.be.equal(':D')
        })
    
        cy.get('#prompt').click()
    })

    it('Validando Mensagens', () => {
        const stub = cy.stub().as('Alerta')
        cy.on('window:alert', stub)

        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio')
        })

        cy.get('#formNome').type('Nome')
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio')
        })
         
        cy.get('#formSobrenome').type('Sobrenome')
        cy.get('#formCadastrar').click().then(() => {
            expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio')
        })
        
        cy.get('#formSexoMasc').click()
        cy.get('#formCadastrar').click().then(() => {
            cy.get('span').should('contain', 'Cadastrado!')
        })
    })
    
})