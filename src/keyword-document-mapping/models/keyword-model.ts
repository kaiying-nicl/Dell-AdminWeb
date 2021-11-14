export class Keyword {
  constructor(
    public id: number,
    public value: string
  ) { }
}

export class KeywordPostBody {
  constructor(
    public value: string
  ) { }
}

export class MappingPostBody {
  constructor(
    public documentIds: number[]
  ) { }
}