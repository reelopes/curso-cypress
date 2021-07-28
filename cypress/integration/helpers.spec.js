/// <reference types = "cypress" />

describe('Helpers...', () => {
    
    it('Wrap', () => {

        const obj = {nome: 'User', idade: 20}

        expect(obj).to.have.property('nome')
        cy.wrap(obj).should('have.property', 'nome')

        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.get('#formNome').then($el => {
            // cy.get('#formNome').type('FUnciona?')
            // $el.val('Funciona via jquery')
            cy.wrap($el).type('Funciona via cypress')
            
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(10)
                }, 500);
            })
            
            cy.get('#buttonSimple').then(() => {console.log('Encontrei o primeiro botão')})
            // promise.then(num => console.log(num))
            cy.wrap(promise).then(num => console.log(num))
            cy.get('#buttonList').then(() => {console.log('Encontrei o segundo botão')})
        })
    })
    
    it('Its...', () => {
        
        const obj = {nome: 'User', idade: 20}
        
        //como testar uma propriedade de um objeto
        cy.wrap(obj).should('have.property', 'nome', 'User')
        
        //its eh um atalho para pegar uma propriedade de um objeto
        cy.wrap(obj).its('nome').should('be.equal','User')
        
        //exemplo 2 de its
        const obj2 = {nome: 'User', idade: 20, endereco: {rua: 'dos bobos'}}
        cy.wrap(obj2).its('endereco').should('have.property','rua')
        cy.wrap(obj2).its('endereco').its('rua').should('be.equal','dos bobos')
        cy.wrap(obj2).its('endereco.rua').should('be.equal','dos bobos')
        
        //exemplo 3 de its
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.title().its('length').should("be.equal", 20)
    })
    
    it.only('Invoke...', () => {
        
        const getValue = () => 1;
        const soma = (a, b) => a + b;
        
        //como testar um invoke de um objeto
        cy.wrap({fn: getValue}).invoke('fn').should("be.equal", 1)
        cy.wrap({fn: soma}).invoke('fn',2,5).should("be.equal", 7)
        
        cy.visit('https://wcaquino.me/cypress/componentes.html')
        cy.get('#formNome').invoke('val', 'Texto via invoke')
        cy.window().invoke('alert','Dá pra ver?')
        cy.get('#resultado').invoke('html', '<input type="button" value="Hacked">')
    })

})