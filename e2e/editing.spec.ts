import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const changeSavingMethod: string[] = ['pressing enter key', 'blurring input textbox'];
const method: ('enter' | 'blur')[] = ['enter', 'blur'];

for (const i in changeSavingMethod) {
    test(`Editing - saving changes by ${changeSavingMethod[i]}`, async ({ page }) => {
        const angularHomepage = new AngularHomepage(page);

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

const descriptionOfChanges: string[] = ['some', 'no'];
// First element must match oldText, second must not.
const newText: string[] = ['Lorem', 'Ipsum']
for (const i in descriptionOfChanges) {
    test(`Make ${descriptionOfChanges[i]} changes to the todo and discard edit`, async ({ page }) => {
        const angularHomepage = new AngularHomepage(page);
        let oldText: string = 'Lorem';

        await angularHomepage.addNewTodo(oldText);
        await angularHomepage.editTodo(oldText, newText[i], 'escape');

        await expect(await angularHomepage.locateTodoBySubstring(oldText)).toBeVisible({ timeout: 3000, visible: true });
    });
}

const descriptionOfReplacementText: string[] = ['nothing,', 'whitespace only,'];
const replacementText: string[] = ['', '	 '];
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

const whitespacePosition: string[] = ['leading', 'trailing', 'leading and trailing'];
const descriptionOfWhitespaceType: string[] = ['tabs', 'spaces', 'tabs and spaces'];
const whitespaceType: string[] = ['		', '   ', ' 	 	'];
let newTextWithWhitespace: string;
const newTextWithoutWhitespace: string = 'Ipsum';
const oldText: string = 'Lorem';

for (const position of whitespacePosition) {
    for (const i in descriptionOfWhitespaceType) {
        test(`Remove ${position} ${descriptionOfWhitespaceType[i]} on save`, async ({ page }) => {

            if (position === 'leading') {
                newTextWithWhitespace = whitespaceType[i] + newTextWithoutWhitespace;
            } else if (position === 'trailing') {
                newTextWithWhitespace = newTextWithoutWhitespace + whitespaceType[i];
            } else if (position === 'leading and trailing') {
                newTextWithWhitespace = whitespaceType[i] + newTextWithoutWhitespace + whitespaceType[i];
            }

            const angularHomepage = new AngularHomepage(page);

            await angularHomepage.addNewTodo(oldText);
            await angularHomepage.editTodo(oldText, newTextWithWhitespace, 'blur');

            // Check that the leading whitespace has been removed when not in editing mode.
            expect(await angularHomepage.checkTodoPresentByTextAndIsTrimmed(newTextWithWhitespace)).toBe(true);
            // Check that the leading whitespace has been removed when in editing mode.
            expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
        });
    }
}
