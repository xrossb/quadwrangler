import Adw from 'gi://Adw';
import Gdk from 'gi://Gdk';
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
                accelerator: accelerator || null,
                disabled_text: _('(unbound)'),
                margin_top: 8,
                margin_bottom: 8,
            });
            this.add_suffix(label);

            const [defaultValue] = settings
                .get_default_value(shortcut)
                .get_strv();
            const clear = new Gtk.Button({
                icon_name: 'edit-undo-symbolic',
                tooltip_text: _('Reset to default'),
                sensitive: accelerator !== defaultValue,
                margin_start: 8,
                margin_top: 8,
                margin_bottom: 8,
            });
            clear.connect('clicked', () => {
                this._resetShortcut();
            });
            this.add_suffix(clear);

            settings.connect(`changed::${shortcut}`, () => {
                const [defaultValue] = settings
                    .get_default_value(shortcut)
                    .get_strv();
                const [value] = settings.get_strv(shortcut);
                label.accelerator = value || null;
                clear.sensitive = value !== defaultValue;
            });

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

            const eventController = new Gtk.EventControllerKey({
                propagation_phase: Gtk.PropagationPhase.CAPTURE,
            });
            eventController.connect(
                'key-pressed',
                (w, keyval, keycode, mods) => {
                    const evt = w.get_current_event();
                    if (evt.is_modifier()) {
                        return true;
                    }

                    // Strip extra informational flags from the reported modifiers.
                    // Otherwise Gtk.accelerator_name can fail to parse the modifiers.
                    mods &= Gdk.MODIFIER_MASK;

                    if (
                        keyval === Gdk.KEY_Escape &&
                        mods === Gdk.ModifierType.NO_MODIFIER_MASK
                    ) {
                        dialog.close();
                        return true;
                    }

                    if (
                        keyval === Gdk.KEY_BackSpace &&
                        mods === Gdk.ModifierType.NO_MODIFIER_MASK
                    ) {
                        this._unsetShortcut();
                        dialog.close();
                        return true;
                    }

                    const shortcut = Gtk.accelerator_name(keyval, mods);
                    this._setShortcut(shortcut);

                    dialog.close();
                    return true;
                }
            );
            dialog.add_controller(eventController);

            dialog.present(this);
        }

        /**
         * Save the given keyboard shortcut to the current setting.
         * @param {string} shortcut New keyboard shortcut.
         */
        _setShortcut(shortcut) {
            this._settings.set_strv(this._shortcut, [shortcut]);
        }

        /**
         * Removes the keyboard shortcut from the current setting.
         */
        _unsetShortcut() {
            this._settings.set_strv(this._shortcut, []);
        }

        /**
         * Reset the keyboard shortcut to the default.
         */
        _resetShortcut() {
            this._settings.reset(this._shortcut);
        }
    }
);

export default ShortcutRow;
