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

test('Check main and footer after deleting one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo("Example");
    await angularHomepage.deleteTodoByText("Example");
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("main")).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("footer")).toBe(false);
});

test('Check main and footer after deleting two todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, "Example");
    await angularHomepage.deleteMultipleTodosByText(Array("Example1", "Example2"));
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("main")).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("footer")).toBe(false);
});

test('Check main and footer after deleting five todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, "Example");
    await angularHomepage.deleteMultipleTodosByText(Array("Example1", "Example2", "Example3", "Example4", "Example5"));
    expect(await angularHomepage.checkAnyTodosPresent()).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("main")).toBe(false);
    expect(await angularHomepage.checkPresenceOfClass("footer")).toBe(false);
});
