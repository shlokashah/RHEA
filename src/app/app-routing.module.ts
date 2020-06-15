import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddArchiveComponent } from './add-archive/add-archive.component';

const routes: Routes = [
  { path:'', pathMatch:'full', redirectTo:'home' },
  { path:'home', component: HomeComponent },
  { path:'viewArchive', component: AddArchiveComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
