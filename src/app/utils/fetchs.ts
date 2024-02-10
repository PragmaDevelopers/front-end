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
const COLUMN_MOVE_ROUTE: string = `${COLUMN_ROUTE}/move`;
const CARD_ROUTE: string = `${COLUMN_ROUTE}/card`;
const CARD_MOVE_ROUTE: string = `${CARD_ROUTE}/move`

const INNER_CARD_ROUTE: string = `${CARD_ROUTE}/innerCard`;
const DEADLINE_ROUTE: string = `${CARD_ROUTE}/deadline`;
const CUSTOMFIELD_ROUTE: string = `${CARD_ROUTE}/customField`;
const TAG_ROUTE: string = `${CARD_ROUTE}/tag`;
const COMMENT_ROUTE: string = `${CARD_ROUTE}/comment`;
const COMMENT_ANSWER_ROUTE: string = `${CARD_ROUTE}/comment/answer`;
const CHECKLIST_ROUTE: string = `${CARD_ROUTE}/checklist`;
const CHECKLIST_ITEM_ROUTE: string = `${CHECKLIST_ROUTE}/checklistItem`;

const CLIENT_TEMPLATE = `${USER_ROUTE}/signup/client/template`;
const PDF_TEMPLATE = `${USER_ROUTE}/signup/pdfEditor/template`;

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
    }).catch((e: any) =>{
        responseCallback(e)
    });
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

type PATCH_user_config = {
    permissionLevel: string,
    isSupervisor: boolean
};
export function patch_user_config(body: PATCH_user_config, userId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(USER_ROUTE+"/"+userId+"/config", requestObject).then((response: Response) => {
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
    fetch(COLUMN_MOVE_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_card_by_id = undefined;
export function get_card_by_id(body: GET_card_by_id, cardId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/"+cardId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_inner_card = undefined;
export function get_inner_card(body: GET_inner_card, cardId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/"+cardId+"/innerCards", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type GET_card_comment = undefined;
export function get_card_comment(body: GET_card_comment, cardId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/"+cardId+"/comments", requestObject).then((response: Response) => {
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

type POST_inner_card = {
    cardId: SystemID,
    title: string,
    description?: string,
    members?: SystemID[]
};
export function post_inner_card(body: POST_inner_card, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(INNER_CARD_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_card = {
    title?: string,
    description?: string,
    members?: SystemID[]
};
export function patch_card(body: PATCH_card, cardId:SystemID, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(CARD_ROUTE+"/"+cardId, requestObject).then((response: Response) => {
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
    fetch(CARD_MOVE_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_deadline = {
    cardId: SystemID,
    date: string,
    category?: string,
    toColumnId?: SystemID
};
export function post_deadline(body: POST_deadline, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(DEADLINE_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_deadline = undefined;
export function delete_deadline(body: DELETE_deadline, deadlineId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(DEADLINE_ROUTE+"/"+deadlineId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_deadline = {
    date: string,
    category?: string,
    toColumnId?: SystemID
};
export function patch_deadline(body: PATCH_deadline, deadlineId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(DEADLINE_ROUTE+"/"+deadlineId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_customField = {
    cardId: SystemID,
    name: string,
    value: string,
    fieldType: string
};
export function post_customField(body: POST_customField, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(CUSTOMFIELD_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_customField = undefined;
export function delete_customField(body: DELETE_customField, customFieldId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(CUSTOMFIELD_ROUTE+"/"+customFieldId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_customField = {
    value: string
};
export function patch_customField(body: PATCH_customField, customFieldId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(CUSTOMFIELD_ROUTE+"/"+customFieldId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_tag = {
    cardId: SystemID,
    name: string,
    color: string
};
export function post_tag(body: POST_tag, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(TAG_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_tag = undefined;
export function delete_tag(body: DELETE_tag, tagId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(TAG_ROUTE+"/"+tagId, requestObject).then((response: Response) => {
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

export function get_notifications_with_limit(body: GET_notification, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'GET', `Bearer ${userToken}`);
    fetch(USER_ROUTE+"/notifications?isLimit=true", requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_checklist = { 
    cardId: SystemID, 
    name: string 
}
export function post_checklist(body: POST_checklist, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(CHECKLIST_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_checklist = undefined;
export function delete_checklist(body: DELETE_checklist, checklistId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(CHECKLIST_ROUTE+"/"+checklistId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_checklist = { 
    name: string 
}
export function patch_checklist(body: PATCH_checklist, checklistId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(CHECKLIST_ROUTE+"/"+checklistId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_checklistItem = { 
    checklistId: SystemID, 
    name: string 
}
export function post_checklistItem(body: POST_checklistItem, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(CHECKLIST_ITEM_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_checklistItem = undefined;
export function delete_checklistItem(body: DELETE_checklistItem, checklistItemId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(CHECKLIST_ITEM_ROUTE+"/"+checklistItemId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type PATCH_checklistItem = { 
    name: string,
    completed: boolean 
}
export function patch_checklistItem(body: PATCH_checklistItem, checklistItemId:SystemID, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'PATCH', `Bearer ${userToken}`);
    fetch(CHECKLIST_ITEM_ROUTE+"/"+checklistItemId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_comment = { 
    cardId: SystemID, 
    content: string 
}
export function post_comment(body: POST_comment, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(COMMENT_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_comment_answer = { 
    commentId: SystemID, 
    content: string 
}
export function post_comment_answer(body: POST_comment_answer, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(COMMENT_ANSWER_ROUTE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_comment = undefined;
export function delete_comment(body: DELETE_comment, commentId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(COMMENT_ROUTE+"/"+commentId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_client_template = {
    name: string,
    template: object
};
export function post_client_template(body: POST_client_template, value:boolean,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(CLIENT_TEMPLATE+"?value="+value, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_client_template = undefined;
export function delete_client_template(body: DELETE_client_template, clientTemplateId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(CLIENT_TEMPLATE+"/"+clientTemplateId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type POST_pdf_template = {
    name: string,
    template: object
};
export function post_pdf_template(body: POST_pdf_template, userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST', `Bearer ${userToken}`);
    fetch(PDF_TEMPLATE, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

type DELETE_pdf_template = undefined;
export function delete_pdf_template(body: DELETE_pdf_template, pdfTemplateId:SystemID,userToken: string,okCallback: (response: Response) => void) {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'DELETE', `Bearer ${userToken}`);
    fetch(PDF_TEMPLATE+"/"+pdfTemplateId, requestObject).then((response: Response) => {
        okCallback(response);
    }).catch((e: any) => console.log(e));
}

/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */


/* Essa função é usada em @/app/page.tsx */



