import { Injectable } from '@angular/core';
import { Column } from '../../grid/grid';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../app.constants';
import { stateCodes, stateColumns } from './state';
import { SourceConcept } from '../../models/code-mapping/source-concept';
import { CodeMapping } from '../../models/code-mapping/code-mapping';
import { CodeMappingParams } from '../../models/code-mapping/code-mapping-params';

@Injectable()
export class ImportCodesService {

  csv: File

  codes: SourceConcept[]

  columns: Column[]

  codeMapping: CodeMapping

  private csvFileName: string

  constructor(private httpClient: HttpClient) {
    this.codes = stateCodes
    this.columns = stateColumns
  }

  get imported(): boolean {
    return !!this.codes && !!this.columns
  }

  loadCsv(csv: File, delimeter = ','): Observable<SourceConcept[]> {
    const formData = new FormData()
    formData.append('file', csv)
    formData.append('delimiter', delimeter)

    return this.httpClient.post<SourceConcept[]>(`${apiUrl}/load_codes_to_server`, formData)
      .pipe(
        tap(codes => {
          if (codes.length === 0) {
            throw new Error('Empty csv file')
          }
          this.csvFileName = csv.name
          this.codes = codes
          this.columns = Object.keys(codes[0]).map(key => ({
            field: key,
            name: key
          }))
        })
      )
  }

  calculateScore(params: CodeMappingParams): Observable<CodeMapping> {
    return this.httpClient.post<CodeMapping>(`${apiUrl}/import_source_codes`, params)
      .pipe(
        tap(codeMapping => this.codeMapping = codeMapping)
      )
  }

  reset() {
    this.csv = null
    this.codes = null
    this.columns = null
    this.codeMapping = null
  }
}
