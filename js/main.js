const SectionConfigure = [
  {
    name: "1",
    sections: [[]]
  },
  {
    name: '1-1',
    sections: [[], []]
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
let ActiveSection = SectionConfigure[5]
let ActiveSectionToSet = null
let ActiveBlockToResize = null
let ActiveBlockDataToResize = null
let StartResizeValue = null
let ActiveResizeValue = 0
let StartResizeHeight = '0px'
let ActiveItemToDrag = null

const WidgetDiveDragStartListener = e => {
  ActiveWidget = AllWidgets.find(item => item.id === Number(e.target.dataset.id))
}

const WidgetActiveItemDragStartListener = e => {
  ActiveSection.sections.forEach(sectionItem => {
    sectionItem.forEach(sectionBlock => {
      if (Number(e.target.dataset.id) === sectionBlock.id) {
        ActiveItemToDrag = sectionBlock
      }
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
  if (ActiveItemToDrag) {
    ActiveSection.sections.forEach((sectionItem, sectionIndex) => {
      sectionItem.forEach((sectionBlock, sectionBlockIndex) => {
        if (ActiveItemToDrag.id === sectionBlock.id) {
          if (sectionIndex === Number(e.target.dataset.index)) return

          ActiveSection.sections[sectionIndex] = ActiveSection.sections[sectionIndex].filter(item => item.id !== ActiveItemToDrag.id)
          ActiveSection.sections[Number(e.target.dataset.index)].push(ActiveItemToDrag)
          buildSections()
        }
      })
    })
    ActiveItemToDrag = null
  } else if (ActiveWidget) {
    const indexValue = Number(e.target.dataset.index)
    ActiveSection.sections[indexValue].push({
      id: Math.random(),
      priority: ActiveSection.sections[indexValue].length + 1,
      height: 300,
      values: [{...ActiveWidget, active: true, id: Math.random()}]
    })

    ActiveWidget = null

    buildSections()
  }
}

const SectionDragOverListener = e => {
  e.preventDefault()
}

const SectionBlockDropListener = e => {
  if (ActiveItemToDrag) {


    ActiveSection.sections.map((sectionItem, sectionIndex) => {
      sectionItem.forEach((sectionBlock, blockIndex) => {
        if (Number(e.target.dataset.id) === sectionBlock.id) {
          if (Number(e.target.dataset.id) === ActiveItemToDrag.id) return alert('no')

          ActiveSection.sections.forEach((sectionItem, sectionIndex) => {
            sectionItem.forEach((sectionBlock, sectionBlockIndex) => {
              if (ActiveItemToDrag.id === sectionBlock.id) {
                if (sectionIndex === Number(e.target.dataset.index)) return
                ActiveSection.sections[sectionIndex] = ActiveSection.sections[sectionIndex].filter(item => item.id !== ActiveItemToDrag.id)
              }
            })
          })

          setTimeout(() => {
            ActiveSection.sections[sectionIndex].splice(blockIndex, 0, ActiveItemToDrag)

            buildSections()
            ActiveItemToDrag = null
          }, 10)
        }
      })
    })

    e.preventDefault()
    e.stopPropagation()
  } else if (ActiveWidget) {
    let sectionIndexValue = 0;
    let blockIndexValue = 0;
    ActiveSection.sections.map((sectionItem, sectionIndex) => {
      sectionItem.forEach((sectionBlock, blockIndex) => {
        if (Number(e.target.dataset.id) === sectionBlock.id) {
          sectionIndexValue = sectionIndex
          blockIndexValue = blockIndex
        }
      })
    })

    const sortedSectionBlockValues = ActiveSection.sections[sectionIndexValue][blockIndexValue].values.map(sortedItem => {
      sortedItem.active = false
      return sortedItem
    })

    ActiveSection.sections[sectionIndexValue][blockIndexValue].values = [...sortedSectionBlockValues, {
      ...ActiveWidget,
      active: true
    }]

    ActiveWidget = null
    buildSections()
    e.preventDefault()
    e.stopPropagation()
  }


}

const SectionBlockDragOverListener = e => {
  e.preventDefault()
  e.stopPropagation()
}

const openConfigureSectionModal = () => {
  const modal = document.getElementById('configure-section-modal')
  if (modal.classList.contains("configure-section-modal-active")) return

  modal.classList.add("configure-section-modal-active")
  ActiveSectionToSet = ActiveSection
  buildSectionModalContent()
}

const closeConfigureSectionModal = () => {
  const modal = document.getElementById('configure-section-modal')

  if (modal.classList.contains("configure-section-modal-active")) {
    modal.classList.remove("configure-section-modal-active")
  }
}

const setActiveSection = () => {
  if (!ActiveSectionToSet) return
  ActiveSection.sections.map((section, index) => {
    section.map(sectionBlock => {
      if (ActiveSectionToSet.sections[index]) {
        ActiveSectionToSet.sections[index].push(sectionBlock)
      } else ActiveSectionToSet.sections[0].push(sectionBlock)
    })
  })

  ActiveSection.sections = ActiveSection.name.split("-").map(() => [])
  ActiveSection = ActiveSectionToSet

  closeConfigureSectionModal()
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
  ActiveSectionToSet = SectionConfigure.find(item => item.name === e.target.dataset.name)
  buildSectionModalContent()
}

const buildWidgetModal = () => {
  // Remove previous listeners
  const widgetDivToRemoveListener = document.getElementsByClassName("widget-modal-item")
  Array.prototype.forEach.call(widgetDivToRemoveListener, function (el) {
    el.removeEventListener("dragstart", WidgetDiveDragStartListener)
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
  });

  const sectionBlocksResizeToRemoveListener = document.getElementsByClassName("section-block-resize")
  Array.prototype.forEach.call(sectionBlocksResizeToRemoveListener, function (el) {
    el.removeEventListener('mousedown', ResizeElementListener)
  });

  // Create main section
  const mainSection = document.getElementById("main-section")
  mainSection.innerText = ''
  mainSection.style.gridTemplateColumns = ActiveSection.name.split('-').join("fr ") + 'fr'


  // Create sections blocks
  ActiveSection.sections.forEach((item, index) => {
    const newSectionBlock = document.createElement("div")
    newSectionBlock.className = "section-item"
    newSectionBlock.dataset.index = index.toString()
    newSectionBlock.addEventListener("dragover", SectionDragOverListener)
    newSectionBlock.addEventListener("drop", SectionDropListener)

    // add child blocks
    item.forEach(block => {
      // creat block + listeners
      const newBlock = document.createElement("div")
      newBlock.className = 'section-widget-wrap'
      newBlock.dataset.id = block.id
      newBlock.style.backgroundColor = block.values.find(val => val.active).color
      newBlock.style.height = block.height + "px"
      newBlock.addEventListener("dragover", SectionBlockDragOverListener)
      newBlock.addEventListener("drop", SectionBlockDropListener)

      // create block header
      const newBlockHeader = document.createElement("div")
      newBlockHeader.className = "section-widget-wrap-header"
      newBlockHeader.dataset.id = block.id
      newBlockHeader.addEventListener("dragstart", WidgetActiveItemDragStartListener)
      newBlockHeader.draggable = true
      newBlock.appendChild(newBlockHeader)


      // create block resize element
      const blockResizeDiv = document.createElement("div")
      blockResizeDiv.dataset.id = block.id
      blockResizeDiv.className = "section-block-resize"
      newBlock.appendChild(blockResizeDiv)

      blockResizeDiv.addEventListener('mousedown', ResizeElementListener)


      // create block values
      block.values.forEach(blockValue => {
        const headerBlock = document.createElement("div")
        headerBlock.className = "section-widget-wrap-header-item"
        headerBlock.style.backgroundColor = blockValue.active ? "transparent" : blockValue.color
        headerBlock.dataset.id = blockValue.id
        headerBlock.onclick = changeSectionBlockValue
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