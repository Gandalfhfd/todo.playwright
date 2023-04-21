import { Locator, Page } from '@playwright/test';

export class AngularHomepage {
    private readonly page: Page;
    private readonly newTodo: Locator;
    private readonly entrybox: Locator;
    private readonly checkbox: Locator;
    private readonly clearCompletedButton: Locator;
    private readonly allFilter: Locator;
    private readonly activeFilter: Locator;
    private readonly completedFilter: Locator;
    private readonly toggleAll: Locator;
    private readonly listItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.locator('input[ng-model="newTodo"]');
        this.entrybox = page.getByPlaceholder('What needs to be done?');
        this.checkbox = page.locator('div').getByRole('checkbox');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
        this.allFilter = page.getByRole('link', { name: 'All' });
        this.activeFilter = page.getByRole('link', { name: 'Active' });
        this.completedFilter = page.getByRole('link', { name: 'Completed' });
        this.toggleAll = page.getByText('Mark all as complete');
        this.listItem = page.locator('body > section > section > ul > li > div > label');
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
            default:
                throw new Error("Incorrect saveMethod passed to EditTodo. saveMethod must be blur, enter or escape.");
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
     */
    async addMultipleTodos(count: number, baseText: string): Promise<void> {
        for (let i = 1; i <= count; i++) {
            await this.entrybox.type(baseText + i);
            await this.entrybox.press('Enter');
        }
    }

    /**
     * Mark the todo containing the specified text as completed, checking it has succeeded.
     * @param text The unique text with which to locate a todo.
     */
    async markAsCompletedByText(text: string): Promise<void> {
        await this.page.getByRole('listitem').filter({ hasText: text }).getByRole('checkbox').check();
    }

    /**
     * Mark the todo containing the specified text as completed, checking it has succeeded.
     * @param textList An array of unique todo content strings.
     */
    async markMultipleAsCompletedByText(textList: string[]): Promise<void> {
        for (const text of textList) {
            await this.page.getByRole('listitem').filter({ hasText: text }).getByRole('checkbox').check();
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
            default:
                throw new Error("Invalid filter passed to checkFilterSelected. Filter must be all, active or completed.");
        }
    }

    /**
     * Check that a todo with the specified text is present on the page.
     * @param text The unique text with which to locate a todo.
     * @returns true if a matching todo is found.
     */
    async checkTodoPresentByText(text: string): Promise<boolean> {
        try {
            let _ = await this.page.getByRole('listitem').filter({ hasText: text }).innerText({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check that a todo with strictly the specified text (i.e. no whitespace) is present on the page.
     * @param text The unique text with which to locate a todo.
     * @returns true if a matching todo is found.
     */
    async checkTodoPresentByTextExact(text: string): Promise<boolean> {
        try {
            let todoText: string = await this.page.getByRole('listitem').filter({ hasText: text }).innerText({ timeout: 3000 });
            return this.checkStringHasBeenTrimmed(todoText);
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

        return this.checkStringHasBeenTrimmed(editingModeText);
    }

    /**
     * Check if the input text has no leading and no trailing whitespace.
     * @param text The text to check for whitespace.
     * @returns true if the text has no surrounding whitespace.
     */
    async checkStringHasBeenTrimmed(text: string): Promise<boolean> {
        return (text === text.trim());
    }

    /**
     * Checks if there is one or more todo on the page.
     * @returns true if at least one todo is present.
     */
    async checkAnyTodosPresent(): Promise<boolean> {
        try {
            let _ = await this.page.locator('.view').isEnabled({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Returns the locator of the completed checkbox
     * Does not work with multiple todos
     * @returns the locator of the completed checkbox
     */
    async returnCompletedCheckboxLocator(): Promise<Locator> {
        return this.page.locator("[ng-model='todo.completed']");
    }

    /**
     * Returns the locator of the delete button
     * Does not work with multiple todos
     * @returns the locator of the completed checkbox
     */
    async returnDeleteButtonLocator(): Promise<Locator> {
        return this.page.locator("[ng-click='vm.removeTodo(todo)']");
    }

    /**
     * Delete a todo containing the specified text.
     * @param text The unique text with which to locate a todo.
     */
    async deleteTodoByText(text: string): Promise<void> {
        let targetTodo: Locator = this.page.getByRole('listitem').filter({ hasText: text });
        await targetTodo.hover();
        await targetTodo.getByRole('button', { name: '×' }).click();
    }

    /**
     * Delete all todos matching text in an array.
     * @param textList An array of unique todo contents.
     */
    async deleteMultipleTodosByText(textList: string[]): Promise<void> {
        for (const text of textList) {
            let targetTodo: Locator = this.page.getByRole('listitem').filter({ hasText: text });
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
            default:
                //const _exhaustiveCheck: never = filter;
                throw new Error("Invalid filter passed to filterByButton. Filter must be all, active or completed.");
        }
    }

    /**
     * Attempt to click on the input class locator, failing after 3s if it is not present.
     * @param className Name of class to check for, without a leading full stop.
     * @returns true if the class is present on the page, false otherwise.
     */
    async checkPresenceOfClass(className: string): Promise<boolean> {
        try {
            let _ = await this.page.locator("." + className).click({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Check whether a specified todo is marked as Completed.
     * @param text The unique text with which to locate a todo.
     * @returns true if the todo matching the specified text is Completed, and false otherwise.
     */
    async checkTodoCompletedByText(text: string): Promise<boolean> {
        let state: string = await this.page.getByRole('listitem').filter({ hasText: text }).getAttribute('class') ?? 'Not Found';
        if (state.includes('completed')) {
            return true
        } else {
            return false
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
     * Check whether all todos in an array are marked as Completed.
     * @param textList An array of unique todo contents.
     * @returns true if all todos matching the text in the textList are Completed, and false otherwise.
     */
    async checkMultipleTodosCompletedByText(textList: string[]): Promise<boolean> {
        for (const text of textList) {
            let state: string = await this.page.getByRole('listitem').filter({ hasText: text }).getAttribute('class') ?? 'Not Found';
            if (state.includes('completed') === false) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check whether all todos in an array are marked as Active.
     * @param textList An array of unique todo contents.
     * @returns true if all todos matching the text in the textList are Active, and false otherwise.
     */
    async checkMultipleTodosActiveByText(textList: string[]): Promise<boolean> {
        for (const text of textList) {
            let state: string = await this.page.getByRole('listitem').filter({ hasText: text }).getAttribute('class') ?? 'Not Found';
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
        await this.addNewTodo(example);
        const todoText = await this.listItem.last().textContent();

        if (todoText === example) {
            return true;
        }
        return false;
    }

    /**
     * Checks if input box is empty
     * @returns true if the inputValue inside the input box contains an empty string
     */
    async checkInputBoxEmpty(): Promise<boolean>{
        if(await this.entrybox.inputValue() === ''){
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Types in the input box
     * @param example string that is being typed into the input box
     */
    async typeInInputBox(example: string): Promise<void> {
        await this.newTodo.type(example)
    }

    /**
     * @returns locator of the last item from todo list
     */
    async getLastItemFromList(): Promise<Locator>{
        return this.listItem.last();
    }

    /**
     * @returns the entry box locator 
     */
    async getEntryBox(): Promise<Locator>{
        return this.entrybox
    }
}
