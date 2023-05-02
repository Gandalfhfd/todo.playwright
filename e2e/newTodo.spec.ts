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

const inputStrings: string[] = ['test','\x20test','test\x20','\x20test\x20', 'test\x20\x09'];     // \x09 is a tab, \x20 is a space
// Tests if string trimming works correctly with different inputs
for(const testInput of inputStrings){
    test(`Check trim is applied to ${testInput}`, async ({ page }) => {
        const toDo = new AngularHomepage(page);
        await toDo.addNewTodo(testInput);
        expect((await (await toDo.getLastItemFromList()).innerText()).toString()).toBe('test');
    });
}

const numberOfTodos: number[] = [1,2,5];
// Tests if a newly added todo gets appended to the todo list when other todos exist
for (const numb of numberOfTodos){
    test(`Creation of a todo when ${numb} todo(s) exist(s)`, async ({ page }) => {
        const toDo = new AngularHomepage(page);    
        await toDo.addMultipleTodos(numb, 'test');
        await toDo.addNewTodo(example);
        expect(await toDo.checkTodoAppendedToList(example)).toBe(true);
        expect(await toDo.checkInputBoxEmpty()).toBe(true);
    });
}

// Tests if a newly added todo gets appended to the todo list when the list is empty
test('Creation of todo when todo list empty', async ({ page }) => {
    const toDo = new AngularHomepage(page);
    await toDo.addNewTodo(example);
    expect(await toDo.checkTodoAppendedToList(example)).toBe(true);
    expect(await toDo.checkInputBoxEmpty()).toBe(true);
});
