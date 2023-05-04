import { test, expect } from '@playwright/test';
import { AngularHomepage } from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/');
});

const filterArray: ('all' | 'active' | 'completed')[] = ['all', 'active', 'completed'];

for (const filter of filterArray) {
    test(`Changing route to ${filter} in URL`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Lorem');
        await angularHomepage.markAsCompletedByText('Lorem2');
        await page.goto('https://todomvc.com/examples/typescript-angular/#/' + (filter === 'all' ? '' : filter));
        expect(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: filter === 'completed' ? false : true });
        await expect(await angularHomepage.locateTodoBySubstring('Lorem2')).toBeVisible({ visible: filter === 'active' ? false : true });
    });

    test(`Changing route to #!/${filter === 'all' ? '' : filter} in URL`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Lorem');
        await angularHomepage.markAsCompletedByText('Lorem2');
        await page.goto('https://todomvc.com/examples/typescript-angular/#!/' + (filter === 'all' ? '' : filter));
        expect(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: filter === 'completed' ? false : true });
        await expect(await angularHomepage.locateTodoBySubstring('Lorem2')).toBeVisible({ visible: filter === 'active' ? false : true });
    });

    test(`Changing route to ${filter} with button`, async ({ page }) => {
        const angularHomepage: AngularHomepage = new AngularHomepage(page);
        await angularHomepage.addMultipleTodos(2, 'Lorem');
        await angularHomepage.markAsCompletedByText('Lorem2');
        await angularHomepage.filterByButton(filter);
        expect(await angularHomepage.checkFilterSelected(filter)).toBe(true);
        await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: filter === 'completed' ? false : true });
        await expect(await angularHomepage.locateTodoBySubstring('Lorem2')).toBeVisible({ visible: filter === 'active' ? false : true });
    });

    if (filter !== 'completed') {
        test(`Update active todo state when filtering by ${filter}`, async ({ page }) => {
            const angularHomepage: AngularHomepage = new AngularHomepage(page);
            await angularHomepage.addNewTodo('Lorem1');
            await angularHomepage.filterByButton(filter);
            // Has to be toggle here for the 'active' case.
            await angularHomepage.toggleCompletedByText('Lorem1');
            await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: filter === 'active' ? false : true });
            if (filter === 'all') expect(await angularHomepage.checkTodosCompletedByText('Lorem1')).toBe(true);
        });
    }

    if (filter !== 'active') {
        test(`Update completed todo state when filtering by ${filter}`, async ({ page }) => {
            const angularHomepage: AngularHomepage = new AngularHomepage(page);
            await angularHomepage.addNewTodo('Lorem1');
            await angularHomepage.markAsCompletedByText('Lorem1');
            await angularHomepage.filterByButton(filter);
            await angularHomepage.toggleCompletedByText('Lorem1');
            await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: filter === 'completed' ? false : true });
            if (filter === 'all') expect(await angularHomepage.checkTodosCompletedByText('Lorem1')).toBe(false);
        });
    }
}

test('Check active filter persists on reload', async ({ page }) => {
    const angularHomepage: AngularHomepage = new AngularHomepage(page);
    await angularHomepage.addMultipleTodos(2, 'Lorem');
    await angularHomepage.markAsCompletedByText('Lorem2');
    await angularHomepage.filterByButton('active');
    await page.reload();
    expect(await angularHomepage.checkFilterSelected('active')).toBe(true);
    await expect(await angularHomepage.locateTodoBySubstring('Lorem1')).toBeVisible({ visible: true });
    await expect(await angularHomepage.locateTodoBySubstring('Lorem2')).toBeVisible({ visible: false });
});
