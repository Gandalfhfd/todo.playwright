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
    await toDo.EditTodo(lorem, 'Ipsum', 'blur');

    // Do the thing for this one to get it to find the text.
    await expect(page.getByRole('listitem').filter({ hasText: 'Ipsum' }).getByRole('textbox')).toContainText('Ipsum');
})
