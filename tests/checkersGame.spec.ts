import { BrowserContext, Page, test, expect } from '@playwright/test';

test.describe('Checker Game', async () => {
    let context: BrowserContext, page: Page

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
})

test.afterAll(async () => {
    await page.close();
})

test('Checker Game 5 moves', async ({ page }) => {
  await page.goto('https://www.gamesforthebrain.com/game/checkers/');
  
  await confirm_ready(page);
  
  await move_a_piece(page,"space42","space33");
  await move_a_piece(page,"space31","space42");
  await move_a_piece(page,"space62","space53");
  await move_a_piece(page,"space71","space53");
  await move_a_piece(page,"space51","space62");

  await page.getByText("Restart...").click();

  await confirm_ready(page);
});

async function confirm_ready(page:Page){
    let startingInstruction = 'Select an orange piece to move.';
    let messageInstruction = page.locator('#message');
    await expect(messageInstruction).toContainText(startingInstruction);
}

async function move_a_piece(page:Page, originalSquare:String, newSquare:String){
    let originalSquareLocator = page.locator(`[name=${originalSquare}]`);
    let newSquareLocator = page.locator(`[name=${newSquare}]`);
    let makeAMoveText = 'Make a move.';
    let testerActiveSqSrcAttr = 'you2.gif';
    let messageInstruction = page.locator('#message');
    let blankGraySqSrcAttr = 'https://www.gamesforthebrain.com/game/checkers/gray.gif';
          
    await expect(async () => {
        const actionabilityExpect = expect.configure({ timeout: 250 });
        await originalSquareLocator.click();
        await actionabilityExpect (originalSquareLocator).toHaveAttribute('src',testerActiveSqSrcAttr);
        }).toPass({intervals: [250, 250, 500]});      
    await expect (originalSquareLocator).toHaveAttribute('src',testerActiveSqSrcAttr);
    await newSquareLocator.click();
    await expect (originalSquareLocator).toHaveAttribute('src',blankGraySqSrcAttr);
    await expect(messageInstruction).toContainText(makeAMoveText);
};

})