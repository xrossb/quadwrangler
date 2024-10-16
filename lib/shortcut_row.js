import Adw from 'gi://Adw';
import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

import {gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const ShortcutRow = GObject.registerClass(
    {
        GTypeName: 'QuadwranglerShortcutRow',
    },
    class extends Adw.ActionRow {
        constructor({shortcut, settings, ...props}, ...args) {
            super({...props, activatable: true}, ...args);

            this._shortcut = shortcut;
            this._settings = settings;

            const key = settings.settings_schema.get_key(shortcut);
            this.title = key.get_summary();
            this.subtitle = key.get_description();

            const [accelerator] = settings.get_strv(shortcut);
            const label = new Gtk.ShortcutLabel({
                accelerator: accelerator,
                margin_top: 8,
                margin_bottom: 8,
            });
            this.add_suffix(label);

            const [defaultValue] = settings
                .get_default_value(shortcut)
                .get_strv();
            console.debug('QUADWRANGLER default:', defaultValue);
            const clear = new Gtk.Button({
                icon_name: 'edit-clear-symbolic',
                tooltip_text: _('Reset to default'),
                sensitive: accelerator !== defaultValue,
                margin_start: 8,
                margin_top: 8,
                margin_bottom: 8,
            });
            this.add_suffix(clear);

            this.connect('activated', this._showDialog.bind(this));
        }

        _showDialog() {
            const view = new Adw.ToolbarView();
            view.add_top_bar(new Adw.HeaderBar());

            const content = new Gtk.Box({
                orientation: Gtk.Orientation.VERTICAL,
                spacing: 16,
                margin_bottom: 32,
                margin_start: 32,
                margin_end: 32,
            });
            view.set_content(content);

            const key = this._settings.settings_schema.get_key(this._shortcut);
            content.append(
                new Gtk.Label({
                    label: _('Edit shortcut for <b>%s</b>').format(
                        key.get_summary()
                    ),
                    use_markup: true,
                })
            );

            const icons = Gtk.Box.new(Gtk.Orientation.VERTICAL, 0);
            icons.append(
                new Gtk.Image({
                    icon_name: 'go-down-symbolic',
                    pixel_size: 24,
                })
            );
            icons.append(
                new Gtk.Image({
                    icon_name: 'input-keyboard-symbolic',
                    pixel_size: 72,
                })
            );
            content.append(icons);

            const hint = new Gtk.FlowBox({
                // column_spacing: 8,
                // row_spacing: 8,
                min_children_per_line: 2,
                max_children_per_line: 4,
                can_focus: false,
                selection_mode: Gtk.SelectionMode.NONE,
            });
            hint.append(Gtk.ShortcutLabel.new('Escape'));
            hint.append(
                new Gtk.Label({
                    label: _('to cancel or'),
                    wrap: true,
                })
            );
            hint.append(Gtk.ShortcutLabel.new('BackSpace'));
            hint.append(
                new Gtk.Label({
                    label: _('to disable the shortcut.'),
                    wrap: true,
                })
            );
            content.append(hint);

            const dialog = new Adw.Dialog({
                child: view,
            });
            dialog.present(this);
        }
    }
);

export default ShortcutRow;
