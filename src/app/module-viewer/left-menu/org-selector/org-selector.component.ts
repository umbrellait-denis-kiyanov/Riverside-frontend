import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'module-org-selector',
  templateUrl: './org-selector.component.html',
  styleUrls: ['./org-selector.component.sass']
})
export class OrgSelectorComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  currentOrg: Organization;
  organizationID: number;
  active$: Observable<{[key: number]: boolean}>;

  @Output() changed = new EventEmitter<Organization>(true);
  @Input() warning = {};
  @Input() activeOrganizations?: Observable<Organization[]>;

  constructor(
    private moduleService: ModuleService,
    private moduleNavService: ModuleNavService
  ) {}

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();
    this.moduleNavService.organization$.pipe(take(1)).subscribe(orgId => this.organizationID);

    if (this.activeOrganizations) {
      this.active$ = this.activeOrganizations.pipe(
        map(orgs => orgs.reduce((all, org) => Object.assign(all, {[org.id]: true}), {}))
      );
    }

    combineLatest(this.moduleNavService.organization$, this.organizations$).pipe(take(1)).subscribe(([orgId, organizations]) => {
      this.currentOrg = organizations.find(
        org => Number(org.id) === Number(orgId)
      );

      this.setOrganization(
        orgId && this.currentOrg ? this.currentOrg : organizations[0]
      );
    });
  }

  setOrganization(organization: Organization) {
    this.currentOrg = organization;

    if (this.organizationID !== organization.id) {
      this.organizationID = Number(organization.id);

      this.changed.emit(organization);
    }
  }
}
