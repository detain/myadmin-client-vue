#!/usr/bin/env python3
"""Apply missing translations for 8 languages: af, am, ar, bg, ca, ceb, co, eo"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def deep_merge(base, updates):
    for k, v in updates.items():
        if k in base and isinstance(base[k], dict) and isinstance(v, dict):
            deep_merge(base[k], v)
        else:
            base[k] = v

def apply_lang(lang, file_name, translations):
    path = os.path.join(BASE, lang, file_name)
    with open(path, encoding='utf-8') as f:
        existing = json.load(f)
    deep_merge(existing, translations)
    with open(path, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'  OK: {lang}/{file_name}')

AT = "{'@'}"

# ─────────────────────────────────────────────────────────────
# AFRIKAANS (af)
# ─────────────────────────────────────────────────────────────
print("=== af ===")

apply_lang('af', 'domains.json', {
  "view": {"pageTitleWithLink": "Domein {id} {link}"},
  "order": {
    "premiumAvailable": f"Ja! Jou domein {{domain}} is beskikbaar en dit is 'n premium domein. Outomatiese registrasie is gedeaktiveer. E-pos {{email}} as u hierdie domein vir {{cost}} per jaar wil koop.",
    "premiumTaken": f"Jammer! Jou domein {{domain}} is reeds geneem! Besit jy dit al? Jy kan dit oordra, en dit is 'n premium domein. Outomatiese registrasie is gedeaktiveer. E-pos {{email}} as u hierdie domein vir {{cost}} per jaar wil koop.",
    "whoisPrivacyLabel": "Whois Privaatheid vir {cost} / jaar",
    "enabled": "Geaktiveer", "disabled": "Gedeaktiveer",
    "whatIsWhoisPrivacy": "Wat is hierdie Whois Privaatheid?",
    "subscriptionAutoRenew": "Die intekening sal outomaties elke jaar by {cost} hernu totdat dit gekanselleer word.",
    "subscriptionDisclaimer": f"Deur hierdie blokkie te merk, erken u dat u 'n intekenprodukte koop wat outomaties hernu (Soos Per Die Terme Hierbo Uiteengesit) en aan die kredietkaart gefaktureer word wat u vandag verskaf. As u u outo-hernuwing wil kanselleer, kan u die kliënteportaal (Hier) besoek, die aktiewe diens kies en op die Kanselleer-skakel klik of e-pos stuur aan: billing{AT}interserver.net of 'n ander metode gebruik soos in die Terme en Voorwaardes uiteengesit. Deur die blokkie te merk en hieronder op Plaas My Bestelling te klik, erken U ook dat u ons Terme en Voorwaardes en Privaatheidbeleid gelees, verstaan en daarmee akkoord gaan.",
    "contactSales": "Kontak Verkope", "premium": "Premium",
    "renewAt": f"Hernu {AT} {{cost}}",
    "searchingDomain": "Wag asseblief! Soek na hierdie domeinnaam.",
    "loadingDomainFields": "Wag asseblief! Laai domeinvelde.", "gotError": "Fout:"
  },
  "nameservers": {
    "registeredNameservers": "Geregistreerde Naamsbedieners", "canDelete": "Kan Verwyder",
    "suggestedApplied": "Voorgestelde naamsbedieners is toegepas. Klik Opdateer om te stoor."
  },
  "eppCode": {
    "title": "E-pos EPP-kode", "confirmButton": "Ja, Stuur My",
    "confirmMessage": "Is u seker dat u die EPP-kode na die geregistreerde e-posadres wil stuur?"
  },
  "whois": {
    "renewalNote": "Whois Privaatheid word elke 12 maande hernu vanaf die aktiveringsdatum. Hernu koste vir Whois Privaatheid-aanhangsel is {cost}.",
    "notAvailable": "Whois Privaatheid is nie beskikbaar vir hierdie TLD nie.",
    "domain": "Domein", "whoisCost": "Whois Koste", "contactPrivacy": "Kontakprivaatheid",
    "contactPrivacyDescription1": "Kontakprivaatheid verberg die identiteit van 'n Registrant wanneer 'n gebruiker 'n WHOIS-naslaan op die Registrant se domein doen.",
    "contactPrivacyDescription2": "Die voordeel van Kontakprivaatheid is dat die Registrant se identiteit, insluitend tuisadres, telefoonnommer en e-posadres, teen strooiposstuurders, identiteitsdiefstalle en bedrieërs beskerm word.",
    "contactPrivacyDescription3": "Wanneer Registrante die Kontakprivaatheidsdiens aktiveer, verskyn gemaskerde kontakinligting in die openbare WHOIS-databasis.",
    "contactPrivacyAvailable": "Kontakprivaatheid is beskikbaar vir {cost} per domein per jaar.",
    "confirmOrderTitle": "Bevestig Bestelling",
    "confirmOrderMessage": "Whois Privaatheid koste: {cost} per jaar. Is u seker dat u hierdie bestelling wil plaas?",
    "placingOrder": "Plaas bestelling...",
    "enableTitle": "Aktiveer Whois Privaatheid",
    "enableMessage": "Jou domein {hostname} het 'n betaalde Whois Privaatheid-aanhangsel wat nog nie geaktiveer is nie. Wil u dit nou aktiveer?",
    "enablingWhois": "Aktiveer Whois Privaatheid...",
    "disableTitle": "Deaktiveer en Kanselleer Whois Privaatheid",
    "disableMessage": "Jou domein {hostname} se Whois Privaatheid-aanhangsel is tans geaktiveer. Is u seker dat u dit wil deaktiveer en kanselleer?",
    "disablingWhois": "Deaktiveer Whois Privaatheid..."
  },
  "whoisToggle": {
    "title": "Whois Privaatheid Aanhangsel", "enableConfirm": "Aktiveer Whois",
    "disableCancelConfirm": "Deaktiveer en Kanselleer dit.",
    "addonEnabled": "Jou domein {domain} se Whois Privaatheid-aanhangsel is Geaktiveer",
    "addonDisabled": "Jou domein {domain} se Whois Privaatheid-aanhangsel is Gedeaktiveer",
    "confirmEnable": "Is u seker dat u Whois wil aktiveer?",
    "confirmDisable": "Is u seker dat u dit wil deaktiveer en kanselleer?"
  },
  "dnssec": {
    "title": "DNSSEC Inligting", "addNewRecord": "Voeg Nuwe Rekord By",
    "removeAllRecords": "Verwyder Alle DNSSEC Rekords",
    "noRecords": "Geen DNSSEC Rekords gevind nie.", "addDnssec": "Voeg DNSSEC By",
    "importDs": "Invoer DS", "digestType": "Verteringsoort #{number}",
    "algorithm": "Algoritme #{number}", "keyTag": "Sleutelmerk #{number}",
    "digest": "Vertering #{number}", "digestTypeHeader": "Verteringsoort",
    "algorithmHeader": "Algoritme", "keyTagHeader": "Sleutelmerk", "digestHeader": "Vertering",
    "select": "Kies", "enterKeyTag": "Voer Sleutelmerk in (Voorbeeld: 2371)",
    "enterDigest": "Voer Waarde van Vertering in (Mag nie groter as {max} Karakters wees nie)",
    "charactersLeft": "Karakters oor: {count}", "addMore": "Voeg Meer By", "import": "Invoer",
    "importPlaceholder": "host.com. IN DS 1172 13 1 26ffc7 ; ( SHA1 vertering )",
    "invalidDsRecord": "Ongeldige DS-rekord",
    "unableToParse": "Kan nie DS-rekordformaat ontleed nie.",
    "confirmRemoveAll": "Dit sal alle DNSSEC-rekords vir hierdie domein verwyder.",
    "yesRemoveThem": "Ja, verwyder hulle!", "removingRecords": "Verwyder DNSSEC-rekords...",
    "removed": "Verwyder", "removeSuccess": "DNSSEC-rekords suksesvol verwyder!",
    "savingRecords": "Stoor DNSSEC-rekords...", "saveSuccess": "DNSSEC-rekords suksesvol gestoor!",
    "noRecordsWarning": "Vul asseblief ten minste een DNSSEC-rekord in."
  },
  "renew": {
    "tip1": "Domein moet op of voor vervaldatum hernu word.",
    "tip2": "As domein verval, kan dit 'n grasietydperk hê vanaf vervaldatum om te hernu.",
    "tip3": "Aktiveer Whois Privaatheid om u Kontakinligting te verberg wanneer 'n gebruiker 'n WHOIS-naslaan op die Registrant se domein doen.",
    "whoisCost": "Whois Koste", "alreadyRenewed": "U het reeds u domein hernu!",
    "payExistingInvoice": "Om u domein te hernu, betaal asseblief die bestaande faktuur.",
    "confirmRenewalMessage": "Totale koste: {cost}. Is u seker dat u hierdie hernuwingsbestelling wil plaas?",
    "placingRenewalOrder": "Plaas hernuwingsbestelling...",
    "renewalOrderPlaced": "Bestelling Geplaas",
    "renewalOrderSuccess": "Domein hernuwingsbestelling suksesvol geplaas!",
    "loadingRenewalInfo": "Laai hernuwingsinligting..."
  },
  "transfer": {
    "title": "Oordragstatus", "notATransfer": "Hierdie domein is nie 'n oordrag nie.",
    "statusLabel": "Status", "statusDetails": "Statusbesonderhede",
    "transferrable": "Oordraagbaar", "transferType": "Oordragtipe", "reason": "Rede",
    "loadingTransferStatus": "Laai oordragstatus..."
  }
})

apply_lang('af', 'servers.json', {
  "view": {"unBilled": "Ongefaktureer","moreInfo": "Meer Inligting","cycle": "Siklus",
           "reset": "Herstel","on": "Aan","off": "Af","unknown": "Onbekend","noLease": "Geen Huur"},
  "reverseDns": {"title": "Omgekeerde DNS-instellings",
    "changeWarning": "Veranderinge aan omgekeerde DNS neem tot 'n uur om te verskyn.",
    "ipAddresses": "IP-adresse","hostnames": "Gasheername","updateReverseDns": "Opdateer Omgekeerde DNS"},
  "bandwidthGraph": {"title": "Bandbreedtegrafieke","graphTitle": "Bandbreedtegrafiek"},
  "ipmiLive": {"title": "IPMI IP","whatThisDoes": "Wat doen dit?",
    "description": "Gee lewendige IP aan IPMI-beheerder beperk tot u IP en beperk tot 24 uur gebruik.",
    "emailIpmiCredentials": "E-pos IPMI Geloofsbriewe","assetId": "Bate-ID",
    "serverId": "Bedieneer-ID","hostname": "Gasheernaam","serverIp": "Bedieneer IP",
    "serverIpmi": "Bedieneer IPMI","yourIpAddress": "U IP-adres"},
  "order": {
    "customizeOrder": "Pasmaak Bestelling",
    "hostnameExample": "Voorbeeld: server.hostname.com",
    "hostnameHelp": "Gebruik die gasheernaam om die bediener te identifiseer. Die domein hoef nie geldig of geregistreer te wees nie. Een punt word vereis in die gasheernaam. Ander voorbeelde: database.local, web.server of your.name.",
    "passwordRequirement": "Let op: Wagwoord moet ten minste 8 karakters bevat, een kleinletter, een hoofletter, een nommer, 'n spesiale karakter.",
    "enterServerDetails": "Voer Bedieneerbesonderhede In",
    "currentlySoldOut": "Tans uitverkoop!",
    "contactSales": "Kontak asseblief ons verkoopsafdeling.",
    "autoRenewNotice": "Die intekening sal outomaties elke maand by {cost} hernu totdat dit gekanselleer word.",
    "tosAcknowledgement": f"Deur hierdie blokkie te merk, erken u dat u 'n intekenprodukte koop wat outomaties hernu (Soos Per Die Terme Hierbo Uiteengesit) en aan die kredietkaart gefaktureer word wat u vandag verskaf. As u u outo-hernuwing wil kanselleer, kan u die kliënteportaal besoek, die aktiewe diens kies en op die Kanselleer-skakel klik of e-pos stuur aan: billing{AT}interserver.net of 'n ander metode gebruik soos in die Terme en Voorwaardes uiteengesit. Deur die blokkie te merk en hieronder op Plaas My Bestelling te klik, erken u ook dat u ons Terme en Voorwaardes en Privaatheidbeleid gelees, verstaan en daarmee akkoord gaan.",
    "continue": "Gaan Voort","selectCpu": "Kies SVE","selectDrives": "Kies Aandrywers",
    "selectedDrives": "Geselekteerde Aandrywers","noDrivesSelected": "Geen aandrywers gekies",
    "totalDrives": "Totale Aandrywers","setupTime": "Opstellingstyd",
    "showMore": "Wys Meer","showLess": "Wys Minder",
    "editDetails": "Wysig besonderhede","backToOptions": "Terug na Opsies"
  }
})

apply_lang('af', 'tickets.json', {
  "view": {
    "titleSuffix": "Bekyk Kaartjie",
    "emailDisabled": "Jou e-pos ({email}) is gedeaktiveer. Kontak asseblief",
    "support": "ONDERSTEUNING",
    "ipHelpText": "As verbinding van 'n ander IP-adres kom. Verander dit asseblief.",
    "rootPasswordPlaceholder": "VPS / Toegewyde Bediener",
    "passwordEncrypted": "Wagwoorde word in 'n aparte geënkripteerde databasis gestoor.",
    "ticketClosed": "Hierdie kaartjie is gesluit, dus antwoorde is gedeaktiveer. As u steeds hulp nodig het, voel vry om 'n nuwe kaartjie te open en ons sal graag help.",
    "replyPlaceholder": "Gedetailleerde plasing oor die probleem",
    "replyHint": "Die skep van aparte kaartjies vir nuwe kwessies help ons span om hulle vinniger te prioritiseer en op te los.",
    "participant": "Deelnemer","userLikedReply": "Gebruiker het u antwoord gehou",
    "userDislikedReply": "Gebruiker het u antwoord nie gehou nie","email": "E-pos:",
    "closeConfirmTitle": "Is u seker?","closeConfirmText": "Wil u hierdie kaartjie sluit?",
    "ticketSettingsUpdated": "Kaartjie-instellings Opgedateer"
  },
  "new": {
    "subjectPlaceholder": "Onderwerp",
    "subjectValidation": "Voer asseblief 'n kort beskrywing van die probleem in.",
    "descriptionPlaceholder": "Dankie dat u ons help om 'n gestroomlynde ondersteuningstelsel te handhaaf deur een versoek per kaartjie in te dien.",
    "descriptionValidation": "Voer asseblief 'n gedetailleerde beskrywing van die probleem in.",
    "fileNote": "Let op: Slegs lêers - gif/jpeg/png tipes word toegelaat.",
    "allowAccessLabel": "Ek laat InterServer toe om toegang tot my bediener te verkry en wysigings uit te voer",
    "accessNote": "Let asseblief op: Deur 'n ondersteuningsversoek te open, sal InterServer moontlik toegang moet verkry, ontfout of lêers in u rekening wysig. Hierdie vereiste is nodig om tegniese ondersteuning te bied. Gaan asseblief slegs voort as u saamstem."
  }
})

af_vps = {
  "view": {
    "linkTitle": "VPS {id} {link}","ipIs": "IP is:","vzid": "Vzid:","commentNone": "geen",
    "diskDrive": "Skyfskyf:","controlPanelAddon": "Beheerpaneel-aanhangsel",
    "reinstallNote": "U kan herinstalleer vanaf die linkerkieslys",
    "reinstallPath": "Onderhoud -> Herinstalleer Bedryfstelsel",
    "startingFrom": "Begin Vanaf:","notSupported": "( Nie Ondersteun )",
    "orderConfirmation": "Bestellingbevestiging","placeOrder": "Plaas Bestelling",
    "cpanelNote": "Beheerpaneel moet op 'n skoon bedryfstelselinstallasie sonder wysigings geinstaleer word. As daar enige data is, sal dit verloor word.",
    "cpuUsage": "SVE Gebruik","attention": "Aandag","item": "Item","value": "Waarde",
    "resendWelcomeEmail": "Is u seker?",
    "resendWelcomeEmailConfirm": "Is u seker dat u die welkom-e-pos wil herversend?"
  },
  "order": {
    "vpsDetails": "VPS Besonderhede","storage": "Stoor:","memoryLabel": "Geheue:",
    "transfer": "Oordrag:","platform": "Platform","location": "Ligging","slices": "Skywe",
    "hostnamePlaceholder": "server.domain.com",
    "rootPasswordNote": "Let op: Wagwoord moet ten minste 8 karakters bevat, een kleinletter, een hoofletter, een nommer, en 'n spesiale karakter.",
    "couponCodePlaceholder": "Koeponkode","months": "{count} Maand(e)",
    "billingCycleDiscount": "Faktureringssiklus afslag:","recommendations": "Aanbevelings",
    "linuxVps": "Linux VPS","directAdminVps": "DirectAdmin VPS","windowsVps": "Windows VPS",
    "cpanelVps": "cPanel VPS","linuxDesktopVps": "Linux Lessenaar VPS","webuzoVps": "Webuzo VPS",
    "locationAvailability": "Liggingsbeskikbaarheid","locationPlatform": "Ligging / Platform",
    "kvmLinux": "KVM Linux","hyperV": "HyperV","kvmStorage": "KVM Stoor",
    "windowsOnlyHyperV": "Windows (slegs op HyperV)","perSlice": "Per Skyf",
    "subscriptionRenewal": f"Die intekening sal outomaties na {{period}} by {{cost}} hernu totdat dit gekanselleer word.",
    "tosAcknowledgment": f"Deur hierdie blokkie te merk, erken u dat u 'n intekenprodukte koop wat outomaties hernu en aan die kredietkaart gefaktureer word wat u vandag verskaf. As u u outo-hernuwing wil kanselleer, kan u die kliënteportaal besoek, die aktiewe diens kies en op die Kanselleer-skakel klik of e-pos stuur aan: billing{AT}interserver.net of 'n ander metode gebruik soos in die Terme en Voorwaardes uiteengesit. Deur die blokkie te merk en hieronder op Plaas My Bestelling te klik, erken u ook dat u ons Terme en Voorwaardes en Privaatheidbeleid gelees, verstaan en daarmee akkoord gaan.",
    "editDetails": "Wysig besonderhede","vpsLocation": "VPS Ligging","hdSpace": "HD Spasie",
    "bandwidth": "Bandwydte","operatingSystem": "Bedryfstelsel",
    "couponUsed": "Koepong Gebruik","couponDiscount": "Koepong Afslag"
  },
  "buyIp": {"title": "Addisionele IP-aanhangsel vir u VPS",
    "existingAddonIps": "Bestaande Aanhangsel IP's","additionalIp": "Addisionele IP",
    "immediateCost": "Onmiddellike Koste ({currency})","placeOrder": "Plaas Bestelling",
    "pleaseWait": "Wag asseblief!","success": "Sukses{text}","gotError": "Fout {text}"},
  "buyHdSpace": {"title": "Addisionele VPS Skyfskyf Spasie","goBack": "Gaan Terug",
    "costPerMonth": "Koste Per Maand ({symbol})","perTenGb": "{symbol}{cost} per 10GB per Maand",
    "additionalSpace": "Addisionele Spasie","selectSpace": "Kies Spasie",
    "spaceNote": "Minimum 1 tot 100GB addisionele HD-spasie kan gekoop word",
    "confirmOrder": "Bevestig Bestelling"},
  "changeHostname": {"placeholder": "your.server.com","example": "Byvoorbeeld: your.server.com"},
  "changeRootPassword": {"server": "Bediener:"},
  "changeTimezone": {"title": "Verander {module} Tydsone",
    "importantNote1": "U moet u {module} heeltemal afskakel voor u die tydsone verander.",
    "importantNote2": "VPS sal Afgesluit word en herbegin tydens die proses.",
    "importantNote3": "Die tydsone op hierdie bladsy sal altyd standaard na America/New_York wees, ongeag wat u bediener ingestel is.",
    "selectTimezone": "Kies Tydsone","changeZone": "Verander Sone","pleaseWait": "Wag asseblief!",
    "success": "Sukses{text}","gotError": "Fout {message}"},
  "changeWebuzoPassword": {"title": "Verander Webuzo Admin Wagwoord","hostname": "Gasheernaam",
    "newPassword": "Nuwe Wagwoord","confirmPassword": "Bevestig Wagwoord",
    "portalLoginPassword": "Ons Portaal Aanmeld Wagwoord","changePassword": "Verander Wagwoord",
    "passwordMismatch": "Wagwoord en Bevestig Wagwoord stem nie ooreen nie"},
  "reinstallOs": {"currentOs": "Huidige OS","version": "Weergawe",
    "loginPassword": "Aanmeld Wagwoord","confirmReinstall": "Ek wil die OS herinstalleer!"},
  "resetPassword": {"title": "Stel VPS Wagwoord Terug","server": "Bediener",
    "importantNote": "Belangrike Nota",
    "windowsWarning": "Windows wagwoordterugstelling sal 'n onsuiwer afsluiting tot gevolg he. Oorweeg dit asseblief as 'n laaste uitweg. Verifieer in VNC dat geen opdaterings tans loop nie. As 'n opdatering loop, sal VNC wys: Windows pas opdaterings toe, moenie afskakel nie. Afskakel in hierdie toestand kan 'n onstartbare masjien tot gevolg he.",
    "confirmReset": "Ek wil die Wagwoord Terugstel!","resetPasswordButton": "Stel Wagwoord Terug"},
  "reverseDns": {"title": "Omgekeerde DNS",
    "dnsChangeNote": "Veranderinge aan omgekeerde DNS neem tot 'n uur om te verskyn.",
    "updateReverseDns": "Opdateer Omgekeerde DNS","pleaseWait": "Wag asseblief!",
    "success": "Sukses{text}","gotError": "Fout {text}"},
  "vnc": {"remoteDesktop": "Microsoft Afstandslessenaar Verbinding",
    "remoteDesktopDescription": "Slegs beskikbaar op die Windows Platform. Afstandslessenaar is 'n vinnige en gerieflike manier om aan 'n virtuele masjien se lessenaar te koppel.",
    "remoteDesktopStep1": "Die Administrateur wagwoord moet eers op die VPS ingestel word voordat u afstandslessenaar kan gebruik.",
    "remoteDesktopStep2": "Verbind met VNC of HTML5 VNC om u aanvanklike wagwoord in te stel.",
    "remoteDesktopNote": "Vir 'n afstandslessenaar handleiding klik","here": "hier",
    "desktopVnc": "Lessenaar VNC Verbinding",
    "desktopVncDescription": "VNC laat u toe om aan die virtuele masjien se lessenaar te koppel. VNC kan in die blaaier of as 'n selfstandige klient uitgevoer word. U rekenaar se IP-adres moet toegang verleen word voor die verbinding tot stand gebring kan word.",
    "grantIpAccess": "Verleen U IP Toegang tot VNC",
    "grantIpWait": "Wag asseblief 2 minute vir die aksie om te voltooi.",
    "vncClientNote": "U kan ook een van die baie VNC-kliente op die internet aflaai. Ons beveel TightVNC aan. Verbind met u VPS IP-adres. Wagwoord is nie nodig nadat u afgeleë IP-adres in stap 1 toegelaat is nie.",
    "browserVnc": "Blaaier VNC Verbinding",
    "connectHtml5": "Om te verbind deur HTML5 VNC Klient te gebruik:",
    "connectOldLayout": "Om te verbind deur ou uitleg te gebruik:","clickHere": "Klik Hier",
    "html5Note": "HTML5 VNC klient wat goed werk in enige moderne blaaier insluitend mobiele blaaiers (iOS en Android)."},
  "setupVnc": {"title": "Stel VNC Op","vpsName": "VPS Naam","vpsIp": "VPS IP",
    "vncIpPort": "VNC IP:Poort","ipToGrant": "IP om VNC toegang te verleen",
    "grantAccess": "Verleen VNC Toegang aan IP","pleaseWait": "Wag asseblief!",
    "success": "Sukses{text}","gotError": "Fout {text}"},
  "insertCd": {"enableCdrom": "Aktiveer CDROM Aandrywer",
    "insertIso": "Voeg ISO Beeld In CDROM Aandrywer In","allowedProtocols": "Toegelate Protokolle",
    "chooseImage": "Kies Beeld","or": "OF","enterUrl": "Voer URL In",
    "urlPlaceholder": "Voer 'n CD of DVD ISO URL in","areYouSure": "Is u seker?",
    "continueButton": "Gaan Voort"},
  "backup": {"importantNote": "Belangrike Nota",
    "backupsPartitionNote": "Rugsteune sal slegs werk met verstekpartisionering.",
    "backupTitle": "{name} Rugsteun","currentBackups": "Huidige Rugsteune","server": "Bediener",
    "confirmBackup": "Wil u regtig 'n rugsteun neem?","noteLabel": "Nota:",
    "noBackup": "Geen rugsteun bestaan tans","service": "Diens","type": "Tipe","size": "Grootte"},
  "backups": {"title": "Bestuur VPS Rugsteune","vps": "VPS","type": "Tipe",
    "backupName": "Rugsteuning Naam","size": "Grootte","options": "Opsies"},
  "restore": {"importantNote": "Belangrike Nota",
    "offlineNote": "U bediener sal aflyn wees terwyl dit al u huidige leers met die op die rugsteun vervang. Kontak asseblief ondersteuning met enige vrae.",
    "backupTitle": "{name} Rugsteun","server": "Bediener",
    "restoreThisBackup": "Herstel hierdie rugsteun","selectBackup": "Kies 'n rugsteun",
    "loginPasswordLabel": "Voer Aanmeld Wagwoord in om Herstel te Valideer.",
    "confirmRestore": "Wil u regtig hierdie rugsteun herstel?"},
  "trafficUsage": {"title": "Bandwydte / Verkeersgebruik","displayIn": "Vertoon in:",
    "bits": "stukkies","bytes": "grepe",
    "billingNote": "Dit word nie gebruik vir faktureringsberekeninge nie en is slegs 'n skatting gebaseer op u virtuele netwerkkaarte.",
    "todayUsage": "Vandag se Gebruik","hourlyUsage": "Uurlikse Gebruik",
    "dailyUsage": "Daaglikse Gebruik","statistics": "Statistieke","history": "Geskiedenis",
    "in": "In","out": "Uit","today": "Vandag","thisMonth": "Hierdie Maand",
    "thisYear": "Hierdie Jaar","all": "Alles","usage": "Gebruik","current": "Huidig",
    "average": "Gemiddeld","peak": "Piek"},
  "slices": {"title": "Opgradering / Afgradering Skywe","upgradeDowngrade": "Opgradering / Afgradering",
    "cpuCores": "SVE Kerne:","memory": "Geheue:","disk": "Skyf:",
    "slicesCount": "Skywe ( Telling )","slicesNote": "Tot 32 Skywe kan aan 'n VPS geheg word.",
    "slicesDisplay": "{current}/{max} Skywe","immediateCost": "Onmiddellike Koste ( {symbol} )",
    "proratedNote": "Pro-rata bedrag om nou te betaal.",
    "additionalFees": "Addisionele Fooie ( {symbol} )",
    "recurringBillNote": "Herhalende rekening sal soveel verander",
    "updatedVpsCost": "Opgedateerde VPS Koste ( {symbol} )",
    "newInvoiceNote": "Nuwe fakture sal soveel kos","confirmLabel": "Ja, ek wil dit doen.",
    "confirmButton": "Bevestig"},
  "common": {"importantNoteLabel": "Belangrike Nota #{number}:"}
}
apply_lang('af', 'vps.json', af_vps)

apply_lang('af', 'webhosting.json', {
  "view": {"hostInfo": "Gasheer Inligting","username": "Gebruikernaam:","ip": "IP:",
    "server": "Bediener:","notSetYet": "Nog nie ingestel nie","types": "Tipes:",
    "linksLabel": "Skakels:","manualLogin": "Handmatige Aanmelding",
    "automaticLogin": "Outomatiese Aanmelding","clickHere": "Klik Hier",
    "defaultNameservers": "Verstek Naamsbedieners","nameservers": "Naamsbedieners:",
    "externalLinks": "Eksterne Skakels","names": "Name:","websitePreview": "Webwerf Voorskou"},
  "buyIp": {"title": "Koop Addisionele IP-aanhangsel",
    "existingAddonIps": "Bestaande Aanhangsel IP's","additionalIp": "Addisionele IP",
    "monthlyCost": "Maandelikse Koste ({symbol})",
    "costDescription": "Koste ({symbol}) elke maand soos u webwerf gefaktureer word",
    "confirmPurchase": "Bevestig Aankoop",
    "confirmMessage": "Addisionele IP koste: {symbol}{cost}/maand. Is u seker dat u 'n addisionele IP wil bestel?",
    "placeOrder": "Plaas Bestelling","orderPlaced": "Bestelling Geplaas"},
  "reverseDns": {"title": "Omgekeerde DNS","updateReverseDns": "Opdateer Omgekeerde DNS"},
  "downloadBackups": {"title": "Laai Rugsteune Af","backup": "Rugsteun","size": "Grootte",
    "options": "Opsies"},
  "migration": {"currentWebHostInfo": "Huidige Webgasheer Inligting",
    "customerPortalUrl": "Klienteportaal URL","portalExample": "Byvoorbeeld: sso.godaddy.com",
    "registeredUsername": "Geregistreerde Gebruikernaam / E-pos / ID",
    "controlPanelUrl": "Beheerpaneel URL",
    "controlPanelExample": "Byvoorbeeld: yourdomain.com/cpanel",
    "ftpUsername": "FTP / Beheerpaneel Gebruikernaam",
    "ftpPassword": "FTP / Beheerpaneel Wagwoord",
    "holdingPageQuestion": "As die webwerf 'n lewendige/besige webwerf is met hoe verkeer, kan ons 'n houdbladsy tydens migrering instel?",
    "specialRequirementsQuestion": "Het hierdie webwerf spesiale vereistes soos PHP Weergawe / Modules?",
    "domainRegistryInfo": "Domeinregister Inligting",
    "transferDomainQuestion": "Wil u ook he dat ons u help om die domeinnaamregistrasie oor te dra?",
    "updateNameserversQuestion": "Wil u he dat ons die naamsbedieners opdateer sodra ons die datamigrering voltooi?",
    "domainRegistryPortal": "Domeinregister Klienteportaal",
    "note1": "Die invul van hierdie vorm sal 'n nuwe kaartjie vir ons ondersteuningsafdeling oopmaak om u migrering te begin.",
    "note2": "Wees asseblief so volledig en akkuraat as moontlik om enige vertragings te vermy.",
    "note3": "'n Tipiese migrering word binne 48 tot 72 uur voltooi. Soms langer as die hoeveelheid data om te kopieer groot is.",
    "note4": "Die ou gasheerrekening moet aanlyn en toeganklik wees terwyl ons die migrering uitvoer, anders kan ons moontlik probleme ondervind.",
    "note5": "Maak asseblief geen opdaterings op u webwerf terwyl ons die migrering uitvoer nie, anders kan daardie data moontlik nie na die nuwe gasheer gekopieer word nie."}
})

# ─────────────────────────────────────────────────────────────
# AMHARIC (am)
# ─────────────────────────────────────────────────────────────
print("=== am ===")

apply_lang('am', 'domains.json', {
  "view": {"pageTitleWithLink": "ዶሜይን {id} {link}"},
  "order": {
    "premiumAvailable": f"አዎ! ዶሜይንዎ {{domain}} ይገኛል እና ፕሪሚየም ዶሜይን ነው። ራስ-ሰር ምዝገባ ተሰናክሏል። ይህን ዶሜይን ለ{{cost}} በዓመት ለመግዛት {{email}} ያግኙ።",
    "premiumTaken": f"ይቅርታ! ዶሜይንዎ {{domain}} ቀድሞ ተወስዷል! ቀድሞ ባለቤቱ ነዎት? ማስተላለፍ ይችላሉ፣ እና ፕሪሚየም ዶሜይን ነው። ራስ-ሰር ምዝገባ ተሰናክሏል። ይህን ዶሜይን ለ{{cost}} በዓመት ለመግዛት {{email}} ያግኙ።",
    "whoisPrivacyLabel": "Whois ግላዊነት ለ{cost} / ዓመት",
    "enabled": "ገቢር", "disabled": "ወጪ",
    "whatIsWhoisPrivacy": "ይህ Whois ግላዊነት ምንድን ነው?",
    "subscriptionAutoRenew": "ምዝገባው በየዓመቱ በ{cost} ሲሰረዝ እስከሚሰረዝ ድረስ ራስ-ሰር ይታደሳል።",
    "subscriptionDisclaimer": f"ይህን ሳጥን ምልክት በማድረግ፣ ራስ-ሰር የሚታደስ (ከዚህ በላይ በተቀመጡት ውሎች መሠረት) እና ዛሬ ወደሚሰጡት ክሬዲት ካርድ የሚከፈል ምዝገባ ምርት እየገዙ መሆኑን ያረጋግጣሉ። ራስ-ሰር ታደሳዎን ለመሰረዝ ከፈለጉ፣ የደንበኞች ፖርታሉን (እዚህ) ማግኘት፣ ንቁ አገልግሎቱን መምረጥ እና ሰርዝ አገናኙን ጠቅ ማድረግ ወይም ወደ billing{AT}interserver.net ኢሜይል መላክ ወይም በውሎች እና ሁኔታዎች ውስጥ ከተዘረዘሩ ሌሎች ዘዴዎች ጥቅም ማድረግ ይችላሉ።",
    "contactSales": "ሽያጭ ያግኙ", "premium": "ፕሪሚየም",
    "renewAt": f"ታደስ {AT} {{cost}}",
    "searchingDomain": "እባክዎ ይጠብቁ! ይህን የዶሜይን ስም በመፈለግ ላይ።",
    "loadingDomainFields": "እባክዎ ይጠብቁ! የዶሜይን መስኮችን በመጫን ላይ።",
    "gotError": "ስህተት ተገኝቷል:"
  },
  "nameservers": {
    "registeredNameservers": "የተመዘገቡ ናሜ ሰርቨሮች",
    "canDelete": "መሰረዝ ይቻላል",
    "suggestedApplied": "የሚጠቆሙ ናሜ ሰርቨሮች ተተግብረዋል። ለማስቀመጥ አዘምን ጠቅ ያድርጉ።"
  },
  "eppCode": {
    "title": "EPP ኮድ ኢሜይል ያድርጉ", "confirmButton": "አዎ፣ ላክልኝ",
    "confirmMessage": "EPP ኮዱን ወደ ተመዘገበው ኢሜይል ለመላክ ይፈልጋሉ?"
  },
  "whois": {
    "renewalNote": "Whois ግላዊነት ከንቃት ቀን ጀምሮ በ12 ወራት ይታደሳል። የWhois ግላዊነት አዶን ታደሻ ዋጋ {cost} ነው።",
    "notAvailable": "Whois ግላዊነት ለዚህ TLD አይገኝም።",
    "domain": "ዶሜይን", "whoisCost": "Whois ዋጋ",
    "contactPrivacy": "የተጋሪ ግላዊነት",
    "contactPrivacyDescription1": "የተጋሪ ግላዊነት አንድ ተጠቃሚ በዚያ ባለቤት ዶሜይን ላይ WHOIS ፍለጋ ሲያደርግ የባለቤቱን ማንነት ይሸፍናል።",
    "contactPrivacyDescription2": "የተጋሪ ግላዊነት ጥቅሙ ባለቤቱ ማንነት፣ ቤት አድራሻ፣ ስልክ ቁጥር እና ኢሜይል አድራሻ ጨምሮ፣ ከስፓምተኞች፣ ከማንነት ሌቦች እና ካጭበርባሪዎች ጥበቃ ማድረጉ ነው።",
    "contactPrivacyDescription3": "ባለቤቶች የተጋሪ ግላዊነት አገልግሎቱን ሲያነቁ፣ ጭምብል የለበሱ የተጋሪ መረጃዎች በሕዝባዊ WHOIS ዳታቤዝ ይታያሉ።",
    "contactPrivacyAvailable": "የተጋሪ ግላዊነት ለ{cost} በዶሜይን በዓመት ይገኛል።",
    "confirmOrderTitle": "ትዕዛዝ አረጋግጥ",
    "confirmOrderMessage": "Whois ግላዊነት ዋጋ: {cost} በዓመት። ይህን ትዕዛዝ ለማስቀመጥ ይፈልጋሉ?",
    "placingOrder": "ትዕዛዝ በማስቀመጥ ላይ...",
    "enableTitle": "Whois ግላዊነትን አነቃ",
    "enableMessage": "ዶሜይንዎ {hostname} ገና ያልተነቃ የሚከፈልበት Whois ግላዊነት አዶን አለው። አሁን ለማነቃቃት ይፈልጋሉ?",
    "enablingWhois": "Whois ግላዊነትን በማነቃቃት ላይ...",
    "disableTitle": "Whois ግላዊነትን አሰናክል እና ሰርዝ",
    "disableMessage": "ዶሜይንዎ {hostname} Whois ግላዊነት አዶን አሁን ነቃ ነው። ለማሰናከል እና ለመሰረዝ ይፈልጋሉ?",
    "disablingWhois": "Whois ግላዊነትን በማሰናከል ላይ..."
  },
  "whoisToggle": {
    "title": "Whois ግላዊነት አዶን", "enableConfirm": "Whois አነቃ",
    "disableCancelConfirm": "አሰናክል እና ሰርዝ።",
    "addonEnabled": "ዶሜይንዎ {domain} Whois ግላዊነት አዶን ነቃ ነው",
    "addonDisabled": "ዶሜይንዎ {domain} Whois ግላዊነት አዶን ወጪ ነው",
    "confirmEnable": "Whois ለማነቃቃት ይፈልጋሉ?",
    "confirmDisable": "ለማሰናከል እና ለመሰረዝ ይፈልጋሉ?"
  },
  "dnssec": {
    "title": "DNSSEC መረጃ","addNewRecord": "አዲስ ሪከርድ ጨምር",
    "removeAllRecords": "ሁሉንም DNSSEC ሪከርዶች አስወግድ",
    "noRecords": "ምንም DNSSEC ሪከርዶች አልተገኙም።","addDnssec": "DNSSEC ጨምር",
    "importDs": "DS አምጣ","digestType": "ዳይጀስት ዓይነት #{number}",
    "algorithm": "ስልተ-ቀመር #{number}","keyTag": "ቁልፍ መለያ #{number}",
    "digest": "ዳይጀስት #{number}","digestTypeHeader": "ዳይጀስት ዓይነት",
    "algorithmHeader": "ስልተ-ቀመር","keyTagHeader": "ቁልፍ መለያ","digestHeader": "ዳይጀስት",
    "select": "ምረጥ","enterKeyTag": "ቁልፍ መለያ አስገባ (ምሳሌ: 2371)",
    "enterDigest": "የዳይጀስት ዋጋ አስገባ (ከ{max} ቁምፊዎች መብለጥ የለበትም)",
    "charactersLeft": "የቀሩ ቁምፊዎች: {count}","addMore": "ተጨማሪ ጨምር","import": "አምጣ",
    "importPlaceholder": "host.com. IN DS 1172 13 1 26ffc7 ; ( SHA1 ዳይጀስት )",
    "invalidDsRecord": "ልክ ያልሆነ DS ሪከርድ",
    "unableToParse": "የDS ሪከርድ ቅርጸት ማንበብ አልተቻለም።",
    "confirmRemoveAll": "ይህ ለዚህ ዶሜይን ሁሉንም DNSSEC ሪከርዶች ያስወግዳል።",
    "yesRemoveThem": "አዎ፣ አስወግዳቸው!","removingRecords": "DNSSEC ሪከርዶችን በማስወገድ ላይ...",
    "removed": "ተወግዷል","removeSuccess": "DNSSEC ሪከርዶች በተሳካ ሁኔታ ተወግደዋል!",
    "savingRecords": "DNSSEC ሪከርዶችን በማስቀመጥ ላይ...",
    "saveSuccess": "DNSSEC ሪከርዶች በተሳካ ሁኔታ ተቀምጠዋል!",
    "noRecordsWarning": "እባክዎ ቢያንስ አንድ DNSSEC ሪከርድ ይሙሉ።"
  },
  "renew": {
    "tip1": "ዶሜይኑ ከመጠናቀቂያ ቀን በፊት ወይም ቀን ላይ መታደስ አለበት።",
    "tip2": "ዶሜይኑ ካለቀ ከጠናቀቂያ ቀን ጀምሮ ለታደሳ የጸጋ ጊዜ ሊኖረው ይችላል።",
    "tip3": "አንድ ተጠቃሚ በዚያ ባለቤት ዶሜይን ላይ WHOIS ፍለጋ ሲያደርግ የተጋሪ መረጃዎን ለመሸፈን Whois ግላዊነትን አነቃ።",
    "whoisCost": "Whois ዋጋ","alreadyRenewed": "ዶሜይንዎን ቀድሞ አድሰዋል!",
    "payExistingInvoice": "ዶሜይንዎን ለማደስ፣ ያለውን ደረሰኝ እባክዎ ይክፈሉ።",
    "confirmRenewalMessage": "ጠቅላላ ዋጋ: {cost}። ይህን የታደሻ ትዕዛዝ ለማስቀመጥ ይፈልጋሉ?",
    "placingRenewalOrder": "የታደሻ ትዕዛዝ በማስቀመጥ ላይ...",
    "renewalOrderPlaced": "ትዕዛዝ ተቀምጧል",
    "renewalOrderSuccess": "የዶሜይን ታደሻ ትዕዛዝ በተሳካ ሁኔታ ተቀምጧል!",
    "loadingRenewalInfo": "የታደሻ መረጃ በመጫን ላይ..."
  },
  "transfer": {
    "title": "የማስተላለፍ ሁኔታ","notATransfer": "ይህ ዶሜይን ማስተላለፍ አይደለም።",
    "statusLabel": "ሁኔታ","statusDetails": "የሁኔታ ዝርዝሮች",
    "transferrable": "ሊተላለፍ የሚችል","transferType": "የማስተላለፍ ዓይነት","reason": "ምክንያት",
    "loadingTransferStatus": "የማስተላለፍ ሁኔታ በመጫን ላይ..."
  }
})

apply_lang('am', 'servers.json', {
  "view": {"unBilled": "ያልተከፈለ","moreInfo": "ተጨማሪ መረጃ","cycle": "ዑደት",
    "reset": "ዳግም አስጀምር","on": "ክፈት","off": "ዝጋ","unknown": "አይታወቅም","noLease": "ምንም ኪራይ የለም"},
  "reverseDns": {"title": "የተገላቢጦሽ DNS ቅንብሮች",
    "changeWarning": "ወደ ተገላቢጦሽ DNS ለውጦች እስከ አንድ ሰዓት ሊወስዱ ይችላሉ።",
    "ipAddresses": "IP አድራሻዎች","hostnames": "ሆስትናሞች","updateReverseDns": "ተገላቢጦሽ DNS ዘምን"},
  "bandwidthGraph": {"title": "የይዘት ስፋት ግራፎች","graphTitle": "የይዘት ስፋት ግራፍ"},
  "ipmiLive": {"title": "IPMI IP","whatThisDoes": "ይህ ምን ያደርጋል?",
    "description": "ለ IP አድራሻዎ ብቻ ያልተወሰነ እና ለ24 ሰዓት ጥቅም ላይ ለሚውለው IPMI ቁጥጥሪ ቀጥታ IP ይስጥ።",
    "emailIpmiCredentials": "IPMI ምስክርነቶችን ኢሜይል ያድርጉ","assetId": "ንብረት መለያ",
    "serverId": "ሰርቨር መለያ","hostname": "ሆስትናም","serverIp": "ሰርቨር IP",
    "serverIpmi": "ሰርቨር IPMI","yourIpAddress": "የእርስዎ IP አድራሻ"},
  "order": {
    "customizeOrder": "ትዕዛዝ ብጅ","hostnameExample": "ምሳሌ: server.hostname.com",
    "hostnameHelp": "ሰርቨሩን ለመለየት ሆስትናሙን ይጠቀሙ። ዶሜይኑ ትክክለኛ ወይም ተመዝጋቢ መሆን አያስፈልገውም። አንድ ነጥብ ሆስትናሙ ውስጥ ያስፈልጋል። ሌሎች ምሳሌዎች: database.local, web.server ወይም your.name።",
    "passwordRequirement": "ማሳሰቢያ: የይለፍ ቃሉ ቢያንስ 8 ቁምፊዎች፣ አንድ ትንሽ ፊደል፣ አንድ ትልቅ ፊደል፣ አንድ ቁጥር፣ ልዩ ቁምፊ ሊኖረው ይገባል።",
    "enterServerDetails": "የሰርቨር ዝርዝሮችን አስገባ","currentlySoldOut": "አሁን ሁሉ ተሸጧል!",
    "contactSales": "እባክዎ የሽያጭ ክፍሉን ያግኙ።",
    "autoRenewNotice": "ምዝገባው እስከሚሰረዝ ድረስ በየወሩ በ{cost} ራስ-ሰር ይታደሳል።",
    "tosAcknowledgement": f"ይህን ሳጥን ምልክት በማድረግ፣ ራስ-ሰር የሚታደስ (ከዚህ በላይ በተቀመጡት ውሎች መሠረት) እና ዛሬ ወደሚሰጡት ክሬዲት ካርድ የሚከፈል ምዝገባ ምርት እየገዙ መሆኑን ያረጋግጣሉ። ለማሰረዝ ከፈለጉ ወደ billing{AT}interserver.net ኢሜይል ይላኩ ወይም ሌሎች ዘዴዎች ጥቅም ያድርጉ።",
    "continue": "ቀጥል","selectCpu": "ሲፒዩ ምረጥ","selectDrives": "ድራይቮችን ምረጥ",
    "selectedDrives": "የተመረጡ ድራይቮች","noDrivesSelected": "ምንም ድራይቮች አልተመረጡም",
    "totalDrives": "ጠቅላላ ድራይቮች","setupTime": "የማዋቀር ጊዜ",
    "showMore": "ተጨማሪ አሳይ","showLess": "ያነሰ አሳይ",
    "editDetails": "ዝርዝሮችን አርም","backToOptions": "ወደ አማራጮች ተመለስ"
  }
})

apply_lang('am', 'tickets.json', {
  "view": {
    "titleSuffix": "ቲኬት ይመልከቱ",
    "emailDisabled": "ኢሜይልዎ ({email}) ተሰናክሏል። እባክዎ ያግኙ",
    "support": "ድጋፍ",
    "ipHelpText": "ግንኙነት ከሌላ IP አድራሻ የሚመጣ ከሆነ። እባክዎ ይቀይሩት።",
    "rootPasswordPlaceholder": "VPS / ቀጥተኛ ሰርቨር",
    "passwordEncrypted": "የይለፍ ቃሎች ተለይቶ በተመሰጠረ ዳታቤዝ ውስጥ ይቀመጣሉ።",
    "ticketClosed": "ይህ ቲኬት ተዘግቷል፣ ስለዚህ መልሶች ተሰናክለዋል። አሁንም እርዳታ ከፈለጉ፣ አዲስ ቲኬት ለመክፈት ነፃ ይሁኑ እናም ደስ ብሎን እንረዳዎታለን።",
    "replyPlaceholder": "ስለ ጉዳዩ ዝርዝር ልጥፍ",
    "replyHint": "ለአዳዲስ ጉዳዮች ተለያይተው ቲኬቶች መፍጠር ቡድናችን እነሱን ፈጠን ብሎ ቅድሚያ ሰጥቶ ለመፍታት ይረዳናል።",
    "participant": "ተሳታፊ","userLikedReply": "ተጠቃሚው መልስዎን ወደደ",
    "userDislikedReply": "ተጠቃሚው መልስዎን አልወደደም","email": "ኢሜይል:",
    "closeConfirmTitle": "እርግጠኛ ነዎት?","closeConfirmText": "ይህን ቲኬት ለመዝጋት ይፈልጋሉ?",
    "ticketSettingsUpdated": "የቲኬት ቅንብሮች ተዘምነዋል"
  },
  "new": {
    "subjectPlaceholder": "ርዕሰ ጉዳይ",
    "subjectValidation": "ስለ ጉዳዩ አጭር መግለጫ ያስገቡ።",
    "descriptionPlaceholder": "በቲኬት አንድ ጥያቄ በማቅረብ ቀለል ያለ የድጋፍ ስርዓት ለማቆየት ስለረዷን እናመሰግናለን።",
    "descriptionValidation": "ስለ ጉዳዩ ዝርዝር መግለጫ ያስገቡ።",
    "fileNote": "ማሳሰቢያ: የምስል ፋይሎች ብቻ - gif/jpeg/png ዓይነቶች ይፈቀዳሉ።",
    "allowAccessLabel": "InterServer ሰርቨሬን ለማግኘት እና ለውጦችን ለማድረግ እፈቅዳለሁ",
    "accessNote": "እባክዎ ልብ ይበሉ: የድጋፍ ጥያቄ ሲከፍቱ InterServer በሂሳብዎ ውስጥ ያሉ ፋይሎችን ለማግኘት፣ ለማስተካከል ወይም ለመቀየር ሊያስፈልግ ይችላል። ይህ ፍላጎት ቴክኒካዊ ድጋፍ ለመስጠት ያስፈልጋል። ከተስማሙ ብቻ ቀጥሉ።"
  }
})

am_vps = {
  "view": {"linkTitle": "VPS {id} {link}","ipIs": "IP ነው:","vzid": "Vzid:",
    "commentNone": "ምንም","diskDrive": "ዲስክ ድራይቭ:","controlPanelAddon": "የቁጥጥር ፓነል ተጨማሪ",
    "reinstallNote": "ከግራ ምናሌ ዳግም መጫን ይችላሉ",
    "reinstallPath": "ጥገና -> ስርዓተ ምርቱን ዳግም ጫን","startingFrom": "ከሚጀምረው:",
    "notSupported": "( አይደገፍም )","orderConfirmation": "የትዕዛዝ ማረጋገጫ",
    "placeOrder": "ትዕዛዝ አስቀምጥ",
    "cpanelNote": "የቁጥጥር ፓነሉ ያለምንም ለውጥ ንጹህ ስርዓተ ምርት ላይ መጫን አለበት። ማንኛውም ዳታ ካለ ይጠፋል።",
    "cpuUsage": "የሲፒዩ አጠቃቀም","attention": "ትኩረት","item": "እቃ","value": "ዋጋ",
    "resendWelcomeEmail": "እርግጠኛ ነዎት?",
    "resendWelcomeEmailConfirm": "የእንኳን ደህና መጡ ኢሜይልን ዳግም ለመላክ ይፈልጋሉ?"},
  "order": {
    "vpsDetails": "VPS ዝርዝሮች","storage": "ማህደረ ትዝታ:","memoryLabel": "ሜሞሪ:",
    "transfer": "ማስተላለፍ:","platform": "መድረክ","location": "ቦታ","slices": "ቁርጥራጮች",
    "hostnamePlaceholder": "server.domain.com",
    "rootPasswordNote": "ማሳሰቢያ: የይለፍ ቃሉ ቢያንስ 8 ቁምፊዎች፣ አንድ ትንሽ ፊደል፣ አንድ ትልቅ ፊደል፣ አንድ ቁጥር እና ልዩ ቁምፊ ሊኖረው ይገባል።",
    "couponCodePlaceholder": "የኩፖን ኮድ","months": "{count} ወር(ወሮች)",
    "billingCycleDiscount": "የክፍያ ዑደት ቅናሽ:","recommendations": "ምክሮች",
    "linuxVps": "Linux VPS","directAdminVps": "DirectAdmin VPS","windowsVps": "Windows VPS",
    "cpanelVps": "cPanel VPS","linuxDesktopVps": "Linux ዴስክቶፕ VPS","webuzoVps": "Webuzo VPS",
    "locationAvailability": "የቦታ ተደራሽነት","locationPlatform": "ቦታ / መድረክ",
    "kvmLinux": "KVM Linux","hyperV": "HyperV","kvmStorage": "KVM ማህደረ ትዝታ",
    "windowsOnlyHyperV": "Windows (በHyperV ላይ ብቻ)","perSlice": "በቁርጥራጭ",
    "subscriptionRenewal": f"ምዝገባው ከ{{period}} በኋላ በ{{cost}} ሲሰረዝ እስከሚሰረዝ ድረስ ራስ-ሰር ይታደሳል።",
    "tosAcknowledgment": f"ይህን ሳጥን ምልክት በማድረግ፣ ራስ-ሰር የሚታደስ እና ዛሬ ወደሚሰጡት ክሬዲት ካርድ የሚከፈል ምዝገባ ምርት እየገዙ መሆኑን ያረጋግጣሉ። ለማሰረዝ ወደ billing{AT}interserver.net ኢሜይል ይላኩ።",
    "editDetails": "ዝርዝሮችን አርም","vpsLocation": "VPS ቦታ","hdSpace": "HD ቦታ",
    "bandwidth": "ይዘት ስፋት","operatingSystem": "ስርዓተ ምርቱ",
    "couponUsed": "ኩፖን ጥቅም ላይ ዋለ","couponDiscount": "የኩፖን ቅናሽ"},
  "buyIp": {"title": "ለVPSዎ ተጨማሪ IP ተጨማሪ","existingAddonIps": "ያሉ ተጨማሪ IPዎች",
    "additionalIp": "ተጨማሪ IP","immediateCost": "ቀጥታ ዋጋ ({currency})",
    "placeOrder": "ትዕዛዝ አስቀምጥ","pleaseWait": "እባክዎ ይጠብቁ!",
    "success": "ተሳካ{text}","gotError": "ስህተት ተገኝቷል {text}"},
  "buyHdSpace": {"title": "ተጨማሪ VPS ዲስክ ቦታ","goBack": "ተመለስ",
    "costPerMonth": "በወር ዋጋ ({symbol})","perTenGb": "{symbol}{cost} በ10ጂቢ በወር",
    "additionalSpace": "ተጨማሪ ቦታ","selectSpace": "ቦታ ምረጥ",
    "spaceNote": "ቢያንስ 1 እስከ 100ጂቢ ተጨማሪ HD ቦታ መግዛት ይቻላል",
    "confirmOrder": "ትዕዛዝ አረጋግጥ"},
  "changeHostname": {"placeholder": "your.server.com","example": "ለምሳሌ: your.server.com"},
  "changeRootPassword": {"server": "ሰርቨር:"},
  "changeTimezone": {"title": "የ{module} ጊዜ ሰቅ ቀይር",
    "importantNote1": "ጊዜ ሰቁን ከመቀየርዎ በፊት {module}ዎን ሙሉ በሙሉ ማጥፋት አለብዎ።",
    "importantNote2": "VPS ሂደቱ ወቅት ጠፍቶ ዳግም ይጀምራል።",
    "importantNote3": "ይህ ገጽ ላይ ያለው ጊዜ ሰቅ ሰርቨርዎ ምን ላይ ቢቀናጅ ሁልጊዜ America/New_York ሆኖ ይቀናጃል።",
    "selectTimezone": "ጊዜ ሰቅ ምረጥ","changeZone": "ዞን ቀይር","pleaseWait": "እባክዎ ይጠብቁ!",
    "success": "ተሳካ{text}","gotError": "ስህተት ተገኝቷል {message}"},
  "changeWebuzoPassword": {"title": "Webuzo አስተዳዳሪ የይለፍ ቃል ቀይር","hostname": "ሆስትናም",
    "newPassword": "አዲስ የይለፍ ቃል","confirmPassword": "የይለፍ ቃል አረጋግጥ",
    "portalLoginPassword": "የፖርታላችን መግቢያ የይለፍ ቃል","changePassword": "የይለፍ ቃል ቀይር",
    "passwordMismatch": "የይለፍ ቃል እና የይለፍ ቃል ማረጋገጫ አይዛመዱም"},
  "reinstallOs": {"currentOs": "ያሁኑ ስርዓተ ምርቱ","version": "ስሪት",
    "loginPassword": "የመግቢያ የይለፍ ቃል","confirmReinstall": "ስርዓተ ምርቱን ዳግም መጫን እፈልጋለሁ!"},
  "resetPassword": {"title": "VPS የይለፍ ቃል ዳግም አስጀምር","server": "ሰርቨር",
    "importantNote": "አስፈላጊ ማሳሰቢያ",
    "windowsWarning": "Windows የይለፍ ቃል ዳግም ማስጀመሪያ ንጹህ ያልሆነ ማጥፋት ያስከትላል። ይህን እንደ የመጨረሻ አማራጭ ይቁጠሩ። VNC ውስጥ ምንም ዝመናዎች አሁን አለመሄዳቸውን ያረጋግጡ። ዝመና እየሄደ ከሆነ VNC ያሳያል: Windows ዝመናዎችን እየተጠቀመ ነው፣ አትጥፋ። ማጥፋት ሊጀመር የማይችል ማሽን ሊያስከትል ይችላል።",
    "confirmReset": "የይለፍ ቃሉን ዳግም ማስጀመር እፈልጋለሁ!",
    "resetPasswordButton": "የይለፍ ቃል ዳግም አስጀምር"},
  "reverseDns": {"title": "ተገላቢጦሽ DNS",
    "dnsChangeNote": "ወደ ተገላቢጦሽ DNS ለውጦች እስከ አንድ ሰዓት ሊወስዱ ይችላሉ።",
    "updateReverseDns": "ተገላቢጦሽ DNS ዘምን","pleaseWait": "እባክዎ ይጠብቁ!",
    "success": "ተሳካ{text}","gotError": "ስህተት ተገኝቷል {text}"},
  "vnc": {"remoteDesktop": "Microsoft ርቀት ዴስክቶፕ ግንኙነት",
    "remoteDesktopDescription": "በWindows Platform ላይ ብቻ ይገኛል። ርቀት ዴስክቶፕ ወደ ቨርቹዋል ማሽን ዴስክቶፕ ለማገናኘት ፈጣን እና ምቹ መንገድ ነው።",
    "remoteDesktopStep1": "ርቀት ዴስክቶፕ ከመጠቀምዎ በፊት አስተዳዳሪ የይለፍ ቃሉ ቅድሚያ VPS ላይ መቀናጀት አለበት።",
    "remoteDesktopStep2": "የመጀመሪያ የይለፍ ቃልዎን ለማቀናጀት VNC ወይም HTML5 VNC ጋር ይገናኙ።",
    "remoteDesktopNote": "ለርቀት ዴስክቶፕ አጋዥ ዘዴ ጠቅ ያድርጉ","here": "እዚህ",
    "desktopVnc": "ዴስክቶፕ VNC ግንኙነት",
    "desktopVncDescription": "VNC ወደ ቨርቹዋል ማሽን ዴስክቶፕ ለማገናኘት ያስችልዎታል። VNC በአሳሹ ወይም ራሱን ችሎ ሊሰራ ይችላል። ኮምፒዩተርዎ IP አድራሻ ፈቃድ ማግኘት አለበት።",
    "grantIpAccess": "IP አድራሻዎን ወደ VNC ፈቃድ ስጥ",
    "grantIpWait": "ድርጊቱ ለመጠናቀቅ 2 ደቂቃ እባክዎ ይጠብቁ።",
    "vncClientNote": "በኢንተርኔት ላይ ከሚገኙ ብዙ VNC ደንበኞች አንዱን ማውረድ ይችላሉ። TightVNC ን እንመክራለን። VPS IP አድራሻዎን ተጠቅሞ ያገናኙ። ርቀት IP ፈቃድ ካገኘ በኋላ የይለፍ ቃል አያስፈልግም።",
    "browserVnc": "አሳሽ VNC ግንኙነት",
    "connectHtml5": "HTML5 VNC ደንበኛ ለመጠቀም ለማገናኘት:",
    "connectOldLayout": "አሮጌ አቀማመጥ ለመጠቀም ለማገናኘት:","clickHere": "እዚህ ጠቅ ያድርጉ",
    "html5Note": "HTML5 VNC ደንበኛ ሞባይል አሳሾችን (iOS እና Android) ጨምሮ ዘመናዊ አሳሽ ውስጥ ጥሩ ሆኖ ይሰራል።"},
  "setupVnc": {"title": "VNC አዋቅር","vpsName": "VPS ስም","vpsIp": "VPS IP",
    "vncIpPort": "VNC IP:ፖርት","ipToGrant": "VNC ፈቃድ ለሚሰጠው IP",
    "grantAccess": "ወደ IP VNC ፈቃድ ስጥ","pleaseWait": "እባክዎ ይጠብቁ!",
    "success": "ተሳካ{text}","gotError": "ስህተት ተገኝቷል {text}"},
  "insertCd": {"enableCdrom": "CDROM ድራይቭ አነቃ",
    "insertIso": "ISO ምስልን ወደ CDROM ድራይቭ አስገባ",
    "allowedProtocols": "የሚፈቀዱ ፕሮቶኮሎች","chooseImage": "ምስል ምረጥ","or": "ወይም",
    "enterUrl": "URL አስገባ","urlPlaceholder": "ሲዲ ወይም ዲቪዲ ISO URL ያስገቡ",
    "areYouSure": "እርግጠኛ ነዎት?","continueButton": "ቀጥል"},
  "backup": {"importantNote": "አስፈላጊ ማሳሰቢያ",
    "backupsPartitionNote": "ምትኬዎች ከነባሪ ክፋፋይ ጋር ብቻ ይሰራሉ.",
    "backupTitle": "{name} ምትኬ","currentBackups": "ያሉ ምትኬዎች","server": "ሰርቨር",
    "confirmBackup": "ምትኬ ለመውሰድ ይፈልጋሉ?","noteLabel": "ማሳሰቢያ:",
    "noBackup": "አሁን ምንም ምትኬ የለም","service": "አገልግሎት","type": "ዓይነት","size": "መጠን"},
  "backups": {"title": "VPS ምትኬዎችን አስተዳድር","vps": "VPS","type": "ዓይነት",
    "backupName": "የምትኬ ስም","size": "መጠን","options": "አማራጮች"},
  "restore": {"importantNote": "አስፈላጊ ማሳሰቢያ",
    "offlineNote": "ሰርቨርዎ ሁሉንም ያሉ ፋይሎቻቸውን ከምትኬ ላይ ካሉ ጋር ሲቀያይር ከመስመር ውጭ ይሆናል። ለማንኛውም ጥያቄ ድጋፍ ያግኙ።",
    "backupTitle": "{name} ምትኬ","server": "ሰርቨር",
    "restoreThisBackup": "ይህን ምትኬ ወደ ነበረበት መልስ","selectBackup": "ምትኬ ምረጥ",
    "loginPasswordLabel": "ወደ ነበረበት ለማስረዳት የመግቢያ የይለፍ ቃል ያስገቡ።",
    "confirmRestore": "ይህን ምትኬ ወደ ነበረበት ለመመለስ ይፈልጋሉ?"},
  "trafficUsage": {"title": "ይዘት ስፋት / የትራፊክ አጠቃቀም","displayIn": "ለማሳየት:",
    "bits": "ቢቶች","bytes": "ባይቶች",
    "billingNote": "ይህ ለክፍያ ስሌቶች ጥቅም ላይ አይውልም እና ቨርቹዋል ኔትወርክ ካርዶቻቸው ላይ ብቻ የተመሠረተ ግምት ነው።",
    "todayUsage": "የዛሬ አጠቃቀም","hourlyUsage": "በሰዓቱ አጠቃቀም",
    "dailyUsage": "ዕለታዊ አጠቃቀም","statistics": "ስታቲስቲክስ","history": "ታሪክ",
    "in": "ወደ ውስጥ","out": "ወደ ውጭ","today": "ዛሬ","thisMonth": "ይህ ወር",
    "thisYear": "ይህ ዓመት","all": "ሁሉ","usage": "አጠቃቀም","current": "ያሁን",
    "average": "አማካይ","peak": "ከፍተኛ"},
  "slices": {"title": "ቁርጥራጮችን አሳድግ / አውርድ","upgradeDowngrade": "አሳድግ / አውርድ",
    "cpuCores": "ሲፒዩ ኮሮች:","memory": "ሜሞሪ:","disk": "ዲስክ:",
    "slicesCount": "ቁርጥራጮች ( ቁጥር )","slicesNote": "እስከ 32 ቁርጥራጮች ወደ VPS ሊጣበቁ ይችላሉ።",
    "slicesDisplay": "{current}/{max} ቁርጥራጮች","immediateCost": "ቀጥታ ዋጋ ( {symbol} )",
    "proratedNote": "አሁን ሊከፈል ያለ ተናፃ መጠን።",
    "additionalFees": "ተጨማሪ ክፍያዎች ( {symbol} )",
    "recurringBillNote": "ተደጋጋሚ ሂሳቡ ይህ ያህል ይቀናጃል",
    "updatedVpsCost": "የተዘመነ VPS ዋጋ ( {symbol} )",
    "newInvoiceNote": "አዳዲስ ደረሰኞች ይህ ያህል ያስወጣሉ","confirmLabel": "አዎ ይህን ማድረግ እፈልጋለሁ።",
    "confirmButton": "አረጋግጥ"},
  "common": {"importantNoteLabel": "አስፈላጊ ማሳሰቢያ #{number}:"}
}
apply_lang('am', 'vps.json', am_vps)

apply_lang('am', 'webhosting.json', {
  "view": {"hostInfo": "የሆስት መረጃ","username": "ተጠቃሚ ስም:","ip": "IP:","server": "ሰርቨር:",
    "notSetYet": "ገና አልተቀናጀም","types": "ዓይነቶች:","linksLabel": "አገናኞች:",
    "manualLogin": "እጅ ሰጥቶ መግባት","automaticLogin": "ራስ-ሰር መግቢያ",
    "clickHere": "እዚህ ጠቅ ያድርጉ","defaultNameservers": "ነባሪ ናሜ ሰርቨሮች",
    "nameservers": "ናሜ ሰርቨሮች:","externalLinks": "ውጭ አገናኞች",
    "names": "ስሞች:","websitePreview": "ዌብሳይት ቅድዮ"},
  "buyIp": {"title": "ተጨማሪ IP ተጨማሪ ግዛ","existingAddonIps": "ያሉ ተጨማሪ IPዎች",
    "additionalIp": "ተጨማሪ IP","monthlyCost": "ወርሃዊ ዋጋ ({symbol})",
    "costDescription": "ዌብሳይትዎ ሲከፈልበት ዋጋ ({symbol}) በወር","confirmPurchase": "ግዢ አረጋግጥ",
    "confirmMessage": "ተጨማሪ IP ዋጋ: {symbol}{cost}/ወር። ተጨማሪ IP ለማዘዝ ይፈልጋሉ?",
    "placeOrder": "ትዕዛዝ አስቀምጥ","orderPlaced": "ትዕዛዝ ተቀምጧል"},
  "reverseDns": {"title": "ተገላቢጦሽ DNS","updateReverseDns": "ተገላቢጦሽ DNS ዘምን"},
  "downloadBackups": {"title": "ምትኬዎችን አውርድ","backup": "ምትኬ","size": "መጠን","options": "አማራጮች"},
  "migration": {"currentWebHostInfo": "ያሁኑ ዌብ ሆስት መረጃ",
    "customerPortalUrl": "የደንበኞች ፖርታል URL","portalExample": "ለምሳሌ: sso.godaddy.com",
    "registeredUsername": "የተመዘገበ ተጠቃሚ ስም / ኢሜይል / መለያ",
    "controlPanelUrl": "የቁጥጥር ፓነል URL",
    "controlPanelExample": "ለምሳሌ: yourdomain.com/cpanel",
    "ftpUsername": "FTP / የቁጥጥር ፓነል ተጠቃሚ ስም",
    "ftpPassword": "FTP / የቁጥጥር ፓነል የይለፍ ቃል",
    "holdingPageQuestion": "ዌብሳይቱ ከፍተኛ ትራፊክ ያለው ቀጥታ ዌብሳይት ከሆነ፣ ሂደቱ ወቅት ማቆያ ገጽ ማዘጋጀት ይቻላል?",
    "specialRequirementsQuestion": "ይህ ዌብሳይት PHP ስሪት / ሞዱሎች ያሉ ልዩ ፍላጎቶች አሉት?",
    "domainRegistryInfo": "የዶሜይን ሬጂስትሪ መረጃ",
    "transferDomainQuestion": "እኛ የዶሜይን ስም ምዝገባ ማስተላለፍ እንድንረዳዎ ይፈልጋሉ?",
    "updateNameserversQuestion": "ዳታ ሂደቱ ሲጠናቀቅ ናሜ ሰርቨሮቹን ለማዘምን ይፈልጋሉ?",
    "domainRegistryPortal": "የዶሜይን ሬጂስትሪ የደንበኞች ፖርታል",
    "note1": "ይህን ቅጽ መሙላት ሂደትዎን ለመጀመር ለድጋፍ ክፍላችን አዲስ ቲኬት ይከፍታል።",
    "note2": "ማንኛውንም መዘናጋቶችን ለማስወገድ እስከሚቻለው ሙሉ እና ትክክለኛ ይሁኑ።",
    "note3": "አለቃ ሂደት ከ48 እስከ 72 ሰዓት ውስጥ ይጠናቀቃል። ለመቅዳት ያለው ዳታ ትልቅ ከሆነ ረዘም ይልላ።",
    "note4": "ሂደቱን እያደረጉ ባሉ ጊዜ አሮጌ ሆስቲንግ ሂሳቡ መስመር ላይ እና ተደራሽ ሆኖ መቆየት አለበት።",
    "note5": "ሂደቱን እያደረጉ ባሉ ጊዜ ዌብሳይትዎ ላይ ምንም ዝመናዎች አያድርጉ።"}
})

# ─────────────────────────────────────────────────────────────
# ARABIC (ar) - only domains.json missing
# ─────────────────────────────────────────────────────────────
print("=== ar ===")

apply_lang('ar', 'domains.json', {
  "view": {"pageTitleWithLink": "نطاق {id} {link}"},
  "order": {
    "premiumAvailable": "نعم! نطاقك {domain} متاح وهو نطاق مميز. التسجيل التلقائي معطّل. أرسل بريداً إلكترونياً إلى {email} إذا كنت ترغب في شراء هذا النطاق مقابل {cost} سنوياً.",
    "premiumTaken": "عذراً! نطاقك {domain} مُسجَّل بالفعل! هل أنت المالك؟ يمكنك نقله، وهو نطاق مميز. التسجيل التلقائي معطّل. أرسل بريداً إلكترونياً إلى {email} إذا كنت ترغب في شراء هذا النطاق مقابل {cost} سنوياً.",
    "whoisPrivacyLabel": "خصوصية Whois مقابل {cost} / سنة",
    "enabled": "مُفعَّل","disabled": "مُعطَّل",
    "whatIsWhoisPrivacy": "ما هي خصوصية Whois؟",
    "subscriptionAutoRenew": "سيتجدد الاشتراك تلقائياً كل عام بمبلغ {cost} حتى يتم إلغاؤه.",
    "subscriptionDisclaimer": f"بتحديد هذا المربع، تُقرّ بأنك تشتري منتج اشتراك يتجدد تلقائياً (وفقاً للشروط الموضحة أعلاه) ويُحسَب على بطاقة الائتمان التي تقدمها اليوم. إذا كنت ترغب في إلغاء التجديد التلقائي، يمكنك الوصول إلى بوابة العملاء واختيار الخدمة النشطة والنقر على رابط الإلغاء أو إرسال بريد إلكتروني إلى: billing{AT}interserver.net أو استخدام طريقة أخرى موضحة في الشروط والأحكام.",
    "contactSales": "تواصل مع المبيعات","premium": "مميز",
    "renewAt": f"تجديد {AT} {{cost}}",
    "searchingDomain": "يرجى الانتظار! جارٍ البحث عن اسم النطاق.",
    "loadingDomainFields": "يرجى الانتظار! جارٍ تحميل حقول النطاق.",
    "gotError": "حدث خطأ:"
  },
  "nameservers": {
    "registeredNameservers": "خوادم الأسماء المسجَّلة","canDelete": "يمكن الحذف",
    "suggestedApplied": "تم تطبيق خوادم الأسماء المقترحة. انقر تحديث للحفظ."
  },
  "eppCode": {
    "title": "إرسال رمز EPP بالبريد الإلكتروني","confirmButton": "نعم، أرسل لي",
    "confirmMessage": "هل أنت متأكد أنك تريد إرسال رمز EPP إلى البريد الإلكتروني المسجَّل؟"
  },
  "whois": {
    "renewalNote": "تتجدد خصوصية Whois كل 12 شهراً من تاريخ التفعيل. تكلفة تجديد إضافة خصوصية Whois هي {cost}.",
    "notAvailable": "خصوصية Whois غير متاحة لهذا النطاق العلوي.",
    "domain": "النطاق","whoisCost": "تكلفة Whois","contactPrivacy": "خصوصية جهة الاتصال",
    "contactPrivacyDescription1": "تُخفي خصوصية جهة الاتصال هوية المُسجِّل عند قيام مستخدم بالبحث عبر WHOIS في نطاق المُسجِّل.",
    "contactPrivacyDescription2": "فائدة خصوصية جهة الاتصال هي حماية هوية المُسجِّل، بما في ذلك عنوان المنزل ورقم الهاتف والبريد الإلكتروني، من البريد العشوائي وسرقة الهوية والنصابين.",
    "contactPrivacyDescription3": "عند تفعيل المُسجِّلون لخدمة خصوصية جهة الاتصال، تظهر معلومات الاتصال المخفية في قاعدة بيانات WHOIS العامة.",
    "contactPrivacyAvailable": "خصوصية جهة الاتصال متاحة بـ {cost} لكل نطاق سنوياً.",
    "confirmOrderTitle": "تأكيد الطلب",
    "confirmOrderMessage": "تكلفة خصوصية Whois: {cost} سنوياً. هل أنت متأكد أنك تريد تقديم هذا الطلب؟",
    "placingOrder": "جارٍ تقديم الطلب...",
    "enableTitle": "تفعيل خصوصية Whois",
    "enableMessage": "نطاقك {hostname} لديه إضافة خصوصية Whois مدفوعة لم يتم تفعيلها بعد. هل تريد تفعيلها الآن؟",
    "enablingWhois": "جارٍ تفعيل خصوصية Whois...",
    "disableTitle": "تعطيل وإلغاء خصوصية Whois",
    "disableMessage": "إضافة خصوصية Whois لنطاقك {hostname} مُفعَّلة حالياً. هل أنت متأكد أنك تريد تعطيلها وإلغاؤها؟",
    "disablingWhois": "جارٍ تعطيل خصوصية Whois..."
  },
  "whoisToggle": {
    "title": "إضافة خصوصية Whois","enableConfirm": "تفعيل Whois",
    "disableCancelConfirm": "تعطيله وإلغاؤه.",
    "addonEnabled": "إضافة خصوصية Whois لنطاقك {domain} مُفعَّلة",
    "addonDisabled": "إضافة خصوصية Whois لنطاقك {domain} مُعطَّلة",
    "confirmEnable": "هل أنت متأكد أنك تريد تفعيل Whois؟",
    "confirmDisable": "هل أنت متأكد أنك تريد تعطيله وإلغاؤه؟"
  },
  "dnssec": {
    "title": "معلومات DNSSEC","addNewRecord": "إضافة سجل جديد",
    "removeAllRecords": "إزالة جميع سجلات DNSSEC",
    "noRecords": "لم يتم العثور على سجلات DNSSEC.","addDnssec": "إضافة DNSSEC",
    "importDs": "استيراد DS","digestType": "نوع الملخص #{number}",
    "algorithm": "الخوارزمية #{number}","keyTag": "وسم المفتاح #{number}",
    "digest": "الملخص #{number}","digestTypeHeader": "نوع الملخص",
    "algorithmHeader": "الخوارزمية","keyTagHeader": "وسم المفتاح","digestHeader": "الملخص",
    "select": "اختر","enterKeyTag": "أدخل وسم المفتاح (مثال: 2371)",
    "enterDigest": "أدخل قيمة الملخص (يجب ألا يزيد عن {max} حرفاً)",
    "charactersLeft": "الأحرف المتبقية: {count}","addMore": "إضافة المزيد","import": "استيراد",
    "importPlaceholder": "host.com. IN DS 1172 13 1 26ffc7 ; ( SHA1 digest )",
    "invalidDsRecord": "سجل DS غير صالح",
    "unableToParse": "تعذّر تحليل تنسيق سجل DS.",
    "confirmRemoveAll": "سيؤدي هذا إلى إزالة جميع سجلات DNSSEC لهذا النطاق.",
    "yesRemoveThem": "نعم، قم بإزالتها!","removingRecords": "جارٍ إزالة سجلات DNSSEC...",
    "removed": "تمت الإزالة","removeSuccess": "تمت إزالة سجلات DNSSEC بنجاح!",
    "savingRecords": "جارٍ حفظ سجلات DNSSEC...","saveSuccess": "تم حفظ سجلات DNSSEC بنجاح!",
    "noRecordsWarning": "يرجى ملء سجل DNSSEC واحد على الأقل."
  },
  "renew": {
    "tip1": "يجب تجديد النطاق في تاريخ انتهاء الصلاحية أو قبله.",
    "tip2": "إذا انتهت صلاحية النطاق، فقد تكون هناك فترة سماح من تاريخ انتهاء الصلاحية للتجديد.",
    "tip3": "فعّل خصوصية Whois لإخفاء معلومات الاتصال الخاصة بك عند قيام مستخدم بالبحث عبر WHOIS في نطاق المُسجِّل.",
    "whoisCost": "تكلفة Whois","alreadyRenewed": "لقد جدّدت نطاقك بالفعل!",
    "payExistingInvoice": "لتجديد نطاقك، يرجى دفع الفاتورة الحالية.",
    "confirmRenewalMessage": "التكلفة الإجمالية: {cost}. هل أنت متأكد أنك تريد تقديم طلب التجديد؟",
    "placingRenewalOrder": "جارٍ تقديم طلب التجديد...",
    "renewalOrderPlaced": "تم تقديم الطلب",
    "renewalOrderSuccess": "تم تقديم طلب تجديد النطاق بنجاح!",
    "loadingRenewalInfo": "جارٍ تحميل معلومات التجديد..."
  },
  "transfer": {
    "title": "حالة النقل","notATransfer": "هذا النطاق ليس عملية نقل.",
    "statusLabel": "الحالة","statusDetails": "تفاصيل الحالة",
    "transferrable": "قابل للنقل","transferType": "نوع النقل","reason": "السبب",
    "loadingTransferStatus": "جارٍ تحميل حالة النقل..."
  }
})

print("af, am, ar done!")
