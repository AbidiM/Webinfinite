/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component,  OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { selectDataGiftCard, selectDataLoading, selectDataTotalItems } from 'src/app/store/giftCard/giftCard-selector';
import { deleteGiftCardlist, fetchGiftCardlistData, updateGiftCardlist } from 'src/app/store/giftCard/giftCard.action';
import { GiftCard } from 'src/app/store/giftCard/giftCard.model';
import { Modules, Permission } from 'src/app/store/Role/role.models';



@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrl: './gift-card.component.css'
})
export class GiftCardComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<object>;
  public Modules = Modules;
  public Permission = Permission;

  giftCardList$: Observable<GiftCard[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;

  isDropdownOpen : boolean = false;
  filteredArray: GiftCard[] = [];
  originalArray: GiftCard[] = [];

  itemPerPage: number = 10;
  currentPage : number = 1;
  
  columns : any[]= [
    { property: 'translation_data[0].name', label: 'Title' },
    { property: 'merchant.translation_data[0].name', label: 'Merchant_Name' },
    { property: 'startDateGiftCard', label: 'Start_Date' },
    { property: 'endDateGiftCard', label: 'End_Date' },
    { property: 'status', label: 'Status' },
  ];

  constructor(
    public toastr:ToastrService,
    public store: Store) {
      
      this.giftCardList$ = this.store.pipe(select(selectDataGiftCard)); 
      this.totalItems$ = this.store.pipe(select(selectDataTotalItems));
      this.loading$ = this.store.pipe(select(selectDataLoading));


  }

  ngOnInit() {
   
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage, status: '' }));
    this.giftCardList$.subscribe(data => {
      this.originalArray = data; // giftCard the full giftCard list
      this.filteredArray = [...this.originalArray];
      document.getElementById('elmLoader')?.classList.add('d-none');
     

    });
       
  }
  onPageSizeChanged(event: any): void {
    const totalItems =  event.target.value;
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: totalItems, status:'' }));
   }
   // pagechanged
   onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.store.dispatch(fetchGiftCardlistData({ page: this.currentPage, itemsPerPage: this.itemPerPage }));
    
  }

  // Delete Store
  onDelete(id: number) {
    this.store.dispatch(deleteGiftCardlist({ GiftCardId: id }));
  }

 
  onChangeEvent( event: any) {
        const newStatus = event.event.checked ? 'active' : 'inactive'; 
    const newData = {id: event.data.id, status: newStatus }
    this.store.dispatch(updateGiftCardlist({ updatedData: newData }));
  }

 }

