import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Mark all two todos as complete', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addMultipleTodos(2, "Example")
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.markAllAsCompleted();
    expect(await angularHomepage.checkTodoCompletedByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoCompletedByText("Example2")).toBe(true);
})

test('Mark all five todos as complete', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addMultipleTodos(5, "Example")
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.markAsCompletedByText("Example4");
    await angularHomepage.markAllAsCompleted();
    let todoTextArray: string[] = new Array("Example1", "Example2", "Example3", "Example4", "Example5");
    expect(await angularHomepage.checkMulitpleTodosCompletedByText(todoTextArray)).toBe(true);
})