import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {ProjectComponent} from "./pages/project/project.component";
import {OrganizationComponent} from "./pages/organization/organization.component";
import {EnvironmentalComponent} from "./pages/environmental/environmental.component";
import {MineralComponent} from "./pages/mineral/mineral.component";
import {MiscContractComponent} from "./pages/misc-contract/misc-contract.component";
import {UserComponent} from "./pages/user/user.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'organization', component: OrganizationComponent
  },
  {
    path: 'project', component: ProjectComponent
  },
  {
    path: 'environmental', component: EnvironmentalComponent
  },
  {
    path: 'mineral', component: MineralComponent
  },
  {
    path: 'misc-contract', component: MiscContractComponent
  },
  {
    path: 'user', component: UserComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'logout', redirectTo: '/login', pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
