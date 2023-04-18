import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Edit todo and save using blur', async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    // Exit the input box by blurring it.
    await angularHomepage.EditTodo(text, 'Ipsum', 'blur');

    expect(await angularHomepage.checkTodoPresentByText('Ipsum'));
})

test('Edit todo and save using enter', async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    // Exit the input box by pressing the enter key.
    await angularHomepage.EditTodo(text, 'Ipsum', 'enter');

    expect(await angularHomepage.checkTodoPresentByText('Ipsum'));
})

test('Edit todo and discard changes', async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, 'Ipsum', 'escape');

    expect(await angularHomepage.checkTodoPresentByText('egrfhtg'));
})

test("Edit todo, don't change anything and discard edit", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, 'Ipsum', 'escape');

    expect(await angularHomepage.checkTodoPresentByText(text));
})

test("Destroy todo by removing text then saving by blurring the input textbox", async ({ page }) => {     
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, '', 'blur');
})

test("Destroy todo by removing all non-whitespace, then saving by blurring the input textbox", async ({ page }) => {     
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, '  	    ', 'blur');
})

test("Destroy todo by removing text then saving by pressing escape", async ({ page }) => {     
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, '', 'escape');
})

test("Destroy todo by removing all non-whitespace, then saving by pressing escape", async ({ page }) => {     
    const angularHomepage = new AngularHomepage(page);
    let text: string = "Lorem";

    await angularHomepage.AddNewTodo(text);
    await angularHomepage.EditTodo(text, '  	    ', 'escape');
})

// CLEAR

test('Clear one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
    await angularHomepage.addOneTodo("Example");
    await angularHomepage.markAsCompletedByText("Example");
    await angularHomepage.clearCompleted();
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
})

test('Clear multiple todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.addOneTodo("Example3");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.markAsCompletedByText("Example3");
    await angularHomepage.clearCompleted();
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
})

// ROUTING

test('Changing route to all in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
    //await page.waitForTimeout(5000);
    expect(await angularHomepage.allFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to active in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/active');
    expect(await angularHomepage.activeFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(false);
})

test('Changing route to completed in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/completed');
    expect(await angularHomepage.completedFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to all with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("all");
    expect(await angularHomepage.allFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to active with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("active");
    expect(await angularHomepage.activeFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(false);
})

test('Changing route to completed with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("completed");
    expect(await angularHomepage.completedFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})
