// import { UserInput, User } from "./user.mts";

// export class Queue {
//     items: User[] = [];

//     enqueue(element: UserInput) {
//         const normalized: User[] = Array.isArray(element) ? element : [element];
//         this.items.push(...normalized);
//     }

//     dequeue(): User | undefined {
//         return this.items.shift();
//     }

//     peek(): User | undefined {
//         return this.items[0];
//     }

//     isEmpty(): boolean {
//         return this.items.length === 0;
//     }

//     size(): number {
//         return this.items.length;
//     }

//     print() {
//         console.log(this.items.map(u => `${u.id}:${u.name}`).join(" -> "));
//     }
// }
