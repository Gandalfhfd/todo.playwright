import { test, expect } from '@playwright/test';
import {AngularHomepage} from '../POM/todo-angular-ts';

let lorem: string = 'Lorem';  

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
    const toDo = new AngularHomepage(page);
    await toDo.addNewTodo(lorem);
});

test('Mark todo as complete', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.markAsCompletedByText(lorem);
    expect(await toDo.checkTodosCompletedByText(lorem)).toBe(true);
});

test('Enable editing mode', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.enterEditMode(lorem);
    await page.getByRole('listitem').getByRole('textbox').fill('test');
    expect(await toDo.checkTodoBeingEditedByText('test')).toBe(true);
});

test('Remove button shows on hover', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.hoverOverTodoByText(lorem);
    await expect(page.getByRole('button', { name: '×' })).toBeVisible();    
});
