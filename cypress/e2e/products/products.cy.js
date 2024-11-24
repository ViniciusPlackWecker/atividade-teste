describe('Testes no módulo de Produtos do Demo.Opencart', () => {
    beforeEach(() => {
        cy.visit('');
        cy.wait(3000); // Aguarda 3 segundos ou até o carregamento completo
        // Verifique se o Bootstrap foi carregado verificando o elemento que depende do Bootstrap
        cy.window().then((window) => {
            // Verifique se o Bootstrap foi carregado corretamente
            expect(window.bootstrap).to.not.be.undefined;
        });

        // Verifica se o jQuery foi carregado
        cy.window().then((window) => {
            expect(window.$).to.not.be.undefined;
        });

        // Verifica se a classe 'img-fluid' foi aplicada em uma imagem
        cy.get('img').first().should('have.class', 'img-fluid');

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


    it('Adicionar e remover produtos do carrinho', () => {
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
                expect(updatedText.trim()).to.include('item(s)');
            });

        cy.wait(5000);

        cy.get('button[data-bs-toggle="dropdown"]')
            .click();

        cy.get('table.table button[title="Remove"]')
            .should('be.visible')
            .click();

        cy.get('button[data-bs-toggle="dropdown"]')
            .invoke('text')
            .should((updatedText) => {
                expect(updatedText.trim()).to.include('0 item(s)');
            });
        cy.wait(10000);
    })

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

        cy.wait(5000);
        cy.get('#input-shipping-address').select('1282');

        cy.get('#button-shipping-methods').click();

        cy.get('#input-shipping-method-flat-flat').should('be.visible').should('be.enabled').check().should('be.checked');

        cy.wait(2000);
        cy.get('#button-shipping-method').should('exist').click();


        cy.wait(2000);
        cy.get('#button-payment-methods').should('exist').should('be.visible').click();

        cy.get('#input-payment-method-cod-cod').should('be.visible').should('be.enabled').check().should('be.checked');

        cy.wait(2000);
        cy.get('#button-payment-method').click();

        cy.wait(2000);
        cy.get('#button-confirm').should('exist').click();

        cy.get('h1').should('contain', 'Your order has been placed!');
    })

    it('Realizar a comparação de dois produtos', () => {

        let productNames = [];
        let compareProductNames = [];
        
        cy.get('a[href="https://demo.opencart.com/en-gb/catalog/desktops"]')
            .should('exist')
            .should('be.visible')
            .click({ multiple: 'true' });

        cy.get('#product-list').find('div').eq(10).within(() => {
            cy.get('input[type="hidden"][name="product_id"][value="30"]').should('exist');
            cy.get('.description h4').invoke('text').then((productName) => {
                productNames.push(productName.trim());
            });
            cy.wait(5000);
            cy.get('button[title="Compare this Product"]').should('be.visible').click();
        });


        cy.get('#product-list').find('div').eq(15).within(() => {
            cy.get('input[type="hidden"][name="product_id"][value="47"]').should('exist');
            cy.get('.description h4').invoke('text').then((productName) => {
                productNames.push(productName.trim());
            });
            cy.wait(5000);
            cy.get('button[title="Compare this Product"]').should('be.visible').click();
        });

        cy.wrap(productNames).should('have.length', 2);


        cy.get('a i.fa-arrow-right-arrow-left').should('exist').click();

        cy.get('#content').find('table tbody tr').find('td').eq(1).within(() => {
            cy.get('a').invoke('text').then ((productName) => {
                compareProductNames.push(productName.trim());
            })
        });

        cy.get('#content').find('table tbody tr').find('td').eq(2).within(() => {
            cy.get('a').invoke('text').then ((productName) => {
                compareProductNames.push(productName.trim());
            })
        });

        cy.wrap(compareProductNames).should('have.length', 2);

        cy.wrap(compareProductNames).then((compareNames) => {
            cy.wrap(productNames).then((names) => {
                expect(compareNames[0]).to.equal(names[0]);
                expect(compareNames[1]).to.equal(names[1]); 
            }) 
        });
    })

    it('Adicionar produto a lista de desejos', () => {

        let productNames = [];
        let compareProductNames = [];
        
        cy.get('a[href="https://demo.opencart.com/en-gb/catalog/desktops"]')
            .should('exist')
            .should('be.visible')
            .click({ multiple: 'true' });

        cy.get('#product-list').find('div').eq(15).within(() => {
            cy.get('input[type="hidden"][name="product_id"][value="47"]').should('exist');
            cy.get('.description h4').invoke('text').then((productName) => {
                productNames.push(productName.trim());
            });
            cy.wait(5000);
            cy.get('button i.fa-heart').should('be.visible').click();
        });

        cy.wrap(productNames).should('have.length', 1);


        cy.get('a i.fa-heart').should('exist').click();

        cy.get('#wishlist').find('div table tbody tr').find('td').eq(1).within(() => {
            cy.get('a').invoke('text').then ((productName) => {
                compareProductNames.push(productName.trim());
            })
        });

        cy.wrap(compareProductNames).should('have.length', 1);

        cy.wrap(compareProductNames).then((compareNames) => {
            cy.wrap(productNames).then((names) => {
                expect(compareNames[0]).to.equal(names[0]);
            }) 
        });
    })

    it('Comprar produto a partir da lista de desejos', () => {

        let productNames = [];
        let compareProductNames = [];
        
        cy.get('a[href="https://demo.opencart.com/en-gb/catalog/desktops"]')
            .should('exist')
            .should('be.visible')
            .click({ multiple: 'true' });

        cy.get('#product-list').find('div').eq(15).within(() => {
            cy.get('input[type="hidden"][name="product_id"][value="47"]').should('exist');
            cy.get('.description h4').invoke('text').then((productName) => {
                productNames.push(productName.trim());
            });
            cy.wait(5000);
            cy.get('button i.fa-heart').should('be.visible').click();
        });

        cy.wrap(productNames).should('have.length', 1);


        cy.get('a i.fa-heart').should('exist').click();

        cy.get('#wishlist').find('div table tbody tr').within(() => {
            cy.get('td').eq(1).find('a').invoke('text').then ((productName) => {
                compareProductNames.push(productName.trim());
            })

            cy.wrap(compareProductNames).should('have.length', 1);

            cy.wrap(compareProductNames).then((compareNames) => {
                cy.wrap(productNames).then((names) => {
                    expect(compareNames[0]).to.equal(names[0]);
                }) 
            });

            cy.wait(5000);
            cy.get('button i.fa-cart-shopping').should('exist').should('be.visible').click()
        });

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

        cy.wait(5000);
        cy.get('#input-shipping-address').select('1282');

        cy.get('#button-shipping-methods').click();

        cy.get('#input-shipping-method-flat-flat').should('be.visible').should('be.enabled').check().should('be.checked');

        cy.wait(2000);
        cy.get('#button-shipping-method').should('exist').click();


        cy.wait(2000);
        cy.get('#button-payment-methods').should('exist').should('be.visible').click();

        cy.get('#input-payment-method-cod-cod').should('be.visible').should('be.enabled').check().should('be.checked');

        cy.wait(2000);
        cy.get('#button-payment-method').click();

        cy.wait(2000);
        cy.get('#button-confirm').should('exist').click();

        cy.get('h1').should('contain', 'Your order has been placed!');
    })
})
