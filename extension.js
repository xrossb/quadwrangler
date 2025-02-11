import Gio from 'gi://Gio';
import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import Scope from './lib/scope.js';
import {Shortcuts, Resizers} from './lib/shortcuts.js';

export default class QuadwranglerExtension extends Extension {
    /** @type {Scope} */
    #scope;
    /** @type {Gio.Settings} */
    #settings;

    enable() {
        this.#scope = new Scope();

        this.#settings = this.getSettings();
        this.#scope.defer(() => (this.#settings = undefined));

        for (const shortcut of Object.values(Shortcuts)) {
            this.#registerShortcut(shortcut);
        }

        this.#registerOnGrab();
    }

    disable() {
        this.#scope.finalize();
        this.#scope = undefined;
    }

    /**
     * Sets up the given keyboard shortcut with the window manager.
     * @param {string} shortcut Name of the shortcut to register.
     */
    #registerShortcut(shortcut) {
        const flags =
            Meta.KeyBindingFlags.IGNORE_AUTOREPEAT |
            Meta.KeyBindingFlags.PER_WINDOW;
        const mode = Shell.ActionMode.NORMAL;
        Main.wm.addKeybinding(shortcut, this.#settings, flags, mode, (d, w) => {
            if (w && w.resizeable) {
                const p = this.#settings.get_int('padding');
                Resizers[shortcut](d, w, p);
            }
        });
        this.#scope.defer(() => Main.wm.removeKeybinding(shortcut));
    }

    /**
     * Sets up the on-grab handler, triggered when windows are "grabbed" by the cursor.
     */
    #registerOnGrab() {
        const handle = global.display.connect('grab-op-begin', (d, w, op) => {
            if (!w._quadwrangler) {
                return;
            }

            // The moving flag (MOVING) seems to always be set, even when only
            // resizing. So instead, I'm looking for whether any resize flags
            // are set.
            let resizing =
                Meta.GrabOp.RESIZING_N |
                Meta.GrabOp.RESIZING_E |
                Meta.GrabOp.RESIZING_S |
                Meta.GrabOp.RESIZING_W |
                Meta.GrabOp.KEYBOARD_RESIZING_N |
                Meta.GrabOp.KEYBOARD_RESIZING_E |
                Meta.GrabOp.KEYBOARD_RESIZING_S |
                Meta.GrabOp.KEYBOARD_RESIZING_W;
            resizing ^= Meta.GrabOp.WINDOW_BASE;
            if (op & resizing) {
                // Only restore the original window dimensions on move.
                return;
            }

            const pos = w.get_frame_rect();
            w.move_resize_frame(
                false,
                pos.x,
                pos.y,
                w._quadwrangler.width,
                w._quadwrangler.height
            );

            w._quadwrangler = undefined;
        });
        this.#scope.defer(() => global.display.disconnect(handle));
    }
}
