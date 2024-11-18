/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import {  emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { EventService } from '../../../core/services/event.service';

import { ConfigService } from '../../../core/services/config.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CustomerRatingChart, MostPaymentMethodChart } from './chart-config';
import { BehaviorSubject, Observable } from 'rxjs';
import { _User } from 'src/app/store/Authentication/auth.models';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, AfterViewInit {
  modalRef?: BsModalRef;
  isVisible: string;
  MostPaymentMethodChart : ChartType = MostPaymentMethodChart;
  CustomerRatingChart: ChartType = CustomerRatingChart;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: any;
  statData: any;
  rateStatics : any;
  rating: any;
  currentRole: string;
  config:any = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  private currentUserSubject: BehaviorSubject<_User>;
  public currentUser: Observable<_User>;

  isActive: string;

  @ViewChild('content') content;
  @ViewChild('center', { static: false }) center?: ModalDirective;
  constructor(private modalService: BsModalService, 
    private configService: ConfigService,
     private eventService: EventService,
    private dashboardService: DashboardService) {

      this.currentUserSubject = new BehaviorSubject<_User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
      this.currentUser.subscribe(user => {
        if (user) {
        this.currentRole = user.role.translation_data[0].name;
      }});
       
      this.dashboardService.getStatistics('week').subscribe(
        response =>{
          this.rateStatics = response.result
          this.updateCustomerRatingChart();
          this.updateStatisticsData();
        }
        );
  }

  ngOnInit() {
    
    /**
     * horizontal-vertical layput set
     */
    const attribute = document.body.getAttribute('data-layout');

    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    /**
     * Fetches the data
     */
    this.fetchData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
     this.center?.show()
    }, 2000);
  }
  updateStatisticsData(){
    if(this.currentRole == 'Admin'){
    this.statData = [
      {
        icon: "bx bx-store", 
        title: "Merchants",
        link: "/private/merchants/list",
        value: this.rateStatics.totalMerchants
      },
      {
        icon: "bx bx-store",
        title: "Merchant Branches",
        link: "/private/stores",
        value: this.rateStatics.totalStores
      },
      {
        icon: "bx bxs-coupon",
        title: "Coupons",
        link: "/private/coupons",
        value: this.rateStatics.totalCoupons
      },
      {
        icon: "bx bxs-gift",
        title: "Gift Cards",
        link: "/private/coupons",
        value: this.rateStatics.totalGiftCards
      },
      {
        icon: "bxs-user-detail",
        title: "Customers",
        value: this.rateStatics.totalCustomers
      },
      {
        icon: "bxs-user-detail",
        title: "Employees",
        value: this.rateStatics.totalEmployees
      }
     
    ];
  } else {
    this.statData = [
      
      {
        icon: "bx bx-store",
        title: "Merchant Branches",
        link: "/private/stores",
        value: this.rateStatics.totalStores
      },
      {
        icon: "bx bxs-coupon",
        title: "Coupons",
        link: "/private/coupons",
        value: this.rateStatics.totalCoupons
      },
      {
        icon: "bx bxs-gift",
        title: "Gift Cards",
        link: "/private/coupons",
        value: this.rateStatics.totalGiftCards
      },
      {
        icon: "bxs-user-detail",
        title: "Employees",
        link: "/private/employees",
        value: this.rateStatics.totalEmployees
      }
     
    ];}

  }

  private updateCustomerRatingChart() {
    
    if (!this.rateStatics || !this.rateStatics.rateStats) {
      return;
    }

    const { oneStar, twoStars, threeStars, fourStars, fiveStars } = this.rateStatics.rateStats;

    this.CustomerRatingChart.series = [
      fiveStars.total, 
      fourStars.total, 
      threeStars.total, 
      twoStars.total, 
      oneStar.total 
    ];
  }
  
  /**
   * Fetches the data
   */
  private fetchData() {
    this.MostPaymentMethodChart.series = [200,30,10,50];
    this.emailSentBarChart = emailSentBarChart;
    this.monthlyEarningChart = monthlyEarningChart;

    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      
    });
  }
  opencenterModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  weeklyreport() {
    this.isActive = 'week';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Flash Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Featured Deals',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }];
  }

  monthlyreport() {
    this.isActive = 'month';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }, {
        name: 'Flash Deals',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Featured Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }];
  }

  yearlyreport() {
    this.isActive = 'year';
    this.emailSentBarChart.series =
      [{
        name: 'Coupons',
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
      }, {
        name: 'Flash Deals',
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
      }, {
        name: 'Featured Deals',
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
      }];
  }


  /**
   * Change the layout onclick
   * @param layout Change the layout
   */
  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }
}
