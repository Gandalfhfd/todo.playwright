import { test, expect } from '@playwright/test';
import {ToDo} from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Create new todo', async ({ page }) => {
    const toDo = new ToDo(page);
    await toDo.AddNewTodo("Lorem");
})
