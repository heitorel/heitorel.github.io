# Frontend Redesign Brief

## Objetivo
Remodelar completamente o frontend da site-portfolio para ficar mais moderno, responsivo e profissional.

## Público-alvo
Recrutadores de empresas e demais profissionais que desegem contratar meus serviços de engenheiro de software.

## Estilo desejado
- Portfolio pessoal

## Referências
Use as imagens em:
- design-inputs/cabecalho.png
- design-inputs/contato.jpg
- design-inputs/rodape.jpg
- design-inputs/homepage.jpg
- design-inputs/sobremim.jpg
- design-inputs/experiencias.jpg

Use o curriculo em:
- assets/curriculo.pdf

Use os dados de:
- assets/data/textos.json
- assets/data/resume.json

## Estrutura do site
- Cabeçalho (cabecalho.png): deve estar presente em todas as demais páginas. Deve conter os seguintes elementos:
    - alinhado a esquerda: um logo da minha marca, meu nome (Hetitor Bianchi) escrito em fonte de caligrafia moderna. Ao clickar sempre levará para home page
    - alinhado ao centro: duas "guias" -> 'sobre' que levará para uma página com um conteúdo sobre mim e 'experiências' que será sobre minhas experiências profissionais
    - alinhado à direita: um botão 'Contatos'(contato.png) que levará para uma página onde será possível enviar um email diretamente dali e um botão de 'sol' para alternar os temas do site (escuro e claro)
- Rodapé (rodape.png): deve estar presente em todas as demais páginas. deve conter, centralizados, icones do github e linkedin que levem para meus respectivos perfis

## Páginas
- Home Page (homepage.png): a página principal será minimalista e conterá blocos que levam para navegação:
    - bloco 1: principal, maior, de destaque. deve conter minha foto, uma saudação e meu cargo. ao clickar deve levar para a mesma página que o botão do cabeçalho 'sobre'
    - bloco 2: é o que levará para página das experiencias profissionais tal qual o botão do cabeçalho 'experiências'
    - bloco 3: deverá levar para meu github
    - bloco 4: é o meu portfólio, deverá para uma página com a mensagem "em construção" ou coisa do tipo, implementaremos no futuro
    - bloco 5: "minha stack", deve conter icones das ferramentas, linguagens e afins com as quais trabalho (só as core!).
- Sobre mim (sobremim.png): conterá um titulo e um pequeno parágrafo sobre mim sobre mim seguido de uma lista da minha stack profissional (os mesmoos do bloco 5). Assim como no bloco, os icones devem ser clickáveis e levar para a home page do site de documentação da ferramenta em questão.
- Experiencias (experiencias.png): à esquerda uma coluna com dois blocos e tomando o centro e a direita um titulo e minhas experiências profissionais listadas com suas informações:
    - bloco 1: um cartão de apresentação simples (nome, cargo, email, cidade)
    - bloco 2: uma lista de contatos linkados ao click (github, linkedin, wpp e curriculo para download (curriculo.pdf))

## Recomendações
- Siga os layouts das referencias
- os textos são bases, adeque para os formatos do site
- as referencias das imagens são em ingles mas o site deve estar em pt-br
- o minimalismo visual com classe e elegância moderno são o alvo
- busque algo responsivo ao tamanho da tela
- se preciso, crie novos .html alem do index
- traga fluidez para a navegação, pode incluir animações leves se cabível
- use flat-icons em branco/preto (dependendo do tema) mas que, ao passar o mouse, mostrem o nome do site que representam e toma a cor principal da ferramenta

Não gosto de:
- excesso de elementos
- gradientes 
- aparência genérica de template

## Paleta
extrair das imagens de referencia, focando nos tons de cinza para o tema escuro e branco para o tema claro. para detalhes pontuais, roxo.