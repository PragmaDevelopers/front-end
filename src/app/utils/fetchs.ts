/*******************************************************************************
 * Esse arquivo implementa todas as funções de fetching usadas através do front.
 * essa abordagem foi usada em prol de facilitar manutenção e adição de novas \
 * funcinalidades no código, cada função contém um comentário contendo o local \
 * que a mesma foi usada. Para fácil navegação no front.
 *
 * Espero ter feito um bom trabalho àqueles que continuarão esse projeto.
 *                                                                     - @Mirai
 ******************************************************************************/

/* POST:
 *  [ ] - LOGIN
 *  [ ] - SIGNUP
 *  [ ] - CARD
 *  [ ] - COLUMN
 *  [ ] - KANBAN
 *  [ ] - CHECKLIST
 *  [ ] - CHECKLIST ITEM
 *  [ ] - INVITE USER TO KANBAN
 *  [ ] - COMMENT
 *  [ ] - COMMENT ANSWER
 *  [ ] - INNER CARD
 *  [ ] - TAG
 *  [ ] - CUSTOM FIELDS
 *  [ ] - CUSTOM FIELDS TEMPLATES
 *
 * GET:
 *  [ ] - KANBAN USERS
 *  [ ] - USER KANBANS
 *  [ ] - PROFILE
 *  [ ] - USERS
 *  [ ] - COLUMN
 *  [ ] - CARD 
 *  [ ] - CHECKLIST
 *  [ ] - CHECKLIST ITEM
 *  [ ] - USER NOTIFICATIONS
 *  [ ] - TAGS
 *  [ ] - COMMENTS
 *  [ ] - CUSTOM FIELDS
 *  [ ] - CUSTOM FIELDS TEMPLATES
 *
 * PATCH:
 *  [ ] - KANBAN
 *  [ ] - PROFILE
 *  [ ] - COLUMN
 *  [ ] - MOVE COLUMN
 *  [ ] - CARD
 *  [ ] - MOVER CARD
 *  [ ] - CHECKLIST
 *  [ ] - CHECKLIST ITEM
 *  [ ] - UPDATE USER PERMISSIONS
 *  [ ] - COMMENT 
 *  [ ] - TAG
 *  [ ] - CUSTOM FIELDS
 *
 * DELETE:
 *  [ ] - KANBAN
 *  [ ] - COLUMN
 *  [ ] - CARD
 *  [ ] - CHECKLIST
 *  [ ] - CHECKLIST ITEM
 *  [ ] - REMOVE USER FROM KANBAN
 *  [ ] - COMMENT
 *  [ ] - TAG
 *  [ ] - CUSTOM FIELDS
 *  [ ] - CUSTOM FIELDS TEMPLATES
 *
 *
 *
 *
 * FALTANDO:
 *  - INNER CARDS PATCH:
 *      > Como vamos atualizar os Inner Cards no Back-End? se tivermos somente \ 
 *      > o DELETE podemos no front-end preservar os dados, e fazer um POST \
 *      > com os dados atualizados. - Mirai
 *  - INNER CARDS DELETE:
 *      > Como vamos deletar um Inner Card no Back-End? se os innerCards fossem\
 *      > objetos adjacentes na rota do Card daria para fazermos um PATCH com \
 *      > o card removido. - Mirai
 * */

import { SystemID } from "../types/KanbanTypes";
import { API_BASE_URL } from "./variables";

/* Constantes das rotas */
const PUBLIC_ROUTE: string = `${API_BASE_URL}/api/public`;
const PRIVATE_ROUTE: string = `${API_BASE_URL}/api/private`;

const SIGNUP_ROUTE: string = `${PUBLIC_ROUTE}/signup`;
const LOGIN_ROUTE: string = `${PUBLIC_ROUTE}/login`;

const USER_ROUTE: string = `${PRIVATE_ROUTE}/user`
const USER_PROFILE_ROUTE: string = `${USER_ROUTE}/profile`
const USER_SEARCH_ROUTE: string = `${USER_ROUTE}/search`

const KANBAN_ROUTE: string = `${USER_ROUTE}/kanban`;
const COLUMN_ROUTE: string = `${KANBAN_ROUTE}/column`;
const COLUMN_MOVE_ROUTE: string = `${KANBAN_ROUTE}/move/column`;
const CARD_ROUTE: string = `${COLUMN_ROUTE}/card`;
const CARD_MOVE_ROUTE: string = `{${COLUMN_ROUTE}/move/card}`

const DEADLINE_ROUTE: string = `${CARD_ROUTE}/deadline`;

const CHECKLIST_ROUTE: string = `${PRIVATE_ROUTE}/user/kanban/column/card/checkList`;
const CHECKLIST_ITEM_ROUTE: string = `${CHECKLIST_ROUTE}/checkListItem`;


/* Essa é uma função local que retorna a rota com ID de um dado elemento */
type elementType = 'columncards' | 'card' | 'cardchecklists'
function elementIDRoute(element: elementType, id: SystemID): string {
    let elementRouteMap: {[Key: string]: string} = {
        'columncards': `${COLUMN_ROUTE}/${id}/card`,
	'card': `${CARD_ROUTE}/${id}`,
	'cardchecklists': `${CARD_ROUTE}/${id}/checkList`,
    }

    return elementRouteMap[element.toLowerCase()];
}

/* Essa é uma função local que simplifica e centraliza a geração de requestObjects */
function generateRequestObject(body: string, method: 'POST' | 'GET' | 'PATCH' | 'DELETE', authorization?: string): RequestInit {
    let headers = {};
    if (authorization) {
        headers = {
            'Content-Type': 'application/json',
            'Authorization': authorization,
        }
    } else {
        headers = {
            'Content-Type': 'application/json',
        }
    }

    let requestObject: RequestInit = {
        method: method,
        body: body,
        headers: headers,
    }

    return requestObject;
}



/* Essa função é usada em @/app/page.tsx */
type POST_loginBody = { email: string; password: string; }
export function post_login(body: POST_loginBody, responseCallback: (response: Response) => void): void {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST');
    fetch(LOGIN_ROUTE, requestObject).then((response: Response) => {
        responseCallback(response);
    }).catch((e: any) => console.log(e));
}

/* Essa função é usada em @/app/page.tsx */
type POST_signupBody = {
    name: string;
    email: string;
    password: string;
    nationality: string;
    gender: string;
};
export function post_signup(body: POST_signupBody, okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST');
    fetch(SIGNUP_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_profile = undefined;
export function get_profile(body: GET_profile, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(USER_PROFILE_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_user = undefined;
export function get_user(body: GET_user, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(USER_SEARCH_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_kanban_members = undefined;
export function get_kanban_members(body: GET_kanban_members, kanbanId: SystemID, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/"+kanbanId+"/members", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_kanban = undefined;
export function get_kanban(body: GET_kanban, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"?columns=true", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_kanban = {
    title: string
};
export function post_kanban(body: POST_kanban, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_invite_kanban = {
    kanbanId: SystemID,
    userId: SystemID
};
export function post_invite_kanban(body: POST_invite_kanban, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/invite", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_uninvite_kanban = undefined;
export function delete_uninvite_kanban(body: DELETE_uninvite_kanban, kanbanId:SystemID,userId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/"+kanbanId+"/uninvite/user/"+userId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_kanban = undefined;
export function delete_kanban(body: DELETE_kanban, kanbanId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/"+kanbanId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_kanban = {
    title: string
};
export function patch_kanban(body: PATCH_kanban, kanbanId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/"+kanbanId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_column = undefined;
export function get_columns(body: GET_column, kanbanId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(KANBAN_ROUTE+"/"+kanbanId+"/columns?cards=true", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_column = {
    kanbanId: SystemID,
    title: string
};
export function post_column(body: POST_column, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(COLUMN_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_column = undefined;
export function delete_column(body: DELETE_column, columnId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(COLUMN_ROUTE+"/"+columnId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_column = {
    title: string
};
export function patch_column(body: PATCH_column, columnId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(COLUMN_ROUTE+"/"+columnId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type MOVE_column = {
    columnId: SystemID,
    toIndex: number
};
export function move_column(body: MOVE_column, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(COLUMN_ROUTE+"/move", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_card = {
    columnId: SystemID,
    title: string,
    description?: string,
    members?: SystemID[]
};
export function post_card(body: POST_card, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(CARD_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_card = undefined;
export function delete_card(body: DELETE_card, cardId: SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/"+cardId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type MOVE_card = {
    cardId: SystemID,
    toColumnId: SystemID,
    toIndex: number
};
export function move_card(body: MOVE_card, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/move", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_deadline = {
    cardId: SystemID,
    date: Date,
    category?: string,
    toColumnId?: SystemID
};
export function post_deadline(body: POST_deadline, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(DEADLINE_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_notification = undefined;
export function get_notifications(body: GET_notification, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(USER_ROUTE+"/notifications", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

/* Essa função é usada em @/app/utils/dashboard/functions/Page/Card.ts */
type POST_checklistBody = { cardId: SystemID, name: string }
export function post_checklists(body: POST_checklistBody, userToken: string, 
    responseCallback?: (response: Response) => void, dataCallback?: (value: string) => void
): void {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);

    fetch(CHECKLIST_ROUTE, requestObject).then((response: Response) => {
        let _response: Response = response;
        if (responseCallback) {
            responseCallback(_response);
        }

        return _response.text();
    }).then((value: string) => {
        if (dataCallback) {
            dataCallback(value);
        }
    }).catch((e: any) => console.log(e));
}

/* Essa função é usada em @/app/utils/dashboard/functions/Page/Card.ts */
type POST_checklistItemBody = { checklistId: SystemID, name: string }
export function post_checklistItems(body: POST_checklistItemBody, userToken: string, 
    responseCallback?: (response: Response) => void, dataCallback?: (value: string) => void
): void {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);

    fetch(CHECKLIST_ITEM_ROUTE, requestObject).then((response: Response) => {
        let _response: Response = response;
        if (responseCallback) {
            responseCallback(_response);
        }

        return _response.text();
    }).then((value: string) => {
        if (dataCallback) {
            dataCallback(value);
        }
    }).catch((e: any) => console.log(e));
}


/* Essa função é usada em @/app/utils/dashboard/functions/Page/Card.ts */
type PATCH_checklistItemBody = { name: string, completed: boolean }
export function patch_checklistItems(body: PATCH_checklistItemBody, userToken: string, 
    responseCallback?: (response: Response) => void, dataCallback?: (value: string) => void
): void {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);

    fetch(CHECKLIST_ITEM_ROUTE, requestObject).then((response: Response) => {
        let _response: Response = response;
        if (responseCallback) {
            responseCallback(_response);
        }

        return _response.text();
    }).then((value: string) => {
        if (dataCallback) {
            dataCallback(value);
        }
    }).catch((e: any) => console.log(e));
}

/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */



