import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Changing route to all in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
    //await page.waitForTimeout(5000);
    expect(await angularHomepage.checkFilterSelected('all')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: true });
})

test('Changing route to active in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await page.goto('https://todomvc.com/examples/typescript-angular/#/active');
    expect(await angularHomepage.checkFilterSelected('active')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: false });
})

test('Changing route to completed in URL', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await page.goto('https://todomvc.com/examples/typescript-angular/#/completed');
    expect(await angularHomepage.checkFilterSelected('completed')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: false });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: true });
})

test('Changing route to all with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.filterByButton('all');
    expect(await angularHomepage.checkFilterSelected('all')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: true });
})

test('Changing route to active with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.filterByButton('active');
    expect(await angularHomepage.checkFilterSelected('active')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: false });
})

test('Changing route to completed with button', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.filterByButton('completed');
    expect(await angularHomepage.checkFilterSelected('completed')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: false });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: true });
})

test('Update active todo state when filtering by all', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    await angularHomepage.filterByButton('all');
    await angularHomepage.markAsCompletedByText('Example1');
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    expect(await angularHomepage.checkTodoCompletedByText('Example1')).toBe(true);
})

test('Update active todo state when filtering by active', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    await angularHomepage.filterByButton('active');
    await angularHomepage.toggleCompletedByText('Example1');
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: false });
})

test('Update completed todo state when filtering by all', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    await angularHomepage.markAsCompletedByText('Example1');
    await angularHomepage.filterByButton('all');
    await angularHomepage.toggleCompletedByText('Example1');
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    expect(await angularHomepage.checkTodoCompletedByText('Example1')).toBe(false);
})

test('Update completed todo state when filtering by completed', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Example1');
    await angularHomepage.markAsCompletedByText('Example1');
    await angularHomepage.filterByButton('completed');
    await angularHomepage.toggleCompletedByText('Example1');
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: false });
})

test('Check active filter persists on reload', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.filterByButton('active');
    await page.reload();
    expect(await angularHomepage.checkFilterSelected('active')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: false });
})