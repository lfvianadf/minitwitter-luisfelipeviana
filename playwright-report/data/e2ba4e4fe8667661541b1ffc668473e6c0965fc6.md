# Page snapshot

```yaml
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
        - textbox "seu@email.com" [ref=e19]: lfvianadf@hotmail.com
    - generic [ref=e20]:
      - text: Senha
      - generic [ref=e21]:
        - img [ref=e22]
        - textbox "••••••••" [ref=e25]: senha12345
        - button [ref=e26] [cursor=pointer]:
          - img [ref=e27]
    - button "Entrar" [disabled] [ref=e30]:
      - img [ref=e31]
      - text: Entrar
    - paragraph [ref=e33]:
      - text: Não tem conta?
      - link "Cadastre-se" [ref=e34] [cursor=pointer]:
        - /url: /register
```