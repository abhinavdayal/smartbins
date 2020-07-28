import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { BinUseComponent } from "./components/bin-use/bin-use.component";

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'binuse', component: BinUseComponent },
    { path: 'binuse/:encryptedmsg', component: BinUseComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EngageRoutingModule { }
