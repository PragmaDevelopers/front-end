export const API_BASE_URL: string = "https://sistema-rc-e0ef46aabaec.herokuapp.com";


export const SYSTEM_PERMISSIONS: { [Key: string]: number } = {
    "CRIAR_CARDS": 1 << 0,
    "MOVER_CARDS": 1 << 1,
    "DELETAR_CARDS": 1 << 2,
    "EDITAR_CARDS": 1 << 3,
    "CRIAR_COLUNAS": 1 << 4,
    "MOVER_COLUNAS": 1 << 5,
    "DELETAR_COLUNAS": 1 << 6,
    "EDITAR_COLUNAS": 1 << 7,
    "CRIAR_DASHBOARDS": 1 << 8,
    "DELETAR_DASHBOARDS": 1 << 9,
    "EDITAR_DASHBOARDS": 1 << 10,
    "CRIAR_CHECKLISTS": 1 << 11,
    "DELETAR_CHECKLISTS": 1 << 12,
    "EDITAR_CHECKLISTS": 1 << 13,
    "CRIAR_PRAZOS": 1 << 14,
    "DELETAR_PRAZOS": 1 << 15,
    "EDITAR_PRAZOS": 1 << 16,
    "CRIAR_COMENTÁRIOS": 1 << 17,
    "EDITAR_COMENTÁRIOS_PRÓPRIOS": 1 << 18,
    "EDITAR_COMENTÁRIOS_EXTERNOS": 1 << 19,
    "DELETAR_COMENTÁRIOS_PRÓPRIOS": 1 << 20,
    "DELETAR_COMENTÁRIOS_EXTERNOS": 1 << 21,
    "RECEBER_NOTIFICAÇÕES_DE_SISTEMA": 1 << 22,
    "RECEBER_NOTIFICAÇÕES_PUSH": 1 << 23,
    "CONVIDAR_PARA_O_KANBAN": 1 << 24,
    "RETIRAR_DO_KANBAN": 1 << 25,
    "CRIAR_TAG": 1 << 26,
    "EDITAR_TAG": 1 << 27,
    "DELETAR_TAG": 1 << 28,
    "CRIAR_CAMPO": 1 << 29,
    "DELETAR_CAMPO": 1 << 30,
}

export const SYSTEM_PERMISSIONS_BOOLEAN: { [Key: string]: boolean } = {
    "CRIAR_CARDS": false,                       //  //
    "MOVER_CARDS": false,                       //
    "DELETAR_CARDS": false,                     //
    "EDITAR_CARDS": false,                      //
    "CRIAR_COLUNAS": false,                     //  //
    "MOVER_COLUNAS": false,                     //  //
    "DELETAR_COLUNAS": false,                   //  //
    "EDITAR_COLUNAS": false,                    //  //
    "CRIAR_DASHBOARDS": false,                  //  //
    "DELETAR_DASHBOARDS": false,                //  //
    "EDITAR_DASHBOARDS": false,
    "CRIAR_CHECKLISTS": false,                  //
    "DELETAR_CHECKLISTS": false,                //
    "EDITAR_CHECKLISTS": false,                 //
    "CRIAR_PRAZOS": false,                      //
    "DELETAR_PRAZOS": false,
    "EDITAR_PRAZOS": false,
    "CRIAR_COMENTÁRIOS": false,
    "EDITAR_COMENTÁRIOS_PRÓPRIOS": false,
    "EDITAR_COMENTÁRIOS_EXTERNOS": false,
    "DELETAR_COMENTÁRIOS_PRÓPRIOS": false,
    "DELETAR_COMENTÁRIOS_EXTERNOS": false,
    "RECEBER_NOTIFICAÇÕES_DE_SISTEMA": false,
    "RECEBER_NOTIFICAÇÕES_PUSH": false,
    "CONVIDAR_PARA_O_KANBAN": false,
    "RETIRAR_DO_KANBAN": false,
    "CRIAR_TAG": false,                         //
    "EDITAR_TAG": false,
    "DELETAR_TAG": false,
    "CRIAR_CAMPO": false,                       //
    "DELETAR_CAMPO": false,
}
