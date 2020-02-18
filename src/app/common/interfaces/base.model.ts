export default class BaseModel {
  public static fromObject<T extends BaseModel>(data: object): T {
    const inst: T = new this() as T;
    const transf = inst.transform();
    Object.keys(inst).forEach(prop => {
      if (data && (data[prop] || transf[prop])) {
        inst[prop] = transf[prop] ? transf[prop](data[prop], data) : data[prop];
      }
    });
    return inst;
  }

  protected transform(): { [key: string]: (val: any, data: any) => any } {
    return {};
  }
}
