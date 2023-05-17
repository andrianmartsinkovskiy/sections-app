const SectionConfigure = [
  {
    name: "1",
    sections: [[]]
  },
  {
    name: '1-1',
    sections: [[],[]]
  },
  {
    name: '3-1',
    sections: [[],[]]
  },
  {
    name: '1-3',
    sections: [[],[]]
  },
  {
    name: '2-2-2',
    sections: [[],[], []],
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
    {id: 1,color: "#DD4124"},
    {id: 2,color: "#EFC050"},
    {id: 3,color: "#5B5EA6"},
    {id: 4,color: "#FF6F61"},
    {id: 5,color:"#009B77"},
    {id: 6,color: "white"},
    {id: 7,color: "#DFCFBE"},
    {id: 8,color: "#45B8AC"},
  ],
  [
    {id: 11,color: "#DD4124"},
    {id: 12,color: "#EFC050"},
    {id: 13,color: "#5B5EA6"},
    {id: 14,color: "#FF6F61"},
    {id: 15,color:"#009B77"},
    {id: 16,color: "white"},
    {id: 17,color: "#DFCFBE"},
    {id: 18,color: "#45B8AC"},
  ],
  [
    {id: 21,color: "#DD4124"},
    {id: 22,color: "#EFC050"},
    {id: 23,color: "#5B5EA6"},
    {id: 24,color: "#FF6F61"},
    {id: 25,color:"#009B77"},
    {id: 26,color: "white"},
    {id: 27,color: "#DFCFBE"},
    {id: 28,color: "#45B8AC"},
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

const toggleModal = () => {
  const modal = document.getElementById('configure-section-modal')


  if (modal.classList.contains("configure-section-modal-active")) {
    modal.classList.remove("configure-section-modal-active");
  } else {
    modal.classList.add("configure-section-modal-active")
  }
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
  const modal = document.getElementById('widget-modal-content')
    modal.innerText = ''

  GropedWidgets.forEach((group,index) => {
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
      widgetDiv.addEventListener("dragstart", e => {
        ActiveWidget = AllWidgets.find(item => item.id === Number(e.target.dataset.id))
      })

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
  const mainSection = document.getElementById("main-section")
  mainSection.innerText = ''
  mainSection.style.gridTemplateColumns = ActiveSection.name.split('-').join("fr ") + 'fr'


  ActiveSection.sections.forEach((item, index) => {
    const newDiv = document.createElement("div")
    newDiv.className = "section-item"
    newDiv.dataset.index = index.toString()
    newDiv.addEventListener("dragover", e => {
      e.preventDefault()
    })

    newDiv.addEventListener("drop", e => {
      if (!ActiveWidget) return
      ActiveSection.sections[index].push({
        id: Math.random(),
        priority: ActiveSection.sections[index].length + 1,
        values: [{...ActiveWidget, active: true, id: Math.random()}]
      })

      ActiveWidget = null

      buildSections()
    })

    console.log(ActiveSection.sections[0], "ActiveSection")
    // add child blocks
    item.forEach(block => {
      const newBlock = document.createElement("div")
      newBlock.className = 'section-widget-wrap'
      newBlock.dataset.id = block.id
      newBlock.style.backgroundColor = block.values.find(val => val.active).color
      newBlock.addEventListener("dragover", e => {
        e.preventDefault()
        e.stopPropagation()
      })

      newBlock.addEventListener("drop", e => {
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

        ActiveSection.sections[sectionIndexValue][blockIndexValue].values = [...sortedSectionBlockValues, {...ActiveWidget, active: true}]

        ActiveWidget = null
        buildSections()
        e.preventDefault()
      })
      const newBlockHeader = document.createElement("div")
      newBlockHeader.className = "section-widget-wrap-header"
      newBlock.appendChild(newBlockHeader)


      block.values.forEach(blockValue => {
        const headerBlock = document.createElement("div")
        headerBlock.className = "section-widget-wrap-header-item"
        headerBlock.style.backgroundColor = blockValue.active ? "transparent" : blockValue.color
        headerBlock.dataset.id = blockValue.id
        headerBlock.onclick = changeSectionBlockValue
        newBlockHeader.appendChild(headerBlock)
      })

      newDiv.appendChild(newBlock)
    })

    mainSection.appendChild(newDiv)
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

  for (let i=0;i<30;i++) {
    const newDiv = document.createElement("div")

    for (let y=0;y<45;y++) {
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