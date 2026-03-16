const FA4_TO_FA5: Record<string, [string, string]> = {
    'trash-o': ['fas', 'trash'],
    'close': ['fas', 'times'],
    'file-text': ['fas', 'file-alt'],
    'file-text-o': ['far', 'file-alt'],
    'id-card-o': ['far', 'id-card'],
    'credit-card-alt': ['fas', 'credit-card'],
    'shield': ['fas', 'shield-alt'],
    'send': ['fas', 'paper-plane'],
    'sign-in': ['fas', 'sign-in-alt'],
};

const BRAND_ICONS = new Set([
    'linux', 'windows', 'wordpress', 'cpanel', 'connectdevelop',
    'facebook', 'twitter', 'github', 'google-plus', 'paypal', 'firefox',
]);

/**
 * Parses a FontAwesome CSS class string (e.g. "fa fa-hourglass" or "fas fa-spinner fa-pulse")
 * into a vue-fontawesome icon tuple [prefix, iconName], or null if not a FA icon.
 */
export function parseFaIcon(classString: string | undefined): [string, string] | null {
    if (!classString || !classString.includes('fa')) return null;
    if (classString.includes('material-icons')) return null;

    const classes = classString.split(/\s+/);
    let prefix = 'fas';
    let iconName = '';

    for (const cls of classes) {
        if (cls === 'fas') prefix = 'fas';
        else if (cls === 'far') prefix = 'far';
        else if (cls === 'fab') prefix = 'fab';
        else if (cls === 'fal') prefix = 'fal';
        else if (
            cls.startsWith('fa-') &&
            cls !== 'fa-fw' &&
            cls !== 'fa-spin' &&
            cls !== 'fa-pulse' &&
            cls !== 'fa-duotone' &&
            !cls.startsWith('fa-w-') &&
            !cls.match(/^fa-\d+x$/)
        ) {
            iconName = cls.substring(3);
        }
    }

    if (!iconName) return null;

    if (FA4_TO_FA5[iconName]) {
        return FA4_TO_FA5[iconName];
    }

    if (BRAND_ICONS.has(iconName)) {
        prefix = 'fab';
    }

    return [prefix, iconName];
}
