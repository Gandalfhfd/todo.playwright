import { test, expect } from '@playwright/test';
import {ToDo} from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Create new todo', async ({ page }) => {
    const toDo = new ToDo(page);
    let lorem: string = "Lorem";

    await toDo.AddNewTodo(lorem);
    await toDo.AddNewTodo('Lorel');
    await toDo.EditTodo(lorem, 'Ipsum', 'escape');
})
