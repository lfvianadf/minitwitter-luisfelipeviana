# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - generic [ref=e9]:
        - heading "Entrar no MiniTwitter" [level=1] [ref=e10]
        - paragraph [ref=e11]: Acesse sua conta para interagir com a comunidade
    - generic [ref=e13]:
      - generic [ref=e14]:
        - text: E-mail
        - generic [ref=e15]:
          - img [ref=e16]
          - textbox "seu@email.com" [ref=e19]
      - generic [ref=e20]:
        - text: Senha
        - generic [ref=e21]:
          - img [ref=e22]
          - textbox "••••••••" [ref=e25]
          - button [ref=e26] [cursor=pointer]:
            - img [ref=e27]
      - button "Entrar" [ref=e30] [cursor=pointer]
      - paragraph [ref=e31]:
        - text: Não tem conta?
        - link "Cadastre-se" [ref=e32] [cursor=pointer]:
          - /url: /register
  - generic [ref=e33]:
    - img [ref=e35]
    - button "Open Tanstack query devtools" [ref=e83] [cursor=pointer]:
      - img [ref=e84]
```