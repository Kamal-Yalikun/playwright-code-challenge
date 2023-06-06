import { BrowserContext, Page, test, expect, request, APIResponse } from '@playwright/test';

test.describe('Card Game', async () => {
    let context: BrowserContext, page: Page

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
    })

    test.afterAll(async () => {
        await page.close();
    })

    test('Blackjack', async ({ page, request }) => {
        await page.goto('/');
        expect(await page.title()).toEqual("Deck of Cards API");

        let newDeck = await request.get('/api/deck/new/');
        let response = await getResponseBody(newDeck);
        let deck_id = response.deck_id;

        let shuffledDeck = await request.get(`/api/deck/${deck_id}/shuffle/`);
        response = await getResponseBody(shuffledDeck);
        let shuffled = response.shuffled;
        expect(shuffled).toBeTruthy();

        let cardCount = 3;

        let player1Draw = await request.get(`/api/deck/${deck_id}/draw/?count=${cardCount}`);
        response = await getResponseBody(player1Draw);
        let player1Cards = response.cards;
        let player1Score = getScore(player1Cards);
        console.log('Player 1 Score: '+player1Score);

        let player2Draw = await request.get(`/api/deck/${deck_id}/draw/?count=${cardCount}`);
        response = await getResponseBody(player2Draw);
        let player2Cards = response.cards;
        let player2Score = getScore(player2Cards);
        console.log('Player 2 Score: '+player2Score);

        if(player1Score === 21 && player2Score !== 21){
            console.log('Player 1 has blackjack!')
        } else if(player1Score !== 21 && player2Score === 21){
            console.log('Player 2 has blackjack!')
        } else if(player1Score === 21 && player2Score === 21){
            console.log('Both players have blackjack!!')
        } else {
            console.log('Neither player has blackjack')
        }

    });


    async function getResponseBody(response: APIResponse) {
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        let body = JSON.parse(await response.text());
        return body;
    }

    function getCardNumericValue(card) {
        switch (card.value) {
            case 'KING':
                return 10;

            case 'QUEEN':
                return 10;

            case 'JACK':
                return 10;

            case 'ACE':
                return 11;

            default:
                return Number(card.value);
        }
    }

    function getScore(cardArray) {
        let score = 0;
        for (let i = 0; i < cardArray.length; i++) {
            let card = cardArray[i];
            score += getCardNumericValue(card);
        }
        return score;
    }

})