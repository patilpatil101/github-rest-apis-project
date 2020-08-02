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

  constructor(public service: AppService) { }

  ngOnInit() {
    this.getUsers('patilpatil101');
    this.subscription = this.searchTextChanged.pipe(
      debounceTime(300)
    ).subscribe((searchTextValue) => { this.getUsers(searchTextValue) });
  }

  getUsers(searchTextValue) {
    return this.service.get('https://api.github.com/search/users?q=' + searchTextValue).subscribe((res) => {
      this.response = res;
      if (this.response && this.response.items) {
        this.users = this.response.items;
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
            }
          });
        }
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
