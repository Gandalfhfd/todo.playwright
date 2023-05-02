import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

let exampleText: string = 'example';  

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
    const toDo = new AngularHomepage(page);
    await toDo.addNewTodo(exampleText);
});

test('Mark todo as complete', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.markAsCompletedByText(exampleText);
    expect(await toDo.checkTodosCompletedByText(exampleText)).toBe(true);
});

test('Enable editing mode', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.enterEditMode(exampleText);
    await toDo.fillActiveEntryBox('test');
    expect(await toDo.checkTodoBeingEditedByText('test')).toBe(true);
});

test('Remove button shows on hover', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.hoverOverTodoByText(exampleText);
    await expect(page.getByRole('button', { name: '×' })).toBeVisible();
});
