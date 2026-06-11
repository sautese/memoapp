const { app, BrowserWindow, globalShortcut, screen } = require('electron');

// ===== 只在开发环境启用热更新 =====
if (!app.isPackaged) {
    try {
        require('electron-reload')(__dirname, {
            electron: require('electron')
        });
    } catch (err) {
        console.log('electron-reload not loaded:', err.message);
    }
}

let win;

function createWindow() {

    win = new BrowserWindow({

        width: 230,
        height: 200,

        frame: false,

        alwaysOnTop: true,

        skipTaskbar: true,

        opacity: 0.98,

        vibrancy: "acrylic",

        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.setAlwaysOnTop(true, "screen-saver");

    // ===== 窗口定位：右上角 =====
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width } = primaryDisplay.workAreaSize;

    const margin = 40;

    const x = width - 200 - margin;
    const y = margin;

    win.setPosition(x, y);

    win.loadFile('index.html');
}


// 启动
app.whenReady().then(() => {

    createWindow();

    // ===== Ctrl+1：显示/隐藏 =====
    globalShortcut.register('CommandOrControl+1', () => {

        if (!win) return;

        if (
            win.isVisible() &&
            !win.isMinimized()
        ) {

            win.hide();

        } else {

            if (win.isMinimized()) {
                win.restore();
            }

            win.showInactive();

            win.moveTop();
        }
    });


    // ===== Ctrl+2：隐藏完成项 =====
    globalShortcut.register(
        'CommandOrControl+2',
        () => {

            if (!win) return;

            win.webContents
                .executeJavaScript(
                    'window.toggleCompleted()'
                )
                .catch(console.error);
        }
    );


    // ===== Ctrl+4：退出 =====
    globalShortcut.register(
        'CommandOrControl+4',
        () => {

            app.quit();

        }
    );
});