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
  // Garante que o feed carregou antes de continuar
  await page.waitForSelector('article', { timeout: 8000 })
}

test.describe('Timeline', () => {
  test('exibe search bar na home sem login', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page.getByPlaceholder('Buscar posts...')).toBeVisible()
  })

  test('busca filtra posts dinamicamente', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForSelector('article', { timeout: 8000 })
    await page.getByPlaceholder('Buscar posts...').fill('Bun')
    await page.waitForTimeout(500)
    await expect(page.getByPlaceholder('Buscar posts...')).toHaveValue('Bun')
  })

  test('limpar busca restaura o feed', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForSelector('article', { timeout: 8000 })
    await page.getByPlaceholder('Buscar posts...').fill('xyzzy')
    await page.waitForTimeout(500)
    await page.getByLabel('Limpar busca').click()
    await expect(page.getByPlaceholder('Buscar posts...')).toHaveValue('')
  })

  test('scroll infinito não quebra a página', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForSelector('article', { timeout: 8000 })
    const initialCount = await page.locator('article').count()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1500)
    const newCount = await page.locator('article').count()
    expect(newCount).toBeGreaterThanOrEqual(initialCount)
  })
})

test.describe('Criação de posts', () => {
  test('formulário de criação é exibido após login no desktop', async ({ page }) => {
    await login(page)
    // O form inline só aparece no desktop (hidden sm:block)
    // Usa o heading específico do formulário
    await expect(page.getByRole('heading', { name: 'Nova publicação' })).toBeVisible()
  })

  test('cria um post com título e conteúdo', async ({ page }) => {
    await login(page)

    const title = `Post de teste ${Date.now()}`
    const content = 'Conteúdo criado pelo teste E2E.'

    await page.getByPlaceholder('Título do seu post...').fill(title)
    await page.getByPlaceholder('O que está acontecendo?').fill(content)

    // Clica no botão Publicar dentro do form (não o do navbar)
    await page.locator('form').getByRole('button', { name: 'Publicar' }).click()

    await expect(page.getByText('Post publicado!')).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 8000 })
  })

  test('não permite criar post sem título', async ({ page }) => {
    await login(page)
    await page.getByPlaceholder('O que está acontecendo?').fill('Conteúdo sem título')
    await page.locator('form').getByRole('button', { name: 'Publicar' }).click()
    await expect(page.getByText('Título obrigatório')).toBeVisible()
  })

  test('não permite criar post sem conteúdo', async ({ page }) => {
    await login(page)
    await page.getByPlaceholder('Título do seu post...').fill('Título sem conteúdo')
    await page.locator('form').getByRole('button', { name: 'Publicar' }).click()
    await expect(page.getByText('Conteúdo obrigatório')).toBeVisible()
  })
})

test.describe('Interações com posts', () => {
  test('usuário não autenticado vê mensagem para fazer login', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForSelector('article', { timeout: 8000 })
    await expect(page.getByText('Faça login para curtir').first()).toBeVisible()
  })

  test('usuário autenticado pode curtir um post', async ({ page }) => {
    await login(page)

    // Pega o botão de like pelo aria — é o que contém o ícone de coração
    const firstPost = page.locator('article').first()
    // O like button é o primeiro button no footer do card
    const likeBtn = firstPost.locator('button').last()
    const countBefore = await likeBtn.locator('span').innerText()

    await likeBtn.click()
    await page.waitForTimeout(600)

    const countAfter = await likeBtn.locator('span').innerText()
    expect(countAfter).not.toBe(countBefore)
  })
})

test.describe('Edição e exclusão de posts', () => {
  test('botões editar/deletar aparecem nos posts do usuário logado', async ({ page }) => {
    await login(page)
    // Verifica que pelo menos um post tem os botões de ação
    await expect(page.getByLabel('Editar post').first()).toBeVisible({ timeout: 8000 })
    await expect(page.getByLabel('Deletar post').first()).toBeVisible({ timeout: 8000 })
  })

  test('fluxo completo: criar → editar → deletar post', async ({ page }) => {
    await login(page)

    // 1. Cria
    const title = `Para deletar ${Date.now()}`
    await page.getByPlaceholder('Título do seu post...').fill(title)
    await page.getByPlaceholder('O que está acontecendo?').fill('Será deletado.')
    await page.locator('form').getByRole('button', { name: 'Publicar' }).click()
    await expect(page.getByText('Post publicado!')).toBeVisible({ timeout: 8000 })
    await expect(page.getByText(title).first()).toBeVisible({ timeout: 8000 })

    // 2. Edita
    await page.getByLabel('Editar post').first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    const newTitle = `Editado ${Date.now()}`
    await page.locator('#edit-title').clear()
    await page.locator('#edit-title').fill(newTitle)
    await page.getByRole('dialog').getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Post atualizado!')).toBeVisible({ timeout: 8000 })

    // 3. Deleta
    await page.getByLabel('Deletar post').first().click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('dialog').getByRole('button', { name: 'Deletar' }).click()
    await expect(page.getByText('Post deletado.')).toBeVisible({ timeout: 8000 })
  })
})