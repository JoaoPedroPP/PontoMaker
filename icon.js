const electron = require('electron');

const { app, Tray, Menu} = electron;

class Icon extends Tray {
    constructor(path, mainWindow) {
        super(path);
        this.mainWindow = mainWindow;
        this.on("click", this.onClick.bind(this));
        this.on("right-click", this.onRightClick.bind(this));
        this.setToolTip("Icon App");
    }

    onClick(events, bounds) {
        const { x, y } = bounds;
        const { height, width } = this.mainWindow.getBounds();

        if(this.mainWindow.isVisible()) this.mainWindow.hide();
        else {
            const yp = process.platform === 'darwin' ? y:y - height;
            this.mainWindow.setBounds({
                x: x - width/2,
                y: yp,
                height: height,
                width: width,
            });
            this.mainWindow.show();
        }
    }

    onRightClick() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => {
                    app.quit();
                },
            }
        ]);
        this.popUpContextMenu(menuConfig);
    }
}

module.exports = Icon;