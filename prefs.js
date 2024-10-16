import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {
    ExtensionPreferences,
    gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class QuadwranglerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        this._addGeneralPage(window);
        this._addShortcutsPage(window);
    }

    _addGeneralPage(window) {
        const page = new Adw.PreferencesPage({
            title: _('General'),
            iconName: 'preferences-other-symbolic',
        });
        window.add(page);

        const appearance = new Adw.PreferencesGroup({
            title: _('Appearance'),
            description: _('Customise how Quadwranger appears'),
        });
        page.add(appearance);

        const trayIcon = new Adw.SwitchRow({
            title: _('Tray icon'),
            subtitle: _('Show a status icon in the system tray'),
        });
        appearance.add(trayIcon);
        window._settings.bind(
            'tray-icon',
            trayIcon,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        const padding = new Adw.SpinRow({
            title: _('Padding'),
            subtitle: _('Padding between snapped windows'),
            adjustment: new Gtk.Adjustment({
                lower: 0,
                upper: 1024,
                stepIncrement: 1,
            }),
        });
        appearance.add(padding);
        window._settings.bind(
            'padding',
            padding,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );
    }

    _addShortcutsPage(window) {
        const page = new Adw.PreferencesPage({
            title: _('Shortcuts'),
            iconName: 'input-keyboard-symbolic',
        });
        window.add(page);

        const halves = new Adw.PreferencesGroup({
            title: 'Halves',
        });
        page.add(halves);
    }
}
