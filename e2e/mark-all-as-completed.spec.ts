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
    expect(await angularHomepage.checkTodoCompletedByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoCompletedByText("Example2")).toBe(true);
})

test('Mark all five todos as complete', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, "Example");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.markAsCompletedByText("Example4");
    await angularHomepage.clickToggleAll();
    let todoTextArray: string[] = new Array("Example1", "Example2", "Example3", "Example4", "Example5");
    expect(await angularHomepage.checkMultipleTodosCompletedByText(todoTextArray)).toBe(true);
})

test('Toggle state of one todo', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addOneTodo("Example");
    await angularHomepage.clickToggleAll();
    expect(await angularHomepage.checkTodoCompletedByText("Example")).toBe(true);
})

test('Toggle state of three todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, "Example");
    await angularHomepage.markAsCompletedByText("Example1");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.markAsCompletedByText("Example3");
    await angularHomepage.clickToggleAll();
    let todoTextArray: string[] = new Array("Example1", "Example2", "Example3");
    expect(await angularHomepage.checkMultipleTodosActiveByText(todoTextArray)).toBe(true);
})

test('Toggle state of five todos', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(5, "Example");
    await angularHomepage.clickToggleAll();
    let todoTextArray: string[] = new Array("Example1", "Example2", "Example3", "Example4", "Example5");
    expect(await angularHomepage.checkMultipleTodosCompletedByText(todoTextArray)).toBe(true);
})

test('Clear checked state', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(3, "Example");
    await angularHomepage.clickToggleAll();
    await angularHomepage.clearCompleted();
    await angularHomepage.addOneTodo("Example");
    expect(await angularHomepage.isToggleAllChecked()).toBe(false);
})