import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';
import { MyHelpers } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const numberOfTodosBeingMarkedAsComplete: number[] = [2, 5];
for (const num of numberOfTodosBeingMarkedAsComplete) {
    test(`Mark all ${num} todos as complete`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        const myHelpers = new MyHelpers();
        await angularHomepage.addMultipleTodos(num, 'Lorem');
        await angularHomepage.markAsCompletedByText('Lorem1');
        await angularHomepage.clickToggleAll();
        const todos: string[] = await myHelpers.createArrayOfStrings(num, 'Lorem');
        expect.soft(await angularHomepage.checkTodosCompletedByText(todos)).toBe(true);
    });
}

const numberOfTodosBeingToggled: number[] = [1, 3, 5];
for (const num of numberOfTodosBeingToggled) {
    test(`Toggle state of ${num} uncompleted todos`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        const myHelpers = new MyHelpers();
        await angularHomepage.addMultipleTodos(num, 'Lorem'); // All are marked as active.
        await angularHomepage.clickToggleAll(); // All are marked as complete.
        const todos: string[] = await myHelpers.createArrayOfStrings(num, 'Lorem');
        expect(await angularHomepage.checkTodosCompletedByText(todos)).toBe(true);
    });

    test(`Toggle state of ${num} completed todos`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        const myHelpers = new MyHelpers();
        await angularHomepage.addMultipleTodos(num, 'Lorem'); // All are marked as active.
        const todos: string[] = await myHelpers.createArrayOfStrings(num, 'Lorem');
        await angularHomepage.markAsCompletedByText(todos); // All are marked as complete.
        await angularHomepage.clickToggleAll(); // All are marked as active.
        expect(await angularHomepage.checkTodosActiveByText(todos)).toBe(true);
    });
}

test('Clear checked state', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, 'Lorem');
    await angularHomepage.clickToggleAll();
    await angularHomepage.clearCompleted();
    await angularHomepage.addNewTodo('Lorem');
    expect(await angularHomepage.isToggleAllChecked()).toBe(false);
});
