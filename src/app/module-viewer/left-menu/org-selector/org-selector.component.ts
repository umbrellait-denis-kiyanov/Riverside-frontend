import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

@Component({
  selector: 'module-org-selector',
  templateUrl: './org-selector.component.html',
  styleUrls: ['./org-selector.component.sass']
})
export class OrgSelectorComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  currentOrg: Organization;
  organizationID: number;

  @Output() changed = new EventEmitter<Organization>(true);

  constructor(
    private moduleService: ModuleService,
    private moduleNavService: ModuleNavService
  ) {}

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();
    this.organizationID = this.moduleNavService.lastOrganization.current;

    this.moduleNavService.organization$.subscribe((orgId: number) => {
      this.organizations$.subscribe(organizations => {
        this.currentOrg = organizations.find(
          org => Number(org.id) === Number(orgId)
        );

        this.setOrganization(
          orgId && this.currentOrg ? this.currentOrg : organizations[0]
        );
      });
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
