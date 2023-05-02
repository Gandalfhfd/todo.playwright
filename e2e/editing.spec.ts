import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const changeSavingMethod: string[] = ['pressing enter key', 'blurring input textbox'];
for (const i in changeSavingMethod) {
    test(`Editing - saving changes by ${changeSavingMethod[i]}`, async ({ page }) => {
        const method: ('enter' | 'blur')[] = ['enter', 'blur'];
        const angularHomepage = new AngularHomepage(page);

    let oldText: string = 'example';
    let newText: string = 'Ipsum';
        const oldText: string = 'Lorem';
        const newText: string = 'Ipsum';

        // Create new todo and edit it, saving by pressing enter key.
        await angularHomepage.addNewTodo(oldText);
        await angularHomepage.editTodo(oldText, newText, method[i]);

        // Verify that the todo's text is what we expect.
        await expect(await angularHomepage.locateTodoBySubstring(newText)).toBeVisible({ timeout: 3000, visible: true });

        // Verify that the editing class has been removed.
        expect(await angularHomepage.checkPresenceOfClass('editing')).toBe(false);
    });
}

for (const description of ['no', 'some']) {
    test(`Make ${description} changes to the todo and discard edit`, async ({ page }) => {
        const todoName: string[] = ['Lorem', 'Ipsum'];
        const angularHomepage = new AngularHomepage(page);

        await angularHomepage.addNewTodo(todoName[0]);
        await angularHomepage.editTodo(todoName[0], (description === 'no' ? todoName[0] : todoName[1]), 'escape');

        await expect(await angularHomepage.locateTodoBySubstring(todoName[0])).toBeVisible({ timeout: 3000, visible: true });
    });
}

const descriptionOfReplacementText: string[] = ['nothing,', 'whitespace only,'];
const replacementText: string[] = ['', '\x09\x20']; // \x09 is a tab, \x20 is a space
for (const i in descriptionOfReplacementText) {
    test(`Destroy todo by replacing text with ${descriptionOfReplacementText[i]}
        then saving by pressing the enter button`, async ({ page }) => {
        const angularHomepage = new AngularHomepage(page);
        const oldText: string = 'Lorem';

        await angularHomepage.addNewTodo(oldText);
        await angularHomepage.editTodo(oldText, replacementText[i], 'enter');

        expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    });
}

test('Enable editing inputs', async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    const oldText: string = 'Lorem';

    await angularHomepage.addNewTodo(oldText);
    await angularHomepage.enterEditMode(oldText);

    // Check certain elements have been hidden.
    expect(await angularHomepage.returnCompletedCheckboxLocator()).toBeVisible({ timeout: 3000, visible: false });
    expect(await angularHomepage.returnDeleteButtonLocator()).toBeVisible({ timeout: 3000, visible: false });

    // Get the input box locator.
    const inputBox = await angularHomepage.getInputBox(oldText);
    // Check the input box is focussed.
    await expect(inputBox).toBeFocused({ timeout: 3000 });
});

const whitespacePosition: ('leading' | 'trailing' | 'leading and trailing')[] = ['leading', 'trailing', 'leading and trailing'];
const whitespaceType: string[] = ['tabs', 'spaces', 'tabs and spaces'];
const whitespace: string[] = ['\x09', '\x20\x20\x20', '\x09\x20\x09\x20']; // \x09 is a tab, \x20 is a space

// Iterate through the places where whitespace could be added.
for (const position of whitespacePosition) {
    // Iterate through the types of whitespace we are adding.
    for (const i in whitespaceType) {
        test(`Remove ${position} ${whitespaceType[i]} on save`, async ({ page }) => {
            let newTextWithWhitespace: string;
            const oldText: string = 'Lorem';
            const newText: string = 'Ipsum';

            const angularHomepage = new AngularHomepage(page);
            // Create todo which we will later add whitespace to.
            await angularHomepage.addNewTodo(oldText);

            // Decide where to put the whitespace and construct the text of the todo.
            switch (position) {
                case 'leading':
                    newTextWithWhitespace = whitespace[i] + newText;
                    break;
                case 'trailing':
                    newTextWithWhitespace = newText + whitespace[i];
                    break;
                case 'leading and trailing':
                    newTextWithWhitespace = whitespace[i] + newText + whitespace[i];
                    break;
            }
            
            await angularHomepage.editTodo(oldText, newTextWithWhitespace, 'blur');

            // Check that the leading and/or trailing whitespace has been removed when not in editing mode.
            expect(await angularHomepage.checkTodoPresentByTextAndIsTrimmed(newTextWithWhitespace)).toBe(true);
            // Check that the leading and/or trailing whitespace has been removed when in editing mode.
            expect(await angularHomepage.checkTodoTrimmedInEditMode(newText)).toBe(true);
        });
    }
}
