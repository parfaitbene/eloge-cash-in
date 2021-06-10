import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionLineListPage } from '../collections/collection-line-list/collection-line-list.page';
import { CollectionListComponent } from '../collections/collection-list/collection-list.component';
import { CustomerListComponent } from '../customers/customer-list/customer-list.component';
import { TabsPage } from './tabs.page';
import { Plugins } from '@capacitor/core';
import { Tab3Page } from '../tab3/tab3.page';


const { Storage } = Plugins;


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'clients',
        children: [
          {
            path: '',
            component: CustomerListComponent
          },
          {
            path: 'import',
            loadChildren: () => import('../customers/customer-import/customer-import.module').then(m => m.CustomerImportPageModule)
          },
        ]
      },
      {
        path: 'collections',
        children: [
          {
            path: '',
            component: CollectionListComponent
          },
          {
            path: 'import',
            loadChildren: () => import('../collections/collection-import/collection-import.module').then(m => m.CollectionImportPageModule)
          },
          {
            path: 'lines',
            children: [
              {
                path: '',
                loadChildren: () => import('../collections/collection-line-list/collection-line-list.module').then(m => m.CollectionLineListPageModule),
              },
              {
                path: 'import',
                loadChildren: () => import('../collections/collection-line-import/collection-line-import.module').then(m => m.CollectionLineImportPageModule)
              },
            ],
          },
        ]
      },
      {
        path: 'tab3',
        component: Tab3Page
        //loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/collections',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo:'/tabs/collections',
    pathMatch: 'full'
  }
];
// isdbSetupDone.value?'/tabs/collections':'/tabs/tab3'
@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule implements OnInit{


  constructor(){

  }

  ngOnInit(){
    console.log("IN TABS ROUTING");

  }

}
