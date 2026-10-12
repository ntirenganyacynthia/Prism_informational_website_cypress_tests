
const websiteUrl = 'https://prism-informational-website.vercel.app/';

const viewports = [
  { name: 'Desktop', width: 1366, height: 768 },
  { name: 'Mobile', width: 375, height: 812 },
];

const navigationLinks = [
  { label: 'Home', target: '#home' },
  { label: 'About us', target: '#about' },
  { label: 'How it works', target: '#how-it-works' },
  { label: 'FAQs', target: '#faqs' },
  { label: 'Contact us', target: '#contact' },
];

const processSteps = [
  'Observe',
  'Connect',
  'Understand',
  'Support',
  'Refer',
];

const faqQuestions = [
  'What is Mirai?',
  'How does Mirai work?',
  'Does Mirai diagnose children?',
  'How does Mirai protect',
  'Does Mirai use AI?',
];

describe('Mirai informational website', () => {
  viewports.forEach((viewport) => {
    describe(`At ${viewport.name} size`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit(websiteUrl);
        cy.get('body').should('exist');
      });

      it('loads the homepage and displays its hero content', () => {
        cy.get('#home').should('exist');

        cy.get('#home').should(
          'contain.text',
          'Observe . Connect . Support . Refer'
        );

        cy.get('#home')
          .contains('Register your school')
          .should('exist')
          .scrollIntoView()
          .should('be.visible');
      });

      it('provides working navigation links', () => {
        navigationLinks.forEach(({ label, target }) => {
          cy.get('header')
            .contains('a', new RegExp(label, 'i'))
            .should('have.attr', 'href', target);

          cy.get(target).should('exist');
        });
      });

      it('displays the About us heading and information', () => {
        cy.get('#about').should('exist');

        cy.get('#about').should(
          'contain.text',
          'Every Learner Deserves to be Understood'
        );

        cy.get('#about').should('contain.text', 'problem');
        cy.get('#about').should('contain.text', 'solution');
      });

      it('checks that the three About us boxes have equal sizes', () => {
        const cardHeadings = [
          'The problem',
          'The solution',
          'Built from research',
        ];

        const cards = [];

        cy.get('#about').should('exist');

        cardHeadings.forEach((heading) => {
          cy.get('#about')
            .contains(heading)
            .closest('article, [class*="card"]')
            .should('exist')
            .then(($card) => {
              cards.push($card[0]);
            });
        });

        cy.then(() => {
          expect(cards).to.have.length(3);

          const sizes = cards.map((card) => {
            const rect = card.getBoundingClientRect();

            return {
              width: rect.width,
              height: rect.height,
            };
          });

          sizes.forEach((size, index) => {
            expect(
              size.width,
              `${cardHeadings[index]} width`
            ).to.be.closeTo(sizes[0].width, 2);

            expect(
              size.height,
              `${cardHeadings[index]} height`
            ).to.be.closeTo(sizes[0].height, 2);
          });
        });
      });

      it('displays all five How It Works steps', () => {
        cy.get('#how-it-works').should('exist');

        processSteps.forEach((step) => {
          cy.get('#how-it-works')
            .contains(step)
            .should('exist');
        });
      });

      it('displays FAQ questions and opens their answers', () => {
        cy.get('#faqs').should('exist');

        faqQuestions.forEach((question) => {
          cy.get('#faqs')
            .contains(question)
            .should('exist');
        });

        faqQuestions.forEach((_, index) => {
          cy.get(`#faq-trigger-${index}`)
            .should('exist')
            .scrollIntoView()
            .click()
            .should('have.attr', 'aria-expanded', 'true');
        });
      });

      it('checks and submits the contact form', () => {
        const message = 'This is a Cypress automated test message.';

      
        expect(message.length).to.be.greaterThan(10);

        cy.get('#contact').scrollIntoView();

        cy.get('#contact').within(() => {
          cy.contains('First Name').should('exist');
          cy.contains('Last Name').should('exist');
          cy.contains('Email').should('exist');
          cy.contains('Subject').should('exist');

          cy.get('input').should('have.length.at.least', 3);
          cy.get('textarea').should('exist');

         
          const fillField = (label, value) => {
            cy.contains('label', new RegExp(`^${label}$`, 'i'))
              .should('exist')
              .invoke('attr', 'for')
              .then((id) => {
                if (id) {
                  cy.get(`#${CSS.escape(id)}`)
                    .clear()
                    .type(value);
                } else {
                  throw new Error(
                    `The "${label}" label has no associated input ID.`
                  );
                }
              });
          };

          fillField('First Name', 'Cypress');
          fillField('Last Name', 'Tester');
          fillField('Email', 'cypresstest@example.com');
          fillField('Subject', 'Automated tests for Mirai website');

          cy.get('textarea')
            .first()
            .clear()
            .type(message)
            .should('have.value', message)
            .invoke('val')
            .should('have.length.greaterThan', 10);

          cy.contains('button', 'Send').click();
        });

        cy.get('#contact').should(($contact) => {
          const text = $contact.text().toLowerCase();

          expect(
            text.includes('success') ||
            text.includes('sent') ||
            text.includes('thank you'),
            'a successful submission confirmation'
          ).to.equal(true);
        });
      });

      it('does not overflow horizontally', () => {
        cy.document()
          .its('documentElement')
          .then((documentElement) => {
            expect(documentElement.scrollWidth)
              .to.be.at.most(documentElement.clientWidth);
          });
      });

      it('checks that website images are visible and loaded', () => {
        cy.get('img').should('have.length.greaterThan', 0);

        cy.get('img').each(($image) => {
          cy.wrap($image)
            .scrollIntoView()
            .should('be.visible')
            .and(($img) => {
              expect(
                $img[0].naturalWidth,
                `image ${$img[0].currentSrc || $img[0].src} loaded`
              ).to.be.greaterThan(0);
            });
        });
      });

      it('displays the footer', () => {
        cy.get('footer').should('exist');
      });
    });
  });
});
