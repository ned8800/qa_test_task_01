import { Locator, Page, expect } from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '.sc-dino-typography-h > [class^=widget__]',
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    BUTTON_WRITE_TO_US = '[class^=btn]',
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
    SUBJECT_ITEM = 'a[href*="/subjects/"]',
}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper(): Locator {
        return this.page.locator(WidgetPage.selector.WRAPPER);
    }

    async openWidget() {
        await this.wrapper().locator(WidgetPage.selector.BUTTON_OPEN).click();
    }

    async getPopularArticles(): Promise<Locator[]> {
        const items = this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM);
        // Ждем рендера списка статей перед вызовом .all(), так как .all() не имеет auto-waiting
        await items.first().waitFor({ state: 'visible' });
        return items.all();
    }

    async clickWriteToUs() {
        // Фильтруем кнопку по тексту «Написать нам» (или берем целевую кнопку), чтобы избежать strict mode violation
        const writeBtn = this.wrapper()
        .locator(WidgetPage.selector.BUTTON_WRITE_TO_US)
        .filter({ hasText: /Написать нам|Связаться/i })
        .first();

        await writeBtn.click();
    }

    getTitleLocator(): Locator {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);
    }

    async getTitle(): Promise<string | null> {
        await this.getTitleLocator().waitFor({ state: 'visible' });
        return this.getTitleLocator().textContent();
    }

    getWidgetBody(): Locator {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }

    async clickSubjectCard(subjectName: string) {
        await this.page
        .locator(WidgetPage.selector.SUBJECT_ITEM)
        .filter({ hasText: subjectName })
        .first()
        .click();
    }
}
