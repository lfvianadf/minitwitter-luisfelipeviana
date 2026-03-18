import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'

const mockLogin = vi.fn()

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({ mutate: mockLogin, isPending: false }),
}))

function renderLoginForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  it('renderiza os campos de e-mail e senha', () => {
    renderLoginForm()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renderiza o botão de entrar', () => {
    renderLoginForm()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('exibe erro de e-mail inválido', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    // Submete com e-mail vazio — Zod valida z.string().email() e retorna "E-mail inválido"
    // Não usamos valor inválido porque type="email" no jsdom bloqueia a digitação
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('exibe erro de senha curta', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByPlaceholderText('seu@email.com'))
    await user.keyboard('test@test.com')
    await user.click(screen.getByPlaceholderText('••••••••'))
    await user.keyboard('123')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('alterna visibilidade da senha', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const input = screen.getByPlaceholderText('••••••••')
    expect(input).toHaveAttribute('type', 'password')

    const buttons = screen.getAllByRole('button')
    const toggleBtn = buttons.find(b => b.getAttribute('type') === 'button')!
    await user.click(toggleBtn)
    expect(input).toHaveAttribute('type', 'text')

    await user.click(toggleBtn)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('tem link para a página de cadastro', () => {
    renderLoginForm()
    expect(screen.getByRole('link', { name: 'Cadastre-se' })).toBeInTheDocument()
  })

  it('não exibe erros com dados válidos', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByPlaceholderText('seu@email.com'))
    await user.keyboard('test@test.com')
    await user.click(screen.getByPlaceholderText('••••••••'))
    await user.keyboard('123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(screen.queryByText('E-mail inválido')).not.toBeInTheDocument()
      expect(screen.queryByText('Mínimo 6 caracteres')).not.toBeInTheDocument()
    })
  })
})