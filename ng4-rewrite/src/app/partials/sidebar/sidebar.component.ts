import { Component, OnInit, NgZone } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { Playlist } from '../../models/Playlist';
import { GoogleApiService } from '../../providers/googleapi.service';
import PlaylistsService from '../../providers/playlist.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: 'sidebar.component.html',
	styleUrls: ['sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	sidebarHeader: string = 'Sign In With Google';
	playlists:Playlist[];

	constructor(private googleApiService: GoogleApiService,
							private playlistsService: PlaylistsService,
							private zone:NgZone) { }

	ngOnInit() {
		this.registerEvents()
	}

	registerEvents() {
		this.playlistsService.myPlaylists
			.subscribe(value => {
				this.zone.run(() => {
					this.playlists = value
				})
			})

			this.playlistsService.myName
				.subscribe(value => {
					this.zone.run(() => {
						this.sidebarHeader = value;
					})
				})
	}

	loginHandler() {
		this.googleApiService.login()
	}
}