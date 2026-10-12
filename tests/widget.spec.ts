import { test, expect } from '@playwright/test';
import { WidgetPage } from "./widget.page";

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup if visible
    const cookieButton = page.locator('._UCHI_COOKIE__button');
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
  });

  test('opens', async () => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();

    const articles = await widgetPage.getPopularArticles();
    await articles[0].click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitleLocator()).toHaveText('Связь с поддержкой');
  });



  // Дополнительный тест: клик по карточке школьного предмета и проверка page title
  test('opens school subject page with matching page title', async ({ page }) => {
    const subjectName = 'Математика';

    await widgetPage.clickSubjectCard(subjectName);

    await expect(page).toHaveURL(/\/subjects\/math/);
    await expect(page).toHaveTitle(new RegExp(subjectName, 'i'));
  });
});
