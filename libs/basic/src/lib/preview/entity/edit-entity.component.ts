import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'dontcode-edit-entity',
  templateUrl: './edit-entity.component.html',
  styleUrls: ['./edit-entity.component.scss']
})
export class EditEntityComponent implements OnInit {

  @Input()
  value:any

  constructor() { }

  ngOnInit(): void {
  }

}
