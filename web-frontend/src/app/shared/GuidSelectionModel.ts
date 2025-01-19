import { SelectionModel } from '@angular/cdk/collections';

export class GuidSelectionModel<T extends { guid?: string }> extends SelectionModel<T> {
  constructor(
    multiple: boolean,
    initiallySelectedValues?: T[],
    emitChanges = true
  ) {
    super(multiple, initiallySelectedValues, emitChanges);
  }

  // Override the toggle method to compare items by guid
  override toggle(item: T): void {
    // Check if the item is already selected based on guid
    const isSelected = this.isSelected(item);

    if (isSelected) {
      // If selected, deselect it
      this.deselect(item);
    } else {
      // If not selected, select it
      this.select(item);
    }
  }
  
  override deselect(item: T): void {
    // Find the item in the selected list using guid
    const selectedItem = this.selected.find(selected => selected.guid === item.guid);

    // If the item is found, remove it from the selected list
    if (selectedItem) {
      super.deselect(selectedItem); // Use the parent class's deselect method
    }
  }

  // Override the isSelected method to compare items by guid
  override isSelected(item: T): boolean {
    return this.selected.some(selectedItem => selectedItem.guid === item.guid);
  }
}