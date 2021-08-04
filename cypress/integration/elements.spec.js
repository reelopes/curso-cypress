/// <reference types="cypress" />

describe('Work with basic elements', () => {
    //Executa antes da execução do primeiro teste
    before(() => {
        cy.visit('https://wcaquino.me/cypress/componentes.html')
    })
    //Executa antes da execução de cada um dos testes
    beforeEach(() => {
        cy.reload()
    })
    
    it('Text', () => {
        cy.get('body').should('contain', 'Cuidado')
        cy.get('span').should('contain', 'Cuidado')
        cy.get('.facilAchar').should('have.text', 'Cuidado onde clica, muitas armadilhas...')
    })
    
    it('Links', () => {
        cy.get('[href="#"]').click()
        cy.get('#resultado').should('have.text', 'Voltou!')
        
        cy.reload()
        cy.get('#resultado').should('not.have.text', 'Voltou!')
        cy.contains('Voltar').click()
        cy.get('#resultado').should('have.text', 'Voltou!')
    })

    it('TextFileds', () => {
        cy.get('#formNome').type('Cypress Test')
            .should('have.value', 'Cypress Test')
        
        cy.get('#elementosForm\\:sugestoes')
            .type('textarea')
            .should('have.value', 'textarea')
        
        cy.get('#tabelaUsuarios > :nth-child(2) > :nth-child(1) > :nth-child(6) > input')
            .type('???')
        
        cy.get('[data-cy=dataSobrenome]')
            .type('Teste12345{backspace}{backspace}')
            .should('have.value', 'Teste123')
        
        cy.get('#elementosForm\\:sugestoes')
            .clear()
            .type('Erro{selectAll}acerto', { delay: 100 })
            .should('have.value', 'acerto')
    })

    it('RadioButton', () => {
        cy.get('#formSexoFem')
            .click()
            .should("be.checked")
        
        cy.get('#formSexoMasc')
            .should("not.be.checked")
        
        cy.get("[name=formSexo]")
            .should("have.length", 2 )
    })
    
    it('CheckBox', () => {
        cy.get('#formComidaPizza')
            .click()
            .should("be.checked")
        
        cy.get("[name=formComidaFavorita]")
            .click({ multiple: true })
        
        cy.get('#formComidaPizza')
            .should("not.be.checked")
        
        cy.get('#formComidaVegetariana')
            .should("be.checked")
        
    })
    
    it('Combo', () => {
        cy.get('[data-test=dataEscolaridade]')
            .select('2o grau completo')
            .should("have.value", '2graucomp')

        cy.get('[data-test=dataEscolaridade] option:selected')
            .should("have.text", '2o grau completo')

        cy.get('[data-test=dataEscolaridade]')
            .select('1graucomp')
            .should("have.value", '1graucomp')

        cy.get('[data-test=dataEscolaridade] option')
            .should('have.length', 8)
            .then($arr => {
                const values = []
                $arr.each(function(){
                    values.push(this.innerHTML)
                })
                expect(values).to.include.members(['Superior', 'Mestrado'])         
            })
        })
    
    it.only('Combo Multiplo', () => {
        cy.get('[data-testid=dataEsportes]')
            .select(['natacao','Corrida','nada'])
            
        cy.get('[data-testid=dataEsportes]')
        // .should('have.value', ['natacao','Corrida','nada'])
        //testar os selecionados
        .then($el => {
            expect($el.val()).to.be.deep.equal(['natacao','Corrida','nada'])
            expect($el.val()).to.have.length(3)
        })
        
        //Ou da pra testar os selecionados assim também
        cy.get('[data-testid=dataEsportes]').invoke('val').should('eql', ['natacao','Corrida','nada'])

    })

})