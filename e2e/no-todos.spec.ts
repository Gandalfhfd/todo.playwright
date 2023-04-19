import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Check main hidden when no todos from start', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("main")).toBe(false);
});

test('Check footer hidden when no todos from start', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("footer")).toBe(false);
});
