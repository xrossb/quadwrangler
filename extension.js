import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import Scope from './lib/scope.js';
import {Shortcuts, Resizers} from './lib/shortcuts.js';

export default class QuadwranglerExtension extends Extension {
    enable() {
        this._scope = new Scope();

        this._settings = this.getSettings();
        this._scope.defer(() => (this._settings = undefined));

        for (const shortcut of Object.values(Shortcuts)) {
            this._registerShortcut(shortcut);
        }

        this._registerOnGrab();
    }

    disable() {
        this._scope.finalize();
        this._scope = undefined;
    }

    _registerShortcut(shortcut) {
        const flags =
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT |
            Meta.KeyBindingFlags.PER_WINDOW;
        const mode = Shell.ActionMode.NORMAL;
        Main.wm.addKeybinding(shortcut, this._settings, flags, mode, (d, w) => {
            if (w && w.resizeable) {
                Resizers[shortcut](d, w);
            }
        });
        this._scope.defer(() => Main.wm.removeKeybinding(shortcut));
    }

    _registerOnGrab() {
        const handle = global.display.connect('grab-op-begin', (d, w, op) => {
            if (!w._quadwrangler) {
                return;
            }

            const moving =
                Meta.GrabOp.MOVING |
                Meta.GrabOp.MOVING_UNCONSTRAINED |
                Meta.GrabOp.KEYBOARD_MOVING;
            if (op & moving) {
                const pos = w.get_frame_rect();
                w.move_resize_frame(
                    false,
                    pos.x,
                    pos.y,
                    w._quadwrangler.width,
                    w._quadwrangler.height
                );
            }

            w._quadwrangler = undefined;
        });
        this._scope.defer(() => global.display.disconnect(handle));
    }
}
