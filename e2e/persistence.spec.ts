import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Check editing mode isn\'t persisted on reload', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example");
    await angularHomepage.EnterEditMode("Example");
    page.reload();
    expect(await angularHomepage.checkTodoBeingEditedByText("Example")).toBe(false);
})