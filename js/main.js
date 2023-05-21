const SectionConfigure = [
  {
    name: "1",
    sections: [[]],
    sectionsWidth: [[100]]
  },
  {
    name: '1-1',
    sections: [[], []],
    sectionsWidth: [[50, 50]]
  },
  {
    name: '3-1',
    sections: [[], []]
  },
  {
    name: '1-3',
    sections: [[], []]
  },
  {
    name: '2-2-2',
    sections: [[], [], []],
  },
  {
    name: '1-2-1',
    sections: [
      [],
      [],
      []
    ]
  }
]
const GropedWidgets = [
  [
    {id: 1, color: "#D81222"},
    {id: 2, color: "#FFE345"},
    {id: 3, color: "#3392FF"},
    {id: 4, color: "#FF3E4E"},
    {id: 5, color: "#28BE6E"},
    {id: 6, color: "#FFFFFF"},
    {id: 7, color: "#89898C"},
    {id: 8, color: "#6FA37A"},
  ],
  [
    {id: 11, color: "#9F8077"},
    {id: 12, color: "#6D8BAF"},
    {id: 13, color: "#B2D300"},
    {id: 14, color: "#029A5F"},
    {id: 15, color: "#502CB4"},
    {id: 16, color: "#FFA0A0"},
    {id: 17, color: "#F07651"},
    {id: 18, color: "#7DD679"},
  ],
  [
    {id: 21, color: "#F05156"},
    {id: 22, color: "#FFE06F"},
    {id: 23, color: "#AA44C9"},
    {id: 24, color: "#067BC4"},
    {id: 25, color: "#6E0911"},
    {id: 26, color: "#12653C"},
    {id: 27, color: "#8B650F"},
    {id: 28, color: "#5C4516"},
  ],
]
const AllWidgets = [
  ...GropedWidgets[0],
  ...GropedWidgets[1],
  ...GropedWidgets[2],
]
let ActiveWidget = null
let ActiveSection = SectionConfigure[0]
let ActiveSectionToSet = null
let ActiveBlockToResize = null
let ActiveBlockDataToResize = null
let StartResizeValue = null
let ActiveResizeValue = 0
let StartResizeHeight = '0px'
let ActiveItemToDrag = null
let ActiveBlockHeaderToDrag = null

// single mode
let ActiveSingleDrop = null
let ActiveResizerValues = null
let LastActiveSection = null

const divDragStart = (e) => {
  if (!e.target.classList.contains("resizable")) return
  const element = document.getElementById("resizable_" + e.target.dataset.id)

  const bounding = element.getBoundingClientRect()
  ActiveSingleDrop = {
    clickOffsetTop: e.pageY - bounding.top,
    clickOffsetLeft: e.pageX - bounding.left,
    ...ActiveSection.sections[0][Number(e.target.dataset.blockIndex)],
  }

  element.classList.add('hide-drag');
}
const divDragEnd = (e) => {
  const element = document.getElementById("resizable_" + e.target.dataset.id)
  if (element) {
    element.classList.remove('hide-drag');
  }

  ActiveSingleDrop = null
}
// make div draggable
const makeDraggableDiv = (element) => {
  element.draggable = true
  element.addEventListener("dragstart", divDragStart)
  element.addEventListener("dragend", divDragEnd)
}

const resize = (e) => {
  // check the same point
  /*
  let hasError = false
  const topPoint = e.pageY - height
  const leftPoint = e.pageX - width


    const elements = document.getElementsByClassName("resizable")
    Array.prototype.forEach.call(elements, errorElement => {
      if (errorElement.classList.contains("resizable_" + item.id)) return
      const bounding = errorElement.getBoundingClientRect()

      if (bounding.right < leftPoint) return

      // check if in horizontal view
      if (
        e.pageY >= bounding.top && e.pageY < bounding.bottom ||
        e.pageY >= bounding.bottom && topPoint < bounding.bottom
      ) {

        // check is left point in other area
        if(e.pageX > bounding.left) {
          hasError = true
          return;
        };
      }
    });
    if (hasError) return
   */
  if (e.pageY < 60) return;

  if (ActiveResizerValues.currentResizer.classList.contains('bottom-right')) {
    const width = ActiveResizerValues.original_width + (e.pageX - ActiveResizerValues.original_mouse_x);
    const height = ActiveResizerValues.original_height + (e.pageY - ActiveResizerValues.original_mouse_y)

    if (width > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.width = width + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].width = width
    }
    if (height > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.height = height + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].height = height
    }
  }
  else if (ActiveResizerValues.currentResizer.classList.contains('bottom-left')) {
    // check the same point
    /*
      let hasError = false
      const topPoint = e.pageY - height
      const rightPoint = e.pageX + width
      const elements = document.getElementsByClassName("resizable")
      Array.prototype.forEach.call(elements, errorElement => {
        if (errorElement.classList.contains("resizable_" + item.id)) return
        const bounding = errorElement.getBoundingClientRect()

        if (rightPoint < bounding.left) return;

        // check if in horizontal view
        if (
          e.pageY >= bounding.top && e.pageY < bounding.bottom ||
          e.pageY > bounding.top && topPoint < bounding.bottom ||
          e.pageY <= topPoint
        ) {

          // check is left point in other area
          if(e.pageX < bounding.right) {
            hasError = true
            return;
          };
        }
      });
      if (hasError) return

     */
    const height = ActiveResizerValues.original_height + (e.pageY - ActiveResizerValues.original_mouse_y)
    const width = ActiveResizerValues.original_width - (e.pageX - ActiveResizerValues.original_mouse_x)



    if (height > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.height = height + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].height = height
    }
    if (width > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.width = width + 'px'
      ActiveResizerValues.element.style.left = ActiveResizerValues.original_x + (e.pageX - ActiveResizerValues.original_mouse_x) + 'px'

      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].width = width
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].left = ActiveResizerValues.original_x + (e.pageX - ActiveResizerValues.original_mouse_x)
    }
  }
  else if (ActiveResizerValues.currentResizer.classList.contains('top-right')) {
    // check the same point
    /*
      let hasError = false
      const leftPoint = e.pageX - width
      const bottomPoint = e.pageY + height
      const elements = document.getElementsByClassName("resizable")
      Array.prototype.forEach.call(elements, errorElement => {
        if (errorElement.classList.contains("resizable_" + item.id)) return
        const bounding = errorElement.getBoundingClientRect()

        if (bounding.right < leftPoint) return

        // check if in horizontal view
        if (
          e.pageY >= bounding.top && e.pageY < bounding.bottom ||
          e.pageY < bounding.top && bottomPoint > bounding.top
        ) {

          // check is left point in other area
          if(e.pageX > bounding.left) {
            hasError = true
            return;
          };
        }
      });
      if (hasError) return;

     */
    const width = ActiveResizerValues.original_width + (e.pageX - ActiveResizerValues.original_mouse_x)
    const height = ActiveResizerValues.original_height - (e.pageY - ActiveResizerValues.original_mouse_y)


    if (width > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.width = width + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].width = width
    }
    if (height > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.height = height + 'px'
      ActiveResizerValues.element.style.top = ActiveResizerValues.original_y + (e.pageY - ActiveResizerValues.original_mouse_y) + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].height = height
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].top = ActiveResizerValues.original_y + (e.pageY - ActiveResizerValues.original_mouse_y)
    }
  }
  else {
    // check the same point
    /*
      let hasError = false
      const bottomPoint = e.pageY + height
      const rightPoint = e.pageX + width
      const elements = document.getElementsByClassName("resizable")
      Array.prototype.forEach.call(elements, errorElement => {
        if (errorElement.classList.contains("resizable_" + item.id)) return
        const bounding = errorElement.getBoundingClientRect()

        if (rightPoint < bounding.left) return;

        // check if in horizontal view
        if (
          bottomPoint >= bounding.top && bottomPoint < bounding.bottom ||
          bottomPoint > bounding.bottom && e.pageY < bounding.bottom
        ) {

          // check is left point in other area
          if(e.pageX < bounding.right) {

            hasError = true
            return;
          };
        }
      });

      if (hasError) return
     */
    const width = ActiveResizerValues.original_width - (e.pageX - ActiveResizerValues.original_mouse_x)
    const height = ActiveResizerValues.original_height - (e.pageY - ActiveResizerValues.original_mouse_y)


    if (width > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.width = width + 'px'
      ActiveResizerValues.element.style.left = ActiveResizerValues.original_x + (e.pageX - ActiveResizerValues.original_mouse_x) + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].width = width
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].left = ActiveResizerValues.original_x + (e.pageX - ActiveResizerValues.original_mouse_x)
    }
    if (height > ActiveResizerValues.minimum_size) {
      ActiveResizerValues.element.style.height = height + 'px'
      ActiveResizerValues.element.style.top = ActiveResizerValues.original_y + (e.pageY - ActiveResizerValues.original_mouse_y) + 'px'
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].height = height
      ActiveSection.sections[0][Number(ActiveResizerValues.element.dataset.blockIndex)].top = ActiveResizerValues.original_y + (e.pageY - ActiveResizerValues.original_mouse_y)
    }
  }
}

const stopResize = () => {
  window.removeEventListener('mousemove', resize)
}

const ResizerMouseDown = (e) => {
  const element = document.getElementById("resizable_" + e.target.dataset.itemId)
  e.preventDefault()
  ActiveResizerValues = {
    element: element,
    minimum_size: 20,
    original_width: parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', '')),
    original_height:  parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', '')),
    original_x: element.getBoundingClientRect().left,
    original_y: element.getBoundingClientRect().top,
    original_mouse_x: e.pageX,
    original_mouse_y: e.pageY,
    currentResizer: e.target
  }

  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}

const makeElementResizeable = (element, id) => {
  // create resizer element
  const resizerDiv = document.createElement("div")
  resizerDiv.className = "resizers"


  const TopLeftResize = document.createElement("div")
  const TopRightResize = document.createElement("div")
  const BottomLeftResize = document.createElement("div")
  const BottomRightResize = document.createElement("div")

  TopLeftResize.className = "resizer"
  TopLeftResize.classList.add("resizer_" + id)
  TopLeftResize.classList.add("top-left")
  TopLeftResize.dataset.itemId = id

  TopRightResize.className = "resizer"
  TopRightResize.classList.add("resizer_" + id)
  TopRightResize.classList.add("top-right")
  TopRightResize.dataset.itemId = id



  BottomLeftResize.className = "resizer"
  BottomLeftResize.classList.add("resizer_" + id)
  BottomLeftResize.classList.add("bottom-left")
  BottomLeftResize.dataset.itemId = id

  BottomRightResize.className = "resizer"
  BottomRightResize.classList.add("resizer_" + id)
  BottomRightResize.classList.add("bottom-right")
  BottomRightResize.dataset.itemId = id

  resizerDiv.appendChild(TopLeftResize)
  resizerDiv.appendChild(TopRightResize)
  resizerDiv.appendChild(BottomLeftResize)
  resizerDiv.appendChild(BottomRightResize)

  // add resize div to block
  element.appendChild(resizerDiv)

  const resizers = [TopLeftResize, TopRightResize, BottomLeftResize, BottomRightResize]


  for (let i = 0;i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', ResizerMouseDown)
  }
}

const removeSectionBlockHelper = (sectionIndex, blockIndex) => {

  if (ActiveSection.sections[sectionIndex].length < 1) return
  ActiveSection.sections[sectionIndex].splice(blockIndex, 1);
}

const removeSectionBlock = (e) => {
  removeSectionBlockHelper(Number(e.target.dataset.sectionIndex), Number(e.target.dataset.blockIndex))
  buildSections()
}

const ClearActiveHeaderToDrag = () => {
  ActiveBlockHeaderToDrag = null
}

const ClearActiveItemToDrag = () => {
  ActiveItemToDrag = null
}

const ClearWidgetToDrag = () => {
  ActiveWidget = null
}

const WidgetDiveDragStartListener = e => {
  ActiveWidget = AllWidgets.find(item => item.id === Number(e.target.dataset.id))
}

const WidgetActiveItemDragStartListener = e => {
  ActiveSection.sections.forEach(sectionItem => {
    sectionItem.forEach(sectionBlock => {
      if (Number(e.target.dataset.id) === sectionBlock.id) {
        ActiveItemToDrag = sectionBlock
        ActiveItemToDrag.sectionIndex = e.target.dataset.sectionIndex
        ActiveItemToDrag.blockIndex = e.target.dataset.blockIndex

      }
    })
  })
}

const SectionBlockHeaderItemDragStartListener = e => {
  ActiveSection.sections.forEach(sectionItem => {
    sectionItem.forEach(sectionBlock => {
      sectionBlock.values.forEach(sectionBlockValue => {
        if (Number(e.target.dataset.id) === sectionBlockValue.id) {
          ActiveBlockHeaderToDrag = sectionBlockValue
          ActiveBlockHeaderToDrag.sectionIndex = Number(e.target.dataset.sectionIndex)
          ActiveBlockHeaderToDrag.blockIndex = Number(e.target.dataset.blockIndex)
          ActiveBlockHeaderToDrag.index = Number(e.target.dataset.index)

        }
      })
    })
  })
}

const ResizeElementListener = function (e) {
  e.preventDefault()
  const blocks = document.getElementsByClassName("section-widget-wrap")
  Array.prototype.forEach.call(blocks, function (el) {
    if (el.dataset.id === e.target.dataset.id) {
      ActiveBlockToResize = el
      StartResizeHeight = Number(ActiveBlockToResize.style.height.slice(0, -2))

      ActiveSection.sections.map(sectionItem => {
        sectionItem.map(sectionItemBlock => {
          if (sectionItemBlock.id === Number(el.dataset.id)) {
            ActiveBlockDataToResize = sectionItemBlock
          }
        })
      })
    }
  })
  StartResizeValue = e.screenY
  window.addEventListener('mousemove', ResizeDivListener)
  window.addEventListener('mouseup', StopResizeDivListener)
}

function ResizeDivListener(e) {
  ActiveResizeValue = (e.screenY - StartResizeValue)
  if (StartResizeHeight + ActiveResizeValue < 50) return
  ActiveBlockToResize.style.height = StartResizeHeight + ActiveResizeValue + "px"
  ActiveBlockDataToResize.height = StartResizeHeight + ActiveResizeValue
}

function StopResizeDivListener() {
  window.removeEventListener('mousemove', ResizeDivListener)
}

const SectionDropListener = (e) => {
  if (e.target.dataset.type !== "section") return
  if(!ActiveSingleDrop && !ActiveWidget && ActiveSection.name === '1') return;


  if (ActiveSection.name === '1') {
    if (ActiveWidget) {
      // check is the same place

      /*
        let hasError = false;
         const newItem = {
        top: e.clientY,
        left: e.clientX,
        right: e.clientX + 100,
        bottom: e.clientY + 50,
      }

        const elements = document.getElementsByClassName("resizable")

        Array.prototype.forEach.call(elements, errorElement => {
          const bounding = errorElement.getBoundingClientRect()
          const oldPoint = {
            top: bounding.top,
            left: bounding.left,
            right: bounding.left + errorElement.clientWidth,
            bottom: bounding.top + errorElement.clientHeight
          }

          if (intersectRect(oldPoint, newItem)) {
            hasError = true
          }
        });
        if (hasError) return

       */
      ActiveSection.sections[0].push({
        id: Math.random(),
        color: ActiveWidget.color,
        width: 300,
        height: 150,
        left: e.clientX,
        top: e.clientY,
        values: [{
          id: Math.random(),
          color: ActiveWidget.color,
          active: true
        }]
      })

      buildSections()
    } else {
      // check is the same place
      /*
        let hasError = false;
        const elements = document.getElementsByClassName("resizable")
        const newPointLeft = e.clientX - ActiveSingleDrop.clickOffsetLeft
        const newPointTop = e.clientY - ActiveSingleDrop.clickOffsetTop
        const newPointRight = e.clientX - ActiveSingleDrop.clickOffsetLeft + ActiveSingleDrop.width
        const newPointBottom = e.clientY - ActiveSingleDrop.clickOffsetTop + ActiveSingleDrop.height

        // check outside
        //if (newPointLeft < 0) return;
        //if (newPointTop < 60) return;
        //if (newPointRight > window.innerWidth) return;
        //if (newPointBottom > window.innerHeight) return;

        Array.prototype.forEach.call(elements, errorElement => {
        if (errorElement.classList.contains("resizable_" + ActiveSingleDrop.id)) return

        const bounding = errorElement.getBoundingClientRect()
        const newPoint = {
          top: newPointTop,
          left: newPointLeft,
          right: newPointRight,
          bottom: newPointBottom
        }
        const oldPoint = {
          top: bounding.top,
          left: bounding.left,
          right: bounding.left + errorElement.clientWidth,
          bottom: bounding.top + errorElement.clientHeight
        }

        if (intersectRect(oldPoint, newPoint)) {
          hasError = true
        }
      });

      if (hasError) return
       */

      const activeItem = ActiveSection.sections[0].find(function (el) {
        return el.id === ActiveSingleDrop.id
      });

      activeItem.top = e.clientY - ActiveSingleDrop.clickOffsetTop
      activeItem.left = e.clientX - ActiveSingleDrop.clickOffsetLeft


      buildSections()
    }
  } else {
    if (ActiveItemToDrag) {
      ActiveSection.sections[ActiveItemToDrag.sectionIndex] =
        ActiveSection.sections[ActiveItemToDrag.sectionIndex].filter(item => item.id !== ActiveItemToDrag.id)



      ActiveSection.sections[Number(e.target.dataset.index)].push(ActiveItemToDrag)
      buildSections()
    } else if (ActiveWidget) {
      const indexValue = Number(e.target.dataset.index)
      ActiveSection.sections[indexValue].push({
        id: Math.random(),
        height: 300,
        width: 200,
        top: 200,
        left: 200,
        values: [{...ActiveWidget, active: true, id: Math.random()}]
      })

      ActiveWidget = null

      buildSections()
    } else if (ActiveBlockHeaderToDrag) {
      // remove previous value
      let sectionValues = ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values
      sectionValues.splice(ActiveBlockHeaderToDrag.index, 1)
      if (sectionValues.length < 1) {
        ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex].splice(ActiveBlockHeaderToDrag.blockIndex,1)
      }

      // add new active if active removed
      if (ActiveBlockHeaderToDrag.active === true) {
        if (sectionValues.length > 0) {
          sectionValues[sectionValues.length - 1].active = true
        }
      }

      // add new item
      ActiveBlockHeaderToDrag.active = true
      ActiveSection.sections[Number(e.target.dataset.index)].push({
        id: Math.random(),
        height: 300,
        values: [ActiveBlockHeaderToDrag],
        top: 200,
        left: 200,
        width: 200
      })

      // build new sections
      buildSections()
    }
  }
}

const SectionDragOverListener = e => {
  e.preventDefault()
}

const SectionBlockHeaderDropListener = e => {
  if (e.target.dataset.type !== "section-block-header") return

  //
  if (ActiveWidget) {
    // set to false previous value
    const sortedSectionBlockValues = ActiveSection.sections[Number(e.target.dataset.sectionIndex)][Number(e.target.dataset.blockIndex)].values.map(sortedItem => {
      sortedItem.active = false
      return sortedItem
    })

    // add newValue
    ActiveSection.sections[Number(e.target.dataset.sectionIndex)][Number(e.target.dataset.blockIndex)].values = [...sortedSectionBlockValues, {
      ...ActiveWidget,
      id: Math.random(),
      active: true
    }]

    // build new sections
    buildSections()
  } else if (ActiveItemToDrag) {
    // remove previous block
    ActiveSection.sections[ActiveItemToDrag.sectionIndex] =
      ActiveSection.sections[ActiveItemToDrag.sectionIndex].filter(item => item.id !== ActiveItemToDrag.id)

    // add new items
    const newItemSectionIndex = Number(e.target.dataset.sectionIndex)
    //const newItemSectionBlockIndex = Number(e.target.dataset.blockIndex)
    const actualItemIndex =  ActiveSection.sections[newItemSectionIndex].findIndex(object => {
      return object.id === Number(e.target.dataset.id)
    });


    ActiveSection.sections[newItemSectionIndex][actualItemIndex].values =
      [
        ...ActiveSection.sections[newItemSectionIndex][actualItemIndex]
          .values.map(item => {
            item.active = false
             return item
          }),
        ...ActiveItemToDrag.values
      ]



    buildSections()
  } else if (ActiveBlockHeaderToDrag) {
    // check if the same block and only one length
    if (
      ActiveSection.sections[Number(e.target.dataset.sectionIndex)][Number(e.target.dataset.blockIndex)].values.length < 2 &&
      ActiveSection.sections[Number(e.target.dataset.sectionIndex)][Number(e.target.dataset.blockIndex)].values[0].id === ActiveBlockHeaderToDrag.id
    ) return

    // remove item-widget
    const values = ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values
    values.splice(ActiveBlockHeaderToDrag.index, 1)

    // remove element if not have more items
    if (values.length < 1) {
      removeSectionBlockHelper(ActiveBlockHeaderToDrag.sectionIndex, ActiveBlockHeaderToDrag.blockIndex)
    } else {
      if (ActiveBlockHeaderToDrag.active === true) {
        values[values.length - 1].active = true
      }
    }

    const newSectionIndex = ActiveSection.sections[Number(e.target.dataset.sectionIndex)].findIndex(item => item.id === Number(e.target.dataset.id))


    // push to section
    ActiveBlockHeaderToDrag.active = true
    ActiveSection.sections[Number(e.target.dataset.sectionIndex)][newSectionIndex].values =
      ActiveSection.sections[Number(e.target.dataset.sectionIndex)][newSectionIndex].values.map(item => {
        item.active = false
        return item
      })
    ActiveSection.sections[Number(e.target.dataset.sectionIndex)][newSectionIndex].values.push(ActiveBlockHeaderToDrag)

    buildSections()
  }


  e.preventDefault()
  e.stopPropagation()
}
const SectionBlockDropListener = e => {
  if (e.target.dataset.type !== "section-block") return
  if (ActiveItemToDrag) {
    if (Number(e.target.dataset.id) === ActiveItemToDrag.id) return
    ActiveSection.sections[ActiveItemToDrag.sectionIndex] =
      ActiveSection.sections[ActiveItemToDrag.sectionIndex].filter(item => item.id !== ActiveItemToDrag.id)

    // remove previous item
    ActiveSection.sections[Number(e.target.dataset.sectionIndex)].splice(Number(e.target.dataset.blockIndex), 0, ActiveItemToDrag)

    // build sections
    buildSections()

  } else if (ActiveBlockHeaderToDrag) {
    const previousHeight = ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].height
    // remove previous item
    let sectionBlockItemIndex = null
    const values = ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values
    values.forEach((sectionBlockValue, index) => {
      if (ActiveBlockHeaderToDrag.id === sectionBlockValue.id) {
        sectionBlockItemIndex = index
      }
    })
    values.splice(sectionBlockItemIndex, 1)

    // remove header if it not includes more item
    if (values.length < 1) {
      ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex].splice(ActiveBlockHeaderToDrag.blockIndex, 1)
    }

    // create new active value if move active element
    if (ActiveBlockHeaderToDrag.active && values.length) {
      values[values.length - 1].active = true
    }

    // add new item to section
    ActiveSection.sections[Number(e.target.dataset.sectionIndex)].splice(Number(e.target.dataset.blockIndex), 0, {
      id: Math.random(),
      height: previousHeight,
      width: 200,
      top: 200,
      left: 200,
      values: [{...ActiveBlockHeaderToDrag, active: true, id: Math.random()}]
    })

    // build new sections
    buildSections()
  }


  e.preventDefault()
  e.stopPropagation()
}

const SectionBlockDragOverListener = e => {
  e.preventDefault()
  e.stopPropagation()
}

const SectionBlockHeaderDragOverListener = e => {
  e.preventDefault()
  e.stopPropagation()
}

const ActiveWidgetHeaderDropListener = e => {
  const sectionIndex =  Number(e.target.dataset.sectionIndex)
  const blockIndex = Number(e.target.dataset.blockIndex)
  const headerBlockIndex = Number(e.target.dataset.index)
  if (e.target.dataset.type !== 'active-widget-header-item') return

  if (ActiveWidget) {
    // push widget
    ActiveSection.sections[sectionIndex][blockIndex].values = ActiveSection.sections[sectionIndex][blockIndex].values.map(item => {
      item.active = false
      return item
    })
    ActiveSection.sections[sectionIndex][blockIndex].values.splice(headerBlockIndex, 0, {...ActiveWidget, active: true, id: Math.random()})

    buildSections()
  } else if (ActiveBlockHeaderToDrag) {
    // remove previous item
    ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values.splice(ActiveBlockHeaderToDrag.index, 1)

    // remove if note have more value
    if (ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values.length < 1) {
      ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex].splice(ActiveBlockHeaderToDrag.blockIndex, 1)
    }

    // new active
    if (
      ActiveBlockHeaderToDrag.active &&
      ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex]?.values.length > 0
    ) {
      ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex]
        .values[ActiveSection.sections[ActiveBlockHeaderToDrag.sectionIndex][ActiveBlockHeaderToDrag.blockIndex].values.length - 1].active = true
    }

    // push widget
    ActiveSection.sections[sectionIndex][blockIndex].values = ActiveSection.sections[sectionIndex][blockIndex].values.map(item => {
      item.active = false
      return item
    })
    ActiveBlockHeaderToDrag.active = true
    ActiveSection.sections[sectionIndex][blockIndex].values.splice(headerBlockIndex, 0, {...ActiveBlockHeaderToDrag})

    buildSections()
  } else if (ActiveItemToDrag) {
    // remove previous item
    ActiveSection.sections[ActiveItemToDrag.sectionIndex].splice(ActiveItemToDrag.blockIndex, 1)

    // push item
    ActiveSection.sections[sectionIndex][blockIndex].values = ActiveSection.sections[sectionIndex][blockIndex].values.map(item => {
      item.active = false
      return item
    })
    ActiveSection.sections[sectionIndex][blockIndex].values.splice(headerBlockIndex, 0, ...ActiveItemToDrag.values)

    buildSections()
  }
}

const openConfigureSectionModal = () => {
  const modal = document.getElementById('configure-section-modal')
  if (modal.classList.contains("configure-section-modal-active")) return

  LastActiveSection = JSON.parse(JSON.stringify(ActiveSection))
  modal.classList.add("configure-section-modal-active")
  buildSectionModalContent()
}

const closeConfigureSectionModal = () => {
  const modal = document.getElementById('configure-section-modal')

  if (modal.classList.contains("configure-section-modal-active")) {
    modal.classList.remove("configure-section-modal-active")
  }
}

const cancelSectionEdit = () => {
  //ActiveSection =  JSON.parse(JSON.stringify(LastActiveSection))
  //LastActiveSection = null
  closeConfigureSectionModal()
  //buildSections()
}

const setActiveSection = () => {
  closeConfigureSectionModal()
}

const clearSections = () => {
  ActiveSection.sections = ActiveSection.name.split("-").map(() => [])
  buildSections()
}

const toggleWidgetModal = () => {
  const modal = document.getElementById('widget-modal')


  if (modal.classList.contains("widget-modal-active")) {
    modal.classList.remove("widget-modal-active");
  } else {
    modal.classList.add("widget-modal-active")
  }
}

const choseSection = (e) => {
  const previousSectionValues = [...ActiveSection.sections]
  ActiveSection.sections = ActiveSection.name.split("-").map(() => [])

  ActiveSection = SectionConfigure.find(item => item.name === e.target.dataset.name)

  console.log(previousSectionValues.length, 'previousSectionValues.length')
  previousSectionValues.forEach((section, index) => {
    section.forEach(sectionBlock => {
      if (ActiveSection.sections[index]) {
        ActiveSection.sections[index].push(sectionBlock)
      } else ActiveSection.sections[0].push(sectionBlock)
    })
  })



  buildSectionModalContent()
  buildSections()
}

const buildWidgetModal = () => {
  // Remove previous listeners
  const widgetDivToRemoveListener = document.getElementsByClassName("widget-modal-item")
  Array.prototype.forEach.call(widgetDivToRemoveListener, function (el) {
    el.removeEventListener("dragstart", WidgetDiveDragStartListener)
    el.removeEventListener("dragend", ClearWidgetToDrag)
  });

  const modal = document.getElementById('widget-modal-content')
  modal.innerText = ''

  GropedWidgets.forEach((group, index) => {
    const groupDiv = document.createElement("div")
    groupDiv.className = "widget-modal-group"

    const groupTitle = document.createElement("h5")
    groupTitle.innerText = "Widget Group " + (index + 1)
    groupTitle.className = "widget-modal-group-title"
    groupDiv.appendChild(groupTitle)

    group.forEach(item => {
      const widgetDiv = document.createElement("div")
      widgetDiv.className = "widget-modal-item"
      widgetDiv.style.backgroundColor = item.color
      widgetDiv.dataset.id = item.id
      widgetDiv.draggable = true
      widgetDiv.addEventListener("dragstart", WidgetDiveDragStartListener)
      widgetDiv.addEventListener("dragend", ClearWidgetToDrag)

      groupDiv.appendChild(widgetDiv)
    })

    modal.appendChild(groupDiv)
  })
}

const buildSectionModalContent = () => {
  const sectionItem1 = document.createElement("div")
  const sectionItem2 = document.createElement("div")
  const sectionItem3 = document.createElement("div")

  sectionItem1.classList.add("configure-section-item-wrap")
  sectionItem2.classList.add("configure-section-item-wrap")
  sectionItem3.classList.add("configure-section-item-wrap")

  const sectionsArr = [sectionItem1, sectionItem2, sectionItem3]


  SectionConfigure.forEach(item => {
    const newBlock = document.createElement("div")
    newBlock.classList.add("modal-configure-section-item")


    if (item.name === ActiveSectionToSet?.name) {
      newBlock.classList.add("modal-configure-section-item-active")
    }

    newBlock.style.gridTemplateColumns = item.name.split('-').join("fr ") + 'fr'
    newBlock.dataset.name = item.name
    newBlock.onclick = choseSection

    item.sections.forEach(() => {
      const newDiv = document.createElement("div")
      newDiv.dataset.name = item.name
      newBlock.appendChild(newDiv)
    })

    sectionsArr[item.sections.length - 1].appendChild(newBlock)
  })

  const mainSection = document.getElementById("configure-section-content")
  mainSection.innerText = ""
  mainSection.appendChild(sectionItem1)
  mainSection.appendChild(sectionItem2)
  mainSection.appendChild(sectionItem3)
}

const buildSections = () => {
  // Remove previous listeners
  const sectionsToRemoveListener = document.getElementsByClassName("section-item")
  Array.prototype.forEach.call(sectionsToRemoveListener, function (el) {
    el.removeEventListener("dragover", SectionDragOverListener)
    el.removeEventListener("drop", SectionDropListener)
  });

  const sectionBlocksToRemoveListener = document.getElementsByClassName("section-widget-wrap")
  Array.prototype.forEach.call(sectionBlocksToRemoveListener, function (el) {
    el.removeEventListener("dragover", SectionBlockDragOverListener)
    el.removeEventListener("drop", SectionBlockDropListener)
    el.removeEventListener("dragstart", divDragStart)
    //el.removeEventListener("dragend", divDragEnd)
  });

  const sectionBlocksHeaderToRemoveListener = document.getElementsByClassName("section-widget-wrap-header")
  Array.prototype.forEach.call(sectionBlocksHeaderToRemoveListener, function (el) {
    el.removeEventListener("dragstart", WidgetActiveItemDragStartListener)
    el.removeEventListener("dragend", ClearActiveHeaderToDrag)
    el.removeEventListener("dragover", SectionBlockHeaderDragOverListener)
    el.removeEventListener("drop", SectionBlockHeaderDropListener)
  });

  const sectionBlocksHeaderItemToRemoveListener = document.getElementsByClassName("section-widget-wrap-header-item")
  Array.prototype.forEach.call(sectionBlocksHeaderItemToRemoveListener, function (el) {
    el.removeEventListener("dragstart", SectionBlockHeaderItemDragStartListener)
    el.removeEventListener("dragend", ClearActiveItemToDrag)
  });

  const sectionBlocksResizeToRemoveListener = document.getElementsByClassName("section-block-resize")
  Array.prototype.forEach.call(sectionBlocksResizeToRemoveListener, function (el) {
    el.removeEventListener('mousedown', ResizeElementListener)
  });

  const resizerListener = document.getElementsByClassName("resizer")
    Array.prototype.forEach.call(resizerListener, function (el) {
      el.removeEventListener('mousedown', ResizerMouseDown)
    });

  const removeListeners = document.getElementsByClassName("remove-block")
  Array.prototype.forEach.call(removeListeners, function (el) {

    el.removeEventListener("click", removeSectionBlock)
  });
  


  // Create main section
  const mainContainer = document.getElementById("container")
  const mainSection = document.getElementById("main-section")
  mainSection.innerText = ''
  mainSection.style.gridTemplateColumns = ActiveSection.name.split('-').join("fr ") + 'fr'

  mainContainer.style.top = "60px"
  mainContainer.style.height = "calc(100vh - 60px)"

  if (ActiveSection.name !== '1') {
    mainContainer.style.top = "60px"
    mainContainer.style.height = "calc(100vh - 60px)"
  } else {
    mainContainer.style.top = "0px"
    mainContainer.style.height = "100vh"
  }

  // Create sections blocks
  ActiveSection.sections.forEach((item, index) => {
    const newSectionBlock = document.createElement("div")
    newSectionBlock.className = "section-item"
    newSectionBlock.dataset.index = index.toString()
    newSectionBlock.dataset.type = "section"

    if (ActiveSection.name !== '1') {
      newSectionBlock.style.paddingBottom = "100px"
    } else {
      newSectionBlock.style.paddingBottom = "0px"
    }

    // section listeners
    newSectionBlock.addEventListener("dragover", SectionDragOverListener)
    newSectionBlock.addEventListener("drop", SectionDropListener)


    // add child blocks
    item.forEach((block, blockIndex) => {
      // creat block + listeners
      const newBlock = document.createElement("div")
      newBlock.className = 'section-widget-wrap'
      newBlock.id = "resizable_" + block.id
      newBlock.dataset.id = block.id
      newBlock.dataset.type = "section-block"
      newBlock.style.backgroundColor = block.values.find(val => val.active).color


      newBlock.dataset.sectionIndex = index.toString()
      newBlock.dataset.blockIndex = blockIndex.toString()

      if (ActiveSection.name !== '1') {
        newBlock.addEventListener("dragover", SectionBlockDragOverListener)
        newBlock.addEventListener("drop", SectionBlockDropListener)
        newBlock.style.height = block.height + "px"
        newBlock.style.width = '100%'
      } else {
        newBlock.style.position = "absolute"
        newBlock.style.height = block.height + 'px'
        newBlock.style.width = block.width + 'px'
        newBlock.style.top = block.top + 'px'
        newBlock.style.left = block.left + 'px'
        newBlock.classList.add("resizable")
        makeDraggableDiv(newBlock)
        makeElementResizeable(newBlock, block.id)
      }



      // create block header
      const newBlockHeader = document.createElement("div")
      newBlockHeader.className = "section-widget-wrap-header"
      newBlockHeader.dataset.id = block.id
      newBlockHeader.dataset.sectionIndex = index.toString()
      newBlockHeader.dataset.blockIndex = blockIndex.toString()
      newBlockHeader.dataset.type = "section-block-header"
      newBlockHeader.addEventListener("dragstart", WidgetActiveItemDragStartListener)
      newBlockHeader.addEventListener("dragover", SectionBlockHeaderDragOverListener)
      newBlockHeader.addEventListener("drop", SectionBlockHeaderDropListener)
      newBlockHeader.addEventListener("dragend", ClearActiveItemToDrag)
      newBlockHeader.draggable = true
      newBlock.appendChild(newBlockHeader)


      // create remove item element
      const blockRemoveDiv = document.createElement("div")
      blockRemoveDiv.dataset.id = block.id
      blockRemoveDiv.className = "remove-block"
      blockRemoveDiv.innerText = "x"
      blockRemoveDiv.dataset.sectionIndex = index.toString()
      blockRemoveDiv.dataset.blockIndex = blockIndex.toString()
      blockRemoveDiv.addEventListener("click", removeSectionBlock)
      newBlockHeader.appendChild(blockRemoveDiv)


      // if not single mode - add bottom resize
      if (ActiveSection.name !== '1') {
        // create block resize element
        const blockResizeDiv = document.createElement("div")
        blockResizeDiv.dataset.id = block.id
        blockResizeDiv.className = "section-block-resize"
        blockResizeDiv.addEventListener('mousedown', ResizeElementListener)
        newBlock.appendChild(blockResizeDiv)
      }



      // create block values
      block.values.forEach((blockValue, blockValueIndex) => {
        const headerBlock = document.createElement("div")
        headerBlock.className = "section-widget-wrap-header-item"
        headerBlock.style.backgroundColor = blockValue.color
        headerBlock.style.height = blockValue.active ? "18px" : "12px"
        headerBlock.dataset.id = blockValue.id
        headerBlock.dataset.type = "active-widget-header-item"
        headerBlock.dataset.sectionIndex = index.toString()
        headerBlock.dataset.index = blockValueIndex.toString()
        headerBlock.dataset.blockIndex = blockIndex.toString()
        headerBlock.onclick = changeSectionBlockValue
        headerBlock.draggable = true
        headerBlock.addEventListener("dragstart", SectionBlockHeaderItemDragStartListener)
        headerBlock.addEventListener("dragend", ClearActiveHeaderToDrag)
        headerBlock.addEventListener("dragover", SectionBlockHeaderDragOverListener)
        newBlockHeader.addEventListener("drop", ActiveWidgetHeaderDropListener)

        newBlockHeader.appendChild(headerBlock)
      })

      // add block to section
      newSectionBlock.appendChild(newBlock)
    })

    // add section to main section
    mainSection.appendChild(newSectionBlock)
  })
}

const changeSectionBlockValue = (e) => {
  let sectionVal = null;
  let sectionBlockVal = null;
  let sectionBlockItemVal = null;

  ActiveSection.sections.forEach((section, sectionIndex) => {
    section.forEach((sectionBlock, sectionBlockIndex) => {
      sectionBlock.values.forEach((sectionBlockItem, sectionBlockItemIndex) => {
        if (sectionBlockItem.id === Number(e.target.dataset.id)) {
          sectionVal = sectionIndex
          sectionBlockVal = sectionBlockIndex
          sectionBlockItemVal = sectionBlockItemIndex
        }
      })
    })
  })

  ActiveSection.sections[sectionVal][sectionBlockVal].values = ActiveSection.sections[sectionVal][sectionBlockVal].values.map(item => {
    item.active = false
    return item
  })

  ActiveSection.sections[sectionVal][sectionBlockVal].values[sectionBlockItemVal].active = true

  buildSections()
}

const buildBackground = () => {
  const back = document.getElementById("back")

  for (let i = 0; i < 30; i++) {
    const newDiv = document.createElement("div")

    for (let y = 0; y < 45; y++) {
      const newPoint = document.createElement("div")
      const newMark = document.createElement("div")
      newPoint.appendChild(newMark)
      newDiv.appendChild(newPoint)
    }

    back.appendChild(newDiv)
  }
}

buildBackground()
buildSectionModalContent()
buildSections()
buildWidgetModal()

dragElement(document.getElementById("configure-section-modal"), document.getElementById("modal-header"));
dragElement(document.getElementById("widget-modal"), document.getElementById("widget-modal-header"));

function dragElement(element, header) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  header.onmousedown = dragMouseDown;

  function dragMouseDown(w) {
    w = w || window.event;
    w.preventDefault();
    pos3 = w.clientX;
    pos4 = w.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(w) {
    w = w || window.event;
    w.preventDefault();
    pos1 = pos3 - w.clientX;
    pos2 = pos4 - w.clientY;
    pos3 = w.clientX;
    pos4 = w.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}




function intersectRect(a, b) {
  return (a.left <= b.right &&
    b.left <= a.right &&
    a.top <= b.bottom &&
    b.top <= a.bottom)
}



