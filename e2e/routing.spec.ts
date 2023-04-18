import { test, expect } from '@playwright/test';
import {AngularHomepage} from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
});

test('Changing route to all in URL', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
    //await page.waitForTimeout(5000);
    expect(await angularHomepage.allFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to active in URL', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/active');
    expect(await angularHomepage.activeFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(false);
})

test('Changing route to completed in URL', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await page.goto('https://todomvc.com/examples/typescript-angular/#/completed');
    expect(await angularHomepage.completedFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to all with button', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("all");
    expect(await angularHomepage.allFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Changing route to active with button', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("active");
    expect(await angularHomepage.activeFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(false);
})

test('Changing route to completed with button', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.addOneTodo("Example2");
    await angularHomepage.markAsCompletedByText("Example2");
    await angularHomepage.filterByButton("completed");
    expect(await angularHomepage.completedFilterSelected()).toBe(true);
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
    expect(await angularHomepage.checkTodoPresentByText("Example2")).toBe(true);
})

test('Update active todo state when filtering by all', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.filterByButton("all");
    await angularHomepage.markAsCompletedByText("Example1");
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoCompletedByText("Example1")).toBe(true);
})

test('Update active todo state when filtering by active', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.filterByButton("active");
    await angularHomepage.toggleCompletedByText("Example1");
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
})

test('Update completed todo state when filtering by all', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.markAsCompletedByText("Example1");
    await angularHomepage.filterByButton("all");
    await angularHomepage.toggleCompletedByText("Example1");
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(true);
    expect(await angularHomepage.checkTodoCompletedByText("Example1")).toBe(false);
})

test('Update completed todo state when filtering by completed', async ({ page }) => {
    const angularHomepage : AngularHomepage = new AngularHomepage(page)
    await angularHomepage.addOneTodo("Example1");
    await angularHomepage.markAsCompletedByText("Example1");
    await angularHomepage.filterByButton("completed");
    await angularHomepage.toggleCompletedByText("Example1");
    expect(await angularHomepage.checkTodoPresentByText("Example1")).toBe(false);
})