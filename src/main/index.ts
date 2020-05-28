import { app, BrowserWindow, Menu, MenuItem, ipcMain } from 'electron';
import { Environment } from '../environments/environment';
import { FirstAlgorithmController } from './controllers/FirstAlgorithmController';

function createWindow() {
  let win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 900,
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true
    },
    frame: true,
    title: 'Fractional Brownian Motion'
  });

  win.setMenuBarVisibility(false);
  
  if (Environment.Production) {
    win.setMenu(null);
  } else {
    let menu = new Menu();

    const developerSubmenu = new Menu();

    developerSubmenu.append(new MenuItem({
      label: 'Developer tools',
      click: () => { win.webContents.toggleDevTools() },
      accelerator: 'Ctrl+I'
    }));
    developerSubmenu.append(new MenuItem({
      label: 'Reload',
      click: () => { win.reload() },
      accelerator: 'Ctrl+R'
    }));
    developerSubmenu.append(new MenuItem({
      label: 'Toggle Full screen',
      click: () => {
        win.setKiosk(!win.isKiosk());
        win.setMenuBarVisibility(!win.isKiosk());
      },
      accelerator: 'F11'
    }));
    developerSubmenu.append(new MenuItem({
      label: 'Hide/Show menu',
      click: () => {
        win.setMenuBarVisibility(!win.isMenuBarVisible());
      },
      accelerator: 'F10'
    }));

    const menuItem = new MenuItem({
      id: 'Developer menu',
      label: 'Developer menu',
      submenu: developerSubmenu
    });

    menu.append(menuItem);

    win.setMenu(menu);
  }

  win.loadFile('./index.html');
}

const firstAlgorithmController = new FirstAlgorithmController();

app.on('ready', async function () {
  createWindow();
  firstAlgorithmController.Start();
});
