import { Playlist } from './Playlist';
import { HttpRequest } from './HttpRequest';
import { api_key } from './APIAuth';
import { Storage } from './Storage';
var btnAdd:HTMLElement = document.getElementById('btn-url-add');
var urlInput:HTMLElement = document.getElementById('url-input-container');
var wrapper:HTMLElement = document.getElementById('main-wrapper');
var template = (<HTMLTemplateElement>document.getElementById('playlist-template'));

const prefix:string = 'https://www.youtube.com/playlist?list=';

//list of all the tabs for displaying
var playlists = [];
var request = new HttpRequest();
var storage = new Storage();

// loadPlaylists();

//shows and hides the add button
//first you toggle the add form, then if the check button is pressed,
//add a new tab with provided URL and place the repository name.
btnAdd.addEventListener('click', () => {
	toggleAddForm();

	let checkButton:HTMLElement = document.getElementById('btn-check');

	if(urlInput.innerHTML.trim() !== '') {
		checkButton.addEventListener('click', () => {
			let url:string = (<HTMLInputElement>document.getElementById('url-text')).value;
			if(url.startsWith(prefix)) {
				addPlaylist(url.split('=')[1], 0);
			}
			//Not a valid url for playlist
			else {
				console.log('Please enter a valid playlist URL. For example: ' + prefix + '...');
			}
			toggleAddForm();
		});
	}
});

//Creates a new Playlist object based on the url in the form.
//Pushes object to the array of all playlists currently tracking
//Called on checkmark button press
function addPlaylist(id, watchCount) {

	getPlaylistInfo(id).then(info => {
		let plist = new Playlist(info);
		plist.setWatchCount(watchCount);
		getVideos(id).then(videos => {
			plist.addVideos(videos);
			playlists.push(plist);
			displayPlaylist(plist);
			storage.savePlaylists(playlists);
		});
	});
}

function displayPlaylist(plist:Playlist) {
	let temp:HTMLElement = <HTMLElement>template.content.cloneNode(true);
	let thumbUrl = plist.getThumbnailUrl();
	let desc = (plist.getDescription() !== '') ? plist.getDescription() : 'There is no description available for this playlist.';
	let container = temp.querySelector('.playlist');
	// temp.addEventListener('click', function() {
	// 	console.log('clicked');
	// });
	container.id = plist.getId();
	temp.querySelector('.plist-title').innerHTML = plist.getTitle();
	temp.querySelector('.channel-name').innerHTML = plist.getChannel();
	temp.querySelector('.video-count').innerHTML = plist.getLastVideoNumber().toString() + ' / ' + plist.getTotalVideos().toString();	
	temp.querySelector('.thumbnail').innerHTML = '<img src="' + thumbUrl + '" width="120px"/>';
	temp.querySelector('.description').innerHTML = desc;

	container.addEventListener('click', () => {
		console.log(plist);
	});

	wrapper.appendChild(temp);
}

//Goes to the Google server (with HttpRequest) and retreives the playlist information
function getPlaylistInfo(id:string) {
	let info;
	let location = 'https://www.googleapis.com/youtube/v3/playlists';
	let headers = {
		'id': id,
		'part':'snippet',
		'key': api_key,
	}

	return request.getResponse(location, headers)
		.then(data => {
			console.log('quering google... (playlist)');
			return data;
		})
		.catch(error => {
			console.log(error);
		});
}

//Goes to the Google server (with HttpRequest) and retreives the videos inside a playlist id
function getVideos(id:string) {
	let location = 'https://www.googleapis.com/youtube/v3/playlistItems';
	let headers = {
		'playlistId': id,
		'part':'snippet',
		'key': api_key
	}

	return request.getResponse(location, headers)
		.then(data => {
			console.log('quering google... (video)');
			return data;
		})
		.catch(error => {
			console.log(error);
		});
}

//Method for displaying and removing the
//Add New form
function toggleAddForm() {
	let btnSpan:HTMLElement = document.getElementById('btn-url-span');
	btnSpan.classList.toggle('icon-plus-circled');
	btnSpan.classList.toggle('icon-minus-circled');

	let formElements:string = '<input id="url-text" style="width: 50%;" class="text-input" type="text" placeholder=" https://www.youtube.com/playlist?list=..."><div id="btn-check" class="btn btn-default"><span class="icon icon-check"></span></div>';
	urlInput.innerHTML = urlInput.innerHTML.trim() == '' ? formElements : '';
}

function toggleBackButton() {
	let backButton:HTMLElement = document.getElementById('btn-back');
	backButton.classList.toggle('hidden');
}

function loadPlaylists() {
	let data = storage.getPlaylists()
		.then(data => {
			if(data['playlists']) {
				for(let i = 0; i < data['playlists'].length; i++) {
					addPlaylist(data['playlists'][i].id, data['playlists'][i].lastVideo);
				}
			}
		})
		.catch(error => {
			console.log(error);
		})
}

