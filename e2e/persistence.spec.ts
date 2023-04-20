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
    await angularHomepage.addNewTodo("Lorem");

    // Find the value which should correspond to the todo we just added. In JSON format.
    let storageState = await page.context().storageState();
    let localStorage = storageState.origins[0].localStorage[0];

    let storedTodo: string = localStorage.value;

    // Convert string to JSON so that the keys can be extracted.
    let todoJSON = await JSON.parse(storedTodo);
    // Extract keys from JSON so that we can compare them to what we expect.
    let keysArray: string[] = Object.keys(todoJSON[0]);

    // We want exactly 2 keys.
    expect(keysArray.length).toEqual(2);

    expect(keysArray[0]).toEqual("title");
    expect(keysArray[1]).toEqual("completed");
})

test('localStorage', async ({ page }) =>{
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('lorem');
    expect((await page.context().storageState()).origins[0].localStorage[0].name).toContain('todos-angularjs-typescript');
})
