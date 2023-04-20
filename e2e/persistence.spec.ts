import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Check editing mode isn\'t persisted on reload', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo("Example");
    await angularHomepage.enterEditMode("Example");
    page.reload();
    expect(await angularHomepage.checkTodoBeingEditedByText("Example")).toBe(false);
})

test('Check todos are stored with correct keys', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    // let storage = await page.context().storageState({path: "localStorage"});
    await angularHomepage.addNewTodo("Lorem");
    
    // Get the overall storage state of the browser.
    let storageState = await page.context().storageState();
    // Get the local storage.
    let localStorage = await storageState.origins[0].localStorage[0];
    // Find the value which should correspond to the todo we just added.
    let storedTodo: string = localStorage.value;
    console.log(storedTodo);

})
