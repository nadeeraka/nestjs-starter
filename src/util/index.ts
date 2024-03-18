class Crt {
  constructor(
    public id: number,
    public name: string,
    public items: string[],
  ) {
    this.id = id;
    this.name = name;
    this.items = items;
  }

  setItems(items: string[]) {
    this.items = items;
  }
  addItem(item: string) {
    this.items.push(item);
  }
  removeItem(item: string) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
  updateItem(oldItem: string, newItem: string) {
    const index = this.items.indexOf(oldItem);
    if (index > -1) {
      this.items[index] = newItem;
    }
  }

  getItems() {
    return this.items;
  }
}
