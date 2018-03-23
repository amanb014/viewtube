import { Injectable, Inject} from '@angular/core';
import { Playlist } from '../models/Playlist';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export default class PlaylistsService {

	public myPlaylists: ReplaySubject<Playlist[]>;
	public myName: ReplaySubject<string>;

	constructor(@Inject(UserService) private userService: UserService) {
		this.myPlaylists = new ReplaySubject(1);
		this.myName = new ReplaySubject(1);
	}

	addAccountPlaylists(resp: any) {
		//TODO: Check for nulls and error responses better in the future
		if(resp.status != 200 || resp.data.pageInfo.resultsPerPage <= 0) {
			console.error('Error. We were unable to receive data from YouTube.', resp);
			return;
		}

		this.userService.setMyName(resp.data.items[0].snippet.channelTitle);
		const lists:{} = resp['data']['items'];
		let plists: Playlist[] = [];
		Object.entries(lists).forEach(
			([key, info]) => {
				plists.push(new Playlist(info));
			});
			this.myPlaylists.next(plists);
	}
}