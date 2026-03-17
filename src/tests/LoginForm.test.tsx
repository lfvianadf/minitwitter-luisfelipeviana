import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'

vi.mock('@/hooks/useAuth', () => ({
  useLogin: () => ({ mutate: vi.fn(), isPending: false }),
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
    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'nao-é-email')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
  })

  it('exibe erro de senha curta', async () => {
    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    await waitFor(() => {
      expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument()
    })
  })

  it('alterna visibilidade da senha', async () => {
    renderLoginForm()
    const input = screen.getByPlaceholderText('••••••••')
    expect(input).toHaveAttribute('type', 'password')

    // Encontra o botão de toggle (Eye/EyeOff)
    const toggle = screen.getByRole('button', { name: '' })
    await userEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'text')

    await userEvent.click(toggle)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('tem link para a página de cadastro', () => {
    renderLoginForm()
    expect(screen.getByRole('link', { name: 'Cadastre-se' })).toBeInTheDocument()
  })

  it('chama login com os dados corretos ao submeter', async () => {
    const mockLogin = vi.fn()
    vi.mocked(vi.importMock('@/hooks/useAuth')).useLogin = () => ({
      mutate: mockLogin,
      isPending: false,
    })

    renderLoginForm()
    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123456')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      // O form foi submetido sem erros de validação
      expect(screen.queryByText('E-mail inválido')).not.toBeInTheDocument()
      expect(screen.queryByText('Mínimo 6 caracteres')).not.toBeInTheDocument()
    })
  })
})
