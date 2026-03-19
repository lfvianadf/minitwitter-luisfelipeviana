# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "MiniTwitter" [ref=e6] [cursor=pointer]:
          - /url: /
          - img [ref=e8]
          - generic [ref=e10]: MiniTwitter
        - generic [ref=e11]:
          - button "Alternar tema" [ref=e12] [cursor=pointer]:
            - img [ref=e13]
          - generic [ref=e15]:
            - link "Entrar" [ref=e16] [cursor=pointer]:
              - /url: /login
            - link "Cadastrar" [ref=e17] [cursor=pointer]:
              - /url: /register
    - main [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]:
          - img [ref=e21]
          - textbox "Buscar posts..." [ref=e24]
        - paragraph [ref=e26]:
          - text: Erro ao carregar posts. Verifique se o backend está rodando em
          - code [ref=e27]: http://localhost:3000
  - generic [ref=e28]:
    - img [ref=e30]
    - button "Open Tanstack query devtools" [ref=e78] [cursor=pointer]:
      - img [ref=e79]
```