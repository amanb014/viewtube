import { HomeComponent } from './partials/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './partials/search/search.component';
import {PlaylistViewComponent} from './partials/playlist-view/playlist-view.component';
import { SettingsComponent } from './partials/settings/settings.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'playlist/:id', component: PlaylistViewComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
