import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from "./app.component";
import {HomeModule} from "./pages/home/home.module";
import {EnvironmentalModule} from "./pages/environmental/environmental.module";
import {LoginModule} from "./pages/login/login.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {ProjectModule} from "./pages/project/project.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HomeModule,
        LoginModule,
        EnvironmentalModule,
        ProjectModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatSnackBarModule
    ],
    providers: [],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
