describe('Testes no módulo de Produtos do Demo.Opencart', () => {
    beforeEach(() => {
        cy.visit('');
        cy.wait(3000); // Aguarda 3 segundos ou até o carregamento completo
        cy.window().then((window) => {
            // Verifique se o Bootstrap está carregado no contexto da janela
            expect(window.bootstrap).to.not.be.undefined;
        });
        cy.get('span')
            .contains('My Account')
            .should('exist')
            .should('be.visible')
            .click();
        cy.get('a[href="https://demo.opencart.com/en-gb?route=account/login"]')
            .should('exist')
            .should('be.visible')
            .click();

        cy.get('#form-login').within(() => {
            cy.get('#input-email').should('be.visible').type('cypressCICD@example.com');
            
            cy.get('#input-password').should('be.visible').type('umasenhaforte');

            cy.get('button').click();
        });

        cy.get('h2').should('contain', 'My Account');
    })


    // it('Adicionar e remover produtos do carrinho', () => {
    //     cy.get('a[href="https://demo.opencart.com/en-gb/catalog/desktops"]')
    //         .should('exist')
    //         .should('be.visible')
    //         .click({multiple:'true'});


    //     cy.get('#product-list').find('div').eq(15).within(() =>{
    //         cy.get('input[type="hidden"][name="product_id"][value="47"]').should('exist');
    //         cy.get('button[title="Add to Cart"]').should('be.visible').click();
    //     })
    
    //     cy.wait(2000);
    //     cy.get('#input-quantity').type('0')

    //     cy.get('#button-cart')
    //         .should('exist')
    //         .should('be.visible')
    //         .click();

    //     cy.get('button[data-bs-toggle="dropdown"]')
    //         .invoke('text')
    //         .should((updatedText) => {
    //             expect(updatedText.trim()).to.include('item(s)');
    //         });

    //     cy.wait(5000);

    //     cy.get('button[data-bs-toggle="dropdown"]')
    //         .click();

    //     cy.get('table.table button[title="Remove"]')
    //         .should('be.visible')
    //         .click();

    //     cy.get('button[data-bs-toggle="dropdown"]')
    //         .invoke('text')
    //         .should((updatedText) => {
    //             expect(updatedText.trim()).to.include('0 item(s)');
    //         });
    //     cy.wait(10000);
    // })

    it('Realizar uma compra do carrinho', () => {
        cy.get('a[href="https://demo.opencart.com/en-gb/catalog/desktops"]')
            .should('exist')
            .should('be.visible')
            .click({multiple:'true'});
        
        cy.get('#product-list').find('div').eq(15).within(() =>{
            cy.get('input[type="hidden"][name="product_id"][value="47"]').should('exist');
            cy.get('button[title="Add to Cart"]').should('be.visible').click();
        })
        
        cy.wait(2000);
        cy.get('#input-quantity').type('0')

        cy.get('#button-cart')
            .should('exist')
            .should('be.visible')
            .click();

        cy.get('button[data-bs-toggle="dropdown"]')
            .invoke('text')
            .should((updatedText) => {
                expect(updatedText.trim()).to.include('10 item(s)');
            });

        cy.wait(5000);

        cy.get('button[data-bs-toggle="dropdown"]')
            .click();

        cy.get('a strong i.fa-share')
            .should('exist')
            .should('be.visible')
            .wait(1000)
            .click();

        cy.get('#input-shipping-address').select('1282');

        cy.get('#button-shipping-methods').click();

        cy.get('#input-shipping-method-flat-flat').check().should('be.checked');

        cy.wait(2000);
        cy.get('#button-shipping-method').click();

        cy.get('#button-payment-methods').click();

        cy.get('#input-payment-method-cod-cod').check().should('be.checked');
        
        cy.wait(2000);
        cy.get('#button-payment-method').click();
        
        cy.wait(2000);
        cy.get('#button-confirm').should('exist').click();

        cy.get('h1').should('contain', 'Your order has been placed!');
    })
})
