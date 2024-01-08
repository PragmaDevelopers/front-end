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
 *  [ ] - 
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *
 * GET:
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *
 * PATCH:
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *  [ ] -
 *
 * */

import { SystemID } from "../types/KanbanTypes";
import { API_BASE_URL } from "./variables";

/* Constantes das rotas */
const PUBLIC_ROUTE: string = `${API_BASE_URL}/api/public`;
const PRIVATE_ROUTE: string = `${API_BASE_URL}/api/private`;

const SIGNUP_ROUTE: string = `${PUBLIC_ROUTE}/signup`;
const LOGIN_ROUTE: string = `${PUBLIC_ROUTE}/login`;

const CHECKLIST_ROUTE: string = `${PRIVATE_ROUTE}/user/kanban/column/card/checkList`;
const CHECKLIST_ITEM_ROUTE: string = `${CHECKLIST_ROUTE}/checkListItem`;
//const _ROUTE: string = ``;
//const _ROUTE: string = ``;
//const _ROUTE: string = ``;
//const _ROUTE: string = ``;

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
export function post_login(body: POST_loginBody, responseCallback?: (response: Response) => void, dataCallback?: (value: string) => void): void {
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST');
    fetch(LOGIN_ROUTE, requestObject).then((response: Response) => {
        let _response: Response = response;

        if (responseCallback) {
            responseCallback(_response);
        }

        return _response.text()
    }).then((value: string) => {
        let _value: string = value;
        if (dataCallback) {
            dataCallback(_value);
        }
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
export function post_signup(body: POST_signupBody, okCallback?: (response: Response) => void): boolean {
    let returnValue: boolean = false;
    let requestObject: RequestInit = generateRequestObject(JSON.stringify(body), 'POST');
    

    fetch(SIGNUP_ROUTE, requestObject).then((response: Response) => {
        if ((response.status == 200) || response.ok) {
            returnValue = true;
    
            if (okCallback) {
                okCallback(response);
            }

            return returnValue || true;
        }
    }).catch((e: any) => console.log(e));

    return returnValue;
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



