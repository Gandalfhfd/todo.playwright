import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

test('Clear one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    // Take a screenshot of the page before any todos added.
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
    await angularHomepage.addNewTodo('Example');
    await angularHomepage.markAsCompletedByText('Example');
    await angularHomepage.clearCompleted();
    // Take a screenshot after all todos removed and ensure it's the same as the first one.
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
});

test('Clear multiple todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    // Take a screenshot of the page with one todo called "Example1".
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
    await angularHomepage.addNewTodo('Example2');
    await angularHomepage.addNewTodo('Example3');
    await angularHomepage.markAsCompletedByText(['Example2', 'Example3']);
    await angularHomepage.clearCompleted();
    // Take a screenshot after todos Example2 and Example3 are removed and ensure it's the same as the first one.
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
});
