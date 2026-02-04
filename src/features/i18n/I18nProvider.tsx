'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Locale = 'es' | 'fr';

interface I18nContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.services': 'Servicios',
        'nav.investments': 'Inversiones',
        'nav.cards': 'Tarjetas',
        'nav.profile': 'Perfil',
        'nav.logout': 'Salir',
        'nav.greeting': 'Hola',

        // Dashboard
        'dashboard.greeting': 'Hola',
        'dashboard.globalPosition': 'Tu posición global al día de hoy',
        'dashboard.security': 'Seguridad',
        'dashboard.biometrics': 'FaceID / Huella',
        'dashboard.biometricsActive': '✅ Activado',
        'dashboard.biometricsNotConfigured': '⚠️ No configurado',
        'dashboard.activate': 'Activar',
        'dashboard.recentAudit': 'Auditoría Reciente',
        'dashboard.noActivity': 'Sin actividad registrada',
        'dashboard.client': 'Cliente',

        // Services
        'services.title': 'Servicios y Utilidades',
        'services.subtitle': 'Herramientas financieras y gestión de pagos',
        'services.transfersTab': '🌍 Transferencias & Divisas',
        'services.nationalTab': '🇬🇶 Pagos Nacionales',
        'services.subscriptionsTab': '🎬 Hub de Suscripciones',
        'services.cfaZone': 'Zona CFA & Internacional',
        'services.cfaZoneDesc': 'Envios a zona CEMAC y SWIFT global.',
        'services.currencyConverter': 'Conversor de Divisas',
        'services.nationalPayments': 'Pagos de Servicios Nacionales',
        'services.nationalPaymentsDesc': 'SEGESA, Canal Sol y Telefonía Móvil.',
        'services.activeSubscriptions': 'Mis Suscripciones Activas',
        'services.subscriptionsDesc': 'Detectadas automáticamente en tus movimientos.',

        // Cards
        'cards.title': 'Activos y Financiación',
        'cards.subtitle': 'Gestión de tarjetas y productos de crédito',
        'cards.back': '← Volver',
        'cards.config': 'Configuración de Tarjeta',
        'cards.freeze': 'Congelar Tarjeta',
        'cards.freezeDesc': 'Bloqueo temporal inmediato',
        'cards.online': 'Compras Online',
        'cards.onlineDesc': 'Habilitar e-commerce internacional',
        'cards.limit': 'Límite Mensual',
        'cards.downloadStatement': '📄 Descargar Extracto Mensual',

        // Investments
        'investments.title': 'Inversiones BVMAC',
        'investments.subtitle': 'Mercado de valores de África Central',

        // Loans
        'loans.title': 'Simulador de Préstamos',
        'loans.amount': 'Importe',
        'loans.term': 'Plazo',
        'loans.months': 'meses',
        'loans.monthlyPayment': 'Cuota mensual',
        'loans.totalInterest': 'Intereses totales',
        'loans.apply': 'Solicitar Préstamo',

        // Account Card
        'account.balance': 'Saldo Disponible',
        'account.transfer': 'Transferir',
        'account.pay': 'Pagar',

        // Transactions
        'transactions.recent': 'Movimientos Recientes',
        'transactions.viewAll': 'Ver Todo',
        'transactions.noRecent': 'No hay movimientos recientes',
        'transactions.refId': 'ID Referencia',
        'transactions.date': 'Fecha',
        'transactions.time': 'Hora',
        'transactions.status': 'Estado',
        'transactions.completed': 'COMPLETADO',
        'transactions.close': 'Cerrar',

        // Dynamic CVV
        'cvv.title': 'CVV Dinámico',
        'cvv.description': 'Para compras online seguras. Válido por 60 segundos.',
        'cvv.expires': 'Expira en',
        'cvv.show': 'Ver CVV',
        'cvv.hide': 'Ocultar / Bloquear',

        // Currency Converter
        'converter.amount': 'Monto a Enviar (XAF)',
        'converter.target': 'Moneda de Destino',
        'converter.rate': 'Tasa de Cambio',
        'converter.fee': 'Comisión Intermediación (2%)',
        'converter.receive': 'Recibes',

        // National Payments
        'payments.electricity': '💡 SEGESA (Luz)',
        'payments.tv': '📺 Canal Sol',
        'payments.mobile': '📱 Recarga Móvil',
        'payments.invoiceCode': 'Código Factura',
        'payments.period': 'Periodo (Mes/Año)',
        'payments.concept': 'Concepto',
        'payments.amount': 'Importe (XAF)',
        'payments.payBill': 'Pagar Factura Luz',
        'payments.processing': 'Procesando...',
        'payments.decoderCard': 'Número de Tarjeta Decodificador',
        'payments.holder': 'Titular del Contrato',
        'payments.months': 'Meses',
        'payments.totalPay': 'Total a Pagar',
        'payments.paySub': 'Pagar Suscripción',
        'payments.reloadTV': 'Recargar TV',
        'payments.phoneNumber': 'Número de Móvil',
        'payments.rechargeAmount': 'Importe Recarga (XAF)',
        'payments.otherAmount': 'Otro importe...',
        'payments.confirmRecharge': 'Confirmar Recarga',
        'payments.recharging': 'Recargando...',
        'payments.cardNote': 'Se utilizará tu tarjeta principal predeterminada para este pago.',

        // Subscriptions
        'subs.service': 'Servicio',
        'subs.cost': 'Costo',
        'subs.frequency': 'Frecuencia',
        'subs.nextPayment': 'Próximo Pago',
        'subs.status': 'Estado',
        'subs.action': 'Acción',
        'subs.active': 'Activo',
        'subs.blocked': 'Bloqueado',
        'subs.block': '🚫 Bloquear',
        'subs.reactivate': '🔄 Reactivar',
        'subs.monthly': 'Mensual',
        'subs.annual': 'Anual',
        'subs.none': 'No se han detectado suscripciones activas.',
        'subs.blockedMsg': '⚠️ Suscripción Bloqueada: Se rechazarán futuros cobros de este comercio.',
        'subs.reactivatedMsg': '✅ Suscripción Reactivada.',

        // Common
        'common.back': 'Volver',
        'common.save': 'Guardar',
        'common.cancel': 'Cancelar',
        'common.loading': 'Cargando...',
        'common.error': 'Error',
        'common.success': 'Éxito',
        'common.transfer': 'Transferir',
        'common.pay': 'Pagar',
    },
    fr: {
        // Navigation
        'nav.home': 'Accueil',
        'nav.services': 'Services',
        'nav.investments': 'Investissements',
        'nav.cards': 'Cartes',
        'nav.profile': 'Profil',
        'nav.logout': 'Déconnexion',
        'nav.greeting': 'Bonjour',

        // Dashboard
        'dashboard.greeting': 'Bonjour',
        'dashboard.globalPosition': 'Votre position globale à ce jour',
        'dashboard.security': 'Sécurité',
        'dashboard.biometrics': 'FaceID / Empreinte',
        'dashboard.biometricsActive': '✅ Activé',
        'dashboard.biometricsNotConfigured': '⚠️ Non configuré',
        'dashboard.activate': 'Activer',
        'dashboard.recentAudit': 'Audit Récent',
        'dashboard.noActivity': 'Aucune activité enregistrée',
        'dashboard.client': 'Client',

        // Services
        'services.title': 'Services et Utilitaires',
        'services.subtitle': 'Outils financiers et gestion des paiements',
        'services.transfersTab': '🌍 Transferts & Devises',
        'services.nationalTab': '🇬🇶 Paiements Nationaux',
        'services.subscriptionsTab': '🎬 Hub d\'Abonnements',
        'services.cfaZone': 'Zone CFA & International',
        'services.cfaZoneDesc': 'Envois vers la zone CEMAC et SWIFT mondial.',
        'services.currencyConverter': 'Convertisseur de Devises',
        'services.nationalPayments': 'Paiements de Services Nationaux',
        'services.nationalPaymentsDesc': 'SEGESA, Canal Sol et Téléphonie Mobile.',
        'services.activeSubscriptions': 'Mes Abonnements Actifs',
        'services.subscriptionsDesc': 'Détectés automatiquement dans vos mouvements.',

        // Cards
        'cards.title': 'Actifs et Financement',
        'cards.subtitle': 'Gestion des cartes et produits de crédit',
        'cards.back': '← Retour',
        'cards.config': 'Configuration de la Carte',
        'cards.freeze': 'Geler la Carte',
        'cards.freezeDesc': 'Blocage temporaire immédiat',
        'cards.online': 'Achats en Ligne',
        'cards.onlineDesc': 'Activer le e-commerce international',
        'cards.limit': 'Limite Mensuelle',
        'cards.downloadStatement': '📄 Télécharger le Relevé Mensuel',

        // Investments
        'investments.title': 'Investissements BVMAC',
        'investments.subtitle': 'Marché boursier d\'Afrique Centrale',

        // Loans
        'loans.title': 'Simulateur de Prêt',
        'loans.amount': 'Montant',
        'loans.term': 'Durée',
        'loans.months': 'mois',
        'loans.monthlyPayment': 'Mensualité',
        'loans.totalInterest': 'Intérêts totaux',
        'loans.apply': 'Demander un Prêt',

        // Account Card
        'account.balance': 'Solde Disponible',
        'account.transfer': 'Transférer',
        'account.pay': 'Payer',

        // Transactions
        'transactions.recent': 'Mouvements Récents',
        'transactions.viewAll': 'Voir Tout',
        'transactions.noRecent': 'Aucun mouvement récent',
        'transactions.refId': 'ID Référence',
        'transactions.date': 'Date',
        'transactions.time': 'Heure',
        'transactions.status': 'Statut',
        'transactions.completed': 'TERMINÉ',
        'transactions.close': 'Fermer',

        // Dynamic CVV
        'cvv.title': 'CVV Dynamique',
        'cvv.description': 'Pour achats en ligne sécurisés. Valide 60 secondes.',
        'cvv.expires': 'Expire dans',
        'cvv.show': 'Voir CVV',
        'cvv.hide': 'Masquer / Bloquer',

        // Currency Converter
        'converter.amount': 'Montant à Envoyer (XAF)',
        'converter.target': 'Devise de Destination',
        'converter.rate': 'Taux de Change',
        'converter.fee': 'Commission (2%)',
        'converter.receive': 'Vous recevez',

        // National Payments
        'payments.electricity': '💡 SEGESA (Électricité)',
        'payments.tv': '📺 Canal Sol',
        'payments.mobile': '📱 Recharge Mobile',
        'payments.invoiceCode': 'Code Facture',
        'payments.period': 'Période (Mois/Année)',
        'payments.concept': 'Concept',
        'payments.amount': 'Montant (XAF)',
        'payments.payBill': 'Payer Facture Électricité',
        'payments.processing': 'Traitement...',
        'payments.decoderCard': 'Numéro de Carte Décodeur',
        'payments.holder': 'Titulaire du Contrat',
        'payments.months': 'Mois',
        'payments.totalPay': 'Total à Payer',
        'payments.paySub': 'Payer Abonnement',
        'payments.reloadTV': 'Recharger TV',
        'payments.phoneNumber': 'Numéro de Mobile',
        'payments.rechargeAmount': 'Montant Recharge (XAF)',
        'payments.otherAmount': 'Autre montant...',
        'payments.confirmRecharge': 'Confirmer Recharge',
        'payments.recharging': 'Recharge en cours...',
        'payments.cardNote': 'Votre carte principale sera utilisée pour ce paiement.',

        // Subscriptions
        'subs.service': 'Service',
        'subs.cost': 'Coût',
        'subs.frequency': 'Fréquence',
        'subs.nextPayment': 'Prochain Paiement',
        'subs.status': 'Statut',
        'subs.action': 'Action',
        'subs.active': 'Actif',
        'subs.blocked': 'Bloqué',
        'subs.block': '🚫 Bloquer',
        'subs.reactivate': '🔄 Réactiver',
        'subs.monthly': 'Mensuel',
        'subs.annual': 'Annuel',
        'subs.none': 'Aucun abonnement actif détecté.',
        'subs.blockedMsg': '⚠️ Abonnement Bloqué: Les futurs paiements de ce commerçant seront rejetés.',
        'subs.reactivatedMsg': '✅ Abonnement Réactivé.',

        // Common
        'common.back': 'Retour',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.loading': 'Chargement...',
        'common.error': 'Erreur',
        'common.success': 'Succès',
        'common.transfer': 'Transférer',
        'common.pay': 'Payer',
    },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>('es');

    // Persist locale to localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sgbge-locale') as Locale;
        if (saved && (saved === 'es' || saved === 'fr')) {
            setLocale(saved);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('sgbge-locale', newLocale);
    };

    const t = (key: string): string => {
        return translations[locale][key] || key;
    };

    return (
        <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
}

export function LanguageToggle() {
    const { locale, setLocale } = useI18n();

    return (
        <button
            onClick={() => setLocale(locale === 'es' ? 'fr' : 'es')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
            title={locale === 'es' ? 'Changer en Français' : 'Cambiar a Español'}
        >
            🌐
            <span className="font-mono text-xs">{locale.toUpperCase()}</span>
        </button>
    );
}
