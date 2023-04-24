import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Clear one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
    await angularHomepage.addNewTodo('Example');
    await angularHomepage.markAsCompletedByText('Example');
    await angularHomepage.clearCompleted();
    await expect(page.locator('body')).toHaveScreenshot('TodoBody.png');
})

test('Clear multiple todos', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
    await angularHomepage.addNewTodo('Example2');
    await angularHomepage.addNewTodo('Example3');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.markAsCompletedByText('Example3');
    await angularHomepage.clearCompleted();
    await expect(page.locator('body')).toHaveScreenshot('TodoBodyOneActive.png');
})
