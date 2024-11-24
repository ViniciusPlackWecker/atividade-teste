describe('Testes no módulo de Conta do Demo.Opencart', () => {
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

    it('Teste 6: Alterar email cadastrado', () => {

        let Email = "cypressCICD@example.com";

        cy.get('#content ul').find('li').eq(0).within(() => {
            cy.wait(2000);
            cy.get('a').should('exist').should('be.visible').click();
        });
        
        cy.wait(2000);
        cy.get('#content div input[name="email"]').clear().type(Email);

        cy.get('#content button').should('exist').should('be.visible').click();

        cy.wait(2000);
        cy.get('#account-account .alert-success').should('exist').should('be.visible').should('contain', ' Success: Your account has been successfully updated.')
    });

    it('Teste 7: Alterar endereço cadastrado', () => {

        cy.get('#content ul').find('li').eq(2).within(() => {
            cy.wait(2000);
            cy.get('a').should('exist').should('be.visible').click();
        });

        cy.wait(2000);
        cy.get('#content table tbody tr').find('td').eq(1).within(() => {
            cy.get('a[title="Edit"]').should('exist').should('be.visible').click();
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(0).within(() => {
            cy.get('#input-firstname').should('exist').should('be.visible').clear().type('new first name');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(3).within(() => {
            cy.get('#input-lastname').should('exist').should('be.visible').clear().type('new last name');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(6).within(() => {
            cy.get('#input-company').should('exist').should('be.visible').clear().type('new company');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(9).within(() => {
            cy.get('#input-address-1').should('exist').should('be.visible').clear().type('new address 1');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(12).within(() => {
            cy.get('#input-address-2').should('exist').should('be.visible').clear().type('new address 2');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(14).within(() => {
            cy.get('#input-city').should('exist').should('be.visible').clear().type('new city');
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(17).within(() => {
            cy.get('#input-postcode').should('exist').should('be.visible').clear().type('999999999');
        })

        cy.get('#content button').should('exist').should('be.visible').click();

        cy.wait(2000);
        cy.get('#account-address').should('exist').should('be.visible').should('contain', '  Your address has been successfully updated')
    });

    it('Teste 8: Solicitar Retorno de Compra', () => {

        cy.get('#content').find('ul').eq(1).find('li').eq(0).within(() => {
            cy.wait(2000);
            cy.get('a').should('exist').should('be.visible').click();
        });

        cy.wait(2000);
        cy.get('#content table tbody tr').find('td').eq(6).within(() => {
            cy.get('a[title="View"]').should('exist').should('be.visible').click();
        })

        cy.wait(2000);
        cy.get('#content').find('div').eq(3).within(() => {
            cy.get('table tbody').find('td').eq(5).within(() =>{
                cy.get('a[title="Return"]').should('exist').should('be.visible').click();
            })
        })

        cy.wait(2000);
        cy.get('#content form fieldset').find('div').eq(10).within(() => {
            cy.get('#input-telephone').should('exist').should('be.visible').type('99999999');
        })

        cy.wait(2000);
        cy.get('#content form').find('fieldset').eq(1).within(() => {
            cy.get('#input-return-reason-1').should('exist').should('be.visible').check();
        })

        cy.wait(2000);
        cy.get('#content form').within(() => {
            cy.get('button').should('exist').should('be.visible').click();
        })
        
        cy.wait(2000);
        cy.get('#content h1').should('exist').should('be.visible').should('contain', 'Product Returns')
    });

    it('Teste 9: Verificar Retorno de Compra', () => {

        let returnData = [];
        cy.get('#content').find('ul').eq(1).find('li').eq(4).within(() => {
            cy.wait(2000);
            cy.get('a').should('exist').should('be.visible').click();
        });

        cy.wait(2000);
        cy.get('#content table tbody tr').find('td').eq(0).invoke('text').then((returnId) => {
            returnData.push(returnId.trim());
        })

        cy.wait(2000);
        cy.get('#content table tbody tr').find('td').eq(3).invoke('text').then((orderId) => {
            returnData.push(orderId.trim());
        })

        cy.wrap(returnData).should('have.length', 2);

        cy.wait(2000);
        cy.get('#content table tbody tr').find('td').eq(5).find('a[title="View"]').click();


        cy.wrap(returnData).then((compareData) => {
            cy.get('#content table tbody').find('td').eq(0).invoke('text').should('include', compareData[0]);

            cy.get('#content table tbody').find('td').eq(1).invoke('text').should('include', compareData[1]);
        });
        
    });

    it('Teste 10: Edição de conta afiliada', () => {

        let returnData = [];
        cy.get('#content').find('ul').eq(2).find('li').eq(0).within(() => {
            cy.wait(2000);
            cy.get('a').should('exist').should('be.visible').click();
        });

        cy.wait(2000);
        cy.get('#content form').find('fieldset').eq(0).find('div').eq(1).within(() => {
            cy.get('#input-company').should('exist').should('be.visible').clear().type('new company name');
        });

        cy.wait(2000);
        cy.get('#content form').find('fieldset').eq(0).find('div').eq(3).within(() => {
            cy.get('#input-website').should('exist').should('be.visible').clear().type('new web site name');
        });

        cy.wait(2000);
        cy.get('#content form').find('fieldset').eq(1).find('div').eq(1).within(() => {
            cy.get('#input-tax').should('exist').should('be.visible').clear().type('new Tax ID');
        });

        cy.wait(2000);
        cy.get('#content form').find('fieldset').eq(1).find('div').eq(8).within(() => {
            cy.get('#input-cheque').should('exist').should('be.visible').clear().type('new check payee name');
        });

        cy.get('#content button').should('exist').should('be.visible').click();

        cy.wait(2000);
        cy.get('#account-account').should('exist').should('be.visible').should('contain', '   Success: Your affiliate account has been successfully updated.')
        
    });

    it('Teste 11: Entrar em contato com o administrador', () => {

        cy.get('footer a[href="https://demo.opencart.com/en-gb?route=information/contact"]').should('exist').should('be.visible').click();

        cy.get('#content form fieldset').find('div').eq(7).within(() => {
            cy.get('#input-enquiry').type('esta é uma resposta automática através do cypress');
        })

        cy.get('#content form').within(() => {
            cy.get('button').should('exist').should('be.visible').click();
        })

        cy.wait(2000);
        cy.get('#content p').should('exist').should('be.visible').should('contain', 'Your enquiry has been successfully sent to the store owner!' );
    });
});