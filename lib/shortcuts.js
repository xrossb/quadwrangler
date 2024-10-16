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
    [Shortcuts.LeftHalf]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: screen.width / 2,
            height: screen.height,
        })),
    [Shortcuts.RightHalf]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2,
            y: screen.y,
            width: screen.width / 2,
            height: screen.height,
        })),
    [Shortcuts.TopHalf]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: screen.width,
            height: screen.height / 2,
        })),
    [Shortcuts.BottomHalf]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y + screen.height / 2,
            width: screen.width,
            height: screen.height / 2,
        })),
    [Shortcuts.TopLeft]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: screen.width / 2,
            height: screen.height / 2,
        })),
    [Shortcuts.TopRight]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2,
            y: screen.y,
            width: screen.width / 2,
            height: screen.height / 2,
        })),
    [Shortcuts.BottomLeft]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y + screen.height / 2,
            width: screen.width / 2,
            height: screen.height / 2,
        })),
    [Shortcuts.BottomRight]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 2,
            y: screen.y + screen.height / 2,
            width: screen.width / 2,
            height: screen.height / 2,
        })),
    [Shortcuts.FirstThird]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: screen.width / 3,
            height: screen.height,
        })),
    [Shortcuts.CenterThird]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 3,
            y: screen.y,
            width: screen.width / 3,
            height: screen.height,
        })),
    [Shortcuts.LastThird]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + (2 * screen.width) / 3,
            y: screen.y,
            width: screen.width / 3,
            height: screen.height,
        })),
    [Shortcuts.FirstTwoThirds]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: (2 * screen.width) / 3,
            height: screen.height,
        })),
    [Shortcuts.LastTwoThirds]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x + screen.width / 3,
            y: screen.y,
            width: (2 * screen.width) / 3,
            height: screen.height,
        })),
    [Shortcuts.Maximize]: (d, w) =>
        simpleResize(d, w, screen => ({
            x: screen.x,
            y: screen.y,
            width: screen.width,
            height: screen.height,
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
