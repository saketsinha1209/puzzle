import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Items from "@/Components/Items";

const SortableItem = ({id, imageUrl,rows,columns, ...props }) => {

  
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined
  }
 
  return (
    <div>
     
        <Items
          key={id}
          ref={setNodeRef}
          style={style}
          withOpacity={isDragging}
          imageUrl={imageUrl}
          {...props}
          {...attributes}
          {...listeners}
        />
    </div>
  );
  
}

export default SortableItem;
