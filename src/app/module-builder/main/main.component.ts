import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';



interface Tab {
  display: string;
  key: string;
}
@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  tabs: Tab[] = [
    {
      display: 'Module Builder',
      key: 'builder'
    },
    {
      display: 'Organization Modules',
      key: 'matcher'
    }
  ];

  selectedTab: Tab = this.tabs[0];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

  }

  onClickTab(tabKey: string) {
    const tab = this.tabs.find(t => t.key === tabKey);
    this.selectedTab = tab;
    this.router.navigateByUrl(`(main:${tabKey})`);
  }
}
