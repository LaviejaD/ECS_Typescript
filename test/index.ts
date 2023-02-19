import { World, Component } from "../src/index";
const ecs = new World();
const entity = ecs.create_entity();
const entity1 = ecs.create_entity();

ecs.add_component_to_entity(entity, [Component("vida", 0)]);
ecs.add_component_to_entity(entity, [Component("name", "entidad 0")]);

ecs.add_component_to_entity(entity1, Component("vidaa", 1));
ecs.add_component_to_entity(entity1, Component("name", "entidad 1"));
let f = ecs.find<{ name: string; vida: number }>("vida");
console.log("entidades", f);

console.log("entidades eliminandas: " + ecs.remove("vidaa"));

const entity2 = ecs.create_entity();

ecs.add_component_to_entity<string | number>(entity2, [
  Component("name", "dimas "),
  Component("vida", 1),
]);
let ff = ecs.find<{ name: string; vida: number }>("vida");

console.log(ff);
ecs.update<{ vida: number }>((e) => (e.vida += 1), ["vida"]);

ff = ecs.find<{ name: string; vida: number }>("vida");
console.log("hola", ff);
