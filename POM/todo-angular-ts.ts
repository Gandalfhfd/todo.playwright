import { Locator, Page } from '@playwright/test';

export class ToDo {
    readonly page: Page;
    readonly newTodo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.locator('input[ng-model="newTodo"]');
    }

    async AddNewTodo(text: string) {
        await this.newTodo.fill(text);
        await this.newTodo.press('Enter');
    }

    async EditTodo(newText: string, saveMethod: string) {
        
    }

    // Create new todo with text "text"
    // Edit specified todo and exit edit mode using specified method
    // Capture value of nth item

}
