import { Component, Input, ViewChild } from '@angular/core';
import { AbstractConsoleWrapperComponent } from '../../shared/scan-console-wrapper/abstract-console-wrapper.component';
import { ScanDataUploadService } from '../../../services/white-rabbit/scan-data-upload.service';
import { saveAs } from 'file-saver';
import { ScanDataConsoleComponent } from './scan-data-console/scan-data-console.component';
import { ScanDataService } from '../../../services/white-rabbit/scan-data.service';
import { switchMap } from 'rxjs/operators';
import { blobToFile } from '../../../utilites/file';
import { parseHttpError } from '../../../utilites/error';

@Component({
  selector: 'app-scan-data-console-wrapper',
  templateUrl: './scan-console-wrapper.component.html',
  styleUrls: ['scan-console-wrapper.component.scss', '../../shared/scan-console-wrapper/console-wrapper.component.scss', '../../styles/scan-data-buttons.scss']
})
export class ScanConsoleWrapperComponent extends AbstractConsoleWrapperComponent {

  result: string // scan-report server file location

  @ViewChild(ScanDataConsoleComponent)
  scanDataConsoleComponent: ScanDataConsoleComponent;

  @Input()
  private reportName: string;  // Without extension

  constructor(private whiteRabbitService: ScanDataService,
              private scanDataUploadService: ScanDataUploadService) {
    super();
  }

  onSaveReport() {
    this.whiteRabbitService.downloadScanReport(this.result)
      .subscribe(
        file => saveAs(file, `${this.reportName}.xlsx`),
        error => this.showErrorMessage(parseHttpError(error))
      )
  }

  onUploadReport() {
    this.whiteRabbitService.downloadScanReport(this.result)
      .pipe(
        switchMap(blob => this.scanDataUploadService.uploadScanReport(
          blobToFile(blob, `${this.reportName}.xlsx`))
        )
      )
      .subscribe(
        () => this.close.emit(),
        error => this.showErrorMessage(parseHttpError(error))
      )
  }

  onFinish(userId: string) {
    this.result = userId;
  }
}
