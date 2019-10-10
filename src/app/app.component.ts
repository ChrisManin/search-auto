import { Component, OnInit } from '@angular/core';
import { Items, Item, GithubResponse } from './interface';
import { GithubService } from './services/github.service';
import { Observable, observable, of } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import {
  startWith,
  map,
  debounceTime,
  mergeMapTo,
  mergeMap,
  switchMap,
  catchError
} from 'rxjs/operators';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public githubAutoComplete$: Observable<Items> = null;
  public autoCompleteControl = new FormControl();

  public myControl = new FormControl();
  public options: string[] = ['Delhi', 'Mumbai', 'Banglore'];
  public filteredOptions: Observable<string[]>;

  public stateForm: FormGroup = this.formBuilder.group({
    stateGroup: '',
  });

  stateGroups: StateGroup[] = [
    {
      letter: 'A',
      names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
    }, {
      letter: 'C',
      names: ['California', 'Colorado', 'Connecticut']
    }, {
      letter: 'D',
      names: ['Delaware']
    }, {
      letter: 'F',
      names: ['Florida']
    }, {
      letter: 'G',
      names: ['Georgia']
    }, {
      letter: 'H',
      names: ['Hawaii']
    }, {
      letter: 'I',
      names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
    }, {
      letter: 'K',
      names: ['Kansas', 'Kentucky']
    }, {
      letter: 'L',
      names: ['Louisiana']
    }, {
      letter: 'M',
      names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
        'Minnesota', 'Mississippi', 'Missouri', 'Montana']
    }, {
      letter: 'N',
      names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
        'New Mexico', 'New York', 'North Carolina', 'North Dakota']
    }, {
      letter: 'O',
      names: ['Ohio', 'Oklahoma', 'Oregon']
    }, {
      letter: 'P',
      names: ['Pennsylvania']
    }, {
      letter: 'R',
      names: ['Rhode Island']
    }, {
      letter: 'S',
      names: ['South Carolina', 'South Dakota']
    }, {
      letter: 'T',
      names: ['Tennessee', 'Texas']
    }, {
      letter: 'U',
      names: ['Utah']
    }, {
      letter: 'V',
      names: ['Vermont', 'Virginia']
    }, {
      letter: 'W',
      names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
    }
  ];

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(private githubService: GithubService, private formBuilder: FormBuilder) { }

  lookup(value: string): Observable<Items> {
    return this.githubService.search(value.toLowerCase()).pipe(
      // map the item property of the github results as our return object
      map(results => results.items),
      // catch errors
      catchError(_ => {
        return of(null);
      })
    );
  }

  ngOnInit() {
    this.githubAutoComplete$ = this.autoCompleteControl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );

    // tslint:disable-next-line: no-non-null-assertion
    this.stateGroupOptions = this.stateForm.get('stateGroup')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this.filterGroup(value))
    );
  }

  private filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({ letter: group.letter, names: filter(group.names, value) }))
        .filter(group => group.names.length > 0);
    }

    return this.stateGroups;
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
