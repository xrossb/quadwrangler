export const Shortcuts = {
    // Halves
    LeftHalf: 'qw-left-half',
    RightHalf: 'qw-right-half',
    TopHalf: 'qw-top-half',
    BottomHalf: 'qw-bottom-half',
    // Quarters
    TopLeft: 'qw-top-left',
    TopRight: 'qw-top-right',
    BottomLeft: 'qw-bottom-left',
    BottomRight: 'qw-bottom-right',
    // Thirds
    FirstThird: 'qw-first-third',
    CenterThird: 'qw-center-third',
    LastThird: 'qw-last-third',
    FirstTwoThirds: 'qw-first-two-thirds',
    LastTwoThirds: 'qw-last-two-thirds',
    // Other
    Maximize: 'qw-maximize',
    Center: 'qw-center',
    Restore: 'qw-restore',
};

export const Resizers = {
    [Shortcuts.LeftHalf]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.RightHalf]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2 + 0.5 * p,
            y: screen.y + p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.TopHalf]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: screen.width - 2 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.BottomHalf]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + screen.height / 2 + 0.5 * p,
            width: screen.width - 2 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.TopLeft]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.TopRight]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2 + 0.5 * p,
            y: screen.y + p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.BottomLeft]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + screen.height / 2 + 0.5 * p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.BottomRight]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2 + 0.5 * p,
            y: screen.y + screen.height / 2 + 0.5 * p,
            width: screen.width / 2 - 1.5 * p,
            height: screen.height / 2 - 1.5 * p,
        })),
    [Shortcuts.FirstThird]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: screen.width / 3 - (4 / 3) * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.CenterThird]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 3 + (2 / 3) * p,
            y: screen.y + p,
            width: screen.width / 3 - (4 / 3) * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.LastThird]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + (2 * screen.width) / 3 + (1 / 3) * p,
            y: screen.y + p,
            width: screen.width / 3 - (4 / 3) * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.FirstTwoThirds]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: (2 * screen.width) / 3 - (5 / 3) * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.LastTwoThirds]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 3 + (2 / 3) * p,
            y: screen.y + p,
            width: (2 * screen.width) / 3 - (5 / 3) * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.Maximize]: (d, w, p) =>
        simpleResize(d, w, screen => ({
            x: screen.x + p,
            y: screen.y + p,
            width: screen.width - 2 * p,
            height: screen.height - 2 * p,
        })),
    [Shortcuts.Center]: (d, w) =>
        simpleResize(d, w, (screen, window) => ({
            x: screen.width / 2 - window.width / 2,
            y: screen.height / 2 - window.height / 2,
            width: window.width,
            height: window.height,
        })),
    [Shortcuts.Restore]: (d, w) => {
        if (!w._quadwrangler) {
            return;
        }
        resize(w, w._quadwrangler);
        w._quadwrangler = undefined;
    },
};

/**
 * Given a display, window and a function to calculate the new window size,
 * resize the window.
 * @param {*} d Mutter Meta.Display.
 * @param {*} w Mutter Meta.Window.
 * @param {Function} newSize Calculates the new size of a window.
 */
function simpleResize(d, w, newSize) {
    const screen = work_area(d, w);
    const window = w.get_frame_rect();
    const size = newSize(screen, window);
    if (!w._quadwrangler) {
        w._quadwrangler = {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height,
        };
    }
    resize(w, size);
}

/**
 * Determine the work area from a window's current monitor.
 * @param {*} d Mutter Meta.Display.
 * @param {*} w Mutter Meta.Window.
 * @returns {*} Rect containing the x, y, width and height of the work area.
 */
function work_area(d, w) {
    return d
        .get_workspace_manager()
        .get_active_workspace()
        .get_work_area_for_monitor(w.get_monitor());
}

/**
 * Resizes a window to match the provided dimensions.
 * @param {*} w Mutter Meta.Window to resize.
 * @param {*} size New window size and location.
 */
function resize(w, size) {
    w.move_resize_frame(false, size.x, size.y, size.width, size.height);
}
