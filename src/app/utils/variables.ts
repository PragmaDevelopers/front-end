export const API_BASE_URL: string = "https://sistema-rc-e0ef46aabaec.herokuapp.com";

export const BACKEND_DATE_FORMAT: string = 'YYYY-MM-DDTHH:mm:ss.SSSSSS';

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

export const PERMISSIONS_LIST: string[] = [
    "CRIAR_CARDS", "MOVER_CARDS", "DELETAR_CARDS", "EDITAR_CARDS", "CRIAR_COLUNAS", "MOVER_COLUNAS", "DELETAR_COLUNAS", "EDITAR_COLUNAS", "CRIAR_DASHBOARDS", "DELETAR_DASHBOARDS", "EDITAR_DASHBOARDS", "CRIAR_CHECKLISTS", "DELETAR_CHECKLISTS", "EDITAR_CHECKLISTS", "CRIAR_PRAZOS", "DELETAR_PRAZOS", "EDITAR_PRAZOS", "CRIAR_COMENTÁRIOS", "EDITAR_COMENTÁRIOS_PRÓPRIOS", "EDITAR_COMENTÁRIOS_EXTERNOS", "DELETAR_COMENTÁRIOS_PRÓPRIOS", "DELETAR_COMENTÁRIOS_EXTERNOS", "RECEBER_NOTIFICAÇÕES_DE_SISTEMA", "RECEBER_NOTIFICAÇÕES_PUSH", "CONVIDAR_PARA_O_KANBAN", "RETIRAR_DO_KANBAN", "CRIAR_TAG", "EDITAR_TAG", "DELETAR_TAG", "CRIAR_CAMPO", "DELETAR_CAMPO",
]

export const NATIONALITIES_ARRAY: string[] = [ "AF", "ZA", "AL", "DE", "AD", "AO", "AG", "SA", "DZ", "AR", "AM", "AU", "AT", "AZ", "BS", "BD", "BB", "BH", "BY", "BE", "BZ", "BJ", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "BT", "CV", "CM", "KH", "CA", "QA", "KZ", "TD", "CL", "CN", "CY", "CO", "KM", "CG", "CI", "CR", "HR", "CU", "DK", "DJ", "DM", "EG", "SV", "AE", "EC", "ER", "SK", "SI", "ES", "US", "EE", "SZ", "ET", "FJ", "PH", "FI", "FR", "GA", "GM", "GH", "GE", "GD", "GR", "GT", "GY", "GN", "GQ", "GW", "HT", "NL", "HN", "HU", "YE", "MH", "SB", "IN", "ID", "IR", "IQ", "IE", "IS", "IL", "IT", "JM", "JP", "JO", "KI", "KW", "LA", "LS", "LV", "LB", "LR", "LY", "LI", "LT", "LU", "MK", "MG", "MY", "MW", "MV", "ML", "MT", "MA", "MU", "MR", "MX", "MM", "FM", "MZ", "MD", "MC", "MN", "ME", "NA", "NR", "NP", "NI", "NE", "NG", "NO", "NZ", "OM", "PW", "PA", "PG", "PK", "PY", "PE", "PL", "PT", "KE", "KG", "GB", "CF", "KR", "CD", "DO", "KP", "CZ", "RO", "RW", "RU", "WS", "SM", "LC", "KN", "ST", "VC", "SC", "SN", "SL", "RS", "SG", "SY", "SO", "LK", "SD", "SS", "SE", "CH", "SR", "TJ", "TH", "TZ", "TL", "TG", "TO", "TT", "TN", "TM", "TR", "TV", "UA", "UG", "UY", "UZ", "VU", "VE", "VN", "ZM", "ZW" ]

export const NOTIFICATION_CATEGORIES_TITLE: {[Key: string]: string} = {
    "KANBAN_CREATE": "Dashboard Criada.",
    "KANBAN_UPDATE": "Dashboard Atualizada.",
    "KANBAN_DELETE": "Dashboard Deletada.",
    "KANBAN_INVITE": "Usuário Convidado a Dashboard.",
    "KANBAN_UNINVITE": "Usuário removido da Dashboard.",
    "COLUMN_CREATE": "Coluna Criada.",
    "COLUMN_UPDATE": "Coluna Atualizada.",
    "COLUMN_DELETE": "Coluna Deletada",
    "COLUMN_MOVE": "Coluna Movida.",
    "CARD_CREATE": "Cartão Criado.",
    "INNERCARD_CREATE": "Cartão Interno Criado.",
    "CARD_UPDATE": "Cartão Atualizado.",
    "CARD_DELETE": "Cartão Removido.",
    "CARD_MOVE": "Cartão Movido.",
    "CARDTAG_CREATE": "Etiqueta Criada.",
    "CARDTAG_UPDATE": "Etiqueta Atualizada.",
    "CARDTAG_DELETE": "Etiqueta Removida.",
    "CARDCOMMENT_CREATE": "Comentário Criado.",
    "CARDCOMMENTANSWERED_CREATE": "Comentário Respondido.",
    "CARDCOMMENT_UPDATE": "Comentário Atualizado.",
    "CARDCOMMENT_DELETE": "Comentário Removido.",
    "CARDCHECKLIST_CREATE": "Lista de Tarefas Criada.",
    "CARDCHECKLIST_UPDATE": "Lista de Tarefas Atualizada.",
    "CARDCHECKLIST_DELETE": "Lista de Tarefas Removida.",
    "CARDCHECKLISTITEM_CREATE": "Tarefa Criada.",
    "CARDCHECKLISTITEM_UPDATE": "Tarefa Atualizada.",
    "CARDCHECKLISTITEM_DELETE": "Tarefa Removida.",
}
