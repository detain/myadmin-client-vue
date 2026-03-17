#!/usr/bin/env python3
"""Script to write all translation files for all 9 languages."""
import json
import os

base = 'F:/dev/myadmin-client-vue/.claude/worktrees/interesting-germain/src/locales'

def write_json(lang, fname, data):
    path = os.path.join(base, lang, fname + '.json')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    print(f'Written: {lang}/{fname}.json')

# ============================================================
# SPANISH (es)
# ============================================================

write_json('es', 'common', {
    "menu": {
        "dashboard": "Panel",
        "domains": "Dominios",
        "dnsManager": "Administrador DNS",
        "vps": "VPS",
        "storage": "Almacenamiento",
        "mail": "Correo",
        "licenses": "Licencias",
        "webhosting": "Alojamiento Web",
        "floatingIps": "IPs Flotantes",
        "scrubIps": "IPs de Limpieza",
        "rapidDeployServers": "Servidores de Despliegue Rápido",
        "servers": "Servidores",
        "affiliateSystem": "Sistema de Afiliados",
        "tickets": "Tickets",
        "billing": "Facturación",
        "settings": "Configuración",
        "cart": "Carrito",
        "viewInvoices": "Ver Facturas",
        "creditCards": "Tarjetas de Crédito",
        "prePaidFunds": "Fondos Prepagados / Crédito",
        "accountSettings": "Configuración de Cuenta",
        "changeLogin": "Cambiar Inicio de Sesión",
        "changePassword": "Cambiar Contraseña"
    },
    "nav": {
        "home": "Inicio",
        "bugsSuck": "Los Errores Son Malos",
        "users": "Usuarios",
        "logout": "Cerrar Sesión"
    },
    "buttons": {
        "save": "Guardar",
        "cancel": "Cancelar",
        "delete": "Eliminar",
        "edit": "Editar",
        "update": "Actualizar",
        "submit": "Enviar",
        "close": "Cerrar",
        "confirm": "Confirmar",
        "back": "Atrás",
        "next": "Siguiente",
        "order": "Ordenar",
        "orderNow": "Ordenar Ahora",
        "add": "Agregar",
        "create": "Crear",
        "remove": "Eliminar",
        "search": "Buscar",
        "reset": "Restablecer",
        "refresh": "Actualizar",
        "download": "Descargar",
        "upload": "Subir",
        "copy": "Copiar",
        "print": "Imprimir",
        "enable": "Habilitar",
        "disable": "Deshabilitar",
        "start": "Iniciar",
        "stop": "Detener",
        "restart": "Reiniciar",
        "viewAll": "Ver Todos",
        "copyToClipboard": "Copiar al Portapapeles",
        "addToCart": "Agregar al Carrito",
        "payNow": "Pagar Ahora",
        "login": "Iniciar Sesión",
        "register": "Registrarse",
        "signUp": "Registrarse",
        "continue": "Continuar",
        "addRange": "Agregar Rango",
        "goBack": "Regresar",
        "prev": "Anterior",
        "exportExcel": "Exportar Excel",
        "exportPdf": "Exportar PDF",
        "exportData": "Exportar datos",
        "unlink": "Desvincular",
        "logOut": "Cerrar Sesión",
        "generateApiKey": "Generar una Clave API",
        "generateNewApiKey": "Generar una nueva Clave API reemplazando la anterior",
        "updateSshKey": "Actualizar Clave Pública SSH",
        "setSshKey": "Establecer Clave Pública SSH",
        "updateAccountFeatures": "Actualizar Configuración de Características de Cuenta",
        "update2fa": "Actualizar Autenticación de Dos Factores"
    },
    "labels": {
        "id": "ID", "name": "Nombre", "email": "Correo Electrónico",
        "status": "Estado", "action": "Acción", "actions": "Acciones",
        "date": "Fecha", "cost": "Costo", "amount": "Cantidad",
        "description": "Descripción", "type": "Tipo", "details": "Detalles",
        "server": "Servidor", "ip": "IP", "hostname": "Nombre de Host",
        "domain": "Dominio", "username": "Nombre de Usuario", "password": "Contraseña",
        "package": "Paquete", "comments": "Comentarios", "loading": "Cargando...",
        "noData": "No hay datos disponibles", "noActiveServices": "No Hay Servicios Activos",
        "controlPanel": "Panel de Control", "welcomeEmail": "Correo de Bienvenida",
        "invoices": "Facturas", "billingStatus": "Estado de Facturación",
        "client": "Cliente", "key": "Clave", "links": "Enlaces",
        "billing": "Facturación", "billed": "facturado:", "statusIs": "El estado es:",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "active": "Activo",
        "pending": "Pendiente", "expired": "Vencido", "all": "Todos",
        "paid": "Pagado", "paidOn": "Pagado el", "paidBy": "Pagado Por",
        "moreDetails": "Más Detalles", "invoiceDate": "Fecha de Factura",
        "dueDate": "Fecha de Vencimiento", "page": "Página", "of": "de",
        "pageSize": "Tamaño de Página", "accounts": "Cuentas",
        "linked": "Vinculado", "notLinked": "No vinculado",
        "startIp": "IP de Inicio", "endIp": "IP de Fin", "restrict": "Restringir",
        "options": "Opciones", "yes": "Sí", "no": "No",
        "noPaidInvoices": "No Hay Facturas Pagadas Disponibles",
        "noApiKey": "Aún No Hay Clave API Configurada",
        "noSshKey": "Aún No Hay Clave SSH Configurada"
    },
    "table": {
        "serviceId": "ID de Servicio", "ticketId": "ID de Ticket",
        "subject": "Asunto", "lastReplier": "Último Respondedor",
        "expirationDate": "Fecha de Vencimiento"
    },
    "export": {
        "order": "Orden", "xlsx": "Excel 2007+", "xlsxShort": "XLSX",
        "xls": "Excel 2003/BIFF", "xlsShort": "XLS",
        "ods": "Hoja de Cálculo OpenDocument", "odsShort": "ODS",
        "pdf": "Formato de Documento Portátil Adobe", "pdfShort": "PDF",
        "xml": "Lenguaje de Marcado Extensible", "xmlShort": "XML",
        "php": "Arreglo PHP", "phpShort": "PHP",
        "csv": "Valores Separados por Coma", "csvShort": "CSV",
        "json": "JSON", "bbcode": "BBCode", "bbcodeShort": "BBCODE",
        "wiki": "Código Wiki", "wikiShort": "WIKI",
        "markdown": "Markdown", "markdownShort": "MARKDOWN"
    },
    "alerts": {"success": "¡Éxito!", "error": "¡Error!"},
    "confirm": {
        "title": "¿Está seguro?", "delete": "Esta acción no se puede deshacer.",
        "yes": "Sí", "no": "No", "yesCancelIt": "Sí, Cancelarlo.",
        "cancelConfirm": "¿Está seguro de que desea cancelar su {module} {id}?",
        "cancelTitle": "Cancelar {module}", "cancelService": "Cancelar Servicio {title}",
        "yesCancelOrder": "Sí, Cancelar el Pedido de {tableName}",
        "areYouSureCancelQuestion": "¿Está seguro de que desea cancelar?"
    },
    "footer": {
        "copyright": "Copyright \u00a9 {year} InterServer Inc.",
        "allRightsReserved": "Todos los derechos reservados."
    },
    "search": {"placeholder": "Buscar...", "noResults": "No se encontraron resultados de búsqueda"},
    "breadcrumb": {"home": "Inicio"},
    "profile": {"editPersonalInfo": "Editar Información Personal", "profileImage": "Imagen de Perfil"},
    "services": {
        "cancelService": "Cancelar Servicio {title}",
        "idLabel": "ID de {tableName}:",
        "reasonForCancellation": "Razón de Cancelación/Comentario:",
        "viewService": "Ver {module} {id}",
        "moduleInvoices": "Facturas de {module}"
    },
    "account": {
        "accountFeatures": "Características de la Cuenta",
        "enableDarkMode": "Habilitar Modo Oscuro",
        "disableReinstalls": "Deshabilitar Reinstalaciones",
        "disablePasswordResets": "Deshabilitar restablecimientos de contraseña (Olvidé mi contraseña).",
        "apiAccess": "Acceso API",
        "apiAccessDescription": "Esto proporciona una forma alternativa de autenticarse con la API. Puede usar la Clave API en lugar de la contraseña de la cuenta para la autenticación de la API.",
        "sessionIpLimits": "Límites de Seguridad de IP de Sesión",
        "sessionIpLimitsDescription": "Esto proporciona una forma de limitar las direcciones IP desde las que su cuenta puede iniciar sesión, agregando seguridad adicional a su cuenta.",
        "yourRemoteIp": "Su IP Remota:",
        "ipLimitsWarning": "Habilitar los límites de IP evitará que cualquier persona que no esté listada a continuación inicie sesión. Asegúrese de que su dirección IP sea estática y no cambie en el futuro.",
        "linkedAccounts": "Cuentas Vinculadas",
        "linkedAccountsDescription": "Cuentas sociales vinculadas para poder iniciar sesión con ellas.",
        "sshKeys": "Claves SSH",
        "sshKeysDescription": "Esta Clave SSH se agregará automáticamente a algunos servicios como órdenes VPS proporcionando un medio alternativo de autenticación con sus servicios.",
        "twoFactorAuth": "Autenticación de Dos Factores",
        "twoFactorAuthDescription": "Autenticación dual para su cuenta por seguridad",
        "enableGoogle2fa": "Habilitar Autenticación de Dos Factores de Google",
        "twoFactorEnabled": "Autenticación de Dos Factores Habilitada",
        "installAuthenticator": "Instale y Registre el {link} ingresando el código a continuación o escaneando la imagen QR",
        "googleAuthenticator": "Google Authenticator",
        "backupCode": "Debe hacer una copia de seguridad de este código para recuperación.",
        "enterAuthCode": "Ingrese el Código del Autenticador",
        "webAndApi": "Web y API",
        "onlyApi": "Solo API"
    }
})

write_json('es', 'dashboard', {
    "title": "Panel",
    "welcome": "Bienvenido, {name}",
    "lastLogin": "Último Inicio de Sesión",
    "lastLoginIp": "IP del Último Inicio de Sesión",
    "prepay": {
        "title": "Saldo Prepagado",
        "remainingBalance": "Saldo Restante Prepagado",
        "manageAccount": "Administrar Cuenta",
        "manageTooltip": "Administre su Cuenta Prepagada"
    },
    "invoices": {
        "title": "Facturas Sin Pagar",
        "totalUnpaid": "Total de Facturas Sin Pagar",
        "totalAmount": "Monto Total a Pagar",
        "payTotalTooltip": "Pagar Monto Total"
    },
    "callInPin": "PIN de Llamada",
    "recentTickets": "Tickets Recientes",
    "viewAllTickets": "Ver Todos los Tickets",
    "editTicket": "Editar Ticket",
    "serviceCount": "Sin servicios activos | {count} servicio activo | {count} servicios activos",
    "affiliate": {
        "earnPerSale": "Gana {amount} Por Venta",
        "urlPlaceholder": "URL de Afiliado",
        "shareWith": "Compartir con"
    }
})

write_json('es', 'dns', {
    "manager": {
        "title": "Administrador DNS",
        "addDomain": "Agregar Dominio",
        "deleteDomain": "Eliminar Dominio",
        "domainName": "Nombre de Dominio",
        "dnsServers": "Servidores DNS",
        "confirmDelete": "¿Está seguro de que desea eliminar este dominio?",
        "noDomains": "No se encontraron dominios"
    },
    "editor": {
        "title": "Editor DNS",
        "addRecord": "Agregar Registro",
        "deleteRecord": "Eliminar Registro",
        "editRecord": "Editar Registro",
        "recordType": "Tipo de Registro",
        "hostname": "Nombre de Host",
        "address": "Dirección",
        "distance": "Distancia",
        "weight": "Peso",
        "port": "Puerto",
        "ttl": "TTL",
        "actions": "Acciones",
        "confirmDelete": "¿Está seguro de que desea eliminar este registro?"
    }
})

write_json('es', 'domains', {
    "list": {
        "pageTitle": "Lista de Registros de Dominio",
        "orderTitle": "Ordenar Registros de Dominio",
        "domainName": "Nombre de Dominio",
        "domainExpirationDate": "Fecha de Vencimiento del Dominio",
        "link": "Enlace",
        "active": "Activo",
        "pending": "Pendiente",
        "expired": "Vencido",
        "all": "Todos",
        "exportData": "Exportar datos",
        "toggleDropdown": "Alternar Menú Desplegable"
    },
    "view": {
        "pageTitle": "Ver Dominio - {hostname}",
        "title": "Dominio {hostname}",
        "pageTitleWithLink": "Dominio {id} {link}",
        "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura: {date}",
        "billing": "Facturación",
        "billedFrequency": "facturado {frequency}",
        "expireDate": "Fecha de Vencimiento: {date}",
        "domainStatus": "Estado del Dominio: {status}",
        "whoisPrivacy": "Privacidad Whois",
        "whoisPrivacyIs": "La Privacidad Whois es: {status}",
        "editWhoisPrivacy": "Editar Estado de Privacidad Whois",
        "links": "Enlaces",
        "nameservers": "Servidores de Nombres",
        "nameserverLabel": "Servidor de Nombres #{number}",
        "editNameservers": "Editar Servidores de Nombres",
        "contactInformation": "Información de Contacto",
        "editContactInformation": "Editar Información de Contacto",
        "name": "Nombre:",
        "organization": "Organización:",
        "address": "Dirección:",
        "phone": "Tel:",
        "domainRegistryLogs": "Registros del Registro de Dominio",
        "noDomainLogFound": "No se encontró registro de dominio.",
        "errorsInContactInfo": "Errores en la Información de Contacto",
        "allGoodNoErrors": "Todo bien! No hay errores en la información de contacto!",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "welcomeEmailResent": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {
        "pageTitle": "Ordenar Dominio",
        "domainsList": "Lista de Dominios",
        "findDomain": "Encuentra tu dominio y verifica la disponibilidad.",
        "checkPrices": "Verificar Precios",
        "premiumAvailable": "¡Sí! Tu dominio {domain} está disponible y es un dominio premium. El registro automático está deshabilitado. Envía un correo a {email} si deseas comprar este dominio por {cost} por año.",
        "premiumTaken": "¡Lo sentimos! Tu dominio {domain} ya está tomado. ¿Ya lo tienes? Puedes transferirlo, y es un dominio premium. El registro automático está deshabilitado. Envía un correo a {email} si deseas comprar este dominio por {cost} por año.",
        "available": "¡Sí! Tu dominio {domain} está disponible! Puedes registrarlo por {cost}. El costo de renovación será {renewal}.",
        "taken": "¡Lo sentimos! Tu dominio {domain} ya está tomado! ¿Ya lo tienes? Puedes transferirlo por {cost}. El costo de renovación será {renewal}.",
        "registerDomain": "Registrar Dominio ({hostname})",
        "transferDomain": "Transferir Dominio ({hostname})",
        "contactInformation": "Información de Contacto",
        "goBack": "Regresar",
        "whoisPrivacyLabel": "Privacidad Whois por {cost} / año",
        "enabled": "Habilitado",
        "disabled": "Deshabilitado",
        "whatIsWhoisPrivacy": "¿Qué es la Privacidad Whois?",
        "continue": "Continuar",
        "orderSummary": "Resumen del Pedido",
        "oneYear": "1 Año",
        "total": "Total",
        "orderType": "Tipo de Pedido",
        "domainTransfer": "Transferencia de Dominio",
        "domainRegister": "Registro de Dominio",
        "agreeToTerms": "Acepto los términos de la oferta",
        "subscriptionAutoRenew": "La suscripción se renovará automáticamente cada año por {cost} hasta ser cancelada.",
        "subscriptionDisclaimer": "Al marcar esta casilla, reconoces que estás comprando un producto de suscripción que se renueva automáticamente (según los términos descritos anteriormente) y se cobra a la tarjeta de crédito que proporciones hoy. Si deseas cancelar la renovación automática, puedes acceder al portal del cliente (aquí), seleccionar el servicio activo y hacer clic en el enlace Cancelar o enviar un correo a: billing{'@'}interserver.net o usar otro método descrito en los Términos y Condiciones. Al marcar la casilla y hacer clic en Realizar Mi Pedido a continuación, también reconoces que has leído, comprendes y aceptas nuestros Términos y Condiciones y Política de Privacidad.",
        "agreeCheckbox": "He leído los términos anteriores y estoy de acuerdo.",
        "placeOrder": "Realizar Pedido",
        "contactSales": "Contactar Ventas",
        "register": "Registrar",
        "transfer": "Transferir",
        "premium": "Premium",
        "renewAt": "Renovar {'@'} {cost}",
        "searchingDomain": "Por favor espere! Buscando este nombre de dominio.",
        "loadingDomainFields": "Por favor espere! Cargando campos del dominio.",
        "gotError": "Error:"
    },
    "nameservers": {
        "title": "Servidores de Nombres de Dominio",
        "nameservers": "Servidores de Nombres",
        "suggestedNameserver": "Servidor de Nombres Sugerido",
        "nameserverLabel": "Servidor de Nombres #{number}",
        "registerNewNameservers": "Registrar Nuevos Servidores de Nombres",
        "hostname": "Nombre de Host",
        "ipAddress": "Dirección IP",
        "registeredNameservers": "Servidores de Nombres Registrados",
        "canDelete": "Puede Eliminar",
        "yes": "Sí",
        "no": "No",
        "suggestedApplied": "Los servidores de nombres sugeridos han sido aplicados. Haga clic en Actualizar para guardar.",
        "deleteTitle": "Eliminar servidor de nombres",
        "deleteConfirm": "Está a punto de eliminar el servidor de nombres de su dominio.",
        "deleteConfirmQuestion": "¿Está seguro?",
        "yesDeleteIt": "Sí, Eliminarlo"
    },
    "contact": {
        "title": "Información de Contacto",
        "pleaseWait": "¡Por favor espere!"
    },
    "eppCode": {
        "title": "Enviar Código EPP por Correo",
        "confirmButton": "Sí, Envíame",
        "confirmMessage": "¿Está seguro de que desea enviar el Código EPP al correo registrado?"
    },
    "whois": {
        "title": "Privacidad Whois",
        "renewalNote": "La Privacidad Whois se renueva cada 12 meses desde la fecha de activación. El costo de renovación del complemento de Privacidad Whois es {cost}.",
        "notAvailable": "La Privacidad Whois no está disponible para este TLD.",
        "currentlyEnabled": "La Privacidad Whois está habilitada actualmente para {hostname}.",
        "disableAndCancel": "Deshabilitar y Cancelar la Privacidad Whois",
        "domain": "Dominio",
        "whoisCost": "Costo de Whois",
        "contactPrivacy": "Privacidad de Contacto",
        "contactPrivacyDescription1": "La Privacidad de Contacto oculta la identidad de un Registrante cuando un usuario realiza una búsqueda WHOIS en el dominio de ese Registrante.",
        "contactPrivacyDescription2": "El beneficio de tener Privacidad de Contacto es que la identidad del Registrante, incluyendo dirección particular, número de teléfono y dirección de correo electrónico, está protegida de spammers, ladrones de identidad y estafadores.",
        "contactPrivacyDescription3": "Cuando los Registrantes habilitan el servicio de Privacidad de Contacto, la información de contacto enmascarada aparece en la base de datos WHOIS pública.",
        "contactPrivacyAvailable": "La privacidad de contacto está disponible por {cost} por dominio por año.",
        "enableNow": "Para habilitar la Privacidad de Contacto para su Dominio, Realice el Pedido Ahora.",
        "confirmOrderTitle": "Confirmar Pedido",
        "confirmOrderMessage": "Costo de Privacidad Whois: {cost} por año. ¿Está seguro de que desea realizar este pedido?",
        "placingOrder": "Realizando pedido...",
        "orderPlaced": "Pedido Realizado",
        "orderSuccess": "¡Pedido de privacidad Whois realizado con éxito!",
        "enableTitle": "Habilitar Privacidad Whois",
        "enableMessage": "Su dominio {hostname} tiene un complemento de privacidad whois pagado que aún no está habilitado. ¿Le gustaría habilitarlo ahora?",
        "enablingWhois": "Habilitando privacidad whois...",
        "whoisEnabled": "La Privacidad Whois está ahora habilitada.",
        "disableTitle": "Deshabilitar y Cancelar la Privacidad Whois",
        "disableMessage": "El complemento de Privacidad Whois de su dominio {hostname} está actualmente habilitado. ¿Está seguro de que desea deshabilitarlo y cancelarlo?",
        "disablingWhois": "Deshabilitando privacidad whois...",
        "whoisDisabled": "La Privacidad Whois ha sido deshabilitada y cancelada."
    },
    "whoisToggle": {
        "title": "Complemento de Privacidad Whois",
        "enableConfirm": "Habilitar Whois",
        "disableCancelConfirm": "Deshabilitar y Cancelarlo.",
        "addonEnabled": "El complemento de Privacidad Whois de su dominio {domain} está Habilitado",
        "addonDisabled": "El complemento de Privacidad Whois de su dominio {domain} está Deshabilitado",
        "confirmEnable": "¿Está seguro de que desea Habilitar Whois?",
        "confirmDisable": "¿Está seguro de que desea Deshabilitar y Cancelarlo?"
    },
    "lock": {
        "title": "Bloquear/Desbloquear Dominio",
        "lockIt": "Sí, Bloquearlo.",
        "unlockIt": "Sí, Desbloquearlo.",
        "statusActive": "El bloqueo de su dominio está {status}.",
        "activateLock": "¿Desea Activar el bloqueo del dominio?",
        "inactivateLock": "¿Desea Desactivar el bloqueo del dominio?"
    },
    "dnssec": {
        "title": "Información DNSSEC",
        "addNewRecord": "Agregar Nuevo Registro",
        "removeAllRecords": "Eliminar Todos los Registros DNSSEC",
        "noRecords": "No se encontraron Registros DNSSEC.",
        "addDnssec": "Agregar DNSSEC",
        "importDs": "Importar DS",
        "digestType": "Tipo de Resumen #{number}",
        "algorithm": "Algoritmo #{number}",
        "keyTag": "Etiqueta de Clave #{number}",
        "digest": "Resumen #{number}",
        "digestTypeHeader": "Tipo de Resumen",
        "algorithmHeader": "Algoritmo",
        "keyTagHeader": "Etiqueta de Clave",
        "digestHeader": "Resumen",
        "select": "Seleccionar",
        "enterKeyTag": "Ingresar Etiqueta de Clave (Ejemplo: 2371)",
        "enterDigest": "Ingresar Valor de Resumen (No debe ser mayor que {max} caracteres)",
        "charactersLeft": "Caracteres restantes: {count}",
        "addMore": "Agregar Más",
        "import": "Importar",
        "importPlaceholder": "host.com. IN DS 1172 13 1 26ffc7 ; ( SHA1 digest )",
        "invalidDsRecord": "Registro DS Inválido",
        "unableToParse": "No se puede analizar el formato del registro DS.",
        "confirmRemoveAll": "Esto eliminará todos los registros DNSSEC para este dominio.",
        "yesRemoveThem": "Sí, eliminarlos!",
        "removingRecords": "Eliminando registros DNSSEC...",
        "removed": "Eliminado",
        "removeSuccess": "¡Registros DNSSEC eliminados con éxito!",
        "savingRecords": "Guardando registros DNSSEC...",
        "saveSuccess": "¡Registros DNSSEC guardados con éxito!",
        "noRecordsWarning": "Por favor complete al menos un registro DNSSEC."
    },
    "renew": {
        "title": "Renovar",
        "tip1": "El dominio debe renovarse en o antes de la fecha de vencimiento.",
        "tip2": "Si el dominio venció, puede tener un período de gracia desde la fecha de vencimiento para renovar.",
        "tip3": "Habilite la Privacidad Whois para ocultar su Información de Contacto cuando un usuario realice una búsqueda WHOIS en el dominio de ese Registrante.",
        "domain": "Dominio",
        "expiryDate": "Fecha de Vencimiento",
        "renewCost": "Costo de Renovación",
        "whoisCost": "Costo de Whois",
        "totalCost": "Costo Total",
        "alreadyRenewed": "¡Ya ha renovado su dominio!",
        "payExistingInvoice": "Para renovar su dominio, por favor pague la factura existente.",
        "confirmRenewal": "Confirmar Renovación",
        "confirmRenewalMessage": "Costo total: {cost}. ¿Está seguro de que desea realizar este pedido de renovación?",
        "placingRenewalOrder": "Realizando pedido de renovación...",
        "renewalOrderPlaced": "Pedido Realizado",
        "renewalOrderSuccess": "¡Pedido de renovación de dominio realizado con éxito!",
        "goToPayment": "Ir al Pago",
        "loadingRenewalInfo": "Cargando información de renovación..."
    },
    "transfer": {
        "title": "Estado de Transferencia",
        "notATransfer": "Este dominio no es una transferencia.",
        "statusLabel": "Estado",
        "statusDetails": "Detalles del Estado",
        "transferrable": "Transferible",
        "transferType": "Tipo de Transferencia",
        "reason": "Razón",
        "loadingTransferStatus": "Cargando estado de transferencia..."
    }
})

write_json('es', 'floating_ips', {
    "list": {
        "title": "Lista de Servicios de IPs Flotantes",
        "orderTitle": "Ordenar Registros de IP Flotante"
    },
    "view": {
        "title": "Ver IP Flotante {id}",
        "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:",
        "billing": "Facturación",
        "billed": "facturado:",
        "statusIs": "El estado es:",
        "floatingIp": "IP Flotante",
        "links": "Enlaces",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {"title": "Ordenar IP Flotante"},
    "changeIp": {"title": "Cambiar IP de Destino"}
})

write_json('es', 'licenses', {
    "list": {
        "title": "Lista de Licencias",
        "orderTitle": "Ordenar Registros de Licencia"
    },
    "view": {
        "title": "Ver Licencia {id}",
        "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:",
        "billing": "Facturación",
        "billed": "facturado:",
        "statusIs": "El estado es:",
        "licenseInfo": "Información de Licencia",
        "cpanelInfo": "Información de cPanel",
        "links": "Enlaces",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {"title": "Ordenar Licencia"},
    "changeIp": {"title": "Cambiar IP"},
    "changeOs": {"title": "Cambiar SO", "selectLicenseOs": "Seleccionar SO de Licencia"}
})

write_json('es', 'login', {
    "title": "Inicio de Sesión",
    "signIn": "Inicia sesión para comenzar tu sesión",
    "signInButton": "Iniciar Sesión",
    "signInUsing": "Iniciar sesión con:",
    "signUpUsing": "Registrarse con:",
    "emailAddress": "Dirección de Correo Electrónico",
    "password": "Contraseña",
    "rememberMe": "Recordarme",
    "forgotPassword": "Olvidé mi contraseña",
    "forgotPasswordTitle": "¿Olvidaste tu Contraseña?",
    "forgotPasswordInstructions": "Ingresa la dirección de correo electrónico que usas para iniciar sesión en tu cuenta",
    "forgotPasswordSendEmail": "Te enviaremos un correo electrónico con instrucciones para elegir una nueva contraseña.",
    "loginToMyAccount": "Iniciar Sesión en Mi Cuenta",
    "continue": "Continuar",
    "twoFactorCode": "Código de Autenticación de 2 Factores",
    "twoFactorTitle": "¡Ingresa el Código de Autorización de Dos Factores!",
    "twoFactorInstructions": "Usa tu autenticador configurado para obtener un código e ingrésalo aquí.",
    "enterCodeFromAuthenticator": "Ingresa el Código del Autenticador",
    "authenticatorCode": "Código del autenticador",
    "emailVerification": "Verificación de Correo Electrónico",
    "emailVerificationInstructions": "Ingresa el código de seguridad enviado a tu correo electrónico.",
    "securityCode": "Código de Seguridad",
    "emailVerificationCode": "Código de Verificación de Correo Electrónico",
    "error": "¡Error!",
    "createYourAccount": "Crea Tu Cuenta Ahora",
    "createAccount": "Crear Cuenta",
    "agreeToTos": "Acepto los",
    "termsOfService": "Términos de Servicio",
    "passwordMustHave": "La contraseña debe tener:",
    "atLeast8Chars": "al menos 8 caracteres",
    "atLeast1Uppercase": "al menos 1 mayúscula",
    "atLeast1Lowercase": "al menos 1 minúscula",
    "atLeast1Number": "al menos 1 número",
    "atLeast1SpecialChar": "al menos 1 carácter especial",
    "noAccountYet": "¿No tienes una cuenta?",
    "alreadyHaveAccount": "¿Ya tienes una cuenta?",
    "welcomeBack": "Bienvenido de nuevo a nuestra creciente Comunidad",
    "captcha": "Captcha",
    "alternateCaptcha": "Captcha Alternativo",
    "primaryCaptchaMethod": "Método de Captcha Principal",
    "reloadCaptcha": "Recargar Captcha",
    "pleaseWait": "Por favor espere",
    "processingLogin": "Procesando Información de Inicio de Sesión",
    "processingSignup": "Procesando Información de Registro",
    "pleaseEnterUsername": "Por favor ingrese un nombre de usuario",
    "pleaseEnterPassword": "Por favor ingrese una contraseña",
    "pleaseEnterEmail": "Por favor ingrese una dirección de correo electrónico",
    "pleaseEnterValidEmail": "Por favor ingrese una dirección de correo electrónico válida",
    "pleaseEnterGiftcard": "Por favor ingrese un número de tarjeta de regalo",
    "processingInformation": "Procesando Información",
    "errorOccurred": "¡Ocurrió un error!",
    "invalidCode": "Código inválido, por favor ingrese el código correcto.",
    "invalidCodeTitle": "Código Inválido",
    "invalidCodeRetry": "Por favor intente de nuevo",
    "twoFaVerificationFailed": "La verificación 2FA falló",
    "registrationSuccessful": "Registro exitoso",
    "register": "Registrarse",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "username": "Nombre de Usuario",
    "signInWith": "Iniciar sesión con {provider}",
    "oauth": {
        "signIn": "Inicio de Sesión OAuth: {provider}",
        "twoFactorPrompt": "La autenticación de dos factores está habilitada para esta cuenta. Ingresa tu código de autenticador para terminar el inicio de sesión.",
        "noLinkedAccount": "No se encontró cuenta vinculada para {name}. Ingresa tus credenciales de inicio de sesión existentes para vincular, o crea una nueva cuenta.",
        "linkExistingAccount": "Vincular Cuenta Existente",
        "createNewAccount": "Crear Nueva Cuenta",
        "verify": "Verificar",
        "verifyEmail": "Verificar Correo Electrónico",
        "verifyEmailSent": "Se ha enviado un código de verificación a tu correo electrónico.",
        "authFailed": "La autenticación OAuth falló",
        "error": "Error OAuth",
        "failedToLink": "No se pudo vincular la cuenta",
        "enterEmailAndPassword": "Por favor ingrese correo electrónico y contraseña"
    },
    "sudo": {"redirecting": "Sesión iniciada como cliente, redirigiendo al inicio."},
    "home": {
        "cart": "Carrito",
        "editPersonalInfo": "Editar Información Personal",
        "copyright": "Copyright \u00a9 {year} InterServer Inc.",
        "allRightsReserved": "Todos los derechos reservados."
    },
    "copyright": "Copyright \u00a9 {year} - Todos los derechos reservados."
})

write_json('es', 'mail', {
    "list": {"title": "Lista de Servicios de Correo", "orderTitle": "Ordenar Registros de Correo"},
    "view": {
        "title": "Ver Correo {id}", "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "billing": "Facturación",
        "billed": "facturado:", "statusIs": "El estado es:",
        "mailApi": "API de Correo", "usageCount": "Recuento de Uso:",
        "links": "Enlaces", "connectionInfo": "Información de Conexión",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {"title": "Ordenar Correo"},
    "alerts": {"title": "Alertas", "addAlert": "Agregar Alerta", "editAlert": "Editar Alerta", "noAlerts": "No se encontraron alertas"},
    "delist": {"title": "Eliminar de Lista", "blockedEmails": "Correos Bloqueados"},
    "denyRules": {"title": "Reglas de Denegación", "addRule": "Agregar Regla", "noRules": "No se encontraron reglas de denegación"},
    "logs": {"title": "Registros", "searchLogs": "Buscar Registros"},
    "stats": {"title": "Estadísticas"},
    "deliverability": {"title": "Entregabilidad"}
})

write_json('es', 'quickservers', {
    "list": {"title": "Lista de Servidores de Despliegue Rápido", "orderTitle": "Ordenar Registros de Servidor de Despliegue Rápido"},
    "view": {
        "title": "Ver Servidor de Despliegue Rápido {id}", "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "billing": "Facturación",
        "billed": "facturado:", "paymentStatus": "Estado de Pago:", "statusIs": "El estado es:",
        "hostServer": "Servidor Host:", "ipIs": "IP es:", "vzid": "Vzid:",
        "serverInformation": "Información de QuickServer", "powerStatusIs": "El estado de energía es:",
        "selectAction": "Seleccionar Acción", "comment": "Comentario:", "none": "ninguno",
        "disk": "Disco", "totalSpace": "Espacio Total:", "freeSpace": "Espacio Libre:",
        "remainingSpace": "Espacio Restante:", "connections": "Conexiones",
        "vncInfo": "Información VNC", "spiceInfo": "Información Spice",
        "noDataToShow": "No hay datos para mostrar", "systemInformation": "Información del Sistema",
        "os": "SO", "links": "Enlaces", "ipInformation": "Información de IP",
        "updateComment": "Actualizar Comentario", "saveChanges": "Guardar cambios",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {
        "title": "Ordenar Servidor de Despliegue Rápido", "orderSummary": "Resumen del Pedido",
        "selectServer": "Seleccionar Servidor", "qsNo": "QS No.", "quickserver": "QUICKSERVER",
        "ram": "RAM", "hdd": "HDD", "cores": "NÚCLEOS",
        "osDistribution": "Distribución del SO", "osVersion": "Versión del SO",
        "rootPassword": "Contraseña de Root",
        "passwordRequirement": "Nota: La contraseña debe contener al menos 8 caracteres, una letra minúscula, una letra mayúscula, un número, un carácter especial.",
        "rapidDeployServer": "Servidor de Despliegue Rápido", "oneMonth": "1 Mes(es)",
        "packageCost": "Costo del Paquete", "total": "Total",
        "currentlySoldOut": "¡Actualmente agotado!",
        "contactSales": "Por favor contacte a nuestro departamento de ventas.",
        "serverName": "Nombre del Servidor", "operatingSystem": "Sistema Operativo",
        "editDetails": "Editar detalles", "agreeToTerms": "Aceptar los términos de la oferta",
        "iAgreeToTerms": "He leído los términos anteriores y estoy de acuerdo.",
        "placeOrder": "Realizar Pedido", "quickServerId": "ID de QuickServer"
    }
})

write_json('es', 'scrub_ips', {
    "list": {"title": "Lista de Servicios de IPs de Limpieza", "orderTitle": "Ordenar IPs de Limpieza"},
    "view": {"title": "Ver IPs de Limpieza", "currentIp": "IP Actual", "ipAddress": "Dirección IP", "ipFromService": "IP del servicio"},
    "filters": {
        "title": "Filtros", "createNew": "Crear Nuevo", "createNewFilter": "Crear Nuevo Filtro",
        "filterType": "Tipo de Filtro", "selectFilterType": "Seleccionar Tipo de Filtro",
        "ipAddress": "Dirección IP", "portNo": "Núm. de Puerto", "filter": "Filtro",
        "destinationIp": "IP de Destino", "destinationPort": "Puerto de Destino",
        "noFiltersFound": "¡No se encontraron filtros!",
        "deleteFilterConfirm": "¿Está seguro de que desea eliminar este filtro?",
        "unableToCreateFilter": "No se puede crear el filtro en este momento.",
        "unableToDeleteFilter": "No se puede eliminar el filtro en este momento."
    },
    "firewallRules": {
        "title": "Reglas de Firewall", "createNew": "Crear Nuevo",
        "createNewFirewall": "Crear Nueva Regla de Firewall", "protocol": "Protocolo",
        "destinationIp": "IP de Destino", "destinationPort": "Puerto de Destino",
        "sourceIp": "IP de Origen", "sourcePort": "Puerto de Origen",
        "xdpAction": "Acción XDP", "ipRequired": "La dirección IP es requerida",
        "block": "Bloquear", "whitelist": "Lista Blanca",
        "noRulesFound": "¡No se encontraron reglas!",
        "deleteRuleConfirm": "¿Está seguro de que desea eliminar esta regla?",
        "unableToCreateRule": "No se puede crear la regla de firewall en este momento.",
        "unableToDeleteRule": "No se puede eliminar la regla de firewall en este momento."
    },
    "geoFirewallRules": {
        "title": "Reglas de Firewall Geográfico", "createNew": "Crear Nuevo",
        "createNewGeoRule": "Crear Nueva Regla de Firewall Geográfico",
        "destinationIp": "IP de Destino", "destinationPort": "Puerto de Destino",
        "sourceCountry": "País de Origen", "sourceAsn": "ASN de Origen",
        "xdpAction": "Acción XDP", "portNo": "Núm. de Puerto",
        "selectCountry": "Seleccionar País", "asn": "ASN",
        "block": "Bloquear", "whitelist": "Lista Blanca",
        "noRulesFound": "¡No se encontraron reglas!",
        "deleteGeoRuleConfirm": "¿Está seguro de que desea eliminar esta regla geográfica?",
        "unableToCreateRule": "No se puede crear la regla de firewall en este momento.",
        "unableToDeleteRule": "No se puede eliminar la regla de firewall geográfico en este momento."
    }
})

write_json('es', 'servers', {
    "list": {"title": "Lista de Servidores Dedicados", "orderTitle": "Ordenar Registros de Servidor"},
    "view": {
        "title": "Ver Servidor {id}", "package": "Paquete",
        "dedicatedServer": "Servidor Dedicado", "nextInvoiceDate": "Próxima Fecha de Factura:",
        "unBilled": "Sin Facturar", "billing": "Facturación", "billed": "facturado:",
        "statusIs": "El estado es:", "orderInfo": "Información del Pedido",
        "orderId": "ID del Pedido:", "orderedOn": "Ordenado el:",
        "links": "Enlaces", "serverInformation": "Información del Servidor",
        "networkInformation": "Información de Red", "power": "Energía",
        "moreInfo": "Más Información", "selectAction": "Seleccionar Acción",
        "cycle": "Ciclo", "reset": "Restablecer", "on": "Encendido", "off": "Apagado",
        "softReboot": "Reinicio Suave", "unknown": "Desconocido", "noLease": "Sin Arrendamiento",
        "paymentStatus": "Estado de Pago:",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "reverseDns": {
        "title": "Configuración de DNS Inverso",
        "changeWarning": "Los cambios en el DNS inverso tardan hasta una hora en aparecer.",
        "ipAddresses": "Direcciones IP", "hostnames": "Nombres de Host",
        "updateReverseDns": "Actualizar DNS Inverso"
    },
    "bandwidthGraph": {"title": "Gráficos de Ancho de Banda", "graphTitle": "Gráfico de Ancho de Banda"},
    "ipmiLive": {
        "title": "IP IPMI",
        "whatThisDoes": "¿Qué hace esto?",
        "description": "Proporcionar IP en vivo al controlador IPMI restringido a su IP y limitado a 24 horas de uso.",
        "emailIpmiCredentials": "Enviar Credenciales IPMI por Correo",
        "assetId": "ID de Activo", "serverId": "ID del Servidor",
        "hostname": "Nombre de Host", "serverIp": "IP del Servidor",
        "serverIpmi": "IPMI del Servidor", "yourIpAddress": "Su Dirección IP"
    },
    "order": {
        "title": "Ordenar Servidor", "orderDedicated": "Ordenar Dedicado",
        "customizeOrder": "Personalizar Pedido", "orderDedicatedServer": "Ordenar Servidor Dedicado",
        "orderSummary": "Resumen del Pedido", "selectServer": "Seleccionar Servidor",
        "serverHostname": "Nombre de Host del Servidor",
        "hostnameExample": "Ejemplo: server.hostname.com",
        "hostnameHelp": "Use el nombre de host para identificar el servidor. El dominio no necesita ser válido o registrado. Se requiere un punto en el nombre de host. Otros ejemplos: database.local, web.server o your.name.",
        "rootPassword": "Contraseña de Root",
        "passwordRequirement": "Nota: La contraseña debe contener al menos 8 caracteres, una letra minúscula, una letra mayúscula, un número, un carácter especial.",
        "comments": "Comentarios", "addToCart": "Agregar al carrito",
        "monthlyTotal": "Total Mensual", "serverRegion": "Región del Servidor",
        "enterServerDetails": "Ingresar Detalles del Servidor",
        "currentlySoldOut": "¡Actualmente agotado!",
        "contactSales": "Por favor contacte a nuestro departamento de ventas.",
        "agreeToTerms": "Aceptar los términos de la oferta",
        "autoRenewNotice": "La suscripción se renovará automáticamente cada mes por {cost} hasta ser cancelada.",
        "tosAcknowledgement": "Al marcar esta casilla, reconoces que estás comprando un producto de suscripción que se renueva automáticamente (según los términos descritos anteriormente) y se cobra a la tarjeta de crédito que proporciones hoy. Si deseas cancelar la renovación automática, puedes acceder al portal del cliente, seleccionar el servicio activo y hacer clic en el enlace Cancelar o enviar un correo a: billing{'@'}interserver.net o usar otro método descrito en los Términos y Condiciones. Al marcar la casilla y hacer clic en Realizar Mi Pedido a continuación, también reconoces que has leído, comprendes y aceptas nuestros Términos y Condiciones y Política de Privacidad.",
        "iAgreeToTerms": "He leído los términos anteriores y estoy de acuerdo.",
        "placeOrder": "Realizar Mi Pedido", "continue": "Continuar",
        "cpuSelection": "Selección de CPU", "selectCpu": "Seleccionar CPU",
        "driveConfiguration": "Configuración de Unidades", "selectDrives": "Seleccionar Unidades",
        "addDrive": "Agregar Unidad", "removeDrive": "Eliminar Unidad",
        "selectedDrives": "Unidades Seleccionadas", "noDrivesSelected": "Sin unidades seleccionadas",
        "totalDrives": "Total de Unidades", "selectMemory": "Seleccionar Memoria",
        "selectBandwidth": "Seleccionar Ancho de Banda", "selectIps": "Seleccionar IPs",
        "selectOs": "Seleccionar Sistema Operativo", "selectControlPanel": "Seleccionar Panel de Control",
        "selectRaid": "Seleccionar Raid", "region": "Región",
        "buyNow": "Comprar Ahora", "setupTime": "Tiempo de Configuración",
        "monthly": "Mensual", "perMonth": "/mes",
        "showMore": "Mostrar Más", "showLess": "Mostrar Menos",
        "editDetails": "Editar detalles", "confirmOrder": "Confirmar Pedido",
        "backToOptions": "Regresar a Opciones"
    }
})

write_json('es', 'ssl', {
    "list": {"title": "Lista de Certificados SSL", "orderTitle": "Ordenar Registros SSL"},
    "view": {
        "title": "Ver SSL {id}", "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "billing": "Facturación",
        "billed": "facturado:", "statusIs": "El estado es:",
        "orderInfo": "Información del Pedido", "certificateInfo": "Información del Certificado",
        "links": "Enlaces",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {"title": "Ordenar SSL"},
    "changeApproverEmail": {"title": "Cambiar Correo del Aprobador", "selectApproverEmail": "Seleccionar Correo del Aprobador"}
})

write_json('es', 'tickets', {
    "list": {
        "title": "Lista de Tickets", "allTickets": "Todos los Tickets",
        "filterByAge": "Filtrar por Antigüedad", "quickFilter": "Filtro Rápido",
        "newTicket": "Nuevo Ticket", "last30Days": "Últimos 30 Días",
        "last90Days": "Últimos 90 Días", "last1Year": "Último Año",
        "last5Years": "Últimos 5 Años", "allTime": "Todo el Tiempo",
        "noTicketsFound": "¡No se encontraron tickets!",
        "searchPlaceholder": "Buscar por ID de Ticket / Asunto"
    },
    "view": {
        "title": "Ticket {id}", "titleSuffix": "Ver Ticket", "subject": "Asunto",
        "importantNotice": "Aviso Importante:",
        "emailDisabled": "Su correo electrónico ({email}) ha sido deshabilitado. Por favor contacte a",
        "support": "SOPORTE", "created": "Creado:", "updated": "Actualizado:",
        "allowServerAccess": "Permitir que InterServer modifique el servidor:",
        "yourIpAddress": "Su Dirección IP",
        "ipHelpText": "Si la conexión proviene de una dirección IP diferente. Por favor cámbiela.",
        "rootPassword": "Contraseña de Root",
        "rootPasswordPlaceholder": "VPS / Servidor Dedicado",
        "passwordEncrypted": "Las contraseñas se almacenan en una base de datos cifrada separada.",
        "isRootRestricted": "¿El Root SSH está Restringido?",
        "sudoUsername": "Nombre de Usuario Sudo",
        "sudoPassword": "Contraseña Sudo",
        "sshPort": "Puerto SSH", "postReply": "Publicar Respuesta",
        "closeTicket": "Cerrar Ticket",
        "ticketClosed": "Este ticket está cerrado, por lo que las respuestas están deshabilitadas. Si aún necesita asistencia, no dude en abrir un nuevo ticket y estaremos encantados de ayudar.",
        "replyContent": "Contenido de la Respuesta",
        "replyPlaceholder": "Publicación detallada sobre el problema",
        "replyHint": "Crear tickets separados para nuevos problemas ayuda a nuestro equipo a priorizarlos y resolverlos más rápido.",
        "attachMedia": "Adjuntar Medios", "ticketReplies": "Respuestas del Ticket",
        "staff": "Personal", "user": "Usuario", "participant": "Participante",
        "postedOn": "Publicado el:", "userLikedReply": "Al usuario le gustó tu respuesta",
        "userDislikedReply": "Al usuario no le gustó tu respuesta",
        "email": "Correo:", "closeConfirmTitle": "¿Está seguro?",
        "closeConfirmText": "¿Desea cerrar este ticket?",
        "closeConfirmButton": "¡Sí, cerrarlo!",
        "ticketClosed2": "Ticket Cerrado", "replyPosted": "Respuesta Publicada",
        "ticketSettingsUpdated": "Configuración del Ticket Actualizada"
    },
    "new": {
        "title": "Nuevo Ticket", "product": "Producto",
        "selectProduct": "Seleccionar Producto", "subject": "Asunto",
        "subjectPlaceholder": "Asunto",
        "subjectValidation": "Por favor ingrese una breve descripción sobre el problema.",
        "description": "Descripción",
        "descriptionPlaceholder": "Gracias por ayudarnos a mantener un sistema de soporte optimizado enviando una solicitud por ticket.",
        "descriptionValidation": "Por favor ingrese una descripción detallada sobre el problema.",
        "fileUpload": "Carga de Archivo",
        "fileNote": "Nota: Solo se permiten archivos de imagen - tipos gif/jpeg/png.",
        "serverAccess": "Acceso al Servidor",
        "allowAccessLabel": "Permito que InterServer acceda a mi servidor y realice modificaciones",
        "accessNote": "Tenga en cuenta: Al abrir una solicitud de soporte, InterServer puede necesitar acceder, depurar o modificar archivos en su cuenta. Este requisito es necesario para proporcionar soporte técnico. Por favor continúe solo si está de acuerdo.",
        "rootPassword": "Contraseña de Root", "yourIpAddress": "Su Dirección IP",
        "isRootRestricted": "¿El root SSH está restringido?",
        "sudoUser": "Usuario Sudo", "sudoPassword": "Contraseña Sudo",
        "sshPort": "Puerto SSH", "termsOfUse": "Términos de uso"
    }
})

write_json('es', 'users', {
    "title": "Usuarios", "addUser": "Agregar Usuario", "editUser": "Editar Usuario",
    "firstName": "Nombre", "lastName": "Apellido", "username": "Nombre de Usuario",
    "password": "Contraseña", "keepSamePassword": "Dejar en blanco para mantener la misma contraseña",
    "errorLoading": "Error al cargar usuarios:", "errorLoadingUser": "Error al cargar usuario:"
})

write_json('es', 'validation', {
    "required": "{field} es requerido",
    "email": "Debe ser una dirección de correo electrónico válida",
    "minLength": "Debe tener al menos {min} caracteres",
    "maxLength": "No debe tener más de {max} caracteres",
    "passwordMatch": "Las contraseñas deben coincidir",
    "invalidFormat": "Formato inválido",
    "numeric": "Debe ser un número",
    "url": "Debe ser una URL válida",
    "ipAddress": "Debe ser una dirección IP válida",
    "hostname": "Debe ser un nombre de host válido"
})

write_json('es', 'vps', {
    "list": {"title": "Lista de VPS", "orderVps": "Ordenar VPS"},
    "view": {
        "title": "Ver VPS {id}", "linkTitle": "VPS {id} {link}", "package": "Paquete",
        "billing": "Facturación", "billed": "facturado", "vpsStatus": "El estado de VPS es:",
        "hostServer": "Servidor Host:", "ipIs": "IP es:", "vzid": "Vzid:",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "vpsInformation": "Información de VPS",
        "powerStatus": "El estado de energía es:", "selectAction": "Seleccionar Acción",
        "comment": "Comentario:", "commentNone": "ninguno", "disk": "Disco",
        "totalSpace": "Espacio Total:", "usedSpace": "Espacio Usado:",
        "remainingSpace": "Espacio Restante:", "systemInformation": "Información del Sistema",
        "memory": "Memoria:", "diskDrive": "Unidad de Disco:", "cpuCores": "Núcleos de CPU:",
        "os": "SO:", "links": "Enlaces", "controlPanelAddon": "Complemento del Panel de Control",
        "reinstallNote": "Puede reinstalar desde el menú izquierdo",
        "reinstallPath": "Mantenimiento -> Reinstalar Sistema Operativo",
        "startingFrom": "A partir de:", "notSupported": "( No Compatible )",
        "orderConfirmation": "Confirmación del Pedido", "placeOrder": "Realizar Pedido",
        "cpanelNote": "El panel de control necesita instalarse en una instalación limpia del SO sin modificaciones. Si hay algún dato, se perderá.",
        "cpuUsage": "Uso de CPU", "attention": "Atención", "item": "Elemento",
        "value": "Valor", "updateComment": "Actualizar Comentario",
        "saveChanges": "Guardar cambios", "resendWelcomeEmail": "¿Está seguro?",
        "resendWelcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "order": {
        "title": "Ordenar VPS", "vpsDetails": "Detalles del VPS", "storage": "Almacenamiento:",
        "memoryLabel": "Memoria:", "transfer": "Transferencia:", "platform": "Plataforma",
        "location": "Ubicación", "slices": "Porciones", "osDistribution": "Distribución del SO",
        "osVersion": "Versión del SO", "hostname": "Nombre de Host",
        "hostnamePlaceholder": "servidor.dominio.com", "rootPassword": "Contraseña de Root",
        "rootPasswordNote": "Nota: La contraseña debe contener al menos 8 caracteres, una letra minúscula, una letra mayúscula, un número y un carácter especial.",
        "couponCode": "Código de Cupón", "couponCodePlaceholder": "Código de Cupón",
        "continue": "Continuar", "orderSummary": "Resumen del Pedido",
        "months": "{count} Mes(es)", "billingCycleDiscount": "Descuento del ciclo de facturación:",
        "total": "Total", "recommendations": "Recomendaciones",
        "linuxVps": "VPS Linux", "directAdminVps": "VPS DirectAdmin",
        "windowsVps": "VPS Windows", "cpanelVps": "VPS cPanel",
        "linuxDesktopVps": "VPS Escritorio Linux", "webuzoVps": "VPS Webuzo",
        "locationAvailability": "Disponibilidad de Ubicación",
        "locationPlatform": "Ubicación / Plataforma",
        "kvmLinux": "KVM Linux", "hyperV": "HyperV", "kvmStorage": "Almacenamiento KVM",
        "windowsOnlyHyperV": "Windows (solo en HyperV)", "perSlice": "Por Porción",
        "agreeToTerms": "Aceptar los términos de la oferta",
        "subscriptionRenewal": "La suscripción se renovará automáticamente después de {period} por {cost} hasta ser cancelada.",
        "tosAcknowledgment": "Al marcar esta casilla, reconoces que estás comprando un producto de suscripción que se renueva automáticamente y se cobra a la tarjeta de crédito que proporciones hoy. Si deseas cancelar la renovación automática, puedes acceder al portal del cliente, seleccionar el servicio activo y hacer clic en el enlace Cancelar o enviar un correo a: billing{'@'}interserver.net o usar otro método descrito en los Términos y Condiciones. Al marcar la casilla y hacer clic en Realizar Mi Pedido a continuación, también reconoces que has leído, comprendes y aceptas nuestros Términos y Condiciones y Política de Privacidad.",
        "tosAgree": "He leído los términos anteriores y estoy de acuerdo.",
        "editDetails": "Editar detalles", "vpsLocation": "Ubicación del VPS",
        "hdSpace": "Espacio en HD", "bandwidth": "Ancho de Banda",
        "operatingSystem": "Sistema Operativo", "couponUsed": "Cupón Utilizado",
        "couponDiscount": "Descuento del Cupón", "placeOrder": "Realizar Pedido"
    },
    "buyIp": {
        "title": "Complemento de IP Adicional para su VPS",
        "existingAddonIps": "IPs de Complemento Existentes",
        "additionalIp": "IP Adicional", "immediateCost": "Costo Inmediato ({currency})",
        "placeOrder": "Realizar Pedido", "pleaseWait": "¡Por favor espere!",
        "success": "Éxito{text}", "gotError": "Error {text}"
    },
    "buyHdSpace": {
        "title": "Espacio de Disco VPS Adicional", "goBack": "Regresar",
        "costPerMonth": "Costo Por Mes ({symbol})",
        "perTenGb": "{symbol}{cost} por 10GB por Mes",
        "additionalSpace": "Espacio Adicional", "selectSpace": "Seleccionar Espacio",
        "spaceNote": "Se puede comprar un mínimo de 1 hasta 100GB de espacio HD adicional",
        "confirmOrder": "Confirmar Pedido"
    },
    "changeHostname": {
        "title": "Cambiar Nombre de Host del VPS",
        "existingHostname": "Nombre de Host Existente",
        "newHostname": "Nuevo Nombre de Host",
        "placeholder": "su.servidor.com", "example": "Por Ejemplo: su.servidor.com",
        "updateHostname": "Actualizar Nombre de Host"
    },
    "changeRootPassword": {
        "title": "Cambiar Contraseña de Root del VPS",
        "server": "Servidor:", "newPassword": "Nueva Contraseña:",
        "confirmPassword": "Confirmar Contraseña:", "changePassword": "Cambiar Contraseña",
        "passwordMismatch": "La contraseña y la confirmación de contraseña no coinciden"
    },
    "changeTimezone": {
        "title": "Cambiar Zona Horaria de {module}",
        "importantNote1": "Debes apagar completamente tu {module} antes de cambiar la zona horaria.",
        "importantNote2": "El VPS se Apagará y reiniciará durante el proceso.",
        "importantNote3": "La zona horaria en esta página siempre será America/New_York independientemente de lo que esté configurado en tu servidor.",
        "selectTimezone": "Seleccionar Zona Horaria", "changeZone": "Cambiar Zona",
        "pleaseWait": "¡Por favor espere!", "success": "Éxito{text}",
        "gotError": "Error {message}"
    },
    "changeWebuzoPassword": {
        "title": "Cambiar Contraseña de Administrador de Webuzo",
        "hostname": "Nombre de Host", "newPassword": "Nueva Contraseña",
        "confirmPassword": "Confirmar Contraseña",
        "portalLoginPassword": "Contraseña de Inicio de Sesión de Nuestro Portal",
        "changePassword": "Cambiar Contraseña",
        "passwordMismatch": "La contraseña y la confirmación de contraseña no coinciden"
    },
    "reinstallOs": {
        "title": "Reinstalar SO",
        "importantNote1": "Reinstalar el sistema operativo eliminará todos los datos.",
        "importantNote2": "Antes de reinstalar el sistema operativo, por favor realice una copia de seguridad.",
        "currentOs": "SO Actual", "osDistribution": "Distribución del Sistema Operativo",
        "version": "Versión", "newPassword": "Nueva Contraseña",
        "confirmPassword": "Confirmar Contraseña", "loginPassword": "Contraseña de Inicio de Sesión",
        "confirmReinstall": "¡Quiero reinstalar el SO!",
        "confirmReinstallButton": "Confirmar Reinstalación del SO"
    },
    "resetPassword": {
        "title": "Restablecer Contraseña del VPS", "server": "Servidor",
        "importantNote": "Nota Importante",
        "windowsWarning": "El restablecimiento de contraseña de Windows resultará en un apagado no limpio. Por favor considere esto como último recurso. Verifique en VNC que no se estén ejecutando actualizaciones. Si hay una actualización en ejecución, VNC mostrará: Windows está aplicando actualizaciones, no apague. Apagar en este estado puede resultar en una máquina que no puede arrancar.",
        "confirmReset": "¡Quiero Restablecer la Contraseña!",
        "resetPasswordButton": "Restablecer Contraseña"
    },
    "reverseDns": {
        "title": "DNS Inverso",
        "dnsChangeNote": "Los cambios en el DNS inverso tardan hasta una hora en aparecer.",
        "updateReverseDns": "Actualizar DNS Inverso",
        "pleaseWait": "¡Por favor espere!", "success": "Éxito{text}",
        "gotError": "Error {text}"
    },
    "vnc": {
        "remoteDesktop": "Conexión de Escritorio Remoto de Microsoft",
        "remoteDesktopDescription": "Disponible solo en la Plataforma Windows. El escritorio remoto es una forma rápida y conveniente de conectarse al escritorio de una máquina virtual.",
        "remoteDesktopStep1": "La contraseña de Administrador debe establecerse primero en el VPS antes de poder usar el escritorio remoto.",
        "remoteDesktopStep2": "Conéctese con VNC o HTML5 VNC para establecer su contraseña inicial.",
        "remoteDesktopNote": "Para un tutorial de escritorio remoto haga clic en",
        "here": "aquí",
        "desktopVnc": "Conexión VNC de Escritorio",
        "desktopVncDescription": "VNC le permite conectarse al escritorio de la máquina virtual. VNC puede ejecutarse en el navegador o como cliente independiente. La dirección IP de su computadora debe tener acceso antes de que se pueda establecer la conexión.",
        "grantIpAccess": "Otorgar Acceso de su IP a VNC",
        "grantIpWait": "Por favor espere 2 minutos para que la acción se complete.",
        "vncClientNote": "También puede descargar uno de los muchos clientes VNC disponibles en internet. Recomendamos TightVNC. Conéctese usando la dirección IP de su VPS. No se requiere contraseña después de que su dirección IP remota haya sido otorgada en el paso 1.",
        "browserVnc": "Conexión VNC del Navegador",
        "connectHtml5": "Para conectarse usando el Cliente VNC HTML5:",
        "connectOldLayout": "Para conectarse usando el diseño antiguo:",
        "clickHere": "Haga Clic Aquí",
        "html5Note": "Cliente VNC HTML5 que funciona bien en cualquier navegador moderno incluyendo navegadores móviles (iOS y Android)."
    },
    "setupVnc": {
        "title": "Configurar VNC", "vpsName": "Nombre del VPS", "vpsIp": "IP del VPS",
        "vncIpPort": "IP:Puerto VNC", "ipToGrant": "IP para otorgar acceso VNC",
        "grantAccess": "Otorgar Acceso VNC a la IP",
        "pleaseWait": "¡Por favor espere!", "success": "Éxito{text}",
        "gotError": "Error {text}"
    },
    "insertCd": {
        "enableCdrom": "Habilitar Unidad CDROM",
        "insertIso": "Insertar Imagen ISO en la Unidad CDROM",
        "allowedProtocols": "Protocolos Permitidos",
        "chooseImage": "Elegir Imagen", "or": "O", "enterUrl": "Ingresar URL",
        "urlPlaceholder": "Ingrese una URL de ISO de CD o DVD",
        "areYouSure": "¿Está seguro?", "continueButton": "Continuar"
    },
    "backup": {
        "importantNote": "Nota Importante",
        "backupsPartitionNote": "Las copias de seguridad solo funcionarán con la partición predeterminada.",
        "backupTitle": "Copia de Seguridad de {name}",
        "currentBackups": "Copias de Seguridad Actuales", "server": "Servidor",
        "confirmBackup": "¿Realmente desea realizar una copia de seguridad?",
        "noteLabel": "Nota:", "noBackup": "No existe ninguna copia de seguridad actualmente",
        "service": "Servicio", "type": "Tipo", "size": "Tamaño"
    },
    "backups": {
        "title": "Administrar Copias de Seguridad de VPS", "vps": "VPS",
        "type": "Tipo", "backupName": "Nombre de la Copia de Seguridad",
        "size": "Tamaño", "options": "Opciones"
    },
    "restore": {
        "importantNote": "Nota Importante",
        "offlineNote": "Su servidor estará fuera de línea mientras reemplaza todos sus archivos actuales con los de la copia de seguridad. Por favor contacte al soporte con cualquier pregunta.",
        "backupTitle": "Copia de Seguridad de {name}", "server": "Servidor",
        "restoreThisBackup": "Restaurar esta copia de seguridad",
        "selectBackup": "Seleccionar una copia de seguridad",
        "loginPasswordLabel": "Ingrese la Contraseña de Inicio de Sesión para Validar la Restauración.",
        "confirmRestore": "¿Realmente desea restaurar esta copia de seguridad?"
    },
    "trafficUsage": {
        "title": "Uso de Ancho de Banda / Tráfico", "displayIn": "Mostrar en:",
        "bits": "bits", "bytes": "bytes",
        "billingNote": "Esto no se usa para cálculos de facturación y es solo una estimación basada en sus tarjetas de red virtual.",
        "todayUsage": "Uso de Hoy", "hourlyUsage": "Uso por Hora",
        "dailyUsage": "Uso Diario", "statistics": "Estadísticas", "history": "Historial",
        "in": "Entrada", "out": "Salida", "today": "Hoy", "thisMonth": "Este Mes",
        "thisYear": "Este Año", "all": "Todos", "usage": "Uso", "current": "Actual",
        "average": "Promedio", "peak": "Pico"
    },
    "slices": {
        "title": "Actualizar / Degradar Porciones",
        "upgradeDowngrade": "Actualizar / Degradar",
        "cpuCores": "Núcleos de CPU:", "memory": "Memoria:", "disk": "Disco:",
        "slicesCount": "Porciones ( Cantidad )",
        "slicesNote": "Se pueden adjuntar hasta 32 Porciones a un VPS.",
        "slicesDisplay": "{current}/{max} Porciones",
        "immediateCost": "Costo Inmediato ( {symbol} )",
        "proratedNote": "Monto prorrateado a pagar ahora.",
        "additionalFees": "Cargos Adicionales ( {symbol} )",
        "recurringBillNote": "La factura recurrente cambiará en esta cantidad",
        "updatedVpsCost": "Costo Actualizado del VPS ( {symbol} )",
        "newInvoiceNote": "Las nuevas facturas costarán esta cantidad",
        "confirmLabel": "Sí, quiero hacer esto.",
        "confirmButton": "Confirmar"
    },
    "common": {
        "importantNoteLabel": "Nota Importante #{number}:",
        "goBack": "Regresar", "back": "Atrás", "pleaseWait": "¡Por favor espere!",
        "success": "Éxito{text}", "gotError": "Error {error}"
    }
})

write_json('es', 'webhosting', {
    "list": {"title": "Lista de Alojamiento Web", "orderTitle": "Ordenar Registros de Sitio Web"},
    "view": {
        "title": "Ver Sitio Web {id}", "package": "Paquete",
        "nextInvoiceDate": "Próxima Fecha de Factura:", "billing": "Facturación",
        "billed": "facturado", "billingStatusIs": "El Estado de Facturación es:",
        "hostInfo": "Información del Host", "username": "Nombre de Usuario:",
        "ip": "IP:", "server": "Servidor:", "notSetYet": "No configurado aún",
        "login": "Iniciar Sesión", "types": "Tipos:", "linksLabel": "Enlaces:",
        "manualLogin": "Inicio de Sesión Manual", "automaticLogin": "Inicio de Sesión Automático",
        "clickHere": "Haga Clic Aquí",
        "defaultNameservers": "Servidores de Nombres Predeterminados",
        "nameservers": "Servidores de Nombres:", "externalLinks": "Enlaces Externos",
        "names": "Nombres:", "websitePreview": "Vista Previa del Sitio Web", "links": "Enlaces",
        "welcomeEmailConfirm": "¿Está seguro de que desea reenviar el correo de bienvenida?",
        "emailSent": "Correo Enviado",
        "emailSentMessage": "El correo de bienvenida ha sido reenviado. Revise su bandeja de entrada."
    },
    "buyIp": {
        "title": "Comprar Complemento de IP Adicional",
        "existingAddonIps": "IPs de Complemento Existentes",
        "additionalIp": "IP Adicional", "monthlyCost": "Costo Mensual ({symbol})",
        "costDescription": "Costo ({symbol}) cada mes cuando se factura su sitio web",
        "confirmPurchase": "Confirmar Compra",
        "confirmMessage": "Costo de IP adicional: {symbol}{cost}/mes. ¿Está seguro de que desea ordenar una IP adicional?",
        "placeOrder": "Realizar Pedido", "orderPlaced": "Pedido Realizado"
    },
    "reverseDns": {"title": "DNS Inverso", "updateReverseDns": "Actualizar DNS Inverso"},
    "downloadBackups": {
        "title": "Descargar Copias de Seguridad", "backup": "Copia de Seguridad",
        "size": "Tamaño", "options": "Opciones"
    },
    "migration": {
        "title": "Migrar su Sitio Web",
        "currentWebHostInfo": "Información del Host Web Actual",
        "customerPortalUrl": "URL del Portal del Cliente",
        "portalExample": "Por Ejemplo: sso.godaddy.com",
        "registeredUsername": "Nombre de Usuario / Correo / ID Registrado",
        "password": "Contraseña", "controlPanelUrl": "URL del Panel de Control",
        "controlPanelExample": "Por Ejemplo: sudominio.com/cpanel",
        "ftpUsername": "Nombre de Usuario FTP / Panel de Control",
        "ftpPassword": "Contraseña FTP / Panel de Control",
        "holdingPageQuestion": "Si el sitio está activo/ocupado con mucho tráfico, ¿podemos establecer una página de espera durante la migración?",
        "specialRequirementsQuestion": "¿Este sitio tiene requisitos especiales como Versión de PHP / Módulos?",
        "domainRegistryInfo": "Información del Registro de Dominio",
        "transferDomainQuestion": "¿También desea que le ayudemos a transferir el registro del nombre de dominio?",
        "updateNameserversQuestion": "¿Desea que actualicemos los servidores de nombres tan pronto como terminemos la migración de datos?",
        "domainRegistryPortal": "Portal del Cliente del Registro de Dominio",
        "importantNotes": "Notas Importantes",
        "note1": "Completar este formulario abrirá un nuevo ticket para que nuestro departamento de soporte comience su migración.",
        "note2": "Por favor sea lo más completo y preciso posible para evitar retrasos.",
        "note3": "Una migración típica se completa en 48 a 72 horas. A veces más tiempo si la cantidad de datos a copiar es grande.",
        "note4": "La cuenta de alojamiento antigua debe estar en línea y accesible mientras realizamos la migración, de lo contrario podemos enfrentar dificultades.",
        "note5": "Por favor no realice actualizaciones en su sitio mientras realizamos la migración, de lo contrario esos datos podrían no copiarse al nuevo alojamiento."
    },
    "order": {"title": "Ordenar Sitio Web"}
})

print("All ES files written successfully!")
