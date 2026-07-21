// Bilingual FR/EN dictionary. Keys are stable ids; the UI reads them through the
// LocaleProvider's t() helper. Both locales MUST expose the exact same keys, or
// the `satisfies Record<Locale, ...>` check below fails to compile.

import type { Locale } from "../core/types";

export type { Locale } from "../core/types";

export const MESSAGES = {
  fr: {
    // Shell
    appTitle: "Générateur de signatures email",
    tagline: "Créez une signature HTML professionnelle. Tout reste dans votre navigateur.",
    privacyNote: "Aucun envoi serveur. Vos données ne quittent jamais votre appareil.",
    langLabel: "Langue",
    reset: "Réinitialiser",
    resetConfirm: "Réinitialiser toutes les données de la signature ?",
    colEdit: "Édition",
    colPreview: "Aperçu",

    // Template gallery
    templatesTitle: "Modèles",
    templatesHint: "Choisissez une mise en page. L'aperçu à droite se met à jour en direct.",
    templateActive: "Actif",
    cat_classic: "Classique",
    cat_modern: "Moderne",
    cat_minimal: "Épuré",
    cat_creative: "Créatif",
    cat_corporate: "Entreprise",
    cat_compact: "Compact",

    // Form sections
    sectionIdentity: "Identité",
    sectionContact: "Contact",
    sectionSocial: "Réseaux sociaux",
    sectionExtras: "Extras",
    sectionMedia: "Logo & photo",
    sectionStyle: "Style",

    // Identity fields
    fieldFullName: "Nom complet",
    fieldJobTitle: "Fonction",
    fieldCompany: "Société",
    fieldDepartment: "Département",
    // Contact fields
    fieldPhone: "Téléphone",
    fieldMobile: "Mobile",
    fieldEmail: "Email",
    fieldWebsite: "Site web",
    fieldAddress: "Adresse",
    // Extras
    fieldTagline: "Slogan",
    fieldDisclaimer: "Mention légale",
    fieldCtaLabel: "Libellé du bouton",
    fieldCtaUrl: "Lien du bouton",

    // Social labels
    social_linkedin: "LinkedIn",
    social_twitter: "X / Twitter",
    social_instagram: "Instagram",
    social_github: "GitHub",
    social_facebook: "Facebook",
    social_youtube: "YouTube",

    // Capability hints (shown when the active template ignores a field)
    capNoPhoto: "Ce modèle n'affiche pas de photo.",
    capNoLogo: "Ce modèle n'affiche pas de logo.",
    capNoSocial: "Ce modèle n'affiche pas les réseaux sociaux.",
    capNoCta: "Ce modèle n'affiche pas de bouton d'action.",
    capNoDisclaimer: "Ce modèle n'affiche pas de mention légale.",
    capNoTagline: "Ce modèle n'affiche pas de slogan.",

    // Media panel
    mediaLogo: "Logo",
    mediaPhoto: "Photo",
    imgModeUrl: "URL",
    imgModeFile: "Fichier",
    imgModeNone: "Aucun",
    imgUrlLabel: "URL de l'image (https)",
    imgFileLabel: "Choisir un fichier",
    imgWidthLabel: "Largeur (px)",
    imgGmailWarning:
      "Le logo intégré (base64) s'affiche dans Outlook et Apple Mail, mais Gmail peut le retirer. Pour Gmail, préférez une URL hébergée, ou utilisez le bouton Copier (Gmail réhéberge alors l'image).",
    imgSizeWarning:
      "Ce fichier dépasse 1 Mo : il alourdit la signature et peut être bloqué. Réduisez l'image ou utilisez une URL hébergée.",
    imgReadError: "Lecture du fichier impossible. Réessayez avec une autre image.",

    // Style panel
    styleAccent: "Accent",
    styleText: "Texte",
    styleMuted: "Texte secondaire",
    styleLink: "Liens",
    styleFont: "Police",
    styleFontSize: "Taille de police (px)",

    // Preview
    previewBgLabel: "Fond de l'aperçu",
    previewBgLight: "Clair",
    previewBgDark: "Sombre",
    previewFrameTitle: "Aperçu de la signature",

    // Export bar
    exportCopy: "Copier la signature",
    exportCopyPlain: "Copier (texte enrichi indisponible)",
    exportCopyHtml: "Copier le code HTML",
    exportDownload: "Télécharger .html",
    charsUnit: "caractères",
    charWarn: "Signature volumineuse : vous approchez de la limite Gmail (10 000 caractères).",
    charOver:
      "Gmail tronque la signature au-delà de 10 000 caractères. Réduisez le contenu ou les images intégrées.",
    toastCopied: "Signature copiée. Collez-la dans votre client mail.",
    toastHtmlCopied: "Code HTML copié dans le presse-papiers.",
    toastCopyError: "Copie impossible. Utilisez « Télécharger .html » à la place.",

    // Install guides
    guidesTitle: "Guides d'installation",
    guideGmail: "Gmail",
    guideOutlookClassic: "Outlook classique",
    guideOutlookNew: "Nouvel Outlook / Web",
    guideAppleMail: "Apple Mail",
    guideThunderbird: "Thunderbird",
    guideGmailBody:
      "Ouvrez Gmail.\nParamètres (roue dentée) puis « Voir tous les paramètres ».\nOnglet Général, section Signature, cliquez « Créer ».\nCollez la signature (Ctrl+V) dans l'éditeur.\nSélectionnez-la comme signature par défaut, puis « Enregistrer les modifications » en bas de page.",
    guideOutlookClassicBody:
      "Fichier puis Options puis Courrier puis Signatures.\nCliquez « Nouveau » et nommez la signature.\nCollez la signature dans l'éditeur (Ctrl+V).\nDéfinissez-la par défaut pour les nouveaux messages et les réponses.\nValidez avec OK.",
    guideOutlookNewBody:
      "Ouvrez Paramètres (roue dentée) puis Courrier puis « Composer et répondre ».\nSous « Signature électronique », créez une signature.\nCollez la signature (Ctrl+V).\nChoisissez-la par défaut pour les nouveaux messages et les réponses.\nEnregistrez.",
    guideAppleMailBody:
      "Apple Mail ne permet pas de coller directement dans Réglages puis Signatures.\nMéthode A : ouvrez un nouveau message, collez la signature dans le corps, tout sélectionner (Cmd+A), copier (Cmd+C). Dans Réglages puis Signatures, créez une signature, décochez « Toujours utiliser la police par défaut », puis collez (Cmd+V).\nMéthode B : créez une signature vide dans Mail, quittez Mail, ouvrez le fichier ~/Library/Mail/V*/MailData/Signatures/*.mailsignature, remplacez le corps HTML par votre signature, passez le fichier en lecture seule pour éviter l'écrasement, relancez Mail.",
    guideThunderbirdBody:
      "Paramètres des comptes, sélectionnez le compte concerné.\nOption 1 : cochez « Utiliser le HTML » et collez la signature dans le champ « Texte de signature ».\nOption 2 : cochez « Joindre la signature à partir d'un fichier » et sélectionnez le fichier .html exporté depuis cet outil.",
  },
  en: {
    // Shell
    appTitle: "Email signature generator",
    tagline: "Build a professional HTML signature. Everything stays in your browser.",
    privacyNote: "No server upload. Your data never leaves your device.",
    langLabel: "Language",
    reset: "Reset",
    resetConfirm: "Reset all signature data?",
    colEdit: "Edit",
    colPreview: "Preview",

    // Template gallery
    templatesTitle: "Templates",
    templatesHint: "Pick a layout. The preview on the right updates live.",
    templateActive: "Active",
    cat_classic: "Classic",
    cat_modern: "Modern",
    cat_minimal: "Minimal",
    cat_creative: "Creative",
    cat_corporate: "Corporate",
    cat_compact: "Compact",

    // Form sections
    sectionIdentity: "Identity",
    sectionContact: "Contact",
    sectionSocial: "Social links",
    sectionExtras: "Extras",
    sectionMedia: "Logo & photo",
    sectionStyle: "Style",

    // Identity fields
    fieldFullName: "Full name",
    fieldJobTitle: "Job title",
    fieldCompany: "Company",
    fieldDepartment: "Department",
    // Contact fields
    fieldPhone: "Phone",
    fieldMobile: "Mobile",
    fieldEmail: "Email",
    fieldWebsite: "Website",
    fieldAddress: "Address",
    // Extras
    fieldTagline: "Tagline",
    fieldDisclaimer: "Legal disclaimer",
    fieldCtaLabel: "Button label",
    fieldCtaUrl: "Button link",

    // Social labels
    social_linkedin: "LinkedIn",
    social_twitter: "X / Twitter",
    social_instagram: "Instagram",
    social_github: "GitHub",
    social_facebook: "Facebook",
    social_youtube: "YouTube",

    // Capability hints (shown when the active template ignores a field)
    capNoPhoto: "This template does not show a photo.",
    capNoLogo: "This template does not show a logo.",
    capNoSocial: "This template does not show social links.",
    capNoCta: "This template does not show a call-to-action button.",
    capNoDisclaimer: "This template does not show a legal disclaimer.",
    capNoTagline: "This template does not show a tagline.",

    // Media panel
    mediaLogo: "Logo",
    mediaPhoto: "Photo",
    imgModeUrl: "URL",
    imgModeFile: "File",
    imgModeNone: "None",
    imgUrlLabel: "Image URL (https)",
    imgFileLabel: "Choose a file",
    imgWidthLabel: "Width (px)",
    imgGmailWarning:
      "An embedded (base64) image shows in Outlook and Apple Mail, but Gmail may strip it. For Gmail, prefer a hosted URL, or use the Copy button (Gmail then re-hosts the image).",
    imgSizeWarning:
      "This file is over 1 MB: it bloats the signature and may be blocked. Shrink the image or use a hosted URL.",
    imgReadError: "Could not read the file. Try another image.",

    // Style panel
    styleAccent: "Accent",
    styleText: "Text",
    styleMuted: "Secondary text",
    styleLink: "Links",
    styleFont: "Font",
    styleFontSize: "Font size (px)",

    // Preview
    previewBgLabel: "Preview background",
    previewBgLight: "Light",
    previewBgDark: "Dark",
    previewFrameTitle: "Signature preview",

    // Export bar
    exportCopy: "Copy signature",
    exportCopyPlain: "Copy (rich text unavailable)",
    exportCopyHtml: "Copy HTML code",
    exportDownload: "Download .html",
    charsUnit: "characters",
    charWarn: "Large signature: you are approaching the Gmail limit (10,000 characters).",
    charOver:
      "Gmail truncates the signature past 10,000 characters. Trim the content or embedded images.",
    toastCopied: "Signature copied. Paste it into your mail client.",
    toastHtmlCopied: "HTML code copied to the clipboard.",
    toastCopyError: "Copy failed. Use “Download .html” instead.",

    // Install guides
    guidesTitle: "Install guides",
    guideGmail: "Gmail",
    guideOutlookClassic: "Outlook (classic)",
    guideOutlookNew: "New Outlook / Web",
    guideAppleMail: "Apple Mail",
    guideThunderbird: "Thunderbird",
    guideGmailBody:
      "Open Gmail.\nSettings (gear icon) then “See all settings”.\nGeneral tab, Signature section, click “Create new”.\nPaste the signature (Ctrl+V) into the editor.\nSelect it as the default signature, then “Save changes” at the bottom.",
    guideOutlookClassicBody:
      "File then Options then Mail then Signatures.\nClick “New” and name the signature.\nPaste the signature into the editor (Ctrl+V).\nSet it as default for new messages and replies.\nConfirm with OK.",
    guideOutlookNewBody:
      "Open Settings (gear icon) then Mail then “Compose and reply”.\nUnder “Email signature”, create a signature.\nPaste the signature (Ctrl+V).\nPick it as default for new messages and replies.\nSave.",
    guideAppleMailBody:
      "Apple Mail does not allow pasting directly into Settings then Signatures.\nMethod A: open a new message, paste the signature into the body, select all (Cmd+A), copy (Cmd+C). In Settings then Signatures, create a signature, untick “Always match my default message font”, then paste (Cmd+V).\nMethod B: create an empty signature in Mail, quit Mail, open ~/Library/Mail/V*/MailData/Signatures/*.mailsignature, replace the HTML body with your signature, set the file to read-only to prevent overwrite, relaunch Mail.",
    guideThunderbirdBody:
      "Account Settings, select the relevant account.\nOption 1: tick “Use HTML” and paste the signature into the “Signature text” field.\nOption 2: tick “Attach the signature from a file” and pick the .html file exported from this tool.",
  },
} satisfies Record<Locale, Record<string, string>>;

export type MessageKey = keyof (typeof MESSAGES)["fr"];
