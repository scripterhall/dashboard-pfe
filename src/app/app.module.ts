import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelectProjetComponent } from './pages/select-projet/select-projet.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { AjouterTicketHistoireFormComponent } from './pages/ajouter-ticket-histoire-form/ajouter-ticket-histoire-form.component';
import { AjouterSprintFormComponent } from './pages/ajouter-sprint-form/ajouter-sprint-form.component';
import { ConfirmDialogComponent } from './pages/confirm-dialog/confirm-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { ConfirmDialogDeleteUserStoryComponent } from './pages/confirm-dialog-delete-user-story/confirm-dialog-delete-user-story.component';
import { ConfirmAddUserStoryDialogueComponent } from './pages/confirm-add-user-story-dialogue/confirm-add-user-story-dialogue.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    HttpClientModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ComponentsModule,
    MatNativeDateModule ,
    MatRadioModule,
    NgbModule,
    RouterModule,
    MatTabsModule,
    MatTableModule,
    AppRoutingModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatStepperModule
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent, SelectProjetComponent, AjouterTicketHistoireFormComponent, AjouterSprintFormComponent, ConfirmDialogComponent, ConfirmDialogDeleteUserStoryComponent, ConfirmAddUserStoryDialogueComponent],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule {}
