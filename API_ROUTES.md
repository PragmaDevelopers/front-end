# API  ROUTES

*Please refer to \[PERMISSIONS LIST\](./PERMISSIONS_LIST.md) for the permissions.*

## Login \[PUBLIC\]

Route: `/api/public/login`

### POST

Requests:
- NONE

Permissions: \[NONE\]
- NONE

Body Schema:
```ts
type Login_Request = {
    "email": string,
    "password": string,
}
```

Return Type: `STRING`

Return Data:
```ts
type UserToken = string // Hash
```
- Example: `wR4Uynk-zfkDXh92cHN7OZcX9cSmE_EAqCL7FF4LtQ_.0XNygDO4MzMwcTM6ICc4VmIsISMiojIiV3ciwiIjJ3Xh1WZ0NXazJiOiM3cpJye.9JCVXpkI6ICc5RnIsIiN1IzUIJiOicGbhJye`

Response Status: 200

## Signup \[PUBLIC\]

Route: `/api/public/signup`

### POST

Requests:
- NONE

Permissions: \[NONE\]
- NONE

Body Schema:
```ts
type Signup_Request = {
    "name": string,
    "email": string,
    "password": string,
    "nationality": string,
    "gender": string,
}
```

Return Type: NONE

Return Data: NONE

Response Status: 200

## Kanban \[PRIVATE\]

Route: `/api/private/user/kanban`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[8\]
- Criar Dashboard

Body Schema:
```ts
type Kanban_Request = {
    "title": string;
}
```

Return Type: `UINT`

Return Data:
```ts
type KanbanID = string // UNIQUE
```
- Example: `42`

Response Status: 200

### GET

#### Kanbans

Requests:
- User Token (Login Required.)

Permissions: NONE

Body Schema: NONE

Return Type: `{id: uint, title: string}[]`

Return Data:
```ts
type KanbanList = {id: number, title: string}[]
```
- Example: `[{"id": 2, "title": test}]`

Response Status: 200

#### Users

Route: `/api/private/user/kanban/:ID`
- ID: is the Kanban ID on the BackEnd.

Requests:
- User Token (Login Required.)
- Needs to be a member of the kanban

Permissions: NONE

Body Schema: NONE

Return Type: `{id: uint, title: string}[]`

Return Data:
```ts
type KanbanList = {id: number, title: string}[]
```
- Example: `[{"id": 2, "title": test}]`

Response Status: 200


## Cards \[PRIVATE\]

Route: `/api/private/`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Columns \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Profile \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Users \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Check Lists \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Check List Item \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200

## Notifications \[PRIVATE\]

Route: `/api/private`

### POST

Requests:
- User Token (Login Required.)

Permissions: \[ \]
- perm

Body Schema:
```ts
type _Request = {

}
```

Return Type:

Return Data:
```ts

```
- Example: ``

Response Status: 200


## Basis


CRIAR KANBAN (POST)
Precisa estar logado!
Permissão no índice 8 necessária!
Quando a resposta for OK, o id do kanban criado é retornado

PEGAR TODOS OS KANBAN NO QUAL O USUÁRIO LOGADO FAZ PARTE (GET)
Precisa estar logado!

PEGAR TODOS OS USUÁRIOS QUE FAZEM PARTE DE UM KANBAN (GET)
Precisa estar logado!
Precisa estar no kanban!

ATUALIZAR O KANBAN (PATCH)
Precisa estar logado!
Permissão no índice 10 necessária!

DELETAR O KANBAN (DELETE)
Precisa estar logado!
Permissão no índice 9 necessária!

PEGAR INFORMAÇÕES DO PRÓPRIO PERFIL (GET)
Precisa estar logado!

PESQUISAR OS USUÁRIOS ATRAVÉS DO NOME E EMAIL COM PAGINÇÃO (GET)
Precisa estar logado!

ATUALIZAR OS DADOS DA SUA CONTA (PATCH)
Precisa estar logado!

Os campos name, email, password, nationality, gender, profilePicture e pushEmail são opcionais.

PEGAR TODAS AS COLUNAS DE UM KANBAN (GET)
Precisa estar logado!
Precisa estar no kanban!

Use o parâmetro opcional ?cards=true para chamar os cards de cada coluna.

CRIAR COLUNA (POST)
Precisa estar logado!
Permissão no índice 4 necessária!

ATUALIZAR A COLUNA (PATCH)
Precisa estar logado!
Permissão no índice 7 necessária!

MOVER A COLUNA (PATCH)
Precisa estar logado!
Permissão no índice 5 necessária!

DELETAR A COLUNA (DELETE)
Precisa estar logado!
Permissão no índice 6 necessária!

PEGAR TODOS OS CARDS DE UMA COLUNA (GET)
Precisa estar logado!
Precisa estar no kanban!

CRIAR CARD/PRAZO (POST)
Precisa estar logado!
Permissão no índice 0/14 necessária!

Só é possível adicionar como membro dentro de um card alguém que está cadastrado no kanban.
Adicionei a opção do campo deadline, ex: 2022-05-23.
Os campos do body: description, tags, members e deadline são opcionais.

ATUALIZAR O CARD/PRAZO (PATCH)
Precisa estar logado!
Permissão no índice 3/16 necessária!

Só é possível adicionar como membro dentro de um card alguém que está cadastrado no kanban.
Adicionei a opção do campo deadline, ex: 2022-05-23.
Todos os campos do body são opcionais.

DELETAR PRAZO (PATCH) - EXTRA
Precisa estar logado!
Permissão no índice 15 necessária!

Adicione o parâmetro ?deleteDeadLine=true na url para deletar o prazo.

DELETAR O CARD (DELETE)
Precisa estar logado!
Permissão no índice 2 necessária!

MOVER O CARD (PATCH)
Precisa estar logado!
Permissão no índice 1 necessária!


PEGAR TODOS OS CHECKLISTS DE UM CARD (GET)
Precisa estar logado!

CRIAR CHECKLIST (POST)
Precisa estar logado!
Permissão no índice 11 necessária!

ATUALIZAR O CHECKLIST (PATCH)
Precisa estar logado!
Permissão no índice 13 necessária!

DELETAR O CHECKLIST (DELETE)
Precisa estar logado!
Permissão no índice 12 necessária!

PEGAR TODOS OS CHECKLISTITEMS DE UM CHECKLIST (GET)
Precisa estar logado!

CRIAR CHECKLISTITEM (POST)
Precisa estar logado!
Permissão no índice 32 necessária!

ATUALIZAR O CHECKLISTITEM (PATCH)
Precisa estar logado!
Permissão no índice 34 necessária!

DELETAR O CHECKLISTITEM (DELETE)
Precisa estar logado!
Permissão no índice 33 necessária!

CONVIDAR UM USUÁRIO PARA O KANBAN (POST)
Precisa estar logado!
Permissão no índice 24 necessária!

RETIRAR USUÁRIO DO KANBAN (DELETE) - NÂO ESTÀ NO DEPLOY AINDA
Precisa estar logado!
Permissão no índice 25 necessária!

ATUALIZAR AS PERMISSÕES DE UM USUÁRIO (PATCH)
Precisa estar logado!

O ADMIN e SUPERVISOR podem mudar as permissões dos usuários, mas somente o ADMIN pode mudar o cargo de alguém. O SUPERVISOR pode mudar apenas as permissões dos MEMBER

CRIAR COMENTÁRIO (POST)
Precisa estar logado!
Permissão no índice 17 necessária!

RESPONDER COMENTÁRIO (POST)
Precisa estar logado!
Permissão no índice 17 necessária!

ATUALIZAR O COMENTÁRIO (PATCH)
Precisa estar logado!
Permissão no índice 18/19 necessária!

DELETAR O COMENTÁRIO (DELETE)
Precisa estar logado!
Permissão no índice 20/21 necessária!

PEGAR TODOS AS NOTIFICAÇÕES DO USUÁRIO (GET)
Precisa estar logado!

ADICIONAR UM INNERCARD (POST)
Precisa estar logado!
Permissão no índice 0 necessária!
Você precisa estar como membro no card pai
