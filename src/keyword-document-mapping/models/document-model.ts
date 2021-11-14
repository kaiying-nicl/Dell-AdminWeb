export class Document {
  constructor(
    public id: number,
    public name: string,
    public url: string
  ) { }
}

export class DocWithMappingStatus extends Document {
  constructor(
    public mapped: Boolean,
    id: number,
    name: string,
    url: string
  ) { super(id, name, url) }
}