import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Renderer2,
  OnInit,
  NgZone,
  Output,
  EventEmitter
} from '@angular/core';
import { BridgeService } from 'src/app/services/bridge.service';
import { ITable } from 'src/app/models/table';
import { IRow } from 'src/app/models/row';
import { Area } from '../models/area';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
  @Input() area: Area;
  @Input() table: ITable;
  @Input() row: IRow;
  @Output() refreshPanel: EventEmitter<any> = new EventEmitter();
  @Input() mappingConfig: any;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private bridgeService: BridgeService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'draggable',
      'true'
    );
    this.zone.runOutsideAngular(() => {
      this.elementRef.nativeElement.addEventListener(
        'dragover',
        this.onDragOver.bind(this)
      );
    });

    setInterval( () => {this.bridgeService.recalculateConnectorsPositions(); }, 250 );

  }

  @HostListener('dragstart', [ '$event' ])
  onDragStart(e: DragEvent) {

    const element: any = e.currentTarget;
    if (element) {
      const row = this.row;
      row.htmlElement = element;
      const draggedRowIndex = this.table.rows.findIndex(selectedRow => selectedRow.name === row.name);
      this.bridgeService.draggedRowIndex = draggedRowIndex;

      if (this.area === 'source') {
        this.bridgeService.sourceRow = row;
        this.bridgeService.sourceRow.htmlElement.classList.add('drag-start');
      }
      if (this.area === 'target') {
        this.bridgeService.targetRow = row;
        this.bridgeService.targetRow.htmlElement.classList.add('drag-start');
      }
    }
  }

  onDragOver(e: any) {
    e.stopPropagation();
    e.preventDefault()
    if (e.currentTarget.nodeName === 'TR') {
      const row = e.currentTarget;

      if (!this.bridgeService.targetRowElement) {
        this.bridgeService.targetRowElement = row;
        this.bridgeService.targetRowElement.classList.add('drag-over');
        return;
      }

      if (this.bridgeService.targetRowElement !== row) {
        this.bridgeService.targetRowElement.classList.remove('drag-over');
        this.bridgeService.targetRowElement = row;
        this.bridgeService.targetRowElement.classList.add('drag-over');
      }
    }

  }

  // TODO Dont manipulate htmlElement directly
  @HostListener('drop', [ '$event' ])
  onDrop(e: DragEvent) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
    }

    if (this.bridgeService.targetRow) {
      this.bridgeService.targetRow.htmlElement.classList.remove('drag-start');
    }

    const element = e.currentTarget;
    if (element) {
      const row = this.row;

      if (this.area === 'source' && this.bridgeService.sourceRow && !this.bridgeService.targetRow
      || this.area === 'target' && this.bridgeService.targetRow && !this.bridgeService.sourceRow) {
        const replacerowindex = this.table.rows.findIndex(selectedRow => selectedRow.name === row.name);
        moveItemInArray(this.table.rows, this.bridgeService.draggedRowIndex, replacerowindex);
        this.bridgeService.newRowIndex = replacerowindex;
        this.bridgeService.storeReorderedRows(this.table.name, this.area);
        this.refreshPanel.emit();
        return;
      }

      if (this.row.hasConstant || this.row.hasIncrement) {
        return;
      }

      row.htmlElement = element;
      this.bridgeService.targetRow = row;
      if (this.bridgeService.connect.canExecute()) {
        this.bridgeService.connect.execute(this.mappingConfig);
      }
    }
  }

  @HostListener('dragend', [ '$event' ])
  onDragEnd(e: DragEvent) {
    if (this.bridgeService.sourceRow) {
      this.bridgeService.sourceRow.htmlElement.classList.remove('drag-start');
      this.bridgeService.sourceRow = null;
    }

    if (this.bridgeService.targetRow) {
      this.bridgeService.targetRow.htmlElement.classList.remove('drag-start');
      this.bridgeService.targetRow = null;
    }

    if (this.bridgeService.targetRowElement) {
      this.bridgeService.targetRowElement.classList.remove('drag-over');
    }
  }

}
