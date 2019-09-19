import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import User from 'src/app/common/interfaces/user.model';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'module-org-selector',
  templateUrl: './org-selector.component.html',
  styleUrls: ['./org-selector.component.sass']
})
export class OrgSelectorComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  organization: Organization;

  constructor(
    private moduleService: ModuleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();
    const { orgId } = this.route.snapshot.params;
    this.organizations$.subscribe(organizations => {
      const currentOrg = organizations.find(
        org => org.id.toString() === orgId
      );
      return this.setOrganization(
        orgId && currentOrg ? currentOrg : organizations[0]
      );
    });
  }

  setOrganization(organization: Organization) {
    this.organization = organization;
    const { moduleId, orgId } = this.route.snapshot.params;
    if (orgId !== organization.id.toString()) {
      this.router.navigate(['org', organization.id, 'module', moduleId]);
    }
  }
}
