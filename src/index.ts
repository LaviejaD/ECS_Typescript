export * from "./component";
import { Component, CreateComponent } from "./component";

export interface Id {
  id: number;
}

export type Result<T> = T[];

export class World<T> {
  entitys: Map<string, any>[] = [];
  emtyEntitys: number[] = [];
  nextEntity: number = 0;
  constructor() {}

  create_entity(): number {
    //if exsit emty space re-use it
    let e = this.emtyEntitys.pop();
    if (e) return e;
    //else create new space
    this.entitys.push(new Map());
    let n = this.nextEntity;
    this.nextEntity += 1;
    return n;
  }

  add_component_to_entity<T = any>(
    entity: number,
    component: CreateComponent<T> | CreateComponent<T>[]
  ) {
    if (Array.isArray(component)) {
      component.forEach(({ component_name, data }) =>
        this.entitys[entity].set(component_name, data)
      );
      return;
    }
    this.entitys[entity].set(component.component_name, component.data);
  }
  find<T = {}>(keys: string | string[]): Result<T & Id> {
    //save all element id with keys
    let list: number[] = [];
    if (typeof keys === "string") {
      this.entitys.forEach((value, index) => {
        value.has(keys) && !list.includes(index) ? list.push(index) : false;
      });
    } else {
      this.entitys.forEach((value, index) => {
        keys.forEach((key) =>
          value.has(key) && !list.includes(index) ? list.push(index) : false
        );
      });
    }
    // tramsform elements type  T them  save in array and return it
    let entity: Result<T & Id> = [];
    list.forEach((v) => {
      let e = Object.fromEntries(this.entitys[v]) as T & Id;
      e.id = v;
      entity.push(e);
    });
    return entity;
  }
  remove(components: string | string[]): number {
    let counter = 0;
    let lastE: number;
    if (Array.isArray(components)) {
      this.entitys.forEach((entity, index) => {
        components.forEach((component) => {
          if (lastE !== index && entity.has(component)) {
            lastE = index;
            this.emtyEntitys.push(index);
            this.entitys[index].clear();
            counter += 1;
          }
        });
      });

      return counter;
    }
    this.entitys.forEach((e, i) => {
      if (e.has(components)) {
        this.entitys[i].clear();
        this.emtyEntitys.push(i);
        counter += 1;
      }
    });
    return counter;
  }
  update<T>(callback: (arg: T & Id) => void, tags: string | string[]) {
    let entitys = this.find<T>(tags);

    entitys.map(callback);
    entitys.forEach((value) => {
      let id = value.id;

      Object.entries(value).forEach(([k, v]) => {
        if (k !== "id") {
          this.entitys[id].set(k, v);
        }
      });
    });
  }
}
