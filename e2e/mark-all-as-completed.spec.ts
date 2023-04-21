import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Mark all two todos as complete', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, "Example");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodosCompletedByText(["Example1", "Example2"])).toBe(true);
});

test('Mark all five todos as complete', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, "Example");
    await angularHomepage.markAsCompletedByText(["Example2", "Example4"]);
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodosCompletedByText(["Example1", "Example2", "Example3", "Example4", "Example5"])).toBe(true);
});

test('Toggle state of one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addNewTodo("Example");
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodosCompletedByText("Example")).toBe(true);
});

test('Toggle state of three todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, "Example");
    await angularHomepage.markAsCompletedByText(["Example1", "Example2", "Example3"]);
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodosActiveByText(["Example1", "Example2", "Example3"])).toBe(true);
});

test('Toggle state of five todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, "Example");
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodosCompletedByText(["Example1", "Example2", "Example3", "Example4", "Example5"])).toBe(true);
});

test('Clear checked state', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, "Example");
    await angularHomepage.clickToggleAll();
    await angularHomepage.clearCompleted();
    await angularHomepage.addNewTodo("Example");
    expect(await angularHomepage.isToggleAllChecked()).toBe(false);
});
