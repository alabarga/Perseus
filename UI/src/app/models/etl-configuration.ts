import { IRow, Row } from './row';
import { Table } from './table';
import { ArrowCache, IArrowCache } from '@models/arrow-cache';
import { Type } from 'class-transformer';
import { ConstantCache, IConstantCache } from '@models/constant-cache';
import { Concepts, IConcepts } from '@models/concepts';
import { Clones, IClones } from '@models/clones';
import { TargetConfig } from '@models/state';
import { EtlMapping } from '@models/perseus/etl-mapping'

export interface IEtlConfiguration {
  etlMapping?: EtlMapping
  name?: string;
  tablesConfiguration?: TargetConfig;
  mappingsConfiguration?: IArrowCache;
  source?: Table[];
  target?: Table[];
  filtered?: string;
  recalculateSimilar?: boolean;
  constants?: IConstantCache;
  targetClones?: IClones;
  sourceSimilar?: IRow[];
  targetSimilar?: IRow[];
  concepts?: IConcepts;
}

export class EtlConfiguration implements IEtlConfiguration {
  etlMapping?: EtlMapping
  name?: string;
  tablesConfiguration?: TargetConfig;

  @Type(() => ArrowCache)
  mappingsConfiguration?: IArrowCache;

  @Type(() => Table)
  source?: Table[];

  @Type(() => Table)
  target?: Table[];

  filtered?: string;
  recalculateSimilar?: boolean;

  @Type(() => ConstantCache)
  constants?: IConstantCache;

  @Type(() => Clones)
  targetClones?: IClones;

  @Type(() => Row)
  sourceSimilar?: IRow[];

  @Type(() => Row)
  targetSimilar?: IRow[];

  @Type(() => Concepts)
  concepts?: IConcepts;

  constructor(options: IEtlConfiguration = {}) {
    this.etlMapping = options.etlMapping
    this.name = options.name
    this.mappingsConfiguration = options.mappingsConfiguration
    this.tablesConfiguration = options.tablesConfiguration
    this.source = options.source
    this.target = options.target
    this.filtered = options.filtered
    this.constants = options.constants
    this.targetClones = options.targetClones
    this.sourceSimilar = options.sourceSimilar
    this.targetSimilar = options.targetSimilar
    this.recalculateSimilar = options.recalculateSimilar
    this.concepts = options.concepts
  }

  get arrows(): ArrowCache {
    return this.mappingsConfiguration
  }

  get tables(): TargetConfig {
    return this.tablesConfiguration
  }

  get sourceTables(): Table[] {
    return this.source
  }

  get targetTables(): Table[] {
    return this.target
  }

  get constantsCache(): ConstantCache {
    return this.constants
  }

  get targetSimilarRows(): IRow[] {
    return this.targetSimilar
  }

  get sourceSimilarRows(): IRow[] {
    return this.sourceSimilar
  }

  get recalculateSimilarTables(): boolean {
    return this.recalculateSimilar
  }

  get tableConcepts(): Concepts {
    return this.concepts
  }
}
