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

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.locator('input[ng-model="newTodo"]');
        this.entrybox = page.getByPlaceholder('What needs to be done?');
        this.checkbox = page.locator('div').getByRole('checkbox');
        this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
        this.allFilter = page.getByRole('link', { name: 'All' });
        this.activeFilter = page.getByRole('link', { name: 'Active' });
        this.completedFilter = page.getByRole('link', { name: 'Completed' });
    }

    async AddNewTodo(text: string) {
        await this.newTodo.fill(text);
        await this.newTodo.press('Enter');
    }

    async EditTodo(oldText: string, newText: string, saveMethod: string): Promise<void> {
        // Enter edit mode.
        await this.page.getByText(oldText).dblclick();

        await this.page.getByRole('listitem').filter({ hasText: oldText }).getByRole('textbox').fill(newText);

        switch (saveMethod) {
            case 'blur':
                await this.page.getByRole('listitem').filter({ hasText: newText }).getByRole('textbox').blur();
                break;
            case 'enter':
                await this.page.keyboard.press('Enter');
                break;
            case 'escape':
                await this.page.keyboard.press('Escape')
                break;
            default:
                console.log("Incorrect argument passed to EditTodo method");
                await this.page.keyboard.press('Enter');
                break;
        }
    }

    async EnterEditMode(oldText: string): Promise<void> {
        await this.page.getByText(oldText).dblclick();
    }

    async addOneTodo(text: string): Promise<void> {
        await this.entrybox.type(text);
        await this.entrybox.press('Enter');
    }

    async markAsCompletedByText(text: string): Promise<void> {
        await this.page.getByRole('listitem').filter({ hasText: text }).getByRole('checkbox').check();
    }

    async clearCompleted(): Promise<void> {
        await this.clearCompletedButton.click();
    }

    async allFilterSelected(): Promise<boolean> {
        if (await this.allFilter.getAttribute('class') === 'selected') {
            return true;
        } else {
            return false;
        }
    }

    async activeFilterSelected(): Promise<boolean> {
        if (await this.activeFilter.getAttribute('class') === 'selected') {
            return true;
        } else {
            return false;
        }
    }

    async completedFilterSelected(): Promise<boolean> {
        if (await this.completedFilter.getAttribute('class') === 'selected') {
            return true;
        } else {
            return false;
        }
    }

    async checkTodoPresentByText(text: string): Promise<boolean> {
        try {
            let _ = await this.page.getByRole('listitem').filter({ hasText: text }).innerText({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkAnyTodosPresent(): Promise<boolean> {
        // Return true if any todos exist
        // Return false if no todos exist
        try {
            let _ = await this.page.locator('.view').isEnabled({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkCompletedCheckboxIsClickable(): Promise<boolean> {
        try {
            let _ = await this.page.locator("[ng-model='todo.completed']").click({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkDeleteTodoButtonIsClickable(): Promise<boolean> {
        // Will click delete button if it exists
        // Only works when there is fewer than 2 todos
        try {
            let _ = await this.page.locator("[ng-click='vm.removeTodo(todo)']").click({ timeout: 3000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getInputBox(text: string): Promise<Locator> {
        return this.page.getByRole('listitem').filter({ hasText: text }).getByRole('textbox');
    }

    async filterByButton(filter: string): Promise<void> {
        switch (filter) {
            case 'all':
                await this.allFilter.click()
                break;
            case 'active':
                await this.activeFilter.click()
                break;
            case 'completed':
                await this.completedFilter.click()
                break;
        }
    }
}
