import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Row, RowOptions } from 'src/app/models/row';
import { ITableOptions, Table } from 'src/app/models/table';
import { environment } from 'src/environments/environment';
import { Mapping } from '../models/mapping';
import { HttpService } from './http.service';
import { StoreService } from './store.service';

const URL = environment.url;

@Injectable()
export class DataService {
  batch = [];

  constructor(
    private httpService: HttpService,
    private storeService: StoreService,
  ) {
  }

  _normalize(data, area) {
    const tables = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const id = i;
      const name = item.table_name;
      const rows = [];

      for (let j = 0; j < item.column_list.length; j++) {
        let unique;
        if (area === 'target') {
          unique = item.column_list[j].column_name.toUpperCase().replace('_ID', '') === item.table_name.toUpperCase();
        }
        const rowOptions: RowOptions = {
          id: j,
          tableId: i,
          tableName: item.table_name,
          name: item.column_list[j].column_name,
          type: item.column_list[j].column_type,
          comments: [],
          uniqueIdentifier: unique,
          area
        };

        const row = new Row(rowOptions);

        rows.push(row);
      }

      const tableOptions: ITableOptions = {
        id,
        area,
        name,
        rows
      };

      tables.push(new Table(tableOptions));
    }
    return tables;
  }

  getZippedXml(mapping: Mapping): Observable<any> {
    return this.getXmlPreview(mapping).pipe(
      switchMap(jsonMapping => {
        const headers = new Headers();
        headers.set('Content-type', 'application/json; charset=UTF-8');

        const init = {
          method: 'GET',
          headers
        };

        const url = `${URL}/get_zip_xml`;
        const request = new Request(url, init);

        return from(
          new Promise((resolve, reject) => {
            fetch(request)
              .then(responce => responce.blob())
              .then(blob => {
                const file = new File([blob], 'mapping-xml.zip');
                resolve(file);
              });
          })
        );
      })
    );
  }

  getXmlPreview(mapping: Mapping): Observable<any> {
    return this.httpService.getXmlPreview(mapping);
  }

  getSqlPreview(sourceTable: string): Observable<any> {
    return this.httpService.getSqlPreview(sourceTable);
  }

  getCDMVersions() {
    return this.httpService.getCDMVersions();
  }

  getTargetData(version) {
    return this.httpService.getTargetData(version).pipe(
      map(data => {
        const tables = this.prepareTables(data, 'target');
        this.storeService.add('version', version);
        this.prepareTargetConfig(data);
        return tables;
      })
    );
  }

  getSourceSchema(path) {
    return this.httpService.getSourceSchema(path).pipe(
      map(data => this.prepareTables(data, 'source'))
    );
  }

  getSourceSchemaData(name: string): Observable<any> {
    return this.httpService.getSourceSchemaData(name).pipe(
      map(data => this.prepareTables(data, 'source'))
    );
  }

  getTopValues(tableName: string, columnName: string): Observable<any> {
    return this.httpService.getTopValues(tableName, columnName);
  }

  prepareTargetConfig(data) {
    const COLUMNS_TO_EXCLUDE_FROM_TARGET = ['CONCEPT', 'COMMON'];
    const targetConfig = {};

    data.map(table => {
      const tableName = table.table_name;
      if (COLUMNS_TO_EXCLUDE_FROM_TARGET.findIndex(name => name === tableName) < 0) {
        targetConfig[tableName] = {
          name: `target-${tableName}`,
          first: tableName,
          data: [tableName]
        };
      }
    });

    this.storeService.add('targetConfig', targetConfig);
  }

  prepareTables(data, key: string) {
    const tables = this._normalize(data, key);
    this.storeService.add(key, tables);
    return tables;
  }

  saveReportName(data, key){
    this.storeService.add(key, data);
  }
}
