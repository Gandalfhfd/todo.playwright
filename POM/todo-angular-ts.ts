import { Locator, Page } from '@playwright/test';

export class ToDo {
    private readonly page: Page;
    private readonly newTodo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newTodo = page.locator('input[ng-model="newTodo"]');
    }

    async AddNewTodo(text: string) {
        await this.newTodo.fill(text);
        await this.newTodo.press('Enter');
    }

    async EditTodo(oldText: string, newText: string, saveMethod: string) {
        // Find some way of separating the locators
        
        await this.page.getByText(oldText).dblclick();
        await this.page.getByRole('listitem').filter({ hasText: oldText }).getByRole('textbox').fill(newText);

        switch ( saveMethod) {
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
                await this.page.keyboard.press('Enter');
                break;
        }
    }

    // Capture value of nth item

}
