import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const classList: ('main' | 'footer')[] = ['main', 'footer'];

for (const className of classList) {
    test(`Check ${className} hidden when no todos from start`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
        expect(await angularHomepage.checkPresenceOfClass(className)).toBe(false);
    });
}

test('Check main and footer after deleting one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo('Lorem');
    await angularHomepage.deleteTodosByText('Lorem');
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('main')).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('footer')).toBe(false);
});

test('Check main and footer after deleting two todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Lorem');
    await angularHomepage.deleteTodosByText(['Lorem1', 'Lorem2']);
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('main')).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('footer')).toBe(false);
});

test('Check main and footer after deleting five todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, 'Lorem');
    await angularHomepage.deleteTodosByText(['Lorem1', 'Lorem2', 'Lorem3', 'Lorem4', 'Lorem5']);
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('main')).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass('footer')).toBe(false);
});
