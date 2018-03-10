import { app, BrowserWindow, ipcRenderer, } from 'electron';
const {ipcMain} = require('electron');

import Main from './main';
import AuthService from './googleapi/authService';
import { YoutubeApiService } from './googleapi/apiService';

var youtube:YoutubeApiService = null;

//Create main window
Main.main(app, BrowserWindow);

//Check for stored tokens

AuthService.loadFromFile()
.then(createYoutubeService)
.catch((err) => {
	console.log('tokens not on file');
});

//Send signal to authorize client
ipcMain.on('authorize', (event) => {
	console.log('authorize');
	AuthService.createAuthWindow();
	this.authEvent = event;
});

ipcMain.on('create-youtube-service', (client) => {
	console.log('create-youtube-service');
	createYoutubeService(client);
	// getAccountPlaylists()
	// 	.then(resp => {
	// 		Main.mainWin.webContents.send('my-playlists', resp);
	// 	})
	// 	.catch(err => {
	// 		console.log(err);
	// 	});
});

ipcMain.on('get-account-playlists', (event, nextPage:string = null) => {
	getAccountPlaylists(nextPage)
		.then(resp => {
			event.sender.send('my-playlists', resp);
		})
		.catch(err => {
			console.log(err);
		})
});

ipcMain.on('check-client', (event) => {
	let val:boolean = youtube ? true : false;
	event.sender.send('check-client', val);
})

function createYoutubeService(client) {
	if(!youtube) youtube = new YoutubeApiService(client);
	return Promise.resolve(youtube);
}

function getAccountPlaylists(nextPage: string = null) {
	console.log('get-account-playlists');
	if(!youtube) {
		ipcMain.emit('authorize');
		return;
	}

	return new Promise((resolve, reject) => {
		youtube.getAccountPlaylists(nextPage)
		.then((resp:any) => {
			resolve(resp);
		})
		.catch((err: any) => {
			reject(err);
		});
	});

}