import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {
    ExtensionPreferences,
    gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import {Shortcuts} from './lib/shortcuts.js';
import ShortcutRow from './lib/shortcut_row.js';

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
            title: _('Halves'),
        });
        halves.add(
            new ShortcutRow({
                shortcut: Shortcuts.LeftHalf,
                settings: window._settings,
            })
        );
        halves.add(
            new ShortcutRow({
                shortcut: Shortcuts.RightHalf,
                settings: window._settings,
            })
        );
        halves.add(
            new ShortcutRow({
                shortcut: Shortcuts.TopHalf,
                settings: window._settings,
            })
        );
        halves.add(
            new ShortcutRow({
                shortcut: Shortcuts.BottomHalf,
                settings: window._settings,
            })
        );
        page.add(halves);

        const quarters = new Adw.PreferencesGroup({
            title: _('Quarters'),
        });
        quarters.add(
            new ShortcutRow({
                shortcut: Shortcuts.TopLeft,
                settings: window._settings,
            })
        );
        quarters.add(
            new ShortcutRow({
                shortcut: Shortcuts.TopRight,
                settings: window._settings,
            })
        );
        quarters.add(
            new ShortcutRow({
                shortcut: Shortcuts.BottomLeft,
                settings: window._settings,
            })
        );
        quarters.add(
            new ShortcutRow({
                shortcut: Shortcuts.BottomRight,
                settings: window._settings,
            })
        );
        page.add(quarters);

        const thirds = new Adw.PreferencesGroup({
            title: _('Thirds'),
        });
        thirds.add(
            new ShortcutRow({
                shortcut: Shortcuts.FirstThird,
                settings: window._settings,
            })
        );
        thirds.add(
            new ShortcutRow({
                shortcut: Shortcuts.CenterThird,
                settings: window._settings,
            })
        );
        thirds.add(
            new ShortcutRow({
                shortcut: Shortcuts.LastThird,
                settings: window._settings,
            })
        );
        thirds.add(
            new ShortcutRow({
                shortcut: Shortcuts.FirstTwoThirds,
                settings: window._settings,
            })
        );
        thirds.add(
            new ShortcutRow({
                shortcut: Shortcuts.LastTwoThirds,
                settings: window._settings,
            })
        );
        page.add(thirds);

        const other = new Adw.PreferencesGroup({
            title: _('Other'),
        });
        other.add(
            new ShortcutRow({
                shortcut: Shortcuts.Maximize,
                settings: window._settings,
            })
        );
        other.add(
            new ShortcutRow({
                shortcut: Shortcuts.Center,
                settings: window._settings,
            })
        );
        other.add(
            new ShortcutRow({
                shortcut: Shortcuts.Restore,
                settings: window._settings,
            })
        );
        page.add(other);
    }
}
