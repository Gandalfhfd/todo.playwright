import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const filterArray: ('all' | 'active' | 'completed')[] = ['all', 'active', 'completed'];

for (const filter of filterArray) {
    test(`Changing route to ${filter} in URL`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Example');
        await angularHomepage.markAsCompletedByText('Example2');
        await page.goto('https://todomvc.com/examples/typescript-angular/#/' + (filter === 'all' ? '' : filter));
        expect.soft(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: filter === 'completed' ? false : true });
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: filter === 'active' ? false : true });
    });

    test(`Changing route to #!/${filter === 'all' ? '' : filter} in URL`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Example');
        await angularHomepage.markAsCompletedByText('Example2');
        await page.goto('https://todomvc.com/examples/typescript-angular/#!/' + (filter === 'all' ? '' : filter));
        expect.soft(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: filter === 'completed' ? false : true });
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: filter === 'active' ? false : true });
    });

    test(`Changing route to ${filter} with button`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Example');
        await angularHomepage.markAsCompletedByText('Example2');
        await angularHomepage.filterByButton(filter);
        expect.soft(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: filter === 'completed' ? false : true });
        await expect.soft(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: filter === 'active' ? false : true });
    });

    if (filter !== 'completed') {
        test(`Update active todo state when filtering by ${filter}`, async ({ page }) => {
            const angularHomepage: AngularHomepage = new AngularHomepage(page);
            await angularHomepage.addNewTodo('Example1');
            await angularHomepage.filterByButton(filter);
            // Has to be toggle here for the 'active' case.
            await angularHomepage.toggleCompletedByText('Example1');
            await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: filter === 'active' ? false : true });
            if (filter === 'all') expect.soft(await angularHomepage.checkTodosCompletedByText('Example1')).toBe(true);
        });
    }

    if (filter !== 'active') {
        test(`Update completed todo state when filtering by ${filter}`, async ({ page }) => {
            const angularHomepage: AngularHomepage = new AngularHomepage(page);
            await angularHomepage.addNewTodo('Example1');
            await angularHomepage.markAsCompletedByText('Example1');
            await angularHomepage.filterByButton(filter);
            await angularHomepage.toggleCompletedByText('Example1');
            await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: filter === 'completed' ? false : true });
            if (filter === 'all') expect.soft(await angularHomepage.checkTodosCompletedByText('Example1')).toBe(false);
        });
    }
}

test('Check active filter persists on reload', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Example');
    await angularHomepage.markAsCompletedByText('Example2');
    await angularHomepage.filterByButton('active');
    await page.reload();
    expect.soft(await angularHomepage.checkFilterSelected('active')).toBe(true);
    await expect.soft(await angularHomepage.locateTodoBySubstring('Example1')).toBeVisible({ timeout: 3000, visible: true });
    await expect.soft(await angularHomepage.locateTodoBySubstring('Example2')).toBeVisible({ timeout: 3000, visible: false });
});
