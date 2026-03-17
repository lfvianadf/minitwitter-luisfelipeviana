import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

test.describe('Dark mode', () => {
  test('alterna para dark mode ao clicar no botão', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.getByLabel('Alternar tema').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('dark mode persiste após reload', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.getByLabel('Alternar tema').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('volta para light mode ao clicar novamente', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.getByLabel('Alternar tema').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByLabel('Alternar tema').click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})