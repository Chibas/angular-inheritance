import { Injectable } from '@angular/core';
import * as _ from 'underscore';


@Injectable()
export class PagerService {

  currentPage = 1;

  getPager(currentPage: number, totalPages: number,  pageSize: number = 10) {
    let startPage: number, 
        endPage: number;

    this.currentPage = currentPage + 1;
      
    if (totalPages <= 10) {
      startPage = 0;
      endPage = totalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 0;
        endPage = 10;  
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    
    let pages = _.range(startPage, endPage);

    return {
      currentPage: currentPage,
      totalPages: totalPages,
      startPage: startPage,
      pages: pages
    }
  }

  constructor() { }

}
