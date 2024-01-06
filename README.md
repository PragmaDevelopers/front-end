# ReadMe.md

this is a NextJS Project.

https://github.com/PragmaDevelopers/SistemasRC/blob/develop/dynamic-form/src/app/(public)/pdf_page/view/page.tsx | visualicação do PDF gerado na pdf_page/edit, caso o pdfInfoDataSession esteja vazio, gerar um modal.

o form de cadastro de cliente ta no SignUP_B


## Logica dos InnerCards

*OBS* eu pensei em talvez adicionar um campo "outerCardID" que faz referencia ao ID do card externo ao card atual, se for NULL é o primeiro card.
isso é pra ver se eu torno possivel essa questão da edição e reconstrução do objeto.

Os arquivos que contém a logica são:
- @/app/dashboard/board/[id]/page.tsx: contém as funções que são passadas pros componentes e os estados.
- @/app/utils/dashboard/functions/Page/InnerCards.ts: contém as funções gerais. 
- @/app/utils/dashboard/functions/Page/InnerCardUtils.ts: contém as funções utilitarias. 
- @/app/components/dashboard/CreateEditCard.tsx: é o form de criação de card. 
- @/app/components/dashboard/InnerCard.tsx: é o elemento usado dentro do form de criação de card. 

as etapas pra criação e edição de um innerCard são as seguintes:
- CRIAÇÃO:
  - salva o tempCard atual dentro da tempCardsArray
  - cria um novo tempCard com o mesmo ID de coluna
  - o usuario faz as mudanças necessárias (abaixo instruções para salvar as mudanças)
  - remove da lista tempCardsArray o ultimo elemento (poppedCard)
  - adiciona o tempCard atual como elemento dentro do atributo innerCards no poppedCard
  - define o poppedCard modificado como o novo tempCard.
- EDIÇÃO:
  - ao clicar no elemento do innerCard, salva aquele innerCard na array tempCardsArray
  - remove o ultimo elemento da tempCardsArray e salva em uma variavel temporaria (poppedInnerCard)
  - adiciona o tempCard atual na tempCardsArray
  - define o poppedInnerCard como tempCard atual. (basicamente tem que fazer o tempCard e o ultimo elemento da array trocarem de lugar)
  - o usuario faz as mudanças necessárias. (abaixo instruções para salvar as mudanças)
  - remove o ultimo elemento da tempCardsArray (poppedOuterCard)
  - procura por um card dentro do atributo innerCards do poppedOuterCard que tenha o mesmo ID que o nosso tempCard editado.
  - substitui o card encontrado pelo tempCard.
  - define o poppedOuterCard (que tem sua array de innerCards atualizada) como novo tempCard.

