import { makeAutoObservable } from 'mobx'

import { SnackBarItem } from "../types/snackBarItem"

export class SnackBarStore {
  items: SnackBarItem[] = [];
  itemKeyCounter: number = 0;

  constructor() {
    makeAutoObservable(this);
  }

  addItem = (item: SnackBarItem) => {
    item.key=this.itemKeyCounter++;
    this.items.push(item);
    this.items = [...this.items];
  }

  removeItem(key: number) {
    this.items = this.items.filter((item) => item.key !== key);
  }    
}

export const snackBarStore = new SnackBarStore();
