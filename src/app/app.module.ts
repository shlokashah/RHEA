import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';
import { ToastaModule } from 'ngx-toasta';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SentenceCardComponent } from './sentence-card/sentence-card.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageItemComponent } from './message-item/message-item.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AppRoutingModule } from './/app-routing.module';
import { AddArchiveComponent } from './add-archive/add-archive.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SentenceCardComponent,
    MessageListComponent,
    MessageItemComponent,
    MessageFormComponent,
    NavbarComponent,
    AddArchiveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ToastaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
