import { test, expect } from '@playwright/test';
import {AngularHomepage} from '../POM/todo-angular-ts';

test.beforeEach(async ({ page }) => {
    await page.goto('https://todomvc.com/examples/typescript-angular/#/')
    const toDo = new AngularHomepage(page);
    let lorem: string = "Lorem";    

    await toDo.AddNewTodo(lorem);
});

test('Mark TODO as complete', async ({ page }) => {
    await page.locator('div').getByRole('checkbox').check();
    const classValue = await page.locator('body > section > section > ul > li').getAttribute('class');
    expect(classValue).toContain('ng-scope completed');
})

test('Enable editing mode', async ({ page }) => {
    await page.locator('body > section > section > ul > li > div > label').dblclick();
    await page.getByRole('listitem').getByRole('textbox').fill('test');

    const classValue = await page.locator('body > section > section > ul > li').getAttribute('class');
    expect(classValue).toContain('ng-scope editing');
    
})

test('Remove button on hover', async ({ page }) => {
    await page.locator('body > section > section > ul > li > div > label').hover();
    await expect(page.getByRole('button', { name: '×' })).toBeVisible();
    
})