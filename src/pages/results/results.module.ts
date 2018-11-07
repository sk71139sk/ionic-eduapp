//imports
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultsPage } from './results';

//declarations
@NgModule({
  declarations: [
    ResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultsPage),
  ],
  exports: [
    ResultsPage
  ]
})
export class ResultsPageModule {}
