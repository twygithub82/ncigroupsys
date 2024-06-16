import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragPreview } from '@angular/cdk/drag-drop';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, DatePipe, formatDate, CommonModule } from '@angular/common';
import { NgScrollbar } from 'ngx-scrollbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, startWith, tap } from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
    selector: 'app-cleaning-procedures-new',
    standalone: true,
    templateUrl: './cleaning-procedures-new.component.html',
    styleUrl: './cleaning-procedures-new.component.scss',
    imports: [
      BreadcrumbComponent,
      MatButtonModule,
      MatSidenavModule,
      MatTooltipModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatSelectModule,
      MatOptionModule,
      MatDatepickerModule,
      MatAutocompleteModule,
      FormsModule,
      ReactiveFormsModule,
      NgScrollbar,
      CdkDropList,
      CdkDrag,
      CdkDragHandle,
      CdkDragPlaceholder,
      CdkDragPreview,
      NgClass,
      DatePipe,
      MatNativeDateModule,
      TranslateModule,
      CommonModule
    ]
})
export class CleaningProceduresNewComponent implements OnInit {
  mode = new UntypedFormControl('side');
  taskForm: UntypedFormGroup;
  cleanForm: UntypedFormGroup;
  showFiller = false;
  isNewEvent = false;
  dialogTitle?: string;
  userImg?: string;

  private cleanStepsSource = new BehaviorSubject<CleanStep[]>([]);
  cleanSteps$ = this.cleanStepsSource.asObservable()
  cleanSteps: CleanStep[] = []

  pageTitle = 'MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-PROCEDURES-NEW'
  breadcrumsMiddleList = [
    'MENUITEMS.HOME.TEXT',
    'MENUITEMS.CLEANING-MANAGEMENT.LIST.CLEAN-PROCEDURES'
  ]

  NEW = 'COMMON-FORM.NEW'
  PROCEDURE_DETAILS = 'COMMON-FORM.PROCEDURE-DETAILS'
  PROCEDURE_NAME = 'COMMON-FORM.PROCEDURE-NAME'
  PROCEDURE_DESCRIPTION = 'COMMON-FORM.DESCRIPTION'
  PROCEDURE_CLEAN_CATEGORY = 'COMMON-FORM.CLEAN-CATEGORY'
  PROCEDURE_CLEAN_GROUP = 'COMMON-FORM.CLEAN-GROUP'
  PROCEDURE_MIN_COST = 'COMMON-FORM.MIN-COST'
  PROCEDURE_MAX_COST = 'COMMON-FORM.MAX-COST'
  PROCEDURE_TOTAL_DURATION = 'COMMON-FORM.TOTAL-DURATION'
  PROCEDURE_REQUIRED = 'COMMON-FORM.IS-REQUIRED'
  PROCEDURE_STEPS = 'COMMON-FORM.PROCEDURE-STEPS'
  PROCEDURE_STEP_NAME = 'COMMON-FORM.STEP-NAME'
  PROCEDURE_STEP_DURATION = 'COMMON-FORM.STEP-DURATION'
  PROCEDURE_STEP_DURATION_TOOLTIP = 'COMMON-FORM.STEP-DURATION-TOOLTIP'

  totalDuration$?: Observable<number>;
  
  thirdForm?: UntypedFormGroup;
  hide3 = true;

  myControl = new UntypedFormControl();
  cleanStepOptions: CleanStep[] = [];
  filteredCleanStepOptions?: Observable<CleanStep[]>;
  
  myControl2 = new UntypedFormControl();
  cleanGroupOptions: CleanGroup[] = [];
  filteredCleanGroupOptions?: Observable<CleanGroup[]>;

  selectedStep?: CleanStep;
  selectedGroup?: CleanGroup;

  cleanStepDuration: number = 0

  constructor(private fb: UntypedFormBuilder, private http: HttpClient) {
    const blank = {} as Task;
    this.initThirdForm();
    this.taskForm = this.createFormGroup(blank);
    this.cleanForm = this.createFormGroup(blank);
    this.totalDuration$ = this.cleanSteps$.pipe(
      filter(steps => {
        return Array.isArray(steps);
      }),
      map(steps => {
        return steps.reduce((total, step) => total + step.duration, 0);
      })
    );
  }

  ngOnInit() {
    this.fetchCleanSteps().subscribe((data: CleanStep[]) => {
      this.cleanStepOptions = data;
      this.generateDefaultCleanStep();
      this.initializefilteredCleanStepOptions();
    });
    this.fetchCleanGroups().subscribe((data: CleanGroup[]) => {
      this.cleanGroupOptions = data;
      this.initializefilteredCleanGroupOptions();
    });
    //this.cleanSteps$ = this.cleanStepsSource.asObservable()
  }
  initThirdForm() {
    this.thirdForm = this.fb.group({
      procedure_name: [''],
      description: [''],
      clean_category: [''],
      clean_group: [''],
    });
  }
  fetchCleanStepsObs(): Observable<CleanStep[]> {
    return this.http.get<CleanStep[]>('assets/data/demoCleanSteps.json').pipe(
      tap(steps => this.cleanStepsSource.next([...steps]))
    );
  }
  fetchCleanSteps(): Observable<CleanStep[]> {
    return this.http.get<CleanStep[]>('assets/data/demoCleanSteps.json');
  }
  fetchCleanGroups(): Observable<CleanGroup[]> {
    return this.http.get<CleanGroup[]>('assets/data/demoCleanGroups.json');
  }
  initializefilteredCleanStepOptions() {
    // Assuming `myControl` is a FormControl you've previously declared and imported
    this.filteredCleanStepOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.stepName),
      map(stepName => stepName ? this._filterCleanSteps(stepName) : this.cleanStepOptions.slice())
    );
  }
  initializefilteredCleanGroupOptions() {
    // Assuming `myControl` is a FormControl you've previously declared and imported
    this.filteredCleanGroupOptions = this.myControl2.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.groupName),
      map(groupName => groupName ? this._filterCleanGroups(groupName) : this.cleanGroupOptions.slice())
    );
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.cleanSteps, event.previousIndex, event.currentIndex);
  }
  toggle(step: { selected: boolean }, nav: MatSidenav) {
    nav.close();
    step.selected = !step.selected;
  }
  addNewTask(nav: MatSidenav) {
    // this.resetFormField();
    // this.isNewEvent = true;
    // this.dialogTitle = 'New Task';
    // this.userImg = 'assets/images/user/user1.jpg';
    // nav.open();
  }
  addCleanStep() {
    this.selectedStep!.duration = this.cleanStepDuration
    const currentSteps = this.cleanStepsSource.getValue();
    this.cleanStepsSource.next([...currentSteps, this.selectedStep!])
  }
  deleteCleanStep() {
    this.cleanSteps = this.cleanSteps.filter(step => !step.selected);
    let tempSteps = this.cleanStepsSource.getValue();
    tempSteps = tempSteps.filter(step => !step.selected);
    this.cleanStepsSource.next(tempSteps);
  }
  generateDefaultCleanStep() {
    this.cleanSteps = this.getRandomItems(this.cleanStepOptions, 11);
  }
  getRandomItems(items: CleanStep[], count: number) {
    let result: CleanStep[] = new Array(count);
    let len = items.length;
    let taken = new Array(len);
    if (count > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (count--) {
      let x = Math.floor(Math.random() * len);
      let item = items[x in taken ? taken[x] : x]
      item.duration = Math.floor(Math.random() * 10) + 1;
      result[count] = items[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
      const currentSteps = this.cleanStepsSource.getValue();
      this.cleanStepsSource.next([...currentSteps, result[count]])
    }
    return result;
  }
  taskClick(step: CleanStep, nav: MatSidenav): void {
    // this.isNewEvent = false;
    // nav.open();
    // this.cleanForm = this.createCleanFormGroup(step);
  }
  closeSlider(nav: MatSidenav) {
    nav.close();
  }
  createFormGroup(data: Task) {
    return this.fb.group({
      id: [data ? data.id : this.getRandomID()],
      img: [data ? data.img : 'assets/images/user/user1.jpg'],
      name: [data ? data.name : null],
      title: [data ? data.title : null],
      done: [data ? data.done : null],
      priority: [data ? data.priority : null],
      due_date: [data ? data.due_date : null],
      note: [data ? data.note : null],
    });
  }
  createCleanFormGroup(data: CleanStep) {
    return this.fb.group({
      id: [data ? data.id : this.getRandomID()],
      stepName: [data ? data.stepName : ''],
      description: [data ? data.description : null],
      latUpdateDt: [data ? data.latUpdateDt : null],
      duration: [data ? data.duration : null],
      selected: [data ? data.selected : null],
    });
  }
  onSelectCleanStep(event: any) {
    this.selectedStep = event.option.value;
  }
  onSelectCleanGroup(event: any) {
    this.selectedGroup = event.option.value;
  }
  saveTask() {
    this.cleanSteps.unshift(this.taskForm.value);
    this.resetFormField();
  }
  editTask() {
    // const targetIdx = this.tasks
    //   .map((item) => item.id)
    //   .indexOf(this.taskForm.value.id);
    // this.tasks[targetIdx] = this.taskForm.value;
  }
  deleteTask(nav: MatSidenav) {
    const targetIdx = this.cleanSteps
      .map((item) => item.id)
      .indexOf(this.taskForm.value.id);
    this.cleanSteps.splice(targetIdx, 1);
    nav.close();
  }
  resetFormField() {
    this.taskForm.controls['name'].reset();
    this.taskForm.controls['title'].reset();
    this.taskForm.controls['done'].reset();
    this.taskForm.controls['priority'].reset();
    this.taskForm.controls['due_date'].reset();
    this.taskForm.controls['note'].reset();
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
  onThirdFormSubmit() {
    console.log('Form Value', this.thirdForm?.value);
  }
  displayCleanStepFn(step: CleanStep): string {
    return step && step.stepName ? step.stepName : '';
  }
  displayCleanGroupFn(group: CleanGroup): string {
    return group && group.groupName ? group.groupName : '';
  }
  private _filterCleanSteps(name: string): CleanStep[] {
    const filterValue = name.toLowerCase();

    return this.cleanStepOptions.filter(
      (option) => option.stepName.toLowerCase().indexOf(filterValue) === 0
    );
  }
  private _filterCleanGroups(name: string): CleanGroup[] {
    const filterValue = name.toLowerCase();

    return this.cleanGroupOptions.filter(
      (option) => option.groupName.toLowerCase().indexOf(filterValue) === 0
    );
  }
}

export class Task {
  id: string;
  img: string;
  name: string;
  title: string;
  done: boolean;
  note: string;
  priority: string;
  due_date: string;
  constructor(appointment: Task) {
    {
      this.id = appointment.id || this.getRandomID();
      this.img = appointment.img || 'assets/images/user/user1.jpg';
      this.name = appointment.name || '';
      this.title = appointment.title || '';
      this.done = appointment.done || true;
      this.due_date = formatDate(new Date(), 'yyyy-MM-dd', 'en') || '';
      this.note = appointment.note || '';
      this.priority = appointment.priority || '';
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}

export class CleanStep {
  id: string;
  stepName: string = ""
  description: string = ""
  latUpdateDt: string = ""
  duration: number = 1
  selected: boolean = false
  constructor(step: CleanStep) {
    this.id = step.id || this.getRandomID();
    this.stepName = step.stepName || '';
    this.description = step.description || ''
    this.latUpdateDt = step.latUpdateDt || ''
    this.duration = step.duration || 1
    this.selected = step.selected || false
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}

export class CleanGroup {
  id: string;
  groupName: string = ""
  category: string = ""
  minCost: number = 0
  maxCost: number = 0
  latUpdateDt: string = ""
  constructor(step: CleanGroup) {
    this.id = step.id || this.getRandomID();
    this.groupName = step.groupName || '';
    this.category = step.category || ''
    this.minCost = step.minCost || 0
    this.maxCost = step.maxCost || 0
    this.latUpdateDt = step.latUpdateDt || ''
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}