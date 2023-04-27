import { test, expect } from '@playwright/test';
import {AngularHomepage} from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

let example: string = 'example';   

// Tests if the input element is in focus using the autofocus method
test('Check element in focus', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await expect(await toDo.getEntryBox()).toHaveAttribute('autofocus', '');
    await toDo.typeInInputBox('example');
});

// Tests if string trimming works correctly
test('Check trim is applied', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    let testData: string[] = ['test',' test','test ',' test ', 'test    '];
    for (const data of testData)
    {
        await toDo.addNewTodo(data);
        expect((await (await toDo.getLastItemFromList()).innerText()).toString()).toBe('test');
    }
});

// Tests if a newly added todo gets appended to the todo list when other todos exist
test('Creation of todo when todos exist', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    let test: string = 'test';    
    let todoNums: number[] = [1, 2, 5];

    for (const num of todoNums)
    {
        await toDo.addMultipleTodos(todoNums[num], test);
        await toDo.addNewTodo(example);
        expect(await toDo.checkTodoAppendedToList(example)).toBe(true);
        expect(await toDo.checkInputBoxEmpty()).toBe(true);
        await toDo.clickToggleAll();
        await toDo.clearCompleted();        
    }
});

// Tests if a newly added todo gets appended to the todo list when the list is empty
test('Creation of todo when todo list empty', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.addNewTodo(example);
    expect(await toDo.checkTodoAppendedToList(example)).toBe(true);
    expect(await toDo.checkInputBoxEmpty()).toBe(true);
});
