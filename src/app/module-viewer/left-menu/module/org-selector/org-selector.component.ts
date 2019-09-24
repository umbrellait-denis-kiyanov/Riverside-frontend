import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Organization } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';
import { Router } from '@angular/router';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

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
    private moduleNavService: ModuleNavService,
    private router: Router
  ) {}

  ngOnInit() {
    this.organizations$ = this.moduleService.getOrganizations();

    this.moduleNavService.organization$.pipe(first()).subscribe((orgId: number) => {
      this.organizations$.subscribe(organizations => {
        const currentOrg = organizations.find(
          org => org.id === orgId
        );

        this.setOrganization(
          orgId && currentOrg ? currentOrg : organizations[0]
        );
      });
    });
  }

  setOrganization(organization: Organization) {
    if (!this.organization || (this.organization.id !== organization.id)) {
      const moduleId = this.moduleNavService.module.current.id;
      const stepId = this.moduleNavService.getStepId();

      this.organization = organization;

      this.router.navigate(['org', organization.id, 'module', moduleId, 'step', stepId]);
    }
  }
}
