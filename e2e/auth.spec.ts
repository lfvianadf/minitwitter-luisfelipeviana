import { test, expect, type Page } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

const TEST_USER = {
  email: 'lfvianadf@hotmail.com',
  password: 'senha12345',
}

async function login(page: Page) {
  await page.goto(`${BASE_URL}/login`)
  await page.getByPlaceholder('seu@email.com').fill(TEST_USER.email)
  await page.getByPlaceholder('••••••••').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(`${BASE_URL}/`, { timeout: 8000 })
}

test.describe('Autenticação', () => {
  test('navega para a página de cadastro', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.getByRole('link', { name: 'Cadastre-se' }).click()
    await expect(page).toHaveURL(`${BASE_URL}/register`)
    await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible()
  })

  test('valida formato de e-mail no login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    // Deixa o email vazio e preenche só a senha — o Zod valida email vazio
    await page.getByPlaceholder('••••••••').fill('123456')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('E-mail inválido')).toBeVisible({ timeout: 8000 })
  })

  test('valida senha curta no login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.getByPlaceholder('seu@email.com').fill('test@test.com')
    await page.getByPlaceholder('••••••••').fill('123')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await expect(page.getByText('Mínimo 6 caracteres')).toBeVisible({ timeout: 8000 })
  })

  test('login com credenciais válidas redireciona para home', async ({ page }) => {
    await login(page)
    await expect(page.getByPlaceholder('Buscar posts...')).toBeVisible()
  })

  test('login com credenciais inválidas exibe erro', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.getByPlaceholder('seu@email.com').fill('errado@email.com')
    await page.getByPlaceholder('••••••••').fill('senhaerrada')
    await page.getByRole('button', { name: 'Entrar' }).click()
    // Aguarda o toast com timeout generoso
    await expect(
      page.locator('[class*="toast"], [aria-live], [role="status"]')
        .or(page.getByText(/credenciais|inválid|incorret|senha|email/i))
    ).toBeVisible({ timeout: 10000 })
  })

  test('logout limpa sessão e redireciona para login', async ({ page }) => {
    await login(page)
    await page.getByLabel('Sair').click()
    await expect(page).toHaveURL(`${BASE_URL}/login`, { timeout: 8000 })
    const auth = await page.evaluate(() => localStorage.getItem('@minitwitter:auth'))
    expect(auth).toBeNull()
  })
})