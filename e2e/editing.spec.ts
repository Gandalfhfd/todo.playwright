import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test("Editing - saving changes by pressing enter key", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newText: string = "Ipsum";

    // Create new todo and edit it, saving by pressing enter key.
    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newText, 'enter');

    // Verify that the todo's text is what we expect.
    expect(await angularHomepage.checkTodoPresentByText(newText)).toBe(true);

    // Verify that the editing class has been removed.
    expect(await angularHomepage.checkPresenceOfClass("editing")).toBe(false);
})

test("Editing - saving changes by blurring input textbox", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newText: string = "Ipsum";

    // Create new todo and edit it, saving by pressing enter key.
    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newText, 'blur');

    // Verify that the todo's text is what we expect.
    expect(await angularHomepage.checkTodoPresentByText(newText)).toBe(true);

    // Verify that the editing class has been removed.
    expect(await angularHomepage.checkPresenceOfClass("editing")).toBe(false);
})

test('Edit todo and discard changes', async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let oldText: string = "Lorem";
    let newText: string = 'Ipsum'

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newText, 'escape');

    expect(await angularHomepage.checkTodoPresentByText(oldText)).toBe(true);
})

test("Edit todo, don't change anything and discard edit", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let oldText: string = "Lorem";
    let newText: string = 'Ipsum'

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newText, 'escape');

    expect(await angularHomepage.checkTodoPresentByText(oldText)).toBe(true);
})

test("Destroy todo by removing text then saving by pressing the enter button", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let oldText: string = "Lorem";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, '', 'enter');

    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
})

test("Destroy todo by removing all non-whitespace, then saving by pressing the enter button", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let oldText: string = "Lorem";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, '  	    ', 'enter');

    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
})

test("Enable editing inputs", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);
    let oldText: string = "Lorem";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EnterEditMode(oldText);

    // Check certain elements have been hidden.
    expect(await angularHomepage.checkCompletedCheckboxIsClickable()).toBe(false);
    expect(await angularHomepage.checkDeleteTodoButtonIsClickable()).toBe(false);

    // Get the input box locator.
    const inputBox = await angularHomepage.getInputBox(oldText);
    // Check the input box is focussed.
    await expect(inputBox).toBeFocused({ timeout: 3000 });
})

test("Remove leading spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "   Ipsum";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove leading tabs on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "		Ipsum";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove leading tabs and spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = " 	 	Ipsum";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove trailing spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "Ipsum   ";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})



test("Remove trailing tabs on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "Ipsum		";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove trailing tabs and spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "Ipsum 	 	";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove leading and trailing spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "   Ipsum   ";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove leading and trailing tabs on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = "		Ipsum		";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})

test("Remove leading and trailing tabs and spaces on save", async ({ page }) => {
    const angularHomepage = new AngularHomepage(page);

    let oldText: string = "Lorem";
    let newTextWithWhitespace: string = " 	 	Ipsum 	 	";
    let newTextWithoutWhitespace: string = "Ipsum";

    await angularHomepage.AddNewTodo(oldText);
    await angularHomepage.EditTodo(oldText, newTextWithWhitespace, 'blur');

    // Check that the leading whitespace has been removed when not in editing mode.
    expect(await angularHomepage.checkTodoPresentByTextExact(newTextWithWhitespace)).toBe(true);
    // Check that the leading whitespace has been removed when in editing mode.
    expect(await angularHomepage.checkTodoTrimmedInEditMode(newTextWithoutWhitespace)).toBe(true);
})
