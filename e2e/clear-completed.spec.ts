import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

test('Clear one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example');
    await angularHomepage.markAsCompletedByText('Example');
    await angularHomepage.clearCompleted();
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
});

test('Clear multiple todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, 'Example');
    await angularHomepage.markAsCompletedByText(['Example2', 'Example3']);
    await angularHomepage.clearCompleted();
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: false });
    await expect(await angularHomepage.locateTodoBySubstring('Example3')).toBeVisible({ timeout: 3000, visible: false });
});
