import { Locator, Page } from '@playwright/test';
import { MyHelpers } from '../utils/helpers';

// Is the format of the browser's localStorage.
export interface LocalStorage {
    readonly name: string;
    readonly value: string;
}

export class AngularHomepage {
    private readonly page: Page;
    private readonly newTodo: Locator;
    private readonly entrybox: Locator;
    private readonly clearCompletedButton: Locator;
    private readonly allFilter: Locator;
    private readonly activeFilter: Locator;
    private readonly completedFilter: Locator;
    private readonly toggleAll: Locator;
    private readonly lastTodo: Locator;
    private readonly activeEntryBox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.locator('input[ng-model="newTodo"]');
        this.entrybox = page.getByPlaceholder('What needs to be done?');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
        this.allFilter = page.getByRole('link', { name: 'All' });
        this.activeFilter = page.getByRole('link', { name: 'Active' });
        this.completedFilter = page.getByRole('link', { name: 'Completed' });
        this.toggleAll = page.getByText('Mark all as complete');
        this.lastTodo = page.getByRole('listitem').locator('label').last();
        this.activeEntryBox = page.getByRole('listitem').getByRole('textbox');
    }

    /**
     * Create a new todo with the specified text.
     * @param text The text that the new todo will contain.
     */
    async addNewTodo(text: string): Promise<void> {
        await this.newTodo.fill(text);
        await this.newTodo.press('Enter');
    }

    /**
     * Edit a todo matching the given text, changing the text to a new value, before exiting edit mode with the specified method.
     * @param oldText The unique text with which to locate a todo.
     * @param newText The text to enter into the todo after clearing the old text.
     * @param saveMethod The method by which to exit edit mode.
     */
    async editTodo(oldText: string, newText: string, saveMethod: ('blur' | 'enter' | 'escape')): Promise<void> {
        await this.enterEditMode(oldText);

        await this.page.getByRole('listitem').filter({ hasText: oldText }).getByRole('textbox').fill(newText);

        switch (saveMethod) {
            case 'blur':
                await this.page.getByRole('listitem').filter({ hasText: newText }).getByRole('textbox').blur();
                break;
            case 'enter':
                await this.page.keyboard.press('Enter');
                break;
            case 'escape':
                await this.page.keyboard.press('Escape');
                break;
        }
    }

    /**
     * Enter edit mode on the todo containing the specified text.
     * @param oldText The unique text with which to locate a todo.
     */
    async enterEditMode(oldText: string): Promise<void> {
        await this.page.getByText(oldText).dblclick();
    }

    /**
     * Add a specified number of todos with names of the format baseText followed by a sequence number between 1 and count.
     * @param count The number of todos to create.
     * @param baseText The text each todo should contain before its sequence number.
     * @param enumerateTodos optional flag to disable todo string enumeration
     */
    async addMultipleTodos(count: number, baseText: string, enumerateTodos?: boolean): Promise<void> {
        const myHelpers = new MyHelpers();
        const todoNames = await myHelpers.createArrayOfEnumeratedStrings(count, baseText, enumerateTodos);
        for (let i = 0; i < count; i++) {
                await this.entrybox.type(todoNames[i]);
                await this.entrybox.press('Enter');            
        }
    }

    /**
     * Mark the todo containing the specified text as completed, checking it has succeeded.
     * @param text The unique text with which to locate a todo.
     */
    async markAsCompletedByText(text: string | string[]): Promise<void> {
        if (typeof (text) === "string") {
            text = Array(text);
        }
        for (const t of text) {
            await this.page.getByRole('listitem').filter({ hasText: t }).getByRole('checkbox').check();
        }
    }

    /**
     * Toggle the completed state of the todo containing the specified text. Performs no checks afterwards.
     * @param text The unique text with which to locate a todo.
     */
    async toggleCompletedByText(text: string): Promise<void> {
        await this.page.getByRole('listitem').filter({ hasText: text }).getByRole('checkbox').click();
    }

    /**
     * Click the Toggle All checkbox.
     */
    async clickToggleAll(): Promise<void> {
        await this.toggleAll.click();
    }

    /**
     * Click the Clear Completed button.
     */
    async clearCompleted(): Promise<void> {
        await this.clearCompletedButton.click();
    }

    /**
     * Check that the specified filter has been applied to the todos.
     * @param filter The name of the filter to check.
     * @returns true if the specified filter is selected, false otherwise.
     */
    async checkFilterSelected(filter: ('all' | 'active' | 'completed')): Promise<boolean> {
        switch (filter) {
            case 'all':
                return (await this.allFilter.getAttribute('class') === 'selected');
            case 'active':
                return (await this.activeFilter.getAttribute('class') === 'selected');
            case 'completed':
                return (await this.completedFilter.getAttribute('class') === 'selected');
        }
    }

    /**
     * Locate a todo using text. Looks for a substring.
     * @param text The unique text with which to locate a todo.
     * @returns locator of todo.
     */
    async locateTodoBySubstring(text: string): Promise<Locator> {
        return this.page.getByRole('listitem').filter({ hasText: text });
    }

    /**
     * Check that a todo with the specified text, which has neither leading nor
     * trailing whitespace is present on the page.
     * @param text The unique text with which to locate a todo.
     * @returns true if a matching todo is found.
     */
    async checkTodoPresentByTextAndIsTrimmed(text: string): Promise<boolean> {
        const myHelpers = new MyHelpers();
        try {
            let todoText: string = await this.page.getByRole('listitem').filter({ hasText: text }).innerText();
            return myHelpers.checkStringHasBeenTrimmed(todoText);
        } catch (error) {
            return false;
        }
    }

    /**
     * Enter edit mode for a specified todo and check that the text there has been trimmed.
     * @param text The unique text with which to locate a todo.
     * @returns true if the text in edit mode has been trimmed.
     */
    async checkTodoTrimmedInEditMode(text: string): Promise<boolean> {
        this.enterEditMode(text);
        // Get text from the edit mode input box.
        let inputBox = await this.getInputBox(text);
        let editingModeText: string = await inputBox.inputValue();

        const myHelpers = new MyHelpers();
        return myHelpers.checkStringHasBeenTrimmed(editingModeText);
    }

    /**
     * Checks if there is one or more todo on the page.
     * @returns true if at least one todo is present.
     */
    async checkAnyTodosPresent(): Promise<boolean> {
        try {
            let _ = await this.page.locator('.view').isEnabled();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Returns the locator of the completed checkbox
     * @remarks does not work with multiple todos
     * @returns the locator of the completed checkbox
     */
    async returnCompletedCheckboxLocator(): Promise<Locator> {
        return this.page.locator("[ng-model='todo.completed']");
    }

    /**
     * Returns the locator of the delete button
     * @remarks does not work with multiple todos
     * @returns the locator of the completed checkbox
     */
    async returnDeleteButtonLocator(): Promise<Locator> {
        return this.page.locator("[ng-click='vm.removeTodo(todo)']");
    }

    /**
     * Delete all todos matching text.
     * @param text The unique text with which to locate todos.
     */
    async deleteTodosByText(text: string | string[]): Promise<void> {
        if (typeof text === "string") {
            text = Array(text);
        }
        for (const t of text) {
            let targetTodo: Locator = this.page.getByRole('listitem').filter({ hasText: t });
            await targetTodo.hover();
            await targetTodo.getByRole('button', { name: '×' }).click();
        }
    }

    /**
     * Get the edit mode input box of a todo containing the specified text.
     * @param text The unique text with which to locate a todo.
     * @returns a locator for the edit mode input box of the matching todo.
     */
    async getInputBox(text: string): Promise<Locator> {
        return this.page.getByRole('listitem').filter({ hasText: text }).getByRole('textbox');
    }

    /**
     * Apply the specified filter to the todos on the page by clicking the matching button.
     * @param filter The name of the filter to apply.
     */
    async filterByButton(filter: ('all' | 'active' | 'completed')): Promise<void> {
        switch (filter) {
            case 'all':
                await this.allFilter.click();
                break;
            case 'active':
                await this.activeFilter.click();
                break;
            case 'completed':
                await this.completedFilter.click();
                break;
        }
    }

    /**
     * Attempt to click on the input class locator, failing after 3s if it is not present.
     * @param className Name of class to check for, without a leading full stop.
     * @returns true if the class is present on the page, false otherwise.
     */
    async checkPresenceOfClass(className: string): Promise<boolean> {
        try {
            let _ = await this.page.locator("." + className).click();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Use the input text to find a todo. Check whether that todo is being edited.
     * @param text The text used to match the todo
     * @returns true if the todo matching the specified text is being edited, and false otherwise
     */
    async checkTodoBeingEditedByText(text: string): Promise<boolean> {
        let state: string = await this.page.getByRole('listitem').filter({ hasText: text }).getAttribute('class') ?? 'Not Found';
        if (state.includes('editing')) {
            return true
        } else {
            return false;
        }
    }

    /**
     * Check whether all matching todos are marked as Completed.
     * @param text The text used to match the todo.
     * @returns true if all todos matching the text are Completed, and false otherwise.
     */
    async checkTodosCompletedByText(text: string | string[]): Promise<boolean> {
        if (typeof (text) === 'string') {
            text = Array(text);
        }
        for (const t of text) {
            let state: string = await this.page.getByRole('listitem').filter({ hasText: t }).getAttribute('class') ?? 'Not Found';
            if (state.includes('completed') === false) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check whether all todos in an array are marked as Active.
     * @param text The text used to match the todo.
     * @returns true if all todos matching the text in the textList are Active, and false otherwise.
     */
    async checkTodosActiveByText(text: string | string[]): Promise<boolean> {
        if (typeof (text) === 'string') {
            text = Array(text);
        }
        for (const t of text) {
            let state: string = await this.page.getByRole('listitem').filter({ hasText: t }).getAttribute('class') ?? 'Not Found';
            if (state.includes('completed') === true) {
                return false;
            }
        }
        return true;
    }

    /**
     * Call the isChecked() method on the toggle all checkbox.
     * @returns a boolean describing the checked state of the toggle all checkbox.
     */
    async isToggleAllChecked(): Promise<boolean> {
        return await this.toggleAll.isChecked();
    }

    /**
     * Adds a new todo and checks if it's appended to the todo list
     * @param example string that is used to add a new item to todo list
     * @returns true if the last item added to the list matches example 
     */
    async checkTodoAppendedToList(example: string): Promise<boolean> {
        const todoText = await this.lastTodo.textContent();
        return (todoText === example);
    }

    /**
     * Checks if input box is empty
     * @returns true if the inputValue inside the input box contains an empty string
     */
    async checkInputBoxEmpty(): Promise<boolean> {
        return (await this.entrybox.inputValue() === '');
    }

    /**
     * Types in the input box
     * @param example string that is being typed into the input box
     */
    async typeInInputBox(example: string): Promise<void> {
        await this.newTodo.type(example);
    }

    /**
     * @returns locator of the last item from todo list
     */
    async getLastItemFromList(): Promise<Locator> {
        return this.lastTodo;
    }

    /**
     * @returns the entry box locator 
     */
    async getEntryBox(): Promise<Locator> {
        return this.entrybox;
    }

    /**
     * Capture localStorage of the browser and return it.
     * @returns localStorage of the browser. Uses the localStorage interface I created.
     */
    async getLocalStorage(): Promise<LocalStorage> {
        // Get the storage state of the browser.
        let storageState = await this.page.context().storageState();
        // Extract just the local storage and store it as the interface localStorage.
        let myLocalStorage: LocalStorage = storageState.origins[0].localStorage[0];

        return myLocalStorage;
    }

    /**
     * Hover over a specific todo
     * @param nameOfTodo specifies the todo list item
     */
    async hoverOverTodoByText(nameOfTodo: string): Promise<void> {
        await (await this.locateTodoBySubstring(nameOfTodo)).hover();
    }

    /**
    * Fill the input box with a string, without appending to the todo list
    * @param example the string that the entry box will be filled with
    */
    async fillActiveEntryBox(example: string): Promise<void> {
        this.activeEntryBox.fill(example);
    }
}
