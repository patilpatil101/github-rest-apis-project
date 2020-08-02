import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  response: any;
  username: string;
  searchTextChanged = new Subject<string>();
  subscription: Subscription;
  repos: any;
  users: any;
  sortField: string;
  p: number = 1;
  direction: string;

  constructor(public service: AppService) { }

  ngOnInit() {
    this.getUsers('rohit')
    this.subscription = this.searchTextChanged.pipe(
      debounceTime(300)
    ).subscribe((searchTextValue) => { this.getUsers(searchTextValue) });
  }

  getUsers(searchTextValue) {
    return this.service.get('https://api.github.com/search/users?q=' + searchTextValue).subscribe((res) => {
      this.response = res;
      if (this.response && this.response.items) {
        this.users = this.response.items;
        this.response.items.forEach((v, k) => {
          this.users[k]['show'] = false;
        });
      }
    })
  }

  onKeyUp(searchTextValue: string) {
    this.searchTextChanged.next(searchTextValue);
  }

  getDetails(username: string, i: number) {
    this.service.get('https://api.github.com/users/' + username + '/repos').subscribe((res) => {
      if (res) {
        if (this.users) {
          this.users.forEach((v: any, k: number) => {
            if (i == k) {
              this.users[i]['repos'] = res;
              this.users[k].show = !this.users[k].show;
            }
          });
        }
      }
    })
  }

  sortBy(type: string) {
    switch (type) {
      case 'name-asc':
        this.sortField = 'login';
        this.direction = 'asc';
        break;
      case 'name-dsc':
        this.sortField = 'login';
        this.direction = 'dsc';
        break;
      case 'rank-asc':
        this.sortField = 'score';
        this.direction = 'asc';
        break;
      case 'rank-dsc':
        this.sortField = 'score';
        this.direction = 'dsc';
        break;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
