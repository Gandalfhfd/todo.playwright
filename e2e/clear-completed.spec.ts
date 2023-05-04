import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

test('Clear one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Lorem');
    await angularHomepage.markAsCompletedByText('Lorem');
    await angularHomepage.clearCompleted();
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
});

test('Clear multiple todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, 'Lorem');
    await angularHomepage.markAsCompletedByText(['Lorem2', 'Lorem3']);
    await angularHomepage.clearCompleted();
    await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Lorem2')).toBeVisible({ visible: false });
    await expect(await angularHomepage.locateTodoBySubstring('Lorem3')).toBeVisible({ visible: false });
});
