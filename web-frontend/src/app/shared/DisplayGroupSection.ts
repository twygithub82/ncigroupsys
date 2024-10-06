import { TemplateEstPartItem } from "app/data-sources/master-template";

// New display section class
export class DisplayPartGroupSection {
    group_name_cv: string;
    items: TemplateEstPartItem[];
  
    constructor(group_name_cv: string, items: TemplateEstPartItem[]) {
      this.group_name_cv = group_name_cv;
      this.items = items;
    }
  }
  
  let globalIndex = 0;
  // Function to group by 'group_name_cv' and convert to DisplaySection
  export function groupByTariffRepairGroup(items: TemplateEstPartItem[]): DisplayPartGroupSection[] {
    globalIndex=0;
    var index=0;
    const groupedItems = items.reduce((acc: { [key: string]: TemplateEstPartItem[] }, item: TemplateEstPartItem) => {
      const groupName = item.tariff_repair?.group_name_cv || 'Unknown Group'; // Handle undefined/null group_name_cv
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
    //  item.index = index++;
      acc[groupName].push(item);
      return acc;
    }, {});
  
    // Convert the grouped items into an array of DisplaySection objects
    return Object.keys(groupedItems).map(groupName => {
        const itemsWithGlobalIndex = groupedItems[groupName].map(item => {
        // Increment the global index for each item
    //    item.no = ++globalIndex; // Assign global index to item
        return item; // Return the modified item
    });
    
    return new DisplayPartGroupSection(groupName, itemsWithGlobalIndex); // Return a new section});
  }
  )
  }
  
