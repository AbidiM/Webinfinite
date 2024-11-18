/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Modules, Permission } from 'src/app/store/Role/role.models';
import { deleteNotificationlist, fetchNotificationlistData, updateNotificationlist } from 'src/app/store/notification/notification.action';
import { selectDataLoading, selectDataNotification, selectDataTotalItems } from 'src/app/store/notification/notification-selector';
import { Notification } from 'src/app/store/notification/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{
  
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  notificationList$: Observable<Notification[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>


  isDropdownOpen : boolean = false;
  filteredArray: Notification[] = [];
  originalArray: Notification[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;

  columns : any[]= [
    { property: 'translation_data[0].title', label: 'Title' },
    { property: 'translation_data[0].description', label: 'Description' },
    { property: 'status', label: 'Status' },
  ];

  constructor(private store: Store) {
      
      this.notificationList$ = this.store.pipe(select(selectDataNotification)); // Observing the Notification list from Notification
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));

    }

  ngOnInit() {
          
        this.store.dispatch(fetchNotificationlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
        this.notificationList$.subscribe(data => {
        this.originalArray = data; // Notification the full Notification list
        this.filteredArray = [...this.originalArray];
        document.getElementById('elmLoader')?.classList.add('d-none');
     
        });
   }
   onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchNotificationlistData({ page: this.currentPage, itemsPerPage: totalItems }));
   }
 
  // pagechanged
  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchNotificationlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Notification
  onDelete(id: any) {
    this.store.dispatch(deleteNotificationlist({ notificationId: id }));
  }

 
  onChangeEvent( event: any) {
    const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateNotificationlist({ updatedData: newData }));
  }


}
