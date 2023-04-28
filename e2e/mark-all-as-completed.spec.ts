import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const numberOfTodosBeingMarkedAsComplete: number[] = [2, 5];
for (const num of numberOfTodosBeingMarkedAsComplete) {
    test(`Mark all ${num} todos as complete`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        const todos: string[] = await angularHomepage.createArrayOfEnumeratedStrings(num, 'Example');
        await angularHomepage.addMultipleTodos(num, 'Example');
        await angularHomepage.markAsCompletedByText('Example1');
        await angularHomepage.clickToggleAll();
        console.log(todos);
        expect.soft(await angularHomepage.checkTodosCompletedByText(todos)).toBe(true);
    });
}

const numberOfTodosBeingToggled: number[] = [1, 3, 5];
for (const num of numberOfTodosBeingToggled) {
    test(`Toggle state of ${num} uncompleted todos`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        const todos: string[] = await angularHomepage.createArrayOfEnumeratedStrings(num, 'Example');
        await angularHomepage.addMultipleTodos(num, 'Example'); // All are marked as active.
        await angularHomepage.clickToggleAll(); // All are marked as complete.
        expect(await angularHomepage.checkTodosCompletedByText(todos)).toBe(true);

        test(`Toggle state of ${num} completed todos`, async ({ page }) => {
            const angularHomepage: AngularHomepage = new AngularHomepage(page);
            const todos: string[] = await angularHomepage.createArrayOfEnumeratedStrings(num, 'Example');
            await angularHomepage.addMultipleTodos(num, 'Example'); // All are marked as active.
            await angularHomepage.markAsCompletedByText(todos); // All are marked as complete.
            await angularHomepage.clickToggleAll(); // All are marked as active.
            expect(await angularHomepage.checkTodosActiveByText(todos)).toBe(true);
        });
    });
}

test('Clear checked state', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, 'Example');
    await angularHomepage.clickToggleAll();
    await angularHomepage.clearCompleted();
    await angularHomepage.addNewTodo('Example');
    expect(await angularHomepage.isToggleAllChecked()).toBe(false);
});
